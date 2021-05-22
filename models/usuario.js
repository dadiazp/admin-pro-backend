const {Schema, model} = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }

});

//Configuracion en el schema para cambiar _id por uid y para eliminar __v a la hora de
//devolver una response json, no afecta la BD
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();

    object.uid = _id;
    return object
});

//De esta manera exporto el modelo de usuario. 
//El primer parametro es el nombre del modelo
//El segundo parametro es el schema que refiere a ese modelo
module.exports = model('Usuario', UsuarioSchema);