const { response } = require("express");
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const log = require("../helpers/logs");

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

        log.registrarLog(usuario.id, 'Crear Cuenta');

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

        //Registrar acción en la BDD
        log.registrarLog(usuarioDB.id, 'Inicio de Sesión');

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



module.exports = {
    crearUsuario,
    login,
    renewToken
}