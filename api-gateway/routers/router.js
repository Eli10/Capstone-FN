// Elijah Augustin
var express = require('express');
var router = express.Router()
var userService = require('./userService')
var restaurantService = require('./restaurantService')
var mapService = require('./mapService')
var reviewService = require('./reviewService')

// Passes incoming request to service routes
//
// @param httpRequest object
router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

// Setting service routes for incoming path
router.use(userService)
router.use(restaurantService)
router.use(mapService)
router.use(reviewService)

module.exports = router
