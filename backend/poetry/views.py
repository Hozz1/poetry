from django.shortcuts import render
from rest_framework import generics

from .Serializers import PoetrySerializer, LanguageSerializer
from .models import Poetry, Language

class PoetryAPIView(generics.ListAPIView):
    queryset = Poetry.objects.all()
    serializer_class = PoetrySerializer


class LanguageListView(generics.ListAPIView):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer