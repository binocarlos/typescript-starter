## typescript starter

### setup

```bash
(cd types && yarn install && yarn link)
(cd api && yarn install && yarn link typescript-starter-types)
(cd frontend && yarn install && yarn link typescript-starter-types)
```

Now visual studio code should be happy.

### env

You need an `.env` file like this:

```
APP_URL=http://localhost
POSTGRES_USER=postgres
POSTGRES_DB=postgres
POSTGRES_PASSWORD=postgres
JWT_SECRET_KEY=myreallysecretkey
GOOGLE_STORAGE_BUCKET_NAME=mybucket
GOOGLE_STORAGE_BUCKET_PREFIX=myprefix
GOOGLE_CLOUD_SERVICE_ACCOUNT=XXXX
```

The `GOOGLE_CLOUD_SERVICE_ACCOUNT` service account shoud be a base64 string of the `.json` keyfile for a key created against a service account.

The service account needs storage write access to the bucket named by `GOOGLE_STORAGE_BUCKET_NAME`

The `GOOGLE_STORAGE_BUCKET_PREFIX` is a prefix path for uploaded files.

If you do not have Google Cloud, just do not include it in the .env

### boot dev stack

```bash
./stack build
docker-compose up
# in free window

```

Open `http://localhost`

Check logs for errors if needed by
```bash
docker-compose logs api
docker-compose logs frontend
```

If you want to run the tmux version:

```bash
bash scripts/tmux.sh
```

### run tests

```bash
bash scripts/tmux.sh
#ctrl+c in the api window
./stack cli api
yarn test
yarn ts-node test/auth/login.test.ts
```

### getting vscode to display typescripts errors

By default - vscode will not automatically show red files for the entire project when there are typescript errors.

Do get that to work press `ctrl+shift+b` then choose one of:

 * `tsc watch api`
 * `tsc watch frontend`

(you can run both at the same time)

This will cause a file watcher to open in the background (you can view output by going `View -> Terminal` then switching to the terminal for the task)

These tasks are defined in `.vscode/tasks.json`