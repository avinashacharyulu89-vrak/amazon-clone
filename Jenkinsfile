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

        stage('Build Images') {
            steps {
                sh 'docker build -t vrak45/amazon-backend:${BUILD_NUMBER} ./backend'
                sh 'docker tag vrak45/amazon-backend:${BUILD_NUMBER} vrak45/amazon-backend:latest'

                sh 'docker build -t vrak45/amazon-frontend:${BUILD_NUMBER} ./frontend'
                sh 'docker tag vrak45/amazon-frontend:${BUILD_NUMBER} vrak45/amazon-frontend:latest'

                sh 'docker build -t vrak45/amazon-mysql:latest ./database'
            }
        }

        stage('Trivy Scans') {
            steps {
                sh 'trivy image vrak45/amazon-backend:${BUILD_NUMBER}'
                sh 'trivy image vrak45/amazon-frontend:${BUILD_NUMBER}'
                sh 'trivy image vrak45/amazon-mysql:latest'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DH_PASS', usernameVariable: 'DH_USER')]) {
                    sh '''
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

                        docker push vrak45/amazon-backend:${BUILD_NUMBER}
                        docker push vrak45/amazon-backend:latest

                        docker push vrak45/amazon-frontend:${BUILD_NUMBER}
                        docker push vrak45/amazon-frontend:latest

                        docker push vrak45/amazon-mysql:latest
                    '''
                }
            }
        }

        stage('Deploy to Swarm') {
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
