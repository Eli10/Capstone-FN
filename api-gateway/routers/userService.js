var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')
const axios = require('axios');


/**
* Local & Heroku User Service URLs
*/
const LOCAL_BASE_URL = 'http://127.0.0.1:5000'
const HEROKU_URL = 'https://test-user-api.herokuapp.com'
const api = apiAdapter(HEROKU_URL)

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
*/
router.post('/users/register', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
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

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
*/
router.post('/users/login', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
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

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
*/
router.post('/users/follows', (req, res) => {
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
router.get('/users/restaurant/search/:restaurant_name', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
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
* @param routeString This is the first paramter to http method
* @param httpRequestObject  This is the second parameter to http method
* @return json
*/
router.get('/users/refresh-token', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
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
* @param routeString This is the first paramter to http method
* @param httpRequestObject  This is the second parameter to http method
* @return json
*/
router.get('/users/list', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
    // console.log(json_data);
    // console.log(req.headers);
    // console.log(typeof json_data);
    // console.log(req.path);
    //Making axios request to service
    // api.get(req.path, json_data)
    // .then(resp => {
    //     console.log(resp.data)
    //     res.send(resp.data)
    // })
    // .catch(err =>{console.log(err)})
    console.log(req.body);
    console.log(req.headers);
    axios({
        method: 'GET',
        url: HEROKU_URL + req.path,
        headers: req.headers
    })
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
* @param routeString This is the first paramter to http method
* @param httpRequestObject  This is the second parameter to http method
* @return json
*/
router.get('/users/friends/:username', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
    console.log(json_data);
    console.log(req.headers);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
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
* @param routeString This is the first paramter to http method
* @param httpRequestObject  This is the second parameter to http method
* @return json
*/
router.get('/users/:username', (req, res) => {
    var json_data = req.body;
    json_data['headers'] = req.headers;
    console.log(json_data);
    console.log(req.headers);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.get(req.path, json_data)
    .then(resp => {
        console.log(resp.data)
        res.send(resp.data)
    })
    .catch(err =>{console.log(err)})
})

module.exports = router
