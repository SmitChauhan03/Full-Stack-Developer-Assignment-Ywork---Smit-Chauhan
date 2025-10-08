from django.db import models
from django.core.validators import MinValueValidator

class Department(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Employee(models.Model):
    name = models.CharField(max_length=120)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="employees")
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.name} ({self.department.name})"


class LeaveApplication(models.Model):
    """
    Stores month-wise leave count for an employee.
    One row per employee-month-year.
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leaves")
    month = models.PositiveSmallIntegerField()  # 1..12
    year = models.PositiveIntegerField()
    leave_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("employee", "month", "year")

    def __str__(self):
        return f"{self.employee.name} - {self.month}/{self.year} = {self.leave_count}"

    def payable_salary(self):
        """
        Payable = base_salary - (leave_count * (base_salary / 25))
        Floor at 0 to avoid negative payout.
        """
        daily = self.employee.base_salary / 25
        payable = self.employee.base_salary - (self.leave_count * daily)
        return max(payable, 0)
