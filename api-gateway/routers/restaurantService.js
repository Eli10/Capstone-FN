var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

const LOCAL_BASE_URL = 'http://localhost:8001'
const HEROKU_URL = 'https://capstone-restaurant-service.herokuapp.com'
const api = apiAdapter(LOCAL_BASE_URL)

router.get('/restaurants', (req, res) => {
    //Making axios request to service
    api.get(req.path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

router.get('/restaurants/:restaurant_name', (req, res) => {
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

router.get('/restaurants/id/:restaurant_name/:restaurant_address', (req, res) => {
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

router.get('/restaurants/discover/:username', (req, res) => {
    //Making axios request to service
    var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
    console.log(formatted_path);
    api.get(formatted_path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

module.exports = router
