/**
* The API Gateway for the back-end and microservices.
* All front-end request come through here.
*
* @author  Elijah Augustin
* @version 1.0
* @since   2019-02-01
*/

var express = require('express');
var app = express();
var router = require('./routers/router')
var bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/**
* This method takes a path string and a request.
* If that request matches the path then it passes
* the request to the proper service.
* @param routeString This is the first paramter to addNum method
* @param httpRequestObject  This is the second parameter to addNum method
* @return string
 */
app.get('/', (req, res) => {
    res.send("Simple API Gateway")
})

app.use(router)

console.log("Simple API Gateway run on localhost:3000")
console.log("Yooo im here")
app.listen(process.env.PORT || 8080);
