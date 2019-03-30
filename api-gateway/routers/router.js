var express = require('express');
var router = express.Router()
var userService = require('./userService')
var restaurantService = require('./restaurantService')
var mapService = require('./mapService')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(userService)
router.use(restaurantService)
router.use(mapService)

module.exports = router
