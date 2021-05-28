const {response} = require('express');

const Hospital = require('../models/hospital');
const usuario = require('../models/usuario');

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

const actualizarHospital = async(req, res = response) => {

    const hospitalId = req.params.id;
    const uid = req.uid;

    try{

        const hospital = await Hospital.findById(hospitalId);

        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg:'Hospital no encontrado'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, {new:true});

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }

}

const borrarHospital = async(req, res = response) => {

    const hospitalID = req.params.id;

    try{

        const hospital = await Hospital.findById(hospitalID);

        if(!hospital){
            return res.status(404).json({
                ok: false,
                msg:'Hospital no encontrado'
            });
        }

        await Hospital.findByIdAndDelete(hospitalID);

        res.json({
            ok: true,
            msg:'Hospital eliminado'
        });

    }catch(error){
        res.status(500).json({
            ok: true,
            msg:'Hable con el administrador'
        });
    }


}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}