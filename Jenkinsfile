pipeline {
    agent {
        label 'docker'
    }
    
    stages {
        stage('checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/avinashacharyulu89-vrak/amazon-clone.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    def scannerHome = tool 'sonarqubescan'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner --version"
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Build backend image') {
            steps {
                sh 'docker build -t vrak45/amazon-backend:${BUILD_NUMBER} ./backend'
                sh 'docker tag vrak45/amazon-backend:${BUILD_NUMBER} vrak45/amazon-backend:latest'
            }
        }

        stage('Build frontend image') {
            steps {
                sh 'docker build -t vrak45/amazon-frontend:${BUILD_NUMBER} ./frontend'
                sh 'docker tag vrak45/amazon-frontend:${BUILD_NUMBER} vrak45/amazon-frontend:latest'
            }
        }

        stage('Trivy scan backend') {
            steps {
                sh 'trivy image vrak45/amazon-backend:${BUILD_NUMBER}'
            }
        }

        stage('Trivy scan frontend') {
            steps {
                sh 'trivy image vrak45/amazon-frontend:${BUILD_NUMBER}'
            }
        }

        stage('Push backend image to docker hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DH_PASS', usernameVariable: 'DH_USER')]) {
                    sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
                    sh 'docker push vrak45/amazon-backend:${BUILD_NUMBER}'
                    sh 'docker push vrak45/amazon-backend:latest'
                }
            }
        }

        stage('Push frontend image to docker hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DH_PASS', usernameVariable: 'DH_USER')]) {
                    sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
                    sh 'docker push vrak45/amazon-frontend:${BUILD_NUMBER}'
                    sh 'docker push vrak45/amazon-frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    cd /home/ec2-user/amazon-clone
                    git pull origin main
                    docker stack deploy --with-registry-auth -c docker-stack.yml amazon
                '''
            }
        }
    }
}
