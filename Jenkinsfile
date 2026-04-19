
pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'local', url: 'https://github.com/DINUANAND-R/Freelance-Client.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t backend ./server'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t frontend ./client'
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker stop backend || true
                docker rm backend || true
                docker run -d -p 5000:5000 --name backend backend

                docker stop frontend || true
                docker rm frontend || true
                docker run -d -p 3000:3000 --name frontend frontend
                '''
            }
        }
    }
}
