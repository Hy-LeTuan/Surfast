from django.shortcuts import render, redirect
from django.conf import settings

from userauths.models import User

from store.models import Product, Category, Gallery, Specifications, Size, Color, Cart, CartOrder, CartOrderItem, Review, Notification, Wishlist, Coupon, ProductFaq, Tax
from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer, CouponSerializer, ReviewSerializer, WishlistSerializer, NotificationSerializer

from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from decimal import Decimal

import stripe
import requests


class OrderAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)

        orders = CartOrder.objects.filter(buyer=user)
        return orders


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny, ]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        order_oid = self.kwargs["order_oid"]

        print("order_oid ==========================", order_oid)
        print("user_id===============================", user_id)

        user = User.objects.get(id=user_id)
        # order = CartOrder.objects.get(
        #     buyer=user, oid=order_oid, payment_status="Paid")

        order = CartOrder.objects.get(buyer=user, oid=order_oid)

        return order


class WishlistAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        wishlists = Wishlist.objects.filter(user=user)

        return wishlists

    def create(self, request, *args, **kwargs):
        payload = request.data

        product_id = payload["product_id"]
        user_id = payload["user_id"]

        print(f"Product ID: {product_id}")
        print(f"User ID: {user_id}")

        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlists = Wishlist.objects.filter(product=product, user=user)

        if wishlists:
            wishlists.delete()
            return Response({"message": "Wishlists delted successfully"}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(product=product, user=user).save()
            return Response({"message": "Wishlist added successfully"}, status=status.HTTP_201_CREATED)


class CustomerNotification(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        user = User.objects.get(id=user_id)
        return Notification.objects.filter(user=user)


class MarkNotificationAsSeen(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny, ]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        noti_id = self.kwargs["noti_id"]

        user = User.objects.get(id=user_id)
        notification = Notification.objects.get(user=user, id=noti_id)

        if notification.seen != True:
            notification.seen = True
            notification.save()
        else:
            notification.seen = False
            notification.save()

        return notification
