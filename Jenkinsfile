pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    SWARM_STACK_NAME = 'app'           // имя стека из docker-compose
    OVERLAY_NET      = 'app_appnet'    // <stack>_<net> из compose
    // БД
    DB_SERVICE   = 'db'
    DB_USER      = 'root'
    DB_PASSWORD  = '1'
    DB_NAME      = 'fulfillment'
    // Фронт (как в методичке), но мы дергаем его внутри overlay-сети
    FRONTEND_URL = 'http://192.168.0.1:3000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // Аналог "Build Docker Images" из методички; безопасно скипается, если Dockerfile-ов нет
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

          // БД у тебя на postgres: образ не собираем (как в методичке mysql — тут не нужен)
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
          sleep time: 30, unit: 'SECONDS'

          echo 'Проверка доступности фронта (через overlay)...'
          sh """
            docker run --rm --network ${OVERLAY_NET} curlimages/curl:8.11.0 -fsS ${FRONTEND_URL} >/dev/null
          """

          echo 'Проверка БД (Postgres) — простая команда SELECT 1 через overlay...'
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
      echo 'Все этапы завершены'
    }
    failure {
      echo 'Ошибка в одном из этапов. Проверь логи выше'
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
