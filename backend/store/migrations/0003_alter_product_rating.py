# Generated by Django 4.2 on 2024-07-01 06:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("store", "0002_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="rating",
            field=models.PositiveBigIntegerField(blank=True, default=0, null=True),
        ),
    ]
