//Incluido en node, sirve para construir un path completo
const path = require('path');

//Importacion del filesystem de express
const fs = require('fs');

const {response} = require('express');

//Importacion de uuid, requiere instalacion previa
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const  fileUpload = (request, response = response) => {

    const tipo = request.params.tipo;

    const id = request.params.id;

    //Validar Tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(!tiposValidos.includes(tipo)){
        return response.status(400).json({
            ok: false,
            msg: "No es un médico, usuario u hospital"
        });
    }

    //Validar que exista un archivo
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //Procesar la imagen
    //Tengo acceso al .file gracias al middleware express fileuploader establecido en las rutas
    const file = request.files.imagen;

    const nombreCortado = file.name.split('.');

    const extensionArchivo = nombreCortado[nombreCortado.length-1];

    //Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
        return response.status(400).json({
            ok: false,
            msg: "La imagen posee una extensión no válida"
        }); 
    }

    //Generar el nombre del archivo (Se genera un uuid porque 2 usuarios pueden subir 2 imagenes con el mismo nombre, seria un problema)
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

    //Crear el path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen
    file.mv(path, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        response.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    });

}

const retornaImagen = (request, response = response) =>{

    const tipo = request.params.tipo;
    const foto = request.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if(fs.existsSync(pathImg)){
        response.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        response.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}