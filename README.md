# Auth Service – Docker Setup Guide

This project uses **Docker Compose** to run the required services:

* PostgreSQL (database)
* Redis (cache)

Follow the steps below to start the services locally or in production.

---

# 1. Prerequisites

Make sure the following are installed:

* Docker
* Docker Compose (v2)

Check installation:

```bash
docker --version
docker compose version
```

---

# 2. Project Structure

Example directory layout:

```
project-root/
│
├─ docker-compose.yml
├─ .auth.env
└─ README.md
```

---

# 3. Environment Variables

Create a file named:

```
.auth.env
```

Example:

```
POSTGRES_USER=admin
POSTGRES_PASS=secret
POSTGRES_DB=authdb
REDIS_PASS=redisSecret123
```

These variables will be loaded into the containers.

---

# 4. Docker Compose Configuration

Example `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: auth_db
    restart: always
    env_file:
      - .auth.env
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: auth_cache
    env_file:
      - .auth.env
    command: sh -c "redis-server --requirepass $$REDIS_PASS"
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  pg_data:
  redis_data:
```

Note:

`$$REDIS_PASS` is used so Docker Compose does not try to substitute the variable before the container starts.

---

# 5. Start Services

Run the following command:

```bash
docker compose --env-file .auth.env up -d
```

This will start:

* PostgreSQL
* Redis

---

# 6. Check Running Containers

```bash
docker ps
```

Expected containers:

```
auth_db
auth_cache
```

---

# 7. View Logs

PostgreSQL logs:

```bash
docker logs auth_db
```

Redis logs:

```bash
docker logs auth_cache
```

---

# 8. Connect to PostgreSQL

Using psql:

```bash
docker exec -it auth_db psql -U admin -d authdb
```

---

# 9. Connect to Redis

Open Redis CLI:

```bash
docker exec -it auth_cache redis-cli
```

Authenticate:

```
AUTH redisSecret123
```

---

# 10. Stop Services

```bash
docker compose down
```

To remove volumes as well:

```bash
docker compose down -v
```

---

# 11. Restart Services

```bash
docker compose restart
```

---

# 12. Production Notes

For production environments:

* Use secure passwords
* Avoid committing `.env` files to version control
* Store secrets using a secret manager or CI/CD environment variables

Example `.gitignore` entry:

```
.env
*.env
```

---

# 13. Troubleshooting

### Redis password warning

If you see:

```
The "REDIS_PASS" variable is not set
```

Ensure:

* `.auth.env` exists
* `REDIS_PASS` is defined
* `$$REDIS_PASS` is used in the Redis command

---

# 14. Useful Commands

Rebuild containers:

```bash
docker compose up -d --build
```

Stop containers:

```bash
docker compose stop
```

Remove containers:

```bash
docker compose rm
```

---

# 15. Cleanup Docker Resources

Remove unused Docker resources:

```bash
docker system prune
```

---
