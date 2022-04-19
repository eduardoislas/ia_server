
const Mensaje = require('../models/mensaje')


const obtenerChat= async (req, res) => {

    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await Mensaje.find({
        $or: [{ de: miId, para: mensajesDe}, {de: mensajesDe, para: miId }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        mensajes: last30
    })
}

const obtenerChatbot= async (req, res) => {

    const miId = req.uid;
    const mensajesDe = '625e6167caa674e5071f82b9';

    const last30 = await Mensaje.find({
        $or: [{ de: miId, para: mensajesDe}, {de: mensajesDe, para: miId }]
    })
    .sort({ createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        mensajes: last30
    })
}

const obtenerTodosMsg= async (req, res) => {

    const todos = await Mensaje.find({})
    .sort({ createdAt: 'desc'});

    res.json({
        ok: true,
        mensajes: todos
    })
}




module.exports = {
    obtenerChat,
    obtenerChatbot,
    obtenerTodosMsg
}