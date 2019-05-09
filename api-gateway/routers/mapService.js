var express = require('express');
var router = express.Router()
const apiAdapter = require('./apiAdapter')

/**
* Local & Heroku Map Service URLs
*/
const LOCAL_BASE_URL = 'http://localhost:8000'
const HEROKU_URL = 'https://map-service.herokuapp.com'
const api = apiAdapter(HEROKU_URL)

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
 */
router.post('/maps/', (req, res) => {
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
router.get('/maps/:username', (req, res) => {
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

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return json
 */
router.get('/maps/name/:username', (req, res) => {
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

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return json
 */
router.get('/maps/follow/:username', (req, res) => {
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

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return None
 */
router.post('/maps/contain', (req, res) => {
    var json_data = req.body;
    var headers = {'headers': req.headers};
    console.log(headers);
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
* @return None
 */
router.delete('/maps/contain', (req, res) => {
    var json_data = req.body;
    var headers = {'headers': req.headers};
    console.log(json_data);
    console.log(typeof json_data);
    console.log(req.path);
    //Making axios request to service
    api.delete(req.path, json_data, headers)
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
