from rest_framework import serializers
from .models import Department, Employee, LeaveApplication

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]


class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ["id", "name", "department", "base_salary"]  # base salary is required at creation


class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        source="department", queryset=Department.objects.all(), write_only=True
    )

    class Meta:
        model = Employee
        fields = ["id", "name", "department", "department_id", "base_salary"]


class BaseSalarySerializer(serializers.Serializer):
    base_salary = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)


class LeaveUpsertSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = ["employee", "month", "year", "leave_count"]

    def validate(self, attrs):
        m = attrs.get("month")
        if m < 1 or m > 12:
            raise serializers.ValidationError("month must be 1..12")
        return attrs


class LeaveIncreaseSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    month = serializers.IntegerField()
    year = serializers.IntegerField()
    increment_by = serializers.IntegerField(min_value=1)


class PayableSalaryRequestSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    month = serializers.IntegerField()
    year = serializers.IntegerField()

    def validate(self, data):
        if not (1 <= data["month"] <= 12):
            raise serializers.ValidationError("month must be 1..12")
        return data


class PayableSalaryResponseSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    month = serializers.IntegerField()
    year = serializers.IntegerField()
    leave_count = serializers.IntegerField()
    base_salary = serializers.DecimalField(max_digits=12, decimal_places=2)
    payable_salary = serializers.DecimalField(max_digits=12, decimal_places=2)