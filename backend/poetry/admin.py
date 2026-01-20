from django.contrib import admin
from .models import Poetry, Language

admin.site.site_header = "POETRY ADMIN (Render)"
@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "language")
    search_fields = ("language",)

@admin.register(Poetry)
class PoetryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "language", "time_create")
    search_fields = ("title", "description", "text")
    list_filter = ("language",)
