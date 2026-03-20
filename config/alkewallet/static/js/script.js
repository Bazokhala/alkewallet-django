/* =========================
   ALERTAS BOOTSTRAP
========================= */
function showAlert(message, type = "info") {
    const alertContainer = document.getElementById("alertContainer");
    if (!alertContainer) return;

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}
const loadingScreen = (direccion) => {
    alert(direccion);
};

/* =========================
   LOGIN
========================= */
function loginUser(email, password) {
    if (email === "johndoe@gmail.com" && password === "12345") {
        showAlert(" Login exitoso", "success");
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 1200);
    } else {
        showAlert(" Credenciales incorrectas", "danger");
    }
}

/* =========================
   SALDO
========================= */
if (localStorage.getItem("saldo") === null) {
    localStorage.setItem("saldo", "10000");
}

const saldoElemento = document.getElementById("saldo");
if (saldoElemento) {
    saldoElemento.textContent = "$" + localStorage.getItem("saldo");
}
