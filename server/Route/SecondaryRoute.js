const express = require('express')
const router = new express.Router()
const secondaryController = require('../Controller/SecondaryController')

router.get('/', secondaryController.getAll)

module.exports = router