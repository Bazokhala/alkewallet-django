from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Billetera, Contacto, Transaccion
from .forms import ContactoForm
from decimal import Decimal

def inicio(request):
    return render(request, 'inicio.html')

def register(request):
    if request.method == 'POST':
        u_name = request.POST.get('username')
        u_email = request.POST.get('email')
        u_pass = request.POST.get('password')
        try:
            nuevo_usuario = User.objects.create_user(username=u_name, email=u_email, password=u_pass)
            Billetera.objects.create(usuario=nuevo_usuario, saldo=0.00)
            messages.success(request, "Cuenta creada con éxito.")
            return redirect('login')
        except IntegrityError:
            messages.error(request, "El nombre de usuario ya existe.")
            return render(request, 'register.html')
    return render(request, 'register.html')

def login_view(request):
    if request.method == 'POST':
        u_name = request.POST.get('username')
        u_pass = request.POST.get('password')
        user = authenticate(request, username=u_name, password=u_pass)
        if user is not None:
            auth_login(request, user)
            return redirect('menu')
        else:
            messages.error(request, "Credenciales incorrectas.")
    return render(request, 'login.html')

@login_required
def menu(request):
    billetera = Billetera.objects.get(usuario=request.user)

    return render(request, 'menu.html', {'saldo': billetera.saldo})

@login_required
def transactions(request):
    historial = Transaccion.objects.filter(usuario=request.user).order_by('-fecha')
    return render(request, 'transactions.html', {'transacciones': historial})

@login_required
def deposit(request):
    billetera = Billetera.objects.get(usuario=request.user)
    
    if request.method == 'POST':
        monto_str = request.POST.get('monto')
        
        if monto_str:
            try:
                monto = Decimal(monto_str)
                
                if monto > 0:
                    billetera.saldo += monto
                    billetera.save()
                    
                    Transaccion.objects.create(
                        usuario=request.user,
                        tipo='deposito',
                        monto=monto
                    )
                    
                    messages.success(request, f"Has depositado ${monto} con éxito.")
                    return redirect('menu') 
                else:
                    messages.error(request, "El monto debe ser mayor a cero.")
            except ValueError:
                messages.error(request, "Por favor, ingresa un número válido.")

    return render(request, 'deposit.html')

@login_required
def send_money(request):
    billetera = Billetera.objects.get(usuario=request.user)
    
    if request.method == 'POST':
        if 'nombre' in request.POST:
            form = ContactoForm(request.POST)
            if form.is_valid():
                nuevo_contacto = form.save(commit=False)
                nuevo_contacto.dueno = request.user 
                nuevo_contacto.save()
                messages.success(request, "Contacto guardado correctamente.")
                return redirect('send_money')
        
        elif 'monto' in request.POST:
            monto_str = request.POST.get('monto')
            if monto_str:
                monto = Decimal(monto_str)
                if billetera.saldo >= monto:
                    billetera.saldo -= monto
                    billetera.save()
                    
                    Transaccion.objects.create(
                        usuario=request.user,
                        tipo='transferencia',
                        monto=monto
                    )
                    
                    messages.success(request, f"Envío de ${monto} realizado con éxito.")
                    return redirect('send_money')
                else:
                    messages.error(request, "Saldo insuficiente.")
    
    form = ContactoForm()
    contactos = Contacto.objects.filter(dueno=request.user)
    
    context = {
        'form': form,
        'contactos': contactos,
        'saldo': billetera.saldo,
    }
    
    return render(request, 'send_money.html', context)

@login_required
def add_contact(request):
    return render(request, 'add_contact.html')

@login_required
def delete_contact(request, contacto_id):
    contacto = Contacto.objects.filter(id=contacto_id, dueno=request.user).first()
    
    if contacto:
        nombre_completo = f"{contacto.nombre} {contacto.apellido}"
        contacto.delete()
        messages.success(request, f"Contacto '{nombre_completo}' eliminado correctamente.")
    else:
        messages.error(request, "No se pudo encontrar el contacto.")
        
    return redirect('send_money')