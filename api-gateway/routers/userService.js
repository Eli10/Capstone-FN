var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

const LOCAL_BASE_URL = 'http://127.0.0.1:5000'
const HEROKU_URL = 'https://test-user-api.herokuapp.com'
const api = apiAdapter(HEROKU_URL)

router.post('/users/register', (req, res) => {
    var json_data = req.body;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.post(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

router.post('/users/login', (req, res) => {
    var json_data = req.body;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.post(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})


router.post('/users/follows', (req, res) => {
    var json_data = req.body;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.post(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

module.exports = router
