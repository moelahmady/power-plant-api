pipeline {
    agent { label 'agent-node' }

    environment {
        DOCKER_IMAGE = "elahmady/power_plant_api:1.0.0"
        EXCEL_FILE_PATH = "src/data/egrid2022_data.xlsx"
        APP_PORT = "3000"
        DB_TYPE = "postgres"
        PG_HOST = "db"
        PG_DB = "aiq_power_plants"
        PG_PORT = "5432"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/moelahmady/power-plant-api.git', branch: 'master'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE, '.')
                }
            }
        }

        stage('Print Environment Variables') {
            steps {
                script {
                    echo "DOCKER_IMAGE: ${env.DOCKER_IMAGE}"
                    echo "EXCEL_FILE_PATH: ${env.EXCEL_FILE_PATH}"
                    echo "APP_PORT: ${env.APP_PORT}"
                    echo "DB_TYPE: ${env.DB_TYPE}"
                    echo "PG_HOST: ${env.PG_HOST}"
                    echo "PG_DB: ${env.PG_DB}"
                    echo "PG_PORT: ${env.PG_PORT}"
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'db-credentials', usernameVariable: 'PG_USER', passwordVariable: 'PG_PASSWORD')]) {
                    script {
                        echo "PG_USER: ${env.PG_USER}"
                        echo "PG_PASSWORD: ${env.PG_PASSWORD}"
                        
                        def compose = """
                        services:
                          expressapp:
                            container_name: power_plant_api
                            image: ${env.DOCKER_IMAGE}
                            build: .
                            ports:
                              - 3000:3000
                            environment:
                              EXCEL_FILE_PATH: ${env.EXCEL_FILE_PATH}
                              APP_PORT: ${env.APP_PORT}
                              DB_TYPE: ${env.DB_TYPE}
                              PG_HOST: ${env.PG_HOST}
                              PG_USER: ${env.PG_USER}
                              PG_PASSWORD: ${env.PG_PASSWORD}
                              PG_DB: ${env.PG_DB}
                              PG_PORT: ${env.PG_PORT}
                            depends_on:
                              db:
                                condition: service_healthy

                          db:
                            container_name: pgdb
                            image: postgres
                            ports:
                              - 5432:5432
                            environment:
                              POSTGRES_USER: ${env.PG_USER}
                              POSTGRES_PASSWORD: ${env.PG_PASSWORD}
                              POSTGRES_DB: ${env.PG_DB}
                            volumes:
                              - pgdata:/var/lib/postgresql/data
                            healthcheck:
                              test: ["CMD-SHELL", "pg_isready -U ${env.PG_USER}"]
                              interval: 10s
                              timeout: 5s
                              retries: 5

                        volumes:
                          pgdata: {}
                        """

                        // Write the docker-compose file
                        writeFile file: 'docker-compose.yml', text: compose

                        // Ensure any existing containers are brought down
                        sh 'docker-compose down -v'

                        // Bring up the new containers
                        sh 'docker-compose up -d'
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up any remaining containers
            sh 'docker-compose down -v'
        }
    }
}