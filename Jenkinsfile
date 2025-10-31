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

          echo 'Проверка доступности базы данных...'
          sh """
            docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} postgres:15-alpine \
              psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} -c 'SELECT 1;'
          """

          echo 'Проверка, что таблица users существует...'
          sh """
            docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} postgres:15-alpine \
              psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} \
              -tAc "SELECT to_regclass('public.users');" | grep -q 'users' && echo 'Таблица users найдена' || (echo 'Таблица users отсутствует' && exit 1)
          """

          echo 'Проверка, что таблица user не существует (для контроля)...'
          sh """
            if docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} postgres:15-alpine \
              psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} \
              -tAc "SELECT to_regclass('public.user');" | grep -q 'user'; then
                echo 'Ошибка: таблица user не должна существовать' && exit 1
            else
                echo 'Проверка успешна: таблицы user нет'
            fi
          """

          echo 'Проверка ошибки при попытке локализации несуществующей таблицы...'
          sh """
            set +e
            docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} postgres:15-alpine \
              psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} -c 'SELECT * FROM nonexistent_table;' 2>&1 | grep -q 'does not exist' && echo 'Ошибка локализации корректна'
          """
        }
      }
    }
  }

  post {
    success {
      echo 'Все этапы завершены успешно'
    }
    failure {
      echo 'Ошибка в одном из этапов. Проверь логи выше.'
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
