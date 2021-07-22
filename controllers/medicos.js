const {response} = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')   // Usuario que lo creó
                                .populate('hospital', 'nombre img'); // Hospital al que pertenece

    res.json({
        ok: true,
        medicos
    });

}

const getMedico = async(req, res = response) => {
    
    try{

        const medico = await Medico.findById(req.params.id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });


    }catch(error){
        res.json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    
    try{

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
 
}

const actualizarMedico = async(req, res = response) => {

    const medicoID = req.params.id;
    const uid = req.uid;

    try{   

        const medicoDB = await Medico.findById(medicoID);

        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg:'Medico no encontrado'
            });
        }

        const campos = {
            ...req.body, //Es similar a poner nombre, hospital
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(medicoID, campos, {new:true});

        res.json({
            ok: true,
            medico: medicoActualizado
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }

}

const borrarMedico = async(req, res = response) => {

    const medicoID = req.params.id;

    try{

        const medicoDB = await Medico.findById(medicoID);

        if(!medicoDB){
            return res.status(404).json({
                ok: false,
                msg:'Medico no encontrado'
            }); 
        }

        await Medico.findByIdAndDelete(medicoID);

        res.json({
            ok: true,
            msg: "Medico eliminado"
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }

}

module.exports = {
    getMedicos,
    getMedico,
    crearMedico,
    actualizarMedico,
    borrarMedico
}