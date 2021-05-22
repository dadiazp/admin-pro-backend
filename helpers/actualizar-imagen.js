//Importacion del filesystem de express
const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const borrarImagen = (path) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }   
}

//Con solo que sea async esto devolverá una promesa
const actualizarImagen = async(tipo, id, nombreArchivo) =>{

    let pathViejo = '';

    switch(tipo){
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico){
                console.log("No se encontró medico por id");
                return false
            }

            //Borrar una imagen anterior, si es que tiene
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo)
            
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                console.log("No se encontró hospital por id");
                return false
            }

            //Borrar una imagen anterior, si es que tiene
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo)
            
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                console.log("No se encontró usuario por id");
                return false
            }

            //Borrar una imagen anterior, si es que tiene
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo)
            
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
    }

}

module.exports = {
    actualizarImagen
}