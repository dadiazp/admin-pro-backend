const {response, request} = require('express');

const Usuario = require('../models/usuario');

const Medico = require('../models/medico');

const Hospital = require('../models/hospital');

const getTodo = async(request, response) => {

    const busqueda =  (request.params.busqueda)

    const regex = new RegExp(busqueda, 'i'); //Con el parametro 'i' hago que busqueda sea insensible, de modo que la busqueda sea flexible

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({nombre: regex}), //Trae todos los usuarios donde el nombre sea igual a regex

        Medico.find({nombre: regex}),
    
        Hospital.find({nombre: regex})
    ]);

    response.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });

}

const getDocumentosColeccion = async(request, response = response) => {

    const tabla =  (request.params.tabla)

    const busqueda =  (request.params.busqueda)

    const regex = new RegExp(busqueda, 'i'); //Con el parametro 'i' hago que busqueda sea insensible, de modo que la busqueda sea flexible

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre: regex})
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');;
        break;

        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                 .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({nombre: regex}); //Trae todos los usuarios donde el nombre sea igual a regex
        break;
    
        default:
            return response.status(400).json({
                ok: false,
                msg: "La tabla tiene que ser usuarios/medicos/hospitales"
            });
    }

    response.json({
        ok: true,
        resultados: data
    });

}

module.exports = {
    getTodo,
    getDocumentosColeccion
}