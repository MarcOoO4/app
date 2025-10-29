pipeline {
  agent any
  options { timestamps() }

  environment {
    STACK          = 'app'
    COMPOSE_FILE   = 'docker-compose.yaml'

    // Для DB smoke-теста (совпадает с твоим compose)
    DB_HOST        = 'db'
    DB_USER        = 'root'
    DB_PASS        = '1'
    DB_NAME        = 'fulfillment'

    // Что дёргаем локально на manager (routing mesh)
    FRONT_URL      = 'http://127.0.0.1:3000'
    API_URL        = 'http://127.0.0.1:5000'

    // Имя overlay-сети стека: <stack>_<network>
    OVERLAY_NET    = 'app_appnet'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Preflight') {
      steps {
        sh '''
          set -e
          docker info >/dev/null 2>&1 || { echo "Docker недоступен"; exit 1; }

          # Swarm должен быть активен (на manager)
          if ! docker info | grep -q "Swarm: active"; then
            echo "Swarm не активен на этой ноде. Инициализирую (для соло-стенда)..."
            docker swarm init || true
          fi

          [ -f "${COMPOSE_FILE}" ] || { echo "${COMPOSE_FILE} не найден"; exit 1; }
        '''
      }
    }

    stage('Deploy to Swarm') {
      steps {
        sh '''
          set -e
          docker stack deploy --with-registry-auth -c "${COMPOSE_FILE}" "${STACK}"
        '''
      }
    }

    stage('Wait for services converge') {
      steps {
        sh '''
          set -e
          timeout=120
          while [ $timeout -gt 0 ]; do
            all_ok=1
            for rep in $(docker stack services "${STACK}" --format '{{.Replicas}}'); do
              have=${rep%/*}; want=${rep#*/}
              if [ "$have" != "$want" ]; then
                all_ok=0; break
              fi
            done
            [ $all_ok -eq 1 ] && { echo "Все сервисы в состоянии x/x"; break; }
            sleep 3; timeout=$((timeout-3))
          done
          [ $all_ok -eq 1 ] || { echo "Сервисы не сошлись по репликам"; docker service ls; exit 1; }
        '''
      }
    }

    stage('Smoke tests') {
      steps {
        sh '''
          set -e

          echo "Front check (${FRONT_URL})…"
          curl -sS "${FRONT_URL}" | grep -q '<title>React App</title>'

          echo "API check (${API_URL})… (ожидаем любой контент, даже 'Cannot GET /')"
          curl -sS "${API_URL}" > /dev/null

          echo "DB check через psql-клиент в overlay-сети ${OVERLAY_NET}…"
          docker run --rm --network "${OVERLAY_NET}" -e PGPASSWORD="${DB_PASS}" \
            postgres:16-alpine \
            psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -c "select 1" | grep -q 1

          echo "Smoke OK"
        '''
      }
    }
  }

  post {
    success {
      echo 'Готово: стек задеплоен'
    }
    failure {
      echo 'Ошибка: смотри логи выше'
      sh 'docker stack ps ${STACK} || true; docker service ls || true'
    }
    always {
      cleanWs()
    }
  }
}
