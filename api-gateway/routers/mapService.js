var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

const LOCAL_BASE_URL = 'http://localhost:8000'
const HEROKU_URL = 'https://map-service.herokuapp.com'
const api = apiAdapter(HEROKU_URL)

router.post('/maps/', (req, res) => {
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

router.get('/maps/:username', (req, res) => {
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

router.get('/maps/name/:username', (req, res) => {
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

router.get('/maps/follow/:username', (req, res) => {
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

router.post('/maps/contain', (req, res) => {
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

router.delete('/maps/contain', (req, res) => {
    var json_data = req.body;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.delete(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})



// router.get('/restaurants/id/:restaurant_name/:restaurant_address', (req, res) => {
//     //Making axios request to service
//     var formatted_path = req.path.replace(new RegExp("%20", 'g'), " ");
//     console.log(formatted_path);
//     api.get(formatted_path)
//     .then(resp => {
//         console.log(resp.data)
//         res.send(resp.data)
//     })
//     .catch(err =>{console.log(err)})
// })



module.exports = router
