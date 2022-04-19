

/*
    path: api/mensajes
*/


const { Router } = require('express');
const { obtenerChat, obtenerTodosMsg, obtenerChatbot } = require('../controllers/mensajes');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/:de', validarJWT, obtenerChat);

router.get('/bot/:de', validarJWT, obtenerChatbot);

router.get('/', validarJWT, obtenerTodosMsg)

module.exports = router;