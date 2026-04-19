pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'local', url: 'https://github.com/DINUANAND-R/Freelance-Client.git'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build & Start Services') {
            steps {
                sh 'docker compose up --build -d'
            }
        }

        stage('Show Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
}
