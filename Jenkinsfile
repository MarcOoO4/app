pipeline {
  agent any

  environment {
    SWARM_STACK_NAME = 'app'
    // Compose-сеть называется "appnet", в Swarm она будет "<stack>_<net>"
    OVERLAY_NET      = 'app_appnet'

    // Имена сервисов в стеке (как в docker-compose.yaml)
    FRONT_SERVICE    = 'client'
    API_SERVICE      = 'server'
    DB_SERVICE       = 'db'

    // Параметры БД
    DB_USER          = 'root'
    DB_PASSWORD      = '1'
    DB_NAME          = 'fulfillment'

    // Тайминги для ожиданий/ретраев
    CONVERGE_MAX_ITERS = '60'   // 60 * 5с ~ 5 минут
    CURL_RETRIES       = '60'   // 60 * 2с ~ 2 минуты
  }

  options { timestamps() }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Preflight') {
      steps {
        sh '''
          set -e
          echo "== Docker info (head) =="
          docker info | sed -n '1,50p' || true

          # Убедимся, что Swarm активен (если нет — инициируем)
          if ! docker info | grep -q "Swarm: active"; then
            echo "Swarm inactive -> docker swarm init"
            docker swarm init || true
          fi

          # Стековый compose должен лежать в корне репо
          [ -f docker-compose.yaml ] || { echo "docker-compose.yaml not found"; exit 1; }

          echo "== Swarm nodes =="
          docker node ls
        '''
      }
    }

    stage('Deploy to Swarm') {
      steps {
        sh '''
          set -e
          echo "Deploy stack ${SWARM_STACK_NAME}..."
          docker stack deploy --with-registry-auth -c docker-compose.yaml ${SWARM_STACK_NAME}
          echo "== Stack services =="
          docker stack services ${SWARM_STACK_NAME}
        '''
      }
    }

    stage('Wait for services converge (x/x)') {
      steps {
        sh '''
          set -e
          i=0
          max=${CONVERGE_MAX_ITERS}
          sleep_s=5

          while [ "$i" -lt "$max" ]; do
            not_ready=$(docker service ls --format '{{.Replicas}}' \
              | awk -F'/' 'BEGIN{c=0} { if ($1!=$2) c++ } END{print c}')
            if [ "$not_ready" -eq 0 ]; then
              echo "All services converged"
              exit 0
            fi
            i=$((i+1))
            echo "Waiting... ($i/$max). Not ready: $not_ready"
            sleep "$sleep_s"
          done

          echo "Timeout waiting services to converge"
          exit 2
        '''
      }
    }
    stage('Smoke tests (inside overlay)') {
      steps {
        sh '''
          set -e

          echo "== Front check via overlay (with retries) =="
          docker run --rm --network ${OVERLAY_NET} curlimages/curl:8.11.0 \
            --retry ${CURL_RETRIES} --retry-connrefused --retry-delay 2 \
            --connect-timeout 2 --max-time 2 -fsS \
            http://${FRONT_SERVICE}:3000/ >/dev/null

          echo "== API TCP reachability (HEAD, with retries) =="
          docker run --rm --network ${OVERLAY_NET} curlimages/curl:8.11.0 \
            --retry ${CURL_RETRIES} --retry-connrefused --retry-delay 2 \
            --connect-timeout 2 --max-time 2 -fsSI \
            http://${API_SERVICE}:5000/ >/dev/null || true

          echo "== DB readiness (pg_isready) =="
          docker run --rm --network ${OVERLAY_NET} \
            -e PGHOST=${DB_SERVICE} \
            -e PGUSER=${DB_USER} \
            -e PGPASSWORD=${DB_PASSWORD} \
            -e PGDATABASE=${DB_NAME} \
            -e PGPORT=5432 \
            postgres:15-alpine sh -euxc '
              for i in $(seq 1 60); do
                pg_isready -t 2 && exit 0
                sleep 2
              done
              exit 1
            '

          echo "== DB quick query (SELECT 1) =="
          docker run --rm --network ${OVERLAY_NET} \
            -e PGHOST=${DB_SERVICE} \
            -e PGUSER=${DB_USER} \
            -e PGPASSWORD=${DB_PASSWORD} \
            -e PGDATABASE=${DB_NAME} \
            -e PGPORT=5432 \
            postgres:15-alpine \
            psql -tAc 'select 1;' | grep -q 1
        '''
      }
    }

  post {
    always {
      sh '''
        echo "== services =="
        docker service ls || true

        echo "== stack services =="
        docker stack services ${SWARM_STACK_NAME} || true

        echo "== stack ps (short) =="
        docker stack ps ${SWARM_STACK_NAME} || true
      '''
    }
    failure {
      // при падении — показать последние логи контейнеров
      sh '''
        echo "== last 200 logs: client =="
        docker service logs ${SWARM_STACK_NAME}_${FRONT_SERVICE} --tail 200 || true

        echo "== last 200 logs: server =="
        docker service logs ${SWARM_STACK_NAME}_${API_SERVICE} --tail 200 || true

        echo "== last 200 logs: db =="
        docker service logs ${SWARM_STACK_NAME}_${DB_SERVICE} --tail 200 || true
      '''
    }
    success {
      echo '✅ Pipeline finished successfully'
    }
  }
}
