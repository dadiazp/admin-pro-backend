const mongoose = require('mongoose');

//El async convierte la funcion en una promesa
//el await convierte una promesa en una sincrona

const dbConnection = async() => {

    try{

        //Await quiere decir: espera a que todo lo que está después pase
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB online');

    }catch(error){

        throw new Error('Error a la hora de iniciar la base de datos'); 

    }

}

//Exporto la funcion dbConnection para usarla en otras partes
module.exports = {
    dbConnection
}