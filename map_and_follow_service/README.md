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
- CREATE (u1:User {username: "Bob"})
- CREATE (u2:User {username: "Sarah"})
- CREATE (u3:User {username: "Mikey"})
- CREATE (u4:User {username: "Lin"})

- CREATE (m:Map {mapname: "Eli's Map"})
- CREATE (m1:Map {mapname: "Bob's Map"})
- CREATE (m2:Map {mapname: "Sarah's Map"})
- CREATE (m3:Map {mapname: "Mikey's Map"})
- CREATE (m4:Map {mapname: "Lin's Map"})

- CREATE (r:Restaurant {name: "Pie Shop", address:"123 Blah Street", lat:80.231, lon:-40.982})
- CREATE (r1:Restaurant {name: "JOHNNY'S REEF RESTAURANT", address:"123 Blah Street", lat:80.231, lon:-40.982})
- CREATE (r2:Restaurant {name: "Applebees", address:"2 CITY ISLAND AVE BRONX NY, 10464", lat:40.837616, lon:-73.7829})
- CREATE (r3:Restaurant {name: "TONY'S PIER RESTAURANT", address:"1 CITY ISLAND AVE BRONX NY, 10464", lat:40.837612, lon:-73.78291})
- CREATE (r4:Restaurant {name: "ANA'S BAKERY & CAFE", address:"2125-27 WILLIAMSBRIDGE RD BRONX NY, 10461", lat:40.85586, lon:-73.85557})
- CREATE (r5:Restaurant {name: "DRAGON VILLAGE", address:"1795 WESTCHESTER AVENUE BRONX NY, 10472", lat:40.831814, lon:-73.8666})
- CREATE (r6:Restaurant {name: "RAMBLING HOUSE", address:"4292 KATONAH AVE BRONX NY, 10470", lat:40.898106, lon:-73.86728})
- CREATE (r7:Restaurant {name: "SWEET BREEZ AFRICAN RESTAURANT", address:"2857 WHITE PLAINS RD BRONX NY, 10467", lat:40.867313, lon:-73.8673})
