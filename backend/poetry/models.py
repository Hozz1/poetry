from django.db import models

# Create your models here.
class Poetry(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    time_create = models.DateTimeField(auto_now_add=True)
    language = models.ForeignKey('Language', on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.title

class Language(models.Model):
    language = models.CharField(max_length=100, db_index=True)

    def __str__(self):
        return self.language