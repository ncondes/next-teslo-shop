# Next.js - Teslo Shop

run locally

```
docker-compose up -d
```

-  -d means **detached**

## Config env variables

rename **.env.template** file to **.env**

-  URL Local Mongo

```
MONGO_URL=mongodb://localhost:27017/teslodb
```

\*Re-build node_modules and run Next.js app

```
yarn install
yarn dev
```

## Fill the database with testing data

```
http://localhost:3000/api/seed

```
