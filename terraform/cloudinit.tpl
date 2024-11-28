#cloud-config
runcmd:
  - export PATH=$PATH:/usr/bin
  - sudo apt-get update -y
  - sudo apt-get -y install nginx
  - sudo apt-get install ca-certificates curl
  - sudo install -m 0755 -d /etc/apt/keyrings
  - sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  - sudo chmod a+r /etc/apt/keyrings/docker.asc
  - echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  - sudo apt-get update -y
  - sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  - |
    echo "
    services:
        nextApp:
            image: ghcr.io/abedhariri/nextjs-template:latest
            ports:
                - 3000:3000
        watchtower:
            image: containrrr/watchtower
            environment:
                - WATCHTOWER_POLL_INTERVAL=60
                - WATCHTOWER_CLEANUP=true
                - WATCHTOWER_ROLLING_RESTART=true
            volumes:
                - /var/run/docker.sock:/var/run/docker.sock
        db:
            image: postgres
            restart: always
            shm_size: 128mb
            ports:
                - 5432:5432
            environment:
                - POSTGRES_PASSWORD=${db_password}

    " > /root/docker-compose.yml
  - sudo docker compose -f root/docker-compose.yml up -d
  - sudo tee /etc/nginx/sites-available/default > /dev/null
  - |
    echo "server
    {
        listen 80;
        listen [::]:80;

        server_name www.${domain} ${domain};

        location / {
            proxy_pass http://localhost:3000;
        }
    }
    " > /etc/nginx/sites-available/default
  - sudo nginx -t
  - sudo systemctl restart nginx
  - sudo apt-get install -y certbot python3-certbot-nginx
  - sleep 600
  - sudo certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos -m ${email}
  - sudo systemctl reload nginx
