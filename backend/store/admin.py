from django.contrib import admin
from store.models import Product, Category, Gallery, Specifications, Size, Color, Cart, CartOrder, CartOrderItem, Review, Notification, Wishlist, Coupon, ProductFaq, Tax


class GalleryInLine(admin.TabularInline):
    model = Gallery


class SpecificationsInLine(admin.TabularInline):
    model = Specifications


class SizeInLine(admin.TabularInline):
    model = Size


class ColorInLine(admin.TabularInline):
    model = Color


class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "price", "category", "shipping_amount",
                    "stock_qty", "in_stock", "vendor", "featured"]
    list_editable = ["featured"]
    list_filter = ["date"]
    search_fields = ["title"]
    inlines = [GalleryInLine, SpecificationsInLine, SizeInLine, ColorInLine]


class CartOrderAdmin(admin.ModelAdmin):
    list_editable = ["payment_status", "order_status", "total"]
    list_display = ["oid", "buyer", "payment_status",
                    "order_status", "total", "date", "orderitem"]

    def orderitem(self, obj):
        return ", ".join(str(item) for item in obj.orderitem())


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user", "product"]


admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(CartOrder, CartOrderAdmin)
admin.site.register(CartOrderItem)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Tax)
admin.site.register(Coupon)
admin.site.register(Notification)
admin.site.register(Wishlist)
