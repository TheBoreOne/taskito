pipeline {
    agent any

    environment {
        IMAGE_NAME = 'taskito-docker'
    }

    stages {
        stage('Obtener código fuente') {
            steps {
                echo 'Descargando código fuente desde GitHub...'
                checkout scm
            }
        }

        stage('Validar archivos del proyecto') {
            steps {
                echo 'Validando archivos principales del proyecto...'
                sh 'ls -la'
                sh 'test -f Dockerfile'
                sh 'test -f docker-compose.yaml'
                sh 'test -f package.json'
            }
        }

        stage('Construir imagen Docker') {
            steps {
                echo 'Construyendo la imagen Docker del proyecto...'
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Validar imagen Docker') {
            steps {
                echo 'Validando que la imagen Docker haya sido creada...'
                sh 'docker images | grep $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente. La imagen Docker fue generada a partir del proyecto Taskito.'
        }

        failure {
            echo 'El pipeline falló. Se deben revisar los logs de Jenkins.'
        }

        always {
            echo 'Finalizó la ejecución del pipeline de integración continua.'
        }
    }
}