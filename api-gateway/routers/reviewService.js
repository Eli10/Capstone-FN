var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

/**
* Local & Heroku Review Service URLs
*/
const LOCAL_BASE_URL = 'http://127.0.0.1:5001'
const HEROKU_URL = 'https://capstone-review-service.herokuapp.com/'
const api = apiAdapter(HEROKU_URL)

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
*/
router.post('/reviews', (req, res) => {
    var json_data = req.body;
    var headers = {'headers': req.headers};
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.post(req.path, json_data, headers)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return json
*/
router.get('/reviews/restaurant/:restaurant_id', (req, res) => {
    //Making axios request to service
    var json_data = {};
    json_data['headers'] = req.headers;
    console.log(req.path);
    api.get(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return json
*/
router.get('/reviews/user/:username', (req, res) => {
    var json_data = {};
    json_data['headers'] = req.headers;
    //Making axios request to service
    console.log(req.path);
    api.get(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})



module.exports = router
