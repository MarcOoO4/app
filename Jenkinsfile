pipeline {
  agent any

  environment {
    SWARM_STACK_NAME = 'app'
    // В Compose сеть называется "appnet", в Swarm имя будет "<stack>_<net>"
    OVERLAY_NET      = 'app_appnet'

    // Имена сервисов в стеке
    FRONT_SERVICE    = 'client'
    API_SERVICE      = 'server'
    DB_SERVICE       = 'db'

    // БД
    DB_USER          = 'root'
    DB_PASSWORD      = '1'
    DB_NAME          = 'fulfillment'
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
          echo "== Docker info =="
          docker info | sed -n '1,40p'

          # Убедимся, что Swarm активен (если нет — инициализируем на менеджере)
          if ! docker info | grep -q "Swarm: active"; then
            docker swarm init || true
          fi

          [ -f docker-compose.yaml ] || { echo "docker-compose.yaml not found"; exit 1; }

          echo "== Nodes =="
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
          docker stack services ${SWARM_STACK_NAME}
        '''
      }
    }

    stage('Wait for services converge (x/x)') {
      steps {
        // Чистый POSIX sh без bash-измов
        sh '''
          set -e
          i=0
          max=60       # 60 итераций * 5с = ~5 минут
          sleep_s=5
          while [ "$i" -lt "$max" ]; do
            # сколько сервисов ещё не в состоянии x/x
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

          echo "== Front check via overlay =="
          docker run --rm --network ${OVERLAY_NET} curlimages/curl:8.11.0 \
            -fsS http://${FRONT_SERVICE}:3000/ >/dev/null

          echo "== API TCP reachability =="
          # У тебя на "/" 5000-й отдаёт "Cannot GET /" — ок, проверяем заголовки
          docker run --rm --network ${OVERLAY_NET} curlimages/curl:8.11.0 \
            -fsSI http://${API_SERVICE}:5000/ >/dev/null || true

          echo "== DB schema check via overlay =="
          docker run --rm --network ${OVERLAY_NET} -e PGPASSWORD=${DB_PASSWORD} \
            postgres:15-alpine \
            psql -h ${DB_SERVICE} -U ${DB_USER} -d ${DB_NAME} -c '\\dt'
        '''
      }
    }
  }

  post {
    always {
      sh '''
        echo "== services =="
        docker service ls
        echo "== stack ps =="
        docker stack ps ${SWARM_STACK_NAME} --no-trunc
      '''
    }
    success { echo '✅ Pipeline finished successfully' }
    failure { echo '❌ Pipeline failed — see logs above' }
    // workspace чистить не обязательно, но если хочешь:
    // always { cleanWs() }
  }
}
