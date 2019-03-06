# Map and Follow Service

Service for managing maps and relations between nodes in the Neo4j Graph Database

## Must Haves
- Must have [Neo4j Community Edition](https://neo4j.com/download-center/#releases) running on machine
- Going to have to change the URL variable in nodes.go to use the correct username and password that you are running your local Neo4j Database with

- Must have Go Lang installed
- For Mac
  - brew install go
  - go mod map_and_follow_service
  - go build
  - go run main.go


Current Endpoints

- GET /hello
- POST /maps/
- GET /maps/{username}
- POST,DELETE /maps/contain
- POST /users/follow


Queries to Populate Database with Fake Data


- CREATE (u:User {username: "Eli"})
- CREATE (m:Map {mapname: "Eli's Map"})

- CREATE (r:Restaurant {name: "Pie Shop", address:"123 Blah Street", lat:80.231, lon:-40.982})
- CREATE (r:Restaurant {name: "Mc Donalds", address:"123 Blah Street", lat:80.231, lon:-40.982})
- CREATE (r:Restaurant {name: "Applebees", address:"123 Blah Street", lat:80.231, lon:-40.982})
- CREATE (r:Restaurant {name: "Burger King", address:"123 Blah Street", lat:80.231, lon:-40.982})
