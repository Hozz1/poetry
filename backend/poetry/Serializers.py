from rest_framework import serializers

from .models import Poetry, Language


class PoetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Poetry
        fields = ('id', 'title', 'description', 'text', 'time_create', 'language')

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ("id", "language")