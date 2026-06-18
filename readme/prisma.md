# Prisma + PostgreSQL Setup

This guide walks through setting up Prisma ORM with PostgreSQL, creating migrations, and generating the Prisma Client.

---

## Install Dependencies

```bash
npm install prisma @prisma/client @prisma/adapter-pg pg dotenv
npm install -D @types/pg
```

| Package              | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `prisma`             | CLI for commands like `init`, `migrate`, and `generate` |
| `@prisma/client`     | Type-safe database client                               |
| `@prisma/adapter-pg` | PostgreSQL adapter                                      |
| `pg`                 | PostgreSQL driver                                       |
| `@types/pg`          | TypeScript definitions                                  |
| `dotenv`             | Loads environment variables                             |

---

# Setup Flow

```mermaid
flowchart LR

    subgraph Setup
        A["📦 Install Dependencies"]
        B["🔧 Initialize Prisma"]
    end

    subgraph Database
        C["🐘 Create Database"]
        D["🔐 Configure DATABASE_URL"]
    end

    subgraph Schema
        E["📝 Define Models"]
    end

    subgraph Migration
        F["⚙️ Run Migration"]
    end

    subgraph Client
        G["✨ Generate Prisma Client"]
        H["🚀 Application Ready"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
```

---

# Step 1: Initialize Prisma

Create the Prisma project:

```bash
npx prisma init --output ../generated/prisma
```

This creates:

* `prisma/schema.prisma`
* `.env`
* `prisma.config.ts`

---

# Step 2: Create a PostgreSQL Database

Run:

```bash
npx create-db
```

Example output:

```text
Database created successfully!

Connection String:

postgres://username:password@db.prisma.io:5432/postgres?sslmode=require
```

Replace the generated value in `.env`:

```env
DATABASE_URL="postgres://username:password@db.prisma.io:5432/postgres?sslmode=require"
```

---

# Step 3: Define Your Schema

Example:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

---

# Step 4: Create Database Tables

Run:

```bash
npx prisma migrate dev --name init
```

This command:

* Creates migration files
* Applies migrations
* Creates database tables

---

# Step 5: Generate Prisma Client

Run:

```bash
npx prisma generate
```

This generates the type-safe Prisma Client.

---

# Commands Summary

```bash
# Install dependencies
npm install prisma @prisma/client @prisma/adapter-pg pg dotenv
npm install -D @types/pg

# Initialize Prisma
npx prisma init --output ../generated/prisma

# Create PostgreSQL database
npx create-db

# Create database tables
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

Your Prisma + PostgreSQL environment is now ready for development 🚀
