# Memo Test 🚀

### Please read both the web and API readme for more information regarding the applications.

## Getting started

To run the application, you must have Docker installed. You can download it from [Docker Desktop](https://www.docker.com/products/docker-desktop/)

> [!WARNING]
> Create a `.env` file on `apps/api` path and copy the `.env.example` content in there. You are free to change the `DATABASE_URL` to any valid PostgreSQL connection string or just use the one in the `.env.example`

Once Docker is running, execute the following command in the root path of the application. This runs docker compose on detached mode:
```
docker compose up -d
```
This will basically get the posgres db running.

> [!NOTE]
> If you don't want to run docker compose on detached mode, remove the `-d` flag. If you this you will have to open a new terminal to run the following commands.

After that install dependencies
```
npm install
```

Run the application.
```
npm run dev
```

This will launch the web application and perform all necessary tasks to set up a fresh API.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

### Enjoy some memo test games 😼
