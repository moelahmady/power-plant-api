# AIQ-Challenge-TopN-Power-Plants

This project is designed to run in a Dockerized environment, simplifying setup and ensuring consistent runtime conditions across different machines.

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository: 
    git clone https://github.com/moelahmady/power-plant-api.git

2. Navigate to the project directory.

## Configuration

Before running the application, you need to set up the environment variables:

1. Copy the `.env.sample` file to a new file named `.env`.

2. Edit the `.env` file with your preferred text editor and set the necessary environment variables.

## Running with Docker Compose

To start the application using Docker Compose, run the following command in the project root directory:

    docker-compose up --build


## Accessing the Application

Once the application is running, you can access it at `http://localhost:PORT`, where `PORT` is the port number specified in your `.env` file or `docker-compose.yml`.

## API Usage

To interact with the API, you can make requests to the following endpoint:

    GET /api/plants/top?count=N&state=some_state

- `count` (optional): The number of top plants to retrieve if not specified will get top 10 plants.
- `state` (optional): The state for which you want to retrieve the top plants. If not specified, the top plants from all states will be returned.

Example request:

    curl http://localhost:3000/api/plants/top?count=5&state=CA

This request will return the top 5 plants from California.