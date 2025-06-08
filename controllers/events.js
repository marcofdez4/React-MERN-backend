const {response} = require('express');
const Evento = require('../models/Evento')

const getEventos = async(req, res = response) => {

        const eventos = await Evento.find()
                                        .populate('user','name');

    res.json({
        ok:true,
        eventos
    })
}

const crearEvento = async(req, res = response) => {

        const evento = new Evento(req.body);

        try {

                evento.user = req.uid;

                const eventoGuardado = await evento.save();

                res.json({
                        ok: true,
                        evento: eventoGuardado
                })

        } catch(error) {
                console.log(error)
                res.status(500).json({
                        ok: false,
                        msg: 'hable con el administrador'
                })
        }

}

const actualizarEvento = async(req, res = response) => {

        const eventoId = req.params.id;
        const uid = req.uid

        try {

                const evento = await Evento.findById(eventoId)

                if(!evento){
                        return res.status(400).json({
                                ok: false,
                                msg: 'el evento no existe'
                        })
                }

                if(evento.user.toString() !== uid){
                        return res.status(401).json({
                                ok: false,
                                msg: 'no tiene privilegios para editar el evento'
                        })
                }

                const nuevoEvento = {
                        ...req.body,
                        user: uid
                }

                const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});


                res.json({
                        ok:true,
                        evento: eventoActualizado
                })   ;


        } catch(error) {
                console.log(error);
                return res.status(500).json({
                ok: false,
                msg: 'hable con el admin'
        });
        }

        
}

const eliminarEvento = async (req, res = response) => {
        const eventoId = req.params.id;
        const uid = req.uid

        try {

                const evento = await Evento.findById(eventoId)

                if(!evento){
                        return res.status(400).json({
                                ok: false,
                                msg: 'el evento no existe'
                        })
                }

                if(evento.user.toString() !== uid){
                        return res.status(401).json({
                                ok: false,
                                msg: 'no tiene privilegios para editar el evento'
                        })
                }

               

                const eventoActualizado = await Evento.findByIdAndDelete(eventoId);


                res.json({
                        ok:true,
                        msg: 'El evento se ha borrado satisfactoriamente'
                })   ;


        } catch(error) {
                console.log(error);
                return res.status(500).json({
                ok: false,
                msg: 'hable con el admin'
        });
        }    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}