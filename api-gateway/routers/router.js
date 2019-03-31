var express = require('express');
var router = express.Router()
var userService = require('./userService')
var restaurantService = require('./restaurantService')
var mapService = require('./mapService')
var reviewService = require('./reviewService')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(userService)
router.use(restaurantService)
router.use(mapService)
router.use(reviewService)

module.exports = router
