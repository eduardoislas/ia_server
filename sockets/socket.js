const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket')


// Mensajes de Sockets
io.on('connection', client => {

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    if ( !valido ){
        return client.disconnect();
    }
    
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id

    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload)=>{
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    } );

    //Escuchar del cliente el mensaje-chatbot
    client.on('mensaje-chatbot', async (payload)=>{
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-chatbot', payload);
    } );


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });


});
