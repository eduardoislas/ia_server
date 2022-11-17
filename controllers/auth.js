const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const Log = require('../models/inicioSesionLog');

const crearUsuario = async (req, res = response) => {

    const { phone, password } = req.body;

    try {

        const existePhone = await Usuario.findOne({ phone })
        if (existePhone) {
            return res.status(400).json({
                ok: false,
                msg: 'El teléfono ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        registrarLog(usuario.id, 'Crear Cuenta');

        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const login = async (req, res = response) => {

    const { phone, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ phone })
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El teléfono no está registrado'
            })
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            })
        }

        const token = await generarJWT(usuarioDB.id)

        registrarLog(usuarioDB.id, 'Inicio de Sesión');

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

//Método para rellenar los digitos
//Ej. En lugar de regresar 8, se regresaria un 09
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

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
    return fechaHora
}


const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
}

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

module.exports = {
    crearUsuario,
    login,
    renewToken
}