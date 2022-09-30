rm -r -f ./build
npm ci
npm run build
docker build -t coda-learning-api:latest .

docker tag coda-learning-api:latest coda/coda-learning-api:latest
docker push coda/coda-learning-api:latest
echo "Finished running script sleeping 30s"
sleep 30