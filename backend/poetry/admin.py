from django.contrib import admin
from .models import Poetry, Language

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "language")
    search_fields = ("language",)

@admin.register(Poetry)
class PoetryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "language", "time_create")
    search_fields = ("title", "description", "text")
    list_filter = ("language",)
