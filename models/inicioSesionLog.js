
const {Schema, model} = require('mongoose');

const LogSchema = Schema({
    id_Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    date: {
        type: String,
        required: true
    }, 
    hour:{
        type: String,
        required: true
    },
    accion:{
        type: String,
        required:true
    }
});

module.exports = model('InicioSesionLog', LogSchema);