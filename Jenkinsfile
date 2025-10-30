pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    SWARM_STACK_NAME = 'app'
    OVERLAY_NET      = 'app_appnet'
    DB_SERVICE       = 'db'
    DB_USER          = 'root'
    DB_PASSWORD      = '1'
    DB_NAME          = 'fulfillment'
    FRONTEND_URL     = 'http://192.168.0.1:3000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images (optional)') {
      steps {
        script {
          if (fileExists('server.Dockerfile')) {
            sh "docker build -f server.Dockerfile -t ${SWARM_STACK_NAME}-server:latest ."
          } else {
            echo 'server.Dockerfile not found — skip build'
          }

          if (fileExists('client.Dockerfile')) {
            sh "docker build -f client.Dockerfile -t ${SWARM_STACK_NAME}-client:latest ."
          } else {
            echo 'client.Dockerfile not found — skip build'
          }
        }
      }
    }

    stage('Deploy to Docker Swarm') {
      steps {
        script {
          sh '''
            set -e
            if ! docker info | grep -q "Swarm: active"; then
              docker swarm init || true
            fi
            [ -f docker-compose.yaml ] || { echo "docker-compose.yaml not found"; exit 1; }
            docker stack deploy --with-registry-auth -c docker-compose.yaml ${SWARM_STACK_NAME}
          '''
        }
      }
    }

    stage('Run Tests') {
      steps {
        script {
          echo 'Ожидание запуска сервисов...'
          sleep time: 15, unit: 'SECONDS'

          echo '--- Проверка, доступен ли PostgreSQL на порту 5432 ---'
          sh """
            docker run --rm --network ${OVERLAY_NET} postgres:15-alpine \
              sh -c 'pg_isready -h ${DB_SERVICE} -p 5432 -U ${DB_USER}' \
              && echo '✅ PostgreSQL доступен на порту 5432' \
              || echo '❌ PostgreSQL недоступен на порту 5432 (возможно, порт изменён)'
          """

          echo '--- Проверка БД (Postgres) — простая команда SELECT 1 ---'
          sh """
            docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} postgres:15-alpine \
              psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} -c 'SELECT 1;'
          """
        }
      }
    }
  }

  post {
    success {
      echo '✅ Все этапы завершены успешно'
    }
    failure {
      echo '❌ Ошибка в одном из этапов. Проверь логи выше.'
    }
    always {
      sh '''
        echo "== stack services =="
        docker stack services ${SWARM_STACK_NAME} || true
        echo "== stack ps =="
        docker stack ps ${SWARM_STACK_NAME} || true
      '''
      cleanWs()
    }
  }
}
