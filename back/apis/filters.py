import django_filters
from .models import Pais,Departamento,Provincia,Distrito
from .models import NocsGrupos

class PaisFilterSet(django_filters.FilterSet):
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    codigopais = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = Pais
        fields = ['nombre', 'codigopais']

class DepartamentoFilterSet(django_filters.FilterSet):
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    pais = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = Departamento
        fields = ['nombre', 'pais']

class ProvinciaFilterSet(django_filters.FilterSet):
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    departamento = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = Provincia
        fields = ['nombre', 'departamento']

class DistritoFilterSet(django_filters.FilterSet):
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    provincia = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = Distrito
        fields = ['nombre', 'provincia','departamento']

class NocsGruposFilterSet(django_filters.FilterSet):
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = NocsGrupos
        fields = ['nombre']