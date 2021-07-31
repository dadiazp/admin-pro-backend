const Usuario = require('../models/usuario');

const bcrypt = require('bcryptjs');

const {response} = require('express');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuOptions } = require('../helpers/menu-frontend');


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
            token,
            menu: getMenuOptions(usuarioDB.role)
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async(request, response = response) =>{

    const googleToken = request.body.token;

    try{

        const {name, email, picture}= await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});

        let usuario;

        if(!usuarioDB){

            //No existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: "@@@", //Este password no es necesario, recordemos que el auth se hace via google
                img: picture,
                google: true 
            });

        }else{

            //Existe el usuario
            usuario = usuarioDB;
            usuario.google = true;

        }

        //Guardar en DB
        await usuario.save();

        //Generar el token
        const token = await generarJWT(usuario.id);

        response.json({
            ok: true,
            msg: "Google Sign in",
            token,
            menu: getMenuOptions(usuario.role)
        });

    }catch(error){

        response.status(401).json({
            ok: false,
            msg: "Token no es correcto",
        });

    }

}

const renewToken = async(request, response = response) => {

    const uid = request.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    response.json({
        ok: true,
        token,
        usuario,
        menu: getMenuOptions(usuario.role)
    });

}

module.exports = {
    login, 
    googleSignIn,
    renewToken
};