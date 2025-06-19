const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcryptJS = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req,res = response) => {

    const {email, password} = req.body;

    try {

        let usuario = await Usuario.findOne({email:email});

        if (usuario) {
            return res.status(400).json({
            ok: false,
            msg: 'el usuario ecite'
        })
        }

        usuario = new Usuario( req.body);

        const salt = bcryptJS.genSaltSync();
        usuario.password = bcryptJS.hashSync(password, salt);
        
        usuario.save();

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'por favor hable con el admin'
        })
    }

    
 }

 const loginUsuario = async (req,res = response) => {

    const {email, password} = req.body;

    try{

        const usuario = await Usuario.findOne({email:email});

        if (!usuario) {
            return res.status(400).json({
            ok: false,
            msg: 'el usuario no ecite'
        })
        }

        const validPassword = bcryptJS.compareSync(password, usuario.password)
        
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'pass malo'
            })
        }

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
         ok: true,
         uid: usuario.id,
         name: usuario.name,
         token
     })


    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'por favor hable con el admin'
        })
    }

    
 }

 const revalidarToken = async(req,res = response) => {

    const uid = req.uid
    const name = req.name

    const token = await generarJWT(uid, name);

    res.json({
         ok: true,
         token,
         uid,
         name
     })
 }

 module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
 }