# RUMergy

## Dev

### Backend

For development a .env file in the backend directory is required. The various variables that must be set are shown below.

```
SECRET_KEY=key
DB_NAME=name
DB_HOST=host
DB_USER=user
DB_PASS=pass
DB_CHAR_SET=utf8
EMAIL_HOST=smtp.gmail.com # Only gmail is supported right now
EMAIL_HOST_USER=user@gmail.com
EMAIL_HOST_PASSWORD=password
```

### Frontend

Similarly, for development a .env file in the frontend directory is required.

```
REACT_APP_API_HOST=backend_uri
```

## Prod

The docker compose depends on various environment variables that must be provided in a .env file in the root directory (i.e. the same directory the docker-compose.yml file is located). A sample env file with the required variables is shown below:

```
REACT_APP_API_HOST=http://localhost

SECRET_KEY=key
DB_NAME=dbname
DB_HOST=db # Must be exactly this
DB_USER=user
DB_PASS=password
DB_ROOT_PASS=password
DB_CHAR_SET=utf8
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=user@gmail.com
EMAIL_HOST_PASSWORD=password
```
