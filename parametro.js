// Obtén la URL actual
const urlActual = window.location.href;

// Verifica si el parámetro 'nombre' ya está presente en la URL
const urlParts = urlActual.split('/');
const carpetaNombre = urlParts[urlParts.length - 1];

if (!carpetaNombre) {
    // Si 'nombre' no está presente, genera un número aleatorio
    carpetaNombre = generarCadenaAleatoria();
    // Agrega el parámetro 'nombre' a la URL
    const urlConParametro = `${urlActual}/${carpetaNombre}`;
    // Redirige a la nueva URL con el parámetro 'nombre'
    window.location.href = urlConParametro;
} else {
    // Llama a la función para crear la carpeta con el nombre obtenido
    crearCarpeta(carpetaNombre);
}

// Función para generar una cadena aleatoria
function generarCadenaAleatoria() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let cadenaAleatoria = '';
    for (let i = 0; i < 3; i++) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        cadenaAleatoria += caracterAleatorio;
    }
    return cadenaAleatoria;
}

// Función para crear la carpeta
function crearCarpeta(carpetaNombre) {
    $.ajax({
        url: `crearCarpeta/${carpetaNombre}`,
        type: 'POST',
        success: function(response) {
            console.log('Carpeta creada con éxito:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error al crear la carpeta:', error);
        }
    });
}

// Obtén la zona de arrastre y el formulario
const dropArea = document.getElementById('drop-area');
const Form = document.getElementById('form');

// Agrega los siguientes eventos a la zona de arrastre
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// Función para manejar los archivos seleccionados
function handleFiles(files) {
    if (files.length > 0) {
        // Realiza alguna acción, como mostrar los nombres de los archivos
        console.log('Archivos seleccionados:');
        Array.from(files).forEach((file) => {
            console.log(file.name);
        });

        // También puedes realizar otras acciones, como subir los archivos al servidor
        // Puedes agregar aquí el código para subir los archivos si lo deseas
        uploadFiles(carpetaNombre, files);
    }
}

// Función para subir varios archivos a la vez
function uploadFiles(carpetaRuta, files) {
    var progressBar = document.getElementById('progressBar');

    var formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append('archivos[]', file);
    });

    var xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Archivos subidos con éxito');
            // Puedes realizar acciones adicionales después de la carga aquí
        } else {
            console.error('Error al subir los archivos');
        }
    };

    xhr.open('POST', 'upload.php', true);
    xhr.send(formData);
}

// Agrega esta función para manejar el evento de envío del formulario
Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = Form.querySelector('#archivo');
    const files = fileInput.files;
    if (files.length > 0) {
        uploadFiles(carpetaNombre, files);
    } else {
        alert('Por favor, seleccione al menos un archivo.');
    }
});

// Selecciona el input de archivo y el botón de subir
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const progressBar = document.getElementById('progress-bar');

// Agrega un evento de cambio al input de archivo
fileInput.addEventListener('change', (e) => {
    // Obtiene el archivo seleccionado
    const file = fileInput.files[0];

    // Crea un objeto de formulario para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);

    // Crea una solicitud de subida de archivo
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // Agrega un evento de progreso para actualizar la barra de progreso
    xhr.upload.addEventListener('progress', (e) => {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = `${percent}%`;
    });

    // Envía el archivo
    xhr.send(formData);
});

// Agrega un evento de clic al botón de subir
uploadButton.addEventListener('click', () => {
    // Simula un clic en el input de archivo
    fileInput.click();
});