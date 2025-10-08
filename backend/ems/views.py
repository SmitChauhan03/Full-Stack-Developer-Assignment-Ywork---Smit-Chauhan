from django.shortcuts import render
from django.db.models import F, Value, DecimalField
from django.db.models.functions import DenseRank
from django.db.models.expressions import Window
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Department, Employee, LeaveApplication
from .serializers import (
    DepartmentSerializer,
    EmployeeCreateSerializer,
    EmployeeSerializer,
    BaseSalarySerializer,
    LeaveUpsertSerializer,
    LeaveIncreaseSerializer,
    PayableSalaryRequestSerializer,
    PayableSalaryResponseSerializer,
)

# 1) POST: create a department
class DepartmentViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        viewsets.GenericViewSet):
    queryset = Department.objects.all().order_by("id")
    serializer_class = DepartmentSerializer


# 2) POST: create an employee
class EmployeeViewSet(mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    queryset = Employee.objects.select_related("department").all().order_by("id")

    def get_serializer_class(self):
        if self.action == "create":
            return EmployeeCreateSerializer
        return EmployeeSerializer

    # 3) POST: set base salary for employee
    @action(methods=["post"], detail=True, url_path="set-base-salary")
    def set_base_salary(self, request, pk=None):
        emp = self.get_object()
        ser = BaseSalarySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        emp.base_salary = ser.validated_data["base_salary"]
        emp.save(update_fields=["base_salary"])
        return Response(EmployeeSerializer(emp).data, status=status.HTTP_200_OK)


# 4) UPDATE API: increase leave count for month+year
class LeaveIncreaseView(APIView):
    def patch(self, request):
        ser = LeaveIncreaseSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        emp_id = ser.validated_data["employee_id"]
        month = ser.validated_data["month"]
        year  = ser.validated_data["year"]
        inc   = ser.validated_data["increment_by"]

        if not (1 <= month <= 12):
            return Response({"detail": "month must be 1..12"}, status=400)

        try:
            emp = Employee.objects.get(pk=emp_id)
        except Employee.DoesNotExist:
            return Response({"detail": "employee not found"}, status=404)

        leave, _ = LeaveApplication.objects.get_or_create(employee=emp, month=month, year=year)
        leave.leave_count = F("leave_count") + inc
        leave.save(update_fields=["leave_count"])
        leave.refresh_from_db()
        return Response(LeaveUpsertSerializer(leave).data, status=200)


# 5) POST: calculate payable salary for an employee for a given month
class PayableSalaryView(APIView):
    def post(self, request):
        req = PayableSalaryRequestSerializer(data=request.data)
        req.is_valid(raise_exception=True)
        emp_id = req.validated_data["employee_id"]
        month  = req.validated_data["month"]
        year   = req.validated_data["year"]

        try:
            emp = Employee.objects.get(pk=emp_id)
        except Employee.DoesNotExist:
            return Response({"detail": "employee not found"}, status=404)

        leave, _ = LeaveApplication.objects.get_or_create(employee=emp, month=month, year=year)
        payload = {
            "employee_id": emp.id,
            "month": month,
            "year": year,
            "leave_count": leave.leave_count,
            "base_salary": emp.base_salary,
            "payable_salary": leave.payable_salary(),
        }
        return Response(PayableSalaryResponseSerializer(payload).data, status=200)


# 6) GET: high earners in a department
# A "high earner" = in the top 3 unique base salaries *within that department*
class DepartmentHighEarnersView(APIView):
    def get(self, request, department_id: int):
        try:
            dept = Department.objects.get(pk=department_id)
        except Department.DoesNotExist:
            return Response({"detail": "department not found"}, status=404)

        # Rank by unique base_salary (DenseRank over base_salary desc)
        qs = Employee.objects.filter(department=dept)
        qs = qs.annotate(
            salary_rank=Window(
                expression=DenseRank(),
                order_by=F("base_salary").desc(),
            )
        ).filter(salary_rank__lte=3).order_by("-base_salary", "id")

        data = EmployeeSerializer(qs, many=True).data
        return Response({"department": dept.name, "high_earners": data}, status=200)


# 7) GET: employees who are high earners in a specific month
# Interpretation: top 3 unique *payable* salaries company-wide for that month (optional department filter via ?department_id=)
class MonthlyHighEarnersView(APIView):
    def get(self, request):
        try:
            month = int(request.query_params.get("month"))
            year = int(request.query_params.get("year"))
        except (TypeError, ValueError):
            return Response({"detail": "provide numeric month & year"}, status=400)

        if not (1 <= month <= 12):
            return Response({"detail": "month must be 1..12"}, status=400)

        dept_id = request.query_params.get("department_id")
        emp_qs = Employee.objects.all()
        if dept_id:
            emp_qs = emp_qs.filter(department_id=dept_id)

        # Ensure LeaveApplication rows exist for each employee for that month (0 leaves default)
        for emp in emp_qs:
            LeaveApplication.objects.get_or_create(employee=emp, month=month, year=year)

        leaves = (LeaveApplication.objects
                  .select_related("employee", "employee__department")
                  .filter(month=month, year=year))
        if dept_id:
            leaves = leaves.filter(employee__department_id=dept_id)

        # Compute payable salary in queryset output (as Decimal) for ranking
        rows = []
        for la in leaves:
            rows.append({
                "employee": la.employee,
                "leave_count": la.leave_count,
                "payable": la.payable_salary(),
            })

        # Get top 3 unique payables
        unique_payables = sorted({r["payable"] for r in rows}, reverse=True)[:3]
        top = [r for r in rows if r["payable"] in unique_payables]
        top_sorted = sorted(top, key=lambda r: (-r["payable"], r["employee"].id))

        return Response({
            "month": month,
            "year": year,
            "department_filter": int(dept_id) if dept_id else None,
            "high_earners": [
                {
                    "employee": EmployeeSerializer(r["employee"]).data,
                    "leave_count": r["leave_count"],
                    "payable_salary": str(r["payable"]),
                } for r in top_sorted
            ]
        }, status=200)

