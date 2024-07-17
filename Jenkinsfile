pipeline {
    agent { label 'agent-node' }

    environment {
        DOCKER_IMAGE = "elahmady/power_plant_api:1.0.0"
        EXCEL_FILE_PATH = "src/data/egrid2022_data.xlsx"
        APP_PORT = "3000"
        DB_TYPE = "postgres"
        PG_HOST = "pgdb"
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

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'db-credentials', usernameVariable: 'PG_USER', passwordVariable: 'PG_PASSWORD')]) {
                    script {
                        def compose = """
                        version: '3'
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
                              - db
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
                        volumes:
                          pgdata: {}
                        """

                        // Write the docker-compose file
                        writeFile file: 'docker-compose.yml', text: compose
                        
                        // Bring down any existing containers
                        sh 'docker-compose down'
                        
                        // Bring up the new containers
                        sh 'docker-compose up -d'
                    }
                }
            }
        }
    }
}