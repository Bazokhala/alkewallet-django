const listaTransacciones = document.getElementById("listaTransacciones");
const filtroSelect = document.getElementById("filtroTransacciones");

/* Obtener transacciones */
function obtenerTransacciones() {
    return JSON.parse(localStorage.getItem("transacciones")) || [];
}

/* Traducir tipo de transacción */
function getTipoTransaccion(tipo) {
    switch (tipo) {
        case "deposito":
            return "Depósito";
        case "transferencia":
            return "Transferencia";
        case "compra":
            return "Compra";
        default:
            return "Movimiento";
    }
}

/* Mostrar movimientos según filtro */
function mostrarUltimosMovimientos(filtro = "todos") {
    if (!listaTransacciones) return;

    listaTransacciones.innerHTML = "";

    const transacciones = obtenerTransacciones();

    const filtradas =
        filtro === "todos" ? transacciones : transacciones.filter((t) => t.tipo === filtro);

    if (filtradas.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item text-muted";
        li.textContent = "No hay movimientos para este filtro";
        listaTransacciones.appendChild(li);
        return;
    }

    filtradas.forEach((t) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${getTipoTransaccion(t.tipo)} - ${t.descripcion} - $${t.monto}`;
        listaTransacciones.appendChild(li);
    });
}

/* Evento del filtro */
if (filtroSelect) {
    filtroSelect.addEventListener("change", function () {
        mostrarUltimosMovimientos(this.value);
    });
}

/* Mostrar todo al cargar */
mostrarUltimosMovimientos();
