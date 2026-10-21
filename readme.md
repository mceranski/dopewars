<a href="https://mceranski.github.io/dopewars/" target="_blank">Live Demo</a>

High scores are saved in this browser's local storage, with the top 10 scores kept separately for each player name. They are shown when a game starts and after it ends. Scores persist across server restarts, but are not shared between browsers or devices.

Build a docker container
Production: sudo docker build -t dopewars-prod .
Development: sudo docker build -f Dockerfile.dev -t dopewars-dev .

Run it
Production: docker run -it -p 8080:80 -v "$(pwd):/app" --rm --name vue-container dopewars-prod
Development: docker run -it -p 5173:5173 -v "$(pwd):/app" --rm --name vue-container dopewars-dev

TO see running services
docker ps -a

To stop a service
docker stop <CONTAINER ID>

To prune images and stop running containers
docker system prune -a
