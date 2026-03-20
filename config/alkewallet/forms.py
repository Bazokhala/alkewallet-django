from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Billetera, Contacto, Transaccion

class ContactoForm(forms.ModelForm):
    class Meta:
        model = Contacto
        fields = ['nombre', 'apellido', 'cbu', 'alias', 'banco']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['class'] = 'form-control'

class ContactoForm(forms.ModelForm):
    BANCOS_CHOICES = [
        ('', 'Seleccione un banco'),
        ('alkebank', 'AlkeBank Digital'),
        ('cryptosol', 'CryptoSol Wallet'),
        ('nacional', 'Banco Nacional Ficticio'),
    ]

    banco = forms.ChoiceField(
        choices=BANCOS_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    class Meta:
        model = Contacto
        fields = ['nombre', 'apellido', 'cbu', 'alias', 'banco'] 
        
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}),
            'apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Apellido'}),
            'cbu': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'CBU (22 dígitos)'}),
            'alias': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Alias (opcional)'}),
        }