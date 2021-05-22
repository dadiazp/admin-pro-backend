const {Schema, model} = require('mongoose');


const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: { //De esta forma se indica la referencia o la relacion con usuario
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

    //Esto es para que en mongo se guarde la bd como hospitales y no como hospitals
}, {collection: 'hospitales'});

HospitalSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject();

    return object
});

module.exports = model('Hospital', HospitalSchema);