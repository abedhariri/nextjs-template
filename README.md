This is a project to quickly start development & deployment using nextjs app directory, next-auth and a postgres db.

## Getting Started on local

#### Environment variables

Fill out the variables

```
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_DATABASE

AUTH_SECRET
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Deployment

### Create a domain

Create a domain and add the following name servers

- ns1.digitalocean.com
- ns2.digitalocean.com
- ns3.digitalocean.com

### Create github actions secrets

```
AUTH_SECRET
AUTH_GITHUB_ID
AUTH_GITHUB_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET

AUTH_GITHUB_ID_TEST
AUTH_GITHUB_SECRET_TEST
AUTH_GOOGLE_ID_TEST
AUTH_GOOGLE_SECRET_TEST

DB_HOST
DB_USER
DB_PORT
DB_PASSWORD
DB_DATABASE (optional)

PERSONAL_ACCESS_TOKEN (Classic Personal Access Token)
```

### Deploy using terraform

Get a api key with the following scope

```
account (1): read
actions (1): read
billing (1): read
domain (4): create, read, update, delete
droplet (4): create, read, update, delete
regions (1): read
sizes (1): read
ssh_key (4): create, read, update, delete
```

Then run this command on mac

`export DIGITALOCEAN_TOKEN=<DIGITAL_OCEAN_API_KEY>`

Then run in cli

`terraform plan`

This will plan the deployment and finally if everything looks good then run in cli

`terraform apply`

### Login using ghocr on vps

To be able to pull your nextjs app image you need to login, use the following command on vps and use your github Personal Access Token as the password

`docker login ghcr.io -u USERNAME`

Finally go into the docker-compose and add your nextjs application service like this

```yml
services:
	nextApp:
		image: <IMAGE>:latest
		ports:
			- 3000:3000
	watchtower:
		image: containrrr/watchtower
		environment:
				- WATCHTOWER_POLL_INTERVAL=60
				- WATCHTOWER_CLEANUP=true
				- WATCHTOWER_ROLLING_RESTART=true
		volumes:
				- postgres_data:/var/lib/postgresql/data
		labels:
				- 'com.centurylinklabs.watchtower.enable=false'
	db:
		image: postgres
		restart: always
		shm_size: 128mb
		ports:
				- 5432:5432
		environment:
				- POSTGRES_PASSWORD=${db_password}
		labels:
				- 'com.centurylinklabs.watchtower.enable=false'
volumes:
		postgres_data:
```
