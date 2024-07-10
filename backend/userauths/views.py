from django.shortcuts import render

from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny

from userauths.models import User, Profile
from userauths.serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, ProfileSerializer

from rest_framework import status
from rest_framework.response import Response

import random
import shortuuid


def generate_otp(length=7):
    uuid_key = shortuuid.uuid()
    unique_key = uuid_key[6]

    return unique_key


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer


class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs["email"]
        user = User.objects.get(email=email)

        print("user ====", user)

        if user:
            user.otp = generate_otp()
            user.save()

            uidb64 = user.pk  # same as user.id
            otp = user.otp

            link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"

            print("link ====", link)

            # Send email

        return user


class PasswordChangeView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )

    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload["otp"]
        uidb64 = payload["uidb64"]
        password = payload["password"]

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()

            print("have already changed password!!!!")

            return Response({"message": "Password Changed Succesfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "An error occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (AllowAny, )

    def get_object(self):
        user_id = self.kwargs["user_id"]

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile
