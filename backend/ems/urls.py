from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, EmployeeViewSet,
    LeaveIncreaseView, PayableSalaryView,
    DepartmentHighEarnersView, MonthlyHighEarnersView,
)

router = DefaultRouter()
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"employees", EmployeeViewSet, basename="employee")

urlpatterns = [
    path("", include(router.urls)),
    # 4) PATCH increase leave count
    path("leaves/increase/", LeaveIncreaseView.as_view(), name="leave-increase"),
    # 5) POST payable salary
    path("payroll/calculate/", PayableSalaryView.as_view(), name="payable-salary"),
    # 6) GET dept high earners (top 3 unique base salaries)
    path("departments/<int:department_id>/high-earners/", DepartmentHighEarnersView.as_view(),
         name="department-high-earners"),
    # 7) GET monthly high earners (top 3 unique payable salaries, optional ?department_id=)
    path("high-earners/month/", MonthlyHighEarnersView.as_view(), name="monthly-high-earners"),
]
