from django.db import models
from django.contrib.auth.models import User

class Billetera(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    saldo = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Billetera de {self.usuario.username} - Saldo: ${self.saldo}"

# Modelo para los contactos
class Contacto(models.Model):
    dueno = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mis_contactos')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    cbu = models.CharField(max_length=22)
    alias = models.CharField(max_length=100, blank=True)
    banco = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# Modelo para las transacciones
class Transaccion(models.Model):
    TIPO_CHOICES = [
        ('deposito', 'Depósito'),
        ('transferencia', 'Transferencia'),
    ]
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - ${self.monto} ({self.fecha})"


# class PerfilBilletera(models.Model):
#     usuario = models.OneToOneField(User, on_delete=models.CASCADE)
#     saldo = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
#     def __str__(self):
#         return f"Cartera de {self.usuario.username}"

