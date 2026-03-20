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

const btnAgregar = document.getElementById("btnAgregarContacto");
const formContacto = document.getElementById("formContacto");
const btnGuardar = document.getElementById("guardarContacto");
const btnCancelar = document.getElementById("cancelarContacto");
const lista = document.getElementById("listaContactos");
const btnEnviar = document.getElementById("btnEnviarDinero");

let contactoSeleccionado = null;

/* MOSTRAR FORMULARIO */
if (btnAgregar && formContacto) {
    btnAgregar.addEventListener("click", function () {
        formContacto.style.display = "block";
    });
}

/* CANCELAR FORMULARIO */
if (btnCancelar && formContacto) {
    btnCancelar.addEventListener("click", function () {
        formContacto.style.display = "none";
    });
}

/* GUARDAR CONTACTO CON VALIDACIONES */
if (btnGuardar) {
    btnGuardar.addEventListener("click", function () {
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const cbu = document.getElementById("cbu").value.trim();
        const alias = document.getElementById("alias").value.trim();
        const banco = document.getElementById("nomBanco").value.trim();

        /* VALIDACIONES */
        if (!nombre || !apellido || !cbu || !banco) {
            showAlert("Todos los campos obligatorios deben estar completos", "danger");
            return;
        }

        if (!/^\d{9}$/.test(cbu)) {
            showAlert("El CBU debe contener exactamente 9 números", "danger");
            return;
        }

        /* CREAR CONTACTO */
        const nuevoContacto = {
            nombre: `${nombre} ${apellido}`,
            cbu: cbu,
            alias: alias,
            banco: banco,
        };

        const contactos = obtenerContactos();
        contactos.push(nuevoContacto);
        guardarContactos(contactos);

        renderizarContactos();

        /* LIMPIAR FORMULARIO */
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("cbu").value = "";
        document.getElementById("alias").value = "";
        document.getElementById("nomBanco").value = "";

        formContacto.style.display = "none";
    });
}

/* SELECCIONAR CONTACTO */
if (btnEnviar) {
    btnEnviar.style.display = "none";
}
if (lista) {
    lista.addEventListener("click", function (e) {
        const item = e.target.closest("li");
        if (!item) return;

        const items = document.querySelectorAll("#listaContactos li");
        items.forEach((li) => li.classList.remove("seleccionado"));

        item.classList.add("seleccionado");
        contactoSeleccionado = item;

        if (btnEnviar) {
            btnEnviar.style.display = "block";
        }
    });
}

/* ENVIAR DINERO */
if (btnEnviar) {
    btnEnviar.addEventListener("click", function () {
        const monto = Number(document.getElementById("monto").value);
        let saldo = Number(localStorage.getItem("saldo"));

        if (!contactoSeleccionado) {
            showAlert("Seleccione un contacto", "danger");
            return;
        }

        if (monto <= 0) {
            showAlert("Ingrese un monto válido", "danger");
            return;
        }

        if (monto > saldo) {
            showAlert("Saldo insuficiente", "danger");
            return;
        }

        const confirmar = confirm(`¿Desea enviar $${monto} al contacto seleccionado?`);

        if (!confirmar) {
            alert("Transferencia cancelada");
            return;
        } else {
            saldo -= monto;
            localStorage.setItem("saldo", saldo);
            updateTransactions("transferencia", "Transferencia enviada", monto);

            mostrarConfirmacion(" Transferencia realizada con éxito");

            setTimeout(() => {
                window.location.href = "menu.html";
            }, 2000);
        }
    });
}
function mostrarConfirmacion(mensaje) {
    let alerta = document.getElementById("alertaConfirmacion");

    if (!alerta) {
        alerta = document.createElement("div");
        alerta.id = "alertaConfirmacion";
        alerta.className =
            "alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-3";
        alerta.style.zIndex = "1050";
        document.body.appendChild(alerta);
    }

    alerta.textContent = mensaje;
}

/* BUSCAR CONTACTOS POR NOMBRE O ALIAS */
const inputBuscar = document.getElementById("buscarContacto");

if (inputBuscar && lista) {
    inputBuscar.addEventListener("input", function () {
        const texto = inputBuscar.value.toLowerCase();
        const contactos = lista.querySelectorAll("li");

        contactos.forEach((li) => {
            const nombre = li.querySelector(".nombreContacto").textContent.toLowerCase();

            const detalle = li.querySelector(".detalleContacto").textContent.toLowerCase();

            if (nombre.includes(texto) || detalle.includes(texto)) {
                li.style.display = "block";
            } else {
                li.style.display = "none";
            }
        });
    });
}

/* ===============================
   CONTACTOS - LOCALSTORAGE
================================ */

function obtenerContactos() {
    return JSON.parse(localStorage.getItem("contactos")) || [];
}

function guardarContactos(contactos) {
    localStorage.setItem("contactos", JSON.stringify(contactos));
}

function renderizarContactos() {
    const contactos = obtenerContactos();
    lista.innerHTML = "";

    contactos.forEach((c) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
            <div class="infoContacto">
                <span class="nombreContacto">${c.nombre}</span>
                <span class="detalleContacto">
                    CBU: ${c.cbu}, Alias: ${c.alias || "-"}, Banco: ${c.banco}
                </span>
            </div>
        `;
        lista.appendChild(li);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    renderizarContactos();
});
