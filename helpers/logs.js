const Log = require('../models/inicioSesionLog');

const registrarLog = async (id, accion) => {
    try {
        //Registrar login en el log (colección dailyLoginApp )
        const fecha = formatDate()[0];
        const hora = formatDate()[1];
        const log = new Log({
            id_Usuario: id,
            date: fecha,
            hour: hora,
            accion: accion
        });
        log.save();
    } catch (error) {
        console.log(error);
    }
}

//Método para rellenar los digitos
//Ej. En lugar de regresar 8, se regresaria un 09
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

//Obter la fecha del registro del Log
//Regrear un array cuyo contenido es
//[0]= cadena de la fecha en formato dd/mm/YYYY
//[1]= formato de la hora en formato hh/mm/ss
function formatDate() {
    var fechaSinFormato = new Date();
    var fechaHora = [[
        padTo2Digits(fechaSinFormato.getDate()),
        padTo2Digits(fechaSinFormato.getMonth() + 1),
        fechaSinFormato.getFullYear()
    ].join('-'),
    [
        padTo2Digits(fechaSinFormato.getHours()),
        padTo2Digits(fechaSinFormato.getMinutes()),
        padTo2Digits(fechaSinFormato.getSeconds())
    ].join(':')
    ];
    return fechaHora;
}

module.exports = {
    registrarLog
}