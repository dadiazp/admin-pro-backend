const {response} = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });

}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
        ...req.body //De esta forma desestructuro todo lo que está en el req.body y lo envio para el save
    });

    try{

       const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
 
}

const actualizarHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg:'actualizar hospitales'
    });

}

const borrarHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg:'borrar hospitales'
    });

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}