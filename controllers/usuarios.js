
const {response} = require('express');
const Usuario = require('../models/usuario')


const getUsuarios= async (req, res) => {

    const desde = Number( req.query.desde ) || 0;

    const usuarios = await Usuario
    .find({ 
        $and:
        [{_id: {$ne: req.uid}},
         {_id: {$ne: '625e6167caa674e5071f82b9'}}
        ]
    })
    .sort('-online')
    .skip(desde)
    .limit(30)

    // .find({ _id: {$ne: 'req.uid'}})
    // .sort('-online')
    // .skip(desde)
    // .limit(30)

    res.json({
        ok: true,
        usuarios
    })
}




module.exports = {
    getUsuarios
}