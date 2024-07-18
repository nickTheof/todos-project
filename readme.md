# Todos Project

This project demonstrates a microservices architecture with frontend, backend, and database services. The setup uses Docker Compose to manage the services, including a React frontend, a FastAPI backend, a PostgreSQL database, pgAdmin for database management, and Traefik for reverse proxy and routing.

## Services

1. **React (Frontend)**
   - Runs the React application.
   - Accessible at `http://app.localhost:5173`.

2. **FastAPI (Backend)**
   - Runs the FastAPI backend.
   - Accessible at `http://api.app.localhost:8000`.

3. **PostgreSQL (Database)**
   - Runs the PostgreSQL database.
   - Accessible at `http://localhost:5432`.

4. **pgAdmin**
   - Database management tool for PostgreSQL.
   - Accessible at `http://dbadmin.localhost:8086`.

5. **Traefik**
   - Reverse proxy and load balancer.
   - Accessible at `http://localhost:80` and Traefik dashboard at `http://localhost:8080`.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Environment variables configured in a `.env` file.

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/nickTheof/jobs-dashboard-project
    cd jobs-dashboard-project
    ```

2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the necessary environment variables.
    ```env
        DOMAIN=localhost
        SERVER_HOST=http://localhost
        PROJECT_NAME="Todos Project"
        STACK_NAME=todos-project

        BACKEND_CORS_ORIGINS="http://app.localhost:5173"
        SECRET_KEY=secret
        ALGORITHM='HS256'
        ACCESS_TOKEN_EXPIRE_MINUTES='30'

        POSTGRES_USER=usertest
        POSTGRES_PASSWORD=secretsecret
        POSTGRES_DB=dbtest
        POSTGRES_SERVER=database
        POSTGRES_PORT=5432

        PGADMIN_PORT=8086
        PGADMIN_DEFAULT_EMAIL='admin@test.com'
        PGADMIN_DEFAULT_PASSWORD=admintest
        PGADMIN_DEFAULT_PASSWORD_FILE=admin

        TRAEFIK_PUBLIC_NETWORK=traefik-public
        TRAEFIK_TAG=traefik
        TRAEFIK_PUBLIC_TAG=traefik-public

        DOCKER_IMAGE_BACKEND=backend
        DOCKER_IMAGE_FRONTEND=frontend
    ```

3. **Build the images**:
    Use Docker Compose to build all images of the services.
    ```bash
    docker-compose build
    ```

4. **Start the services**:
    Use Docker Compose to start all services.
    ```bash
    docker-compose up -d
    ```


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nickTheof/todos-projects/blob/main/licence.txt) file for details.