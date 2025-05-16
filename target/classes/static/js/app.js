async function guardarActivo() {
    const nombreInput = document.getElementById('nombre');
    const descripcionInput = document.getElementById('descripcion');
    const codigoReferencia = document.getElementById('codigoReferencia').value.trim();
    const fechaUltimaRevision = document.getElementById('fechaUltimaRevision').value;
    const revisadoPor = document.getElementById('revisadoPor').value.trim();
    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!nombre || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const id = crypto.randomUUID();
    const qrContenido = `${window.location.origin}/activos/${id}`;
    const qrCode = await generarQrCode(qrContenido);

    const activo = { id, nombre, descripcion, qrCode, codigoReferencia, fechaUltimaRevision, revisadoPor };

    try {
        await fetch('/api/activos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activo)
        });

        nombreInput.value = '';
        descripcionInput.value = '';
        document.getElementById('codigoReferencia').value = '';
        document.getElementById('fechaUltimaRevision').value = '';
        document.getElementById('revisadoPor').value = '';
        listarActivos();
    } catch (error) {
        alert('Error al guardar el activo.');
        console.error(error);
    }
}

async function generarQrCode(texto) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, texto, function (error) {
            if (error) reject(error);
            else resolve(canvas.toDataURL());
        });
    });
}

async function listarActivos() {
    try {
        const res = await fetch('/api/activos');
        const activos = await res.json();
        const lista = document.getElementById('lista-activos');
        lista.innerHTML = '';

        activos.forEach(a => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row';

            const contenido = document.createElement('div');
            contenido.innerHTML = `
                <strong>${a.nombre}</strong><br>
                <span>${a.descripcion}</span><br>
                <span><b>Código Ref.:</b> ${a.codigoReferencia || '-'}</span><br>
                <span><b>Última revisión:</b> ${a.fechaUltimaRevision || '-'}</span><br>
                <span><b>Revisado por:</b> ${a.revisadoPor || '-'}</span><br>
                <img src="${a.qrCode}" alt="Código QR" width="100" height="100" class="mt-2">
            `;

            const boton = document.createElement('a');
            boton.href = `/activos/${a.id}`;
            boton.className = 'btn btn-outline-primary mt-3 mt-md-0';
            boton.style.borderRadius = '10px';
            boton.style.padding = '10px 20px';
            boton.style.fontWeight = 'bold';
            boton.innerText = 'Ver información';

            const botonBorrar = document.createElement('button');
            botonBorrar.className = 'btn btn-outline-danger mt-3 mt-md-0 ms-2';
            botonBorrar.style.borderRadius = '10px';
            botonBorrar.style.padding = '10px 20px';
            botonBorrar.style.fontWeight = 'bold';
            botonBorrar.innerText = 'Borrar';
            botonBorrar.onclick = () => borrarActivo(a.id);

            li.appendChild(contenido);
            li.appendChild(boton);
            li.appendChild(botonBorrar);
            lista.appendChild(li);
        });
    } catch (error) {
        alert('Error al listar los activos.');
        console.error(error);
    }
}

async function cargarDetalleActivo() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '/login.html';
        return;
    }
    const partes = window.location.pathname.split('/');
    const id = partes[partes.length - 1];
    console.log('ID del activo a cargar:', id);

    const nombreEl = document.getElementById('nombre-detalle');
    const descripcionEl = document.getElementById('descripcion-detalle');
    const codigoReferenciaEl = document.getElementById('codigoReferencia-detalle');
    const fechaUltimaRevisionEl = document.getElementById('fechaUltimaRevision-detalle');
    const revisadoPorEl = document.getElementById('revisadoPor-detalle');
    const qrEl = document.getElementById('qr-detalle');
    const container = document.getElementById('detalle-activo');
    const errorDiv = document.getElementById('error-detalle');
    const mensajeError = document.getElementById('mensaje-error');

    try {
        const res = await fetch(`/api/activos/${id}`);
        console.log('Respuesta del servidor:', res.status, res.statusText);
        if (!res.ok) {
            const texto = await res.text();
            console.error('Error del servidor:', texto);
            throw new Error(`Código ${res.status}: ${texto}`);
        }

        const resultado = await res.json();
        const activo = resultado.activo;
        nombreEl.innerText = activo.nombre;
        descripcionEl.innerText = activo.descripcion;
        codigoReferenciaEl.innerText = activo.codigoReferencia || '-';
        fechaUltimaRevisionEl.innerText = activo.fechaUltimaRevision || '-';
        revisadoPorEl.innerText = activo.revisadoPor || '-';
        qrEl.src = activo.qrCode;
        actualizarHistorialRevisiones(resultado.historial);

        container.style.display = 'block';
        errorDiv.classList.add('d-none');

        // Botón borrar en detalle
        let btnBorrar = document.getElementById('btn-borrar-detalle');
        if (!btnBorrar) {
            btnBorrar = document.createElement('button');
            btnBorrar.id = 'btn-borrar-detalle';
            btnBorrar.className = 'btn btn-danger mt-3';
            btnBorrar.style.borderRadius = '10px';
            btnBorrar.style.padding = '10px 20px';
            btnBorrar.style.fontWeight = 'bold';
            btnBorrar.innerText = 'Borrar activo';
            btnBorrar.onclick = async () => {
                if (confirm('¿Estás seguro de que deseas borrar este activo?')) {
                    await borrarActivo(activo.id);
                    window.location.href = '/';
                }
            };
            container.appendChild(btnBorrar);
        }
    } catch (error) {
        console.error('Error al cargar el activo:', error);
        container.style.display = 'none';
        mensajeError.textContent = `No se ha podido cargar el activo. Detalle: ${error.message}`;
        errorDiv.classList.remove('d-none');
    }
}

async function borrarActivo(id) {
    if (!confirm('¿Estás seguro de que deseas borrar este activo?')) {
        return;
    }
    try {
        const res = await fetch(`/api/activos/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error(`Error al borrar el activo: ${res.statusText}`);
        }
        listarActivos();
    } catch (error) {
        alert('Error al borrar el activo.');
        console.error(error);
    }
}

async function registrarUsuario() {
    const email = document.getElementById('email-registro').value.trim();
    const password = document.getElementById('password-registro').value.trim();
    const rol = document.getElementById('rol-registro').value.trim();

    if (!email || !password || !rol) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const id = crypto.randomUUID();
    const usuario = { id, email, password, rol };

    try {
        await fetch('/api/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        alert('Usuario registrado correctamente.');
        window.location.href = '/index.html';
    } catch (error) {
        alert('Error al registrar el usuario.');
        console.error(error);
    }
}

async function iniciarSesion() {
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value.trim();

    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const res = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            throw new Error('Credenciales incorrectas.');
        }
        const usuario = await res.json();
        localStorage.setItem('usuario', JSON.stringify(usuario));
        alert('Sesión iniciada correctamente.');
        window.location.href = '/index.html';
    } catch (error) {
        alert('Error al iniciar sesión.');
        console.error(error);
    }
}

async function cerrarSesion() {
    try {
        await fetch('/api/usuarios/logout', { method: 'POST' });
        localStorage.removeItem('usuario');
        alert('Sesión cerrada correctamente.');
        window.location.href = '/login.html';
    } catch (error) {
        alert('Error al cerrar sesión.');
        console.error(error);
    }
}

function actualizarVista() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');
    const logoutButton = document.getElementById('logout-button');
    const activosForm = document.querySelector('.card.shadow-sm.mb-5');
    const listaActivos = document.getElementById('lista-activos');

    if (usuario) {
        loginForm.classList.add('d-none');
        registroForm.classList.add('d-none');
        logoutButton.classList.remove('d-none');
        activosForm.classList.remove('d-none');
        listaActivos.classList.remove('d-none');
    } else {
        loginForm.classList.remove('d-none');
        registroForm.classList.remove('d-none');
        logoutButton.classList.add('d-none');
        activosForm.classList.add('d-none');
        listaActivos.classList.add('d-none');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
        return;
    }
    const path = window.location.pathname;
    if (/\/activos\/[^\/]+$/.test(path)) {
        cargarDetalleActivo();
    } else if (document.getElementById('lista-activos')) {
        listarActivos();
    }
});

async function guardarRevision() {
    const partes = window.location.pathname.split('/');
    const id = partes[partes.length - 1];
    const revisadoPor = document.getElementById('revisadoPor').value.trim();
    if (!revisadoPor) {
        alert('Por favor, ingresa el nombre del revisor.');
        return;
    }
    try {
        const res = await fetch(`/api/activos/${id}/revisiones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ revisadoPor })
        });
        if (!res.ok) {
            throw new Error('Error al guardar la revisión.');
        }
        const data = await res.json();
        alert('Revisión registrada correctamente.');
        document.getElementById('revisadoPor').value = '';
        document.getElementById('fechaUltimaRevision-detalle').innerText = data.fechaUltimaRevision;
        document.getElementById('revisadoPor-detalle').innerText = data.revisadoPor;
        actualizarHistorialRevisiones(data.historial);
        const modal = bootstrap.Modal.getInstance(document.getElementById('revisionModal'));
        modal.hide();
    } catch (error) {
        alert('Error al guardar la revisión.');
        console.error(error);
    }
}

function actualizarHistorialRevisiones(historial) {
    const tbody = document.getElementById('historial-revisiones');
    tbody.innerHTML = '';
    historial.forEach(rev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${rev.fecha}</td><td>${rev.revisadoPor}</td>`;
        tbody.appendChild(tr);
    });
}
