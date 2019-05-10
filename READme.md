# Food Network



## Architecture

### Services
- User (Python/Flask)
- Map (Go)
- Restaurant (Go)
- Review (Python/Flask)

### API Gateway
- All frontend requests go to an Api Gateway written in the Node/Express framework
- Api Gateway parse url and forwards request to proper Services

- Initial Request to any endpoint may make a few seconds but afterwards the speed should increase


### Security
- TODO


## Local Set-Up

Ports that services are running on that gateway (3000) listens for
- users (5000)
- reviews (5001)
- map (8000)
- restaurant (8001)

1) For map_service and restaurant_service folders, in their respective nodes.go files
- Change URI variable to proper local database url with correct password
Ex) bolt://neo4j:1234@127.0.0.1:7687

2) For user_service and review_service folders
- Uncomment code in app.py if commented out
- Keep heroku code commented out in Users.py
- Make sure user and pass parameter are correct in Users.py

3) Run apis for all 4 services in their respective folders
- users -> python3 app.py
- reviews -> python3 app.py
- map -> go run main.go
- restaurant -> go run main.go

4) In the api-gateway folder
- Run node index.js to start service
- URL is http://localhost:3000
- Make all endpoint requests to that URL not to specific services

Ex) Correct -> http://localhost:3000/login
    Wrong -> http://localhost:5000/login (Direct User Service URL)

## Current Endpoints

Users
- POST /users/register
- POST /users/login
- GET /users/{username}
- GET /users/refresh-token
- POST /users/follow
- GET /users/restaurant/search/{restaurant_name}
- GET /users/list
- GET /users/friends/{username}
- GET /users/hello (TEST)

Map
- POST /maps/
- GET /maps/{username}
- GET /maps/name/{username}
- POST, DELETE /maps/contain
- GET /maps/follow/{username}

Restaurant
- GET /restaurants
- GET /restaurants/{restaurant_name}
- GET /restaurants/id/{restaurant_name}/{address}
- GET /restaurants/discover/{username}

Reviews
- POST /reviews
- GET /reviews/restaurant/{restaurant_name}
- GET /reviews/user/{username}


## API Security

- Almost all endpoint are secured with JWT Authentication except /login and /register

- /users/login returns your access token and refresh token
- Access Token expires in 15 mins

- Use /users/refresh_token to get a new access_token

- Pass refresh_token in header to /users/refresh_token
Ex) {"Authorization": "Bearer <refresh_token>"}

- Pass access token in the headers of all api requests
Ex) {"Authorization": "Bearer <access_token>"}



## Environment Variables

Credentials are not stored in plain-text anymore. For each service locally you have to set the environment variables for them.

## Environment variables for Python APIs

- JWT_SECRET_KEY
- GOOGLE_MAPS_API_KEY
- NEO4J_PYTHON_HOST
- NEO4J_PYTHON_USER
- NEO4J_PYTHON_PASS

**Already Set By Heroku**
- GRAPHENEDB_BOLT_URL
- GRAPHENEDB_BOLT_USER
- GRAPHENEDB_BOLT_PASSWORD

## Environment variables for Go APIs

- JWT_SECRET_KEY
- NEO4J_GO_LANG_LOCAL_DB_CREDS
- NEO4J_GO_LANG_HEROKU_DB_CREDS
