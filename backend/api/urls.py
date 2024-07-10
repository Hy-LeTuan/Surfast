from django.urls import path
from userauths import views as userauth_views
from store import views as store_views
from customer import views as customer_views
from vendor import views as vendor_views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("user/token", userauth_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh", TokenRefreshView.as_view(), name='token_refresh'),
    path("user/register", userauth_views.RegisterView.as_view()),
    path("user/password-reset/<email>",
         userauth_views.PasswordResetEmailVerify.as_view()),
    path("user/password-change", userauth_views.PasswordChangeView.as_view()),
    path("user/profile/<user_id>", userauth_views.ProfileView.as_view()),

    # store endpoints
    path("category", store_views.CategoryListAPIView.as_view()),
    path("products", store_views.ProductListAPIView.as_view()),
    path("product-detail/<slug>", store_views.ProductDetailAPIView.as_view()),
    path("cart-view", store_views.CartAPIView.as_view()),

    path("cart-list/<str:cart_id>/<int:user_id>",
         store_views.CartListView.as_view()),
    path("cart-list/<str:cart_id>",
         store_views.CartListView.as_view()),

    path("cart-detail/<str:cart_id>/<int:user_id>",
         store_views.CartDetailView.as_view()),
    path("cart-detail/<str:cart_id>",
         store_views.CartDetailView.as_view()),
    path("cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>",
         store_views.CartItemDeleteAPIView.as_view()),
    path("cart-delete/<str:cart_id>/<int:item_id>",
         store_views.CartItemDeleteAPIView.as_view()),
    path("create-order", store_views.CreateOrderAPIView.as_view()),
    path("checkout/<order_oid>", store_views.CheckoutView.as_view()),
    path("coupon", store_views.CouponAPIView.as_view()),
    path("reviews/<product_id>", store_views.ReviewListAPIView.as_view()),
    path("search", store_views.SearchProductAPIView.as_view()),

    # payment
    path("stripe-checkout/<order_oid>", store_views.StripeCheckoutView.as_view()),
    path("payment-success", store_views.PaymentSuccessView.as_view()),

    # customer
    path("customer/orders/<user_id>", customer_views.OrderAPIView.as_view()),
    path("customer/orders/<user_id>/<order_oid>",
         customer_views.OrderDetailAPIView.as_view()),
    path("customer/wishlist/<user_id>",
         customer_views.WishlistAPIView.as_view()),
    path("customer/notification/<user_id>",
         customer_views.CustomerNotification.as_view()),
    path("customer/notification/<user_id>/<noti_id>",
         customer_views.MarkNotificationAsSeen.as_view()),

    # vendor dashboard
    path("vendor/stats/<vendor_id>",
         vendor_views.DashboardStatAPIView.as_view()),
    path("vendor/vendor-orders-chart/<vendor_id>",
         vendor_views.MonthlyOrderChartAPIView),
    path("vendor/vendor-products-chart/<vendor_id>",
         vendor_views.MonthlyProductChartAPIView),
    path("vendor/products/<vendor_id>",
         vendor_views.ProductAPIView.as_view()),
    path("vendor/orders/<vendor_id>",
         vendor_views.OrderAPIView.as_view()),
    path("vendor/orders/order-detail/<vendor_id>/<order_oid>",
         vendor_views.OrderDetailAPIView.as_view()),
    path("vendor/orders/filter/<vendor_id>",
         vendor_views.FilterOrderAPIView.as_view()),
    path("vendor/revenue/<vendor_id>",
         vendor_views.RevenueAPIView.as_view()),

    path("vendor/product-filter/<vendor_id>",
         vendor_views.FilterProductAPIView.as_view()),
    path("vendor/vendor-earning/<vendor_id>",
         vendor_views.EarningAPIView.as_view()),
    path("vendor/vendor-monthly-earning/<vendor_id>",
         vendor_views.MonthlyEarningTracker),
    path("vendor/vendor-reviews/<vendor_id>",
         vendor_views.ReviewListAPIView.as_view()),
    path("vendor/vendor-review-detail/<vendor_id>/<review_id>",
         vendor_views.ReviewDetailAPIView.as_view()),
    path("vendor/vendor-coupon-list/<vendor_id>",
         vendor_views.CouponListAPIView.as_view()),
    path("vendor/vendor-coupon-stats/<vendor_id>",
         vendor_views.CouponStatsAPIView.as_view()),
    path("vendor/vendor-coupon-detail/<vendor_id>/<coupon_id>",
         vendor_views.CouponDetailAPIView.as_view()),

    path("vendor/vendor-notification-list/<vendor_id>",
         vendor_views.NotificationAPIView.as_view()),
    path("vendor/vendor-notification-unseen/<vendor_id>",
         vendor_views.NotificationUnseenAPIView.as_view()),
    path("vendor/vendor-notification-seen/<vendor_id>",
         vendor_views.NotificationSeenAPIView.as_view()),
    path("vendor/vendor-notification-summary/<vendor_id>",
         vendor_views.NotificationSummaryAPIView.as_view()),
    path("vendor/vendor-notification-mark-as-seen/<vendor_id>/<notification_id>",
         vendor_views.NotificationVendorMarkAsSeen.as_view()),

    path("vendor/vendor-settings/<int:pk>",
         vendor_views.VendorProfileUpdateView.as_view()),
    path("vendor/vendor-shop-settings/<int:pk>",
         vendor_views.VendorShopUpdateView.as_view()),
    path("vendor/shop/<vendor_slug>",
         vendor_views.ShopAPIView.as_view()),
    path("vendor/vendor-products/<vendor_slug>",
         vendor_views.ShopProductAPIView.as_view()),
    path("vendor/vendor-create-product",
         vendor_views.ProductCreateAPIView.as_view()),
    path("vendor/vendor-update-product/<vendor_id>/<product_pid>",
         vendor_views.ProductUpdateAPIView.as_view()),
    path("vendor/vendor-delete-product/<vendor_id>/<product_pid>",
         vendor_views.ProductDeleteAPIView.as_view()),
]
