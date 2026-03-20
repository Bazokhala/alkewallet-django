from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('login/', views.login_view, name='login'),
    path('logout/', LogoutView.as_view(next_page='inicio'), name='logout'),
    path('menu/', views.menu, name='menu'),
    path('transactions/', views.transactions, name='transactions'),
    path('deposit/', views.deposit, name='deposit'),
    path('send_money/', views.send_money, name='send_money'),
    path('register/', views.register, name='register'),
    path('add_contact/', views.add_contact, name='add_contact'),
    path('delete_contact/<int:contacto_id>/', views.delete_contact, name='delete_contact'),
]