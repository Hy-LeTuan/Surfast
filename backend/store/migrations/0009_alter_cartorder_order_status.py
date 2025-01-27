# Generated by Django 4.2 on 2024-07-09 03:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0008_alter_notification_vendor"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cartorder",
            name="order_status",
            field=models.CharField(
                choices=[
                    ("Pending", "Pending"),
                    ("Fulfilled", "Fulfilled"),
                    ("Cancelled", "Cancelled"),
                ],
                default="pending",
                max_length=100,
            ),
        ),
    ]
