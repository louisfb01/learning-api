# coda-learning-api
Learning API for CODA

# Deployment in production
 - docker login -u ${USER} -p ${USER}
 - ./publish.sh
 - Wait for the ansible script to execute on site hosts (executes at each 10 min and takes about 3 min to run)

# Start redis windows
docker run --name some-redis -p 6379:6379 -d redis

# Security analysis

## Trivy (Most severe)
docker run --rm -v C:\dev\trivy:/root/.cache/ -v //var/run/docker.sock:/var/run/docker.sock  aquasec/trivy image coda-learning-api:latest --security-checks vuln > report.txt

## npm
npm audit