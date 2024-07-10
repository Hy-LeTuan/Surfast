from django.contrib import admin
from vendor.models import Vendor


class VendorAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'mobile', 'active', 'date')
    search_fields = ('name', 'user__username')
    list_filter = ('active', 'date')

    def save_model(self, request, obj, form, change):
        if not obj.user:
            obj.user = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Vendor, VendorAdmin)
