const express = require('express')
const router = new express.Router()
const userController = require('../Controller/UserController')
const {body} = require('express-validator')
const authMiddleware = require('../Middleware/AuthMiddleware')
const roleMiddleware = require('../Middleware/RoleMiddleware')


router.post('/registration',
    body('email', 'invalid email').isEmail(),
    body('password', 'invalid password').isLength({min: 5, max: 30}).custom((val, { req, loc, path }) => {
        if (val !== req.body.passwordRep) {
            throw new Error("passwords don't match")
        } else {
            return val
        }
    }),
    body('nameCompany', 'invalid name company').isLength({min: 3, max: 30}),
    body('name', 'invalid name').isLength({min: 3, max: 50}),
    body('director', 'invalid director').isLength({min: 3, max: 30}),
    body('country', 'invalid country').isLength({min: 3, max: 30}),
    body('state', 'invalid state').isLength({min: 3, max: 30}),
    body('city', 'invalid city').isLength({min: 3, max: 30}),
    body('address', 'invalid address').notEmpty(),
    body('phoneNumber', 'invalid phone number').custom((val, { req, loc, path }) => {
        if (!val.match('^[+][0-9]{1,4}[\\]([0-9]{1,4}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}')) {
            throw new Error("invalid phone number")
        } else {
            return val
        }
    }),
    body('role', 'invalid role').custom((val, { req, loc, path }) => {
        if (val === 'CARRIER' || val === 'CUSTOMER') {
            return val
        } else {
            throw new Error("invalid role")
        }
    }),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.put('/', authMiddleware,
    body('email', 'invalid email').isEmail(),
    body('name', 'invalid name company').isLength({min: 3, max: 50}),
    body('phoneNumber', 'invalid phone number').custom((val, { req, loc, path }) => {
        if (!val.match('^[+][0-9]{1,4}[\\]([0-9]{1,4}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}')) {
            throw new Error("invalid phone number")
        } else {
            return val
        }
    }),
    userController.updateMy)
router.get('/my', authMiddleware, userController.getMy)
router.get('/auth', authMiddleware, userController.auth)
router.post('/drivers/free', roleMiddleware, userController.getFreeDrivers)
router.get('/drivers/:id', roleMiddleware, userController.getDriver)
router.get('/drivers', roleMiddleware, userController.getMyDrivers)
router.post('/drivers', roleMiddleware,     body('email', 'invalid email').isEmail(),
    body('password', 'invalid password').isLength({min: 5, max: 30}).custom((val, { req, loc, path }) => {
        if (val !== req.body.passwordRep) {
            throw new Error("passwords don't match")
        } else {
            return val
        }
    }),
    body('name', 'invalid name').isLength({min: 3, max: 50}),
    body('phoneNumber', 'invalid phone number').custom((val, { req, loc, path }) => {
        if (!val.match('^[+][0-9]{1,4}[\\]([0-9]{1,4}[)][0-9]{3}[-][0-9]{2}[-][0-9]{2}')) {
            throw new Error("invalid phone number")
        } else {
            return val
        }
    }),
    body('role', 'invalid role').custom((val, { req, loc, path }) => {
        if (val === 'DRIVER') {
            return val
        } else {
            throw new Error("invalid role")
        }
    }),
    userController.createDriver)
router.delete('/drivers/:id', roleMiddleware, userController.deleteDriver)

module.exports = router