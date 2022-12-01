const express = require('express')
const requestController = require('../Controller/RequestController');
const requestService = require('../Service/RequestService')
const authMiddleware = require('../Middleware/AuthMiddleware')
const roleMiddleware = require('../Middleware/RoleMiddleware')
const ApiError = require("../Error/ApiError");
const {body} = require("express-validator");
const router = new express.Router()


router.get('/', requestController.findAllFree)
router.get('/user', authMiddleware, requestController.findAllByUser)
router.post('/', roleMiddleware, (req, res, next) =>
    {
        try{
            req.ability.throwUnlessCan('create', 'Request')
            next()
        } catch{
            next(ApiError.Forbidden())
        }
    },
    body('dateLoading', 'invalid date/time loading').custom((val, { req, loc, path }) => {
        if (val < new Date()) {
            throw new Error("invalid date/time loading")
        } else {
            return val
        }
    }),
    body('dateUnloading', 'invalid date/time unloading').custom((val, { req, loc, path }) => {
        if (val < req.bodydateLoading) {
            throw new Error("invalid date/time unloading")
        } else {
            return val
        }
    }),
    body('loadLimit', 'invalid load limit').isInt({ min: 1, max: 1000 }),
    body('weight', 'invalid weight').isInt({ min: 5, max: 40 }),
    body('volume', 'invalid volume').isInt({ min: 3, max: 40 }),
    body('WRCountry', 'invalid from country').isLength({min: 3, max: 30}),
    body('WCountry', 'invalid to country').isLength({min: 3, max: 30}),
    body('WRState', 'invalid from state').isLength({min: 3, max: 30}),
    body('WState', 'invalid from state').isLength({min: 3, max: 30}),
    body('WRCity', 'invalid from city').isLength({min: 3, max: 30}),
    body('WCity', 'invalid to city').isLength({min: 3, max: 30}),
    body('WRAddress', 'from address must be populated').notEmpty(),
    body('WAddress', 'to address must be populated').notEmpty(),
    body('typeLoading', 'invalid type loading').custom((val, { req, loc, path }) => {
        if (val === 'up' || val === 'side' || 'pear') {
            return val
        } else {
            throw new Error("invalid type loading")
        }
    }),
    body('typeUnloading', 'invalid type unloading').custom((val, { req, loc, path }) => {
        if (val === 'up' || val === 'side' || 'pear') {
            return val
        } else {
            throw new Error("invalid type unloading")
        }
    }),
    body('cargo', 'invalid cargo').isLength({min: 5, max: 30}),
    body('rate', 'invalid rate').isInt(),
    requestController.create)
router.get('/:id', authMiddleware, requestController.getById)
router.put('/:id', roleMiddleware,(req, res, next) => {
    try{
        req.ability.throwUnlessCan('update', 'Request')
        next()
    } catch{
        next(ApiError.Forbidden())
    }
}, requestController.update)
router.delete('/:id', roleMiddleware, async (req, res, next) => {
    try{
        req.ability.throwUnlessCan('delete', await requestService.findById(req.params.id))
        next()
    } catch{
        next(ApiError.Forbidden())
    }
}, requestController.delete)
module.exports = router