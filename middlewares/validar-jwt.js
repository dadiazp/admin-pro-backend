const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {

    //Leer el token
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        //Con esto coloco el uid en la request para luego recogerlo en la funcion siguiente al
        //middleware
        req.uid = uid;

        next();

    }catch(error){
        return res.status(401).json({
            ok: true,
            msg: 'Token incorrecto'
        });
    }

}

const validarAdminRole = async(req, res, next) =>{

    const uid = req.uid //Como primero se ejecuta el validarJWT y este guarda el uid en la request, ya tengo disposicion del mismo

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios'
            });
        }

        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

const validarAdminRoleOMismoUsuario = async(req, res, next) =>{

    const uid = req.uid //Como primero se ejecuta el validarJWT y este guarda el uid en la request, ya tengo disposicion del mismo
    const id = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios'
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRoleOMismoUsuario
}