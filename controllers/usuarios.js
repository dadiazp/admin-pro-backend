const Usuario = require('../models/usuario');

//Paquete para encriptar, requiere instalacion
const bcrypt = require('bcryptjs');

const { response } = require('express');

const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(request, response) => {

    //Recoger el parametro de la URL
    const desde = Number (request.query.desde) || 0; // Si no mando el desde, se setea en 0

    //Esto es una coleccion de promesas. Lo ejecuto de esta forma para ejecutar todas las promesas
    //dentro de la coleccion de manera sincrona (al mismo tiempo). Cuando TODAS las promesas han terminado su proceso es que se
    //devolverá una respuesta. La respuesta es un array con el resolve de cada promesa
    const [usuarios, total] = await Promise.all([
        //1ra posicion del arreglo
        Usuario.find({}, 'nombre email role google img')
        .skip(desde) //Con esto se va a saltar los registros que esten antes de la variable desde
        .limit(5), //Con esto establezco el número de registro que quiero que se muestren

        //2da posicion del arreglo
        Usuario.countDocuments()
    ]);


    response.json({
        ok: true,
        usuarios,
        total
    });
   
}

//El await solo se puede utilizar en funciones asincronas, por eso colocamos el async
const crearUsuario = async(request, response) => {

    const {email, password} = request.body;

    try{

        //El paremetro del findOne es equivalente a esto email: email
        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return response.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(request.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Se coloca acá el await porque el save es una promesa, por lo que el response se va a
        //ejecutar y la insercion del usuario aun no se habrá hecho, puede ocurrir
        //un error y no lo contemplariamos. Con el await espero
        //a que termine de ejecutar la promesa para luego devolver la respuesta
        await usuario.save();

        //Generar el token
        const token = await generarJWT(usuario._id);

        response.json({
            ok: true,
            usuario,
            token
        });

    }catch(error){
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarUsuario = async(req, res = response) =>{

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese ID'
            });
        }

         //Actualizaciones
         //El siguiente codigo es equivalente a:
         /** 
          *   delete campos.password;
              delete campos.google;
         */
        //Elimino password y google de la variable campos
         const {password, google, email, ...campos} = req.body;

        //Acá ya no es necesario colocar req.body.email, con la desestructuracion de la linea anterior lo obtengo
         if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        //De este modo evito que un usuario cambie el correo si está logueado con correo
        if(!usuarioDB.google){
            //Vuelvo añadir el email para ser actualizado
            campos.email = email;
        }else if(usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de Google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true}); //Con el new en true mongoose devuelve el usuario actualizado

        return res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese ID'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        return res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};