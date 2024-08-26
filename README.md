# Virtual Gamers

Virtual Gamers is a platform where users can browse and play a variety of games, either solo or with friends in dynamic multiplayer lobbies.

## Getting Started

1. Install [Docker](https://www.docker.com)
2. Run command `docker-compose up -d`
    1. Optional Update `.env` file to modify ports, if the common dev ports are already in use.

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
