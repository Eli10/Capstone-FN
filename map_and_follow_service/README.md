# Map and Follow Service

Service for managing maps and relations between nodes in the Neo4j Graph Database

## Must Haves
- Must have Neo4j Community Edition running on machine
- Going to have to change the URL variable in nodes.go to use the correct username and password that you can running your local Neo4j Database with

- Must have Go Lang installed
- For Mac
  - brew install go
  - go mod map_and_follow_service
  - go build
  - go run main.go


Current Endpoints

- /hello
- /maps/
- /maps/{username}
- /users/follow
