function showAlert(message, type = "info") {
    const alertContainer = document.getElementById("alertContainer");
    if (!alertContainer) return;

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}

function updateTransactions(tipo, descripcion, monto) {
    let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

    transacciones.push({
        tipo: tipo,
        descripcion: descripcion,
        monto: monto,
    });

    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

const formDeposito = document.getElementById("form-deposito");
const leyendaDeposito = document.getElementById("leyendaDeposito");

if (formDeposito) {
    formDeposito.addEventListener("submit", function (e) {
        e.preventDefault();

        const monto = Number(document.getElementById("depositar").value);
        let saldoActual = Number(localStorage.getItem("saldo"));

        if (monto > 0) {
            saldoActual += monto;
            localStorage.setItem("saldo", saldoActual);
            updateTransactions("deposito", "Deposito recibido", monto);

            showAlert(" Depósito realizado con éxito", "success");

            // Leyenda visual debajo del formulario
            if (leyendaDeposito) {
                leyendaDeposito.innerHTML = `
                    <div class="alert alert-info">
                         Has depositado <strong>$${monto}</strong> correctamente
                    </div>
                `;
            }

            setTimeout(() => {
                window.location.href = "menu.html";
            }, 2000);

            document.getElementById("depositar").value = "";
        } else {
            showAlert(" Ingrese un monto válido", "danger");
        }
    });
}
