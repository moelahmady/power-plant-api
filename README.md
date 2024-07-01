# AIQ-Challenge-TopN-Power-Plants

TopN-Power-Plants is a RESTful service designed to visualize and analyze the annual net generation of power plants in the United States. Utilizing data from the eGRID2022 file, this Node.js application allows users to retrieve information about the top N power plants, view data by state, and understand the power generation landscape through absolute values and percentages.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Running with Docker Compose](#running-with-docker-compose)
- [Accessing the Application](#accessing-the-application)
- [API Usage](#api-usage)

## Prerequisites

- Node 20 or Later
- Postgres
- Docker
- Docker Compose

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/moelahmady/power-plant-api.git
    ```

2. Navigate to the project directory:

    ```bash
    cd power-plant-api
    ```

## Configuration

Before running the application, you need to set up the environment variables:

1. Copy the `.env.sample` file to a new file named `.env`:

    ```bash
    cp .env.sample .env
    ```

2. Edit the `.env` file with your preferred text editor and set the necessary environment variables.

## Running Locally

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Build the project:

    ```bash
    npm run build
    ```

3. Set `PG_HOST` to `localhost` in the `.env` file.

4. Install Postgres locally:

    - **For macOS using Homebrew**:

        ```bash
        brew install postgresql
        brew services start postgresql
        ```

    - **For Ubuntu**:

        ```bash
        sudo apt update
        sudo apt install postgresql postgresql-contrib
        sudo systemctl start postgresql
        ```

    - **For Windows**:

        Download and install PostgreSQL from [the official website](https://www.postgresql.org/download/windows/).

5. Create a new database and user:

    ```bash
    psql -U postgres
    CREATE DATABASE power_plant_db;
    CREATE USER power_plant_user WITH ENCRYPTED PASSWORD 'yourpassword';
    GRANT ALL PRIVILEGES ON DATABASE power_plant_db TO power_plant_user;
    \q
    ```

6. Update the `.env` file with the new database credentials.

7. Start the application:

    ```bash
    npm start
    ```

## Running with Docker Compose

To start the application using Docker Compose for the first time or after making changes to the Dockerfile or dependencies, run the following command in the project root directory:

```bash
docker-compose up --build
```

For subsequent runs, you can start the application without rebuilding the images:

```bash
docker-compose up
```

Ensure that `PG_HOST` in the `.env` file is set to `pgdb`, which is the name of the database container defined in the `docker-compose.yaml` file.

## Accessing the Application

Once the application is running, you can access it at `http://localhost:PORT`, where `PORT` is the port number specified in your `.env` file or `docker-compose.yml`.

## API Usage

To interact with the API, you can make requests to the following endpoint:

```http
GET /api/plants/top?count=N&state=some_state
```

- `count` (optional): The number of top plants to retrieve; if not specified, the top 10 plants will be returned.
- `state` (optional): The state for which you want to retrieve the top plants. If not specified, the top plants from all states will be returned.

Example request:

```bash
curl http://localhost:3000/api/plants/top?count=5&state=CA
```

This request will return the top 5 plants from California.