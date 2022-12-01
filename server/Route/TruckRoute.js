const express = require('express')
const router = new express.Router()
const authMiddleware = require('../Middleware/AuthMiddleware')
const roleMiddleware = require('../Middleware/RoleMiddleware')
const truckController = require("../Controller/TruckController");

router.post('/', roleMiddleware, truckController.createTruck)
router.get('/user', roleMiddleware, truckController.getMyTrucks)
router.get('/free', roleMiddleware, truckController.getFreeTrucks)
router.get('/:id', roleMiddleware, truckController.getById)
router.put('/:id', roleMiddleware, truckController.updateTruck)
router.delete('/:id', roleMiddleware, truckController.deleteTruck)

module.exports = router