# Virtual Gamers

Virtual Gamers is a platform where users can browse and play a variety of games, either solo or with friends in dynamic multiplayer lobbies.

## Getting Started

1. Install [Docker](https://www.docker.com)
2. Pre-configute environment. If other local development is occuring, update `.env` with avaialbe ports on system.
3. Start core infrasturcture.
    1. Run docker command: `docker-compose up postgres -d`
    1. Run docker command: `docker-compose up localstack -d`
4. Configure core infrasturcture.
    1. Connect to DB and run sql scripts in `/database` folder.
        1. TODO - Comne up wit single docker command to run init scripts.
    2. Apply terraform to localstack.
        1. Run terraform command: `docker run -i -t hashicorp/terraform:latest -chdir=terraform init `
        2. Run terraform command: `docker run -i -t hashicorp/terraform:latest plan`
        3. Run terraform command: `docker run -i -t hashicorp/terraform:latest apply --auto-approve`
    
If you need to rebuild a container: `docker compose --env-file .env up -d --no-deps --build <service-name>`

## High Level Technical Design

1. Database
    1. PostgresSQL v16 is being used as the primary data source backing this application.
2. Monolith (Backend Service)
    1. NodeJs v20 w/ TypeScript v5. Language choosen for business reasons, so both the back & frontend use the same language.
    1. The `virtual-gamers-service`is a monolithic container handling logic for the this applications.
    3. Area's of ownership include: Auth, User Accounts, Permissions, Games.
    4. Future Plans: After initial product is delivered. Efforts will be made to extract the individual games into their own services.
3. React App (Frontend UI)
    1. NodeJs v20 w/ TypeScript v5.
    1. The React App is the UI portion of the application.
    1. Future Plans: After initial product is delivered. The app will be structured to handle MicroFront Ends.

### React App

Routes on the app are reserved for specfic purposes, as to not overlap with the different games.
The following are the rserved routes and their purpose.
* `/user` Management of users & their sessions.
* `/admin` Used for all configurations and health checks.
* `/games` Game Mangement and browsing of game catalog.

Each game will get it's own base routes, like `/games/dungeon-duel`, upon it's creation.
All sub-routes will be owned by the games base route.