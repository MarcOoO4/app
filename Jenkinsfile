pipeline {
  agent any
  options { timestamps() }

  environment {
    // Стек и compose
    STACK        = 'app'
    COMPOSE_FILE = 'docker-compose.yaml'

    // Порты/URL, опубликованные в compose
    FRONT_URL    = 'http://127.0.0.1:3000'
    API_URL      = 'http://127.0.0.1:5000'

    // Доступ к БД (порт 5432 опубликован наружу)
    DB_HOST      = '127.0.0.1'
    DB_PORT      = '5432'
    DB_USER      = 'root'
    DB_PASS      = '1'
    DB_NAME      = 'fulfillment'
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
          echo "== Docker info =="
          docker info >/dev/null 2>&1 || { echo "Docker недоступен"; exit 1; }

          if ! docker info | grep -q "Swarm: active"; then
            echo "Swarm не активен. Инициализирую (соло-стенд)..."
            docker swarm init || true
          fi

          [ -f "${COMPOSE_FILE}" ] || { echo "Нет ${COMPOSE_FILE}"; exit 1; }

          echo "== Ноды =="
          docker node ls || true
        '''
      }
    }

    stage('Deploy to Swarm') {
      steps {
        sh '''
          set -e
          echo "Деплой стека ${STACK}..."
          docker stack deploy --with-registry-auth -c "${COMPOSE_FILE}" "${STACK}"
          docker stack services "${STACK}"
        '''
      }
    }

    stage('Wait for services converge (x/x)') {
      steps {
        sh '''
          set -e
          timeout=150
          while [ $timeout -gt 0 ]; do
            all_ok=1
            while read name reps; do
              have=${reps%/*}; want=${reps#*/}
              if [ "$have" != "$want" ]; then all_ok=0; break; fi
            done < <(docker stack services "${STACK}" --format '{{.Name}} {{.Replicas}}')
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
          echo "== Front check: ${FRONT_URL} =="
          # ждём до ~60с пока начнёт отвечать
          for i in $(seq 1 20); do
            if curl -fsS "${FRONT_URL}" >/dev/null; then echo "FRONT OK"; break; fi
            sleep 3
          done
          curl -fsS "${FRONT_URL}" >/dev/null || { echo "Фронт недоступен"; exit 1; }

          echo "== API check: ${API_URL} =="
          # корень у тебя может отдавать 404/текст — нам важна достижимость TCP/HTTP
          for i in $(seq 1 20); do
            code=$(curl -s -o /dev/null -w '%{http_code}' "${API_URL}") || true
            [ -n "$code" ] && [ "$code" -gt 0 ] && { echo "API OK (HTTP ${code})"; break; }
            sleep 3
          done
          [ -n "$code" ] || { echo "API не отвечает"; exit 1; }

          echo "== DB readiness via published port ${DB_HOST}:${DB_PORT} =="
          # используем одноразовый контейнер с psql; --network host работает на Linux
          for i in $(seq 1 20); do
            if docker run --rm --network host -e PGPASSWORD="${DB_PASS}" postgres:16-alpine \
                 pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}"; then
              break
            fi
            sleep 3
          done

          echo "== DB query =="
          docker run --rm --network host -e PGPASSWORD="${DB_PASS}" postgres:16-alpine \
            psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "select 1;" | grep -q 1
          echo "DB OK"
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Готово: стек задеплоен, smoke-тесты пройдены'
    }
    failure {
      echo '❌ Ошибка. Диагностика ниже:'
      sh '''
        echo "== services =="; docker service ls || true
        echo "== stack ps =="; docker stack ps ${STACK} --no-trunc || true
        echo "== server logs =="; docker service logs --tail 200 ${STACK}_server || true
        echo "== db logs =="; docker service logs --tail 200 ${STACK}_db || true
      '''
    }
    always {
      cleanWs()
    }
  }
}
