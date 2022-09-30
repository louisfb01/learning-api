# Learning API

### Overview

- **Description:** This repository contains code to train machine learning models on de-identified medical data, using the Keras model specification and Tensorflow libraries. It receives requests from the [site API](https://github.com/coda-platform/site-api) and communicates with the [site store](https://github.com/coda-platform/site-store) to obtain the de-identified data necessary to fulfill these requests.
- **Primary author(s):** Jeffrey Li [[@JeffreyLi16](https://github.com/JeffreyLi16)]
- **Contributors:** Louis Mullie [[@louism](https://github.com/louismullie)]
- **License:** The code in this repository is released under the GNU General Public License, V3.

### Deployment

**Production**

Authenticate on Docker, then run `publish.sh` as follows:

```
docker login -u ${USER} -p ${USER}
./publish.sh
```

Finally, wait for the ansible script to execute on site hosts (executes at each 10 min and takes about 3 min to run).

**Local development**

```
docker run --name some-redis -p 6379:6379 -d redis
```

### Security analysis

**Trivy (Most severe)**

```
docker run --rm -v C:\dev\trivy:/root/.cache/ -v //var/run/docker.sock:/var/run/docker.sock  aquasec/trivy image coda-learning-api:latest --security-checks vuln > report.txt
```

**npm**

```
npm audit
```
