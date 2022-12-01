const express = require('express')
const router = new express.Router()
const companyController = require('../Controller/CompanyController')
const authMiddleware = require('../Middleware/AuthMiddleware')
const roleMiddleware = require('../Middleware/RoleMiddleware')
const requestController = require("../Controller/RequestController");
const userController = require("../Controller/UserController");
const {body} = require("express-validator");

router.put('/', authMiddleware,
    body('name', 'invalid name company').isLength({min: 3, max: 50}),
    body('country', 'invalid country').isLength({min: 3, max: 30}),
    body('state', 'invalid state').isLength({min: 3, max: 30}),
    body('city', 'invalid city').isLength({min: 3, max: 30}),
    body('address', 'invalid address').notEmpty(),
    body('director', 'invalid director').isLength({min: 3, max: 30}),
    companyController.updateMy)
// router.get('/drivers', authMiddleware, companyController.findDrivers)
// router.get('/trucks', authMiddleware, companyController.findTrucks)
// router.post('/drivers', roleMiddleware, companyController.createDriver)
// router.post('/trucks', roleMiddleware, companyController.createTruck)
router.get('/my', authMiddleware, companyController.getMy)



module.exports = router