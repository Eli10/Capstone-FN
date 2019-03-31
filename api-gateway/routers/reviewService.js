var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

const LOCAL_BASE_URL = 'http://127.0.0.1:5001'
const HEROKU_URL = 'n/a'
const api = apiAdapter(LOCAL_BASE_URL)

router.post('/reviews', (req, res) => {
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


router.get('/reviews/restaurant/:restaurant_id', (req, res) => {
    //Making axios request to service
    console.log(req.path);
    api.get(req.path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

router.get('/reviews/user/:username', (req, res) => {
    //Making axios request to service
    console.log(req.path);
    api.get(req.path)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})



module.exports = router
