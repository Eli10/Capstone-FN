var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

// Local & Heroku Restaurant Service URLs
const LOCAL_BASE_URL = 'http://localhost:8001'
const HEROKU_URL = 'https://capstone-restaurant-service.herokuapp.com'
const api = apiAdapter(HEROKU_URL)


// This method takes a path string and a request.
// If that request matches the path then it passes
// the request to the proper service.
//
// @param routeString This is the first paramter to the method
//
// @param httpRequestObject  This is the second parameter to the method
//
// @return json
router.get('/restaurants', (req, res) => {
    var json_data = {};
    json_data['headers'] = req.headers;
    //Making axios request to service
    api.get(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})


// This method takes a path string and a request.
// If that request matches the path then it passes
// the request to the proper service.
//
// @param routeString This is the first paramter to the method
//
// @param httpRequestObject  This is the second parameter to the method
//
// @return json
router.get('/restaurants/:restaurant_name', (req, res) => {
    var json_data = {};
    json_data['headers'] = req.headers;
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})


// This method takes a path string and a request.
// If that request matches the path then it passes
// the request to the proper service.
//
// @param routeString This is the first paramter to the method
//
// @param httpRequestObject  This is the second parameter to the method
//
// @return json
router.get('/restaurants/id/:restaurant_name/:restaurant_address', (req, res) => {
    var json_data = {};
    json_data['headers'] = req.headers;
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})


// This method takes a path string and a request.
// If that request matches the path then it passes
// the request to the proper service.
//
// @param routeString This is the first paramter to the method
//
// @param httpRequestObject  This is the second parameter to the method
//
// @return json
router.get('/restaurants/discover/:username', (req, res) => {
    var json_data = {};
    json_data['headers'] = req.headers;
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

// Exporting restaurantService router
module.exports = router
