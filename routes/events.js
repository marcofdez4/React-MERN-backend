const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
//todas tienen que estar validadas por el JWT
//obtener eventos

const router = Router();

router.use(validarJWT);

router.get('/', getEventos)

// crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de fin es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento)

// actualizar Evento
router.put('/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'fecha de inicio es obligatoria').custom(isDate),
        check('end', 'fecha de fin es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento)

// borrar Evento
router.delete('/:id', eliminarEvento)

module.exports = router