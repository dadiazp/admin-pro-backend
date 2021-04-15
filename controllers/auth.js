const Usuario = require('../models/usuario');

const bcrypt = require('bcryptjs');

const {response} = require('express');

const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) =>{

    const {email, password} = req.body;

    try{

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido' //Este mensaje es ideal para no darle indicios a un atacante de que algun dato está correcto o no
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            })
        }

        //Generar el token
        const token = await generarJWT(usuarioDB._id);

        res.json({
            ok: true,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {login};