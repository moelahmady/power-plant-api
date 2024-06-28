# My Project

This project is designed to run in a Dockerized environment, simplifying setup and ensuring consistent runtime conditions across different machines.

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository: 
git clone https://github.com/yourusername/my-project.git

2. Navigate to the project directory

## Configuration

Before running the application, you need to set up the environment variables:

1. Copy the `.env.sample` file to a new file named `.env`.

2. Edit the `.env` file with your preferred text editor and set the necessary environment variables.

## Running with Docker Compose

To start the application using Docker Compose, run the following command in the project root directory:

docker-compose up --build


## Accessing the Application

Once the application is running, you can access it at `http://localhost:PORT`, where `PORT` is the port number specified in your `.env` file or `docker-compose.yml`.

## Environment Variables Sample (.env.sample)

Here is an example of what your `.env.sample` file might look like:

EXCEL_FILE_PATH=path_to_your_data
APP_PORT=3000
DB_TYPE=postgres
PG_HOST=pgdb
PG_USER=your_username
PG_PASSWORD=your_password
PG_DB=your_database_name
PG_PORT=5432
