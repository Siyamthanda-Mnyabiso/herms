# HERMS

A booking platform where **organizations** (hospitals, pharmacies, schools) find and book **professionals**
(doctors, nurses, teachers, pharmacists), and **admins** oversee the platform.

- **Backend:** Spring Boot 4, Java 21, Spring Security, JPA/Hibernate, MySQL, Maven (`src/`)
- **Frontend:** React 19, Vite, Tailwind, React Router (`frontend/herms-frontend/`)

## How it works

| Who | What they can do |
| --- | --- |
| **Professional** | Registers and logs in straight away. Manages their profile and availability, and accepts or declines booking requests within 24 hours. |
| **Organization** | Registers, then **waits for an admin to approve** it. Browses professionals, sends booking requests, confirms accepted ones, cancels. |
| **Admin** | Approves or rejects organizations, creates other admins, views users, professionals, bookings, reports and the audit log. |

**Booking flow:** organization requests → professional accepts or declines (24 hours, else it expires) →
organization confirms → the booking completes after its end date. An organization sees only an anonymous label
(`Candidate #007`) until the professional accepts; only then is the real name shown.

## Run it locally

You need **JDK 21**, **Node 20.19+ (22 recommended)** and **MySQL 8+**.

### 1. Database

Use any MySQL 8+ you already have, or start one with Docker:

```
docker compose up -d
```

### 2. Configuration

```
cp .env.example .env
```

Edit `.env` and set at least `MYSQL_PASSWORD` (your MySQL root password). Set `HERMS_ADMIN_EMAIL` and
`HERMS_ADMIN_PASSWORD` to get a first admin account created at startup (the email must not already belong to
another account). `.env` is git-ignored; never commit it.

### 3. Backend (http://localhost:8080/herms)

```
set -a; source .env; set +a
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS; point JAVA_HOME at any JDK 21
./mvnw spring-boot:run
```

In IntelliJ, put the same variables under *Run > Edit Configurations > Environment variables* instead.
The first start creates the tables.

### 4. Frontend (http://localhost:5173)

```
cd frontend/herms-frontend
npm install
npm run dev
```

The dev server proxies `/herms` to the backend on port 8080.

### 5. Try it

1. Register an organization at `/register/organization`, log in as the admin and approve it under *Organizations*.
2. Register a professional at `/register`.
3. As the organization, book the professional from *Browse Professionals*; as the professional, accept; as the
   organization, confirm.

## Configuration reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `MYSQL_PASSWORD` | yes | Password for the MySQL user. |
| `MYSQL_USER` / `MYSQL_HOST` | no | Default `root` / `localhost`. |
| `HERMS_ADMIN_EMAIL`, `HERMS_ADMIN_PASSWORD` | no | Creates an admin at startup if that email has no account yet. |
| `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` | no | SMTP server for password-reset emails. Without a host, the reset link is printed in the backend log instead. |
| `MAIL_FROM` | no | Sender address for emails. |
| `FRONTEND_URL` | no | Public address of the frontend; used in reset links. Default `http://localhost:5173`. |
| `HERMS_CORS_ALLOWED_ORIGINS` | no | Comma-separated origins allowed to call the API. Default `http://localhost:5173`. |

## Tests

```
./mvnw test                                  # backend (needs MySQL; uses its own herms_test_db database)
cd frontend/herms-frontend && npm test       # frontend
```

The backend tests connect with `MYSQL_TEST_USER` / `MYSQL_TEST_PASSWORD` (defaults `root` / `password`) on
`MYSQL_HOST` (default `localhost`). CI (`.github/workflows/ci.yml`) runs both suites, plus lint and a production
build, on every pull request.

## Project layout

```
src/main/java/za/ac/cput/herms/
  config/        security, startup admin, schema fix-up
  controller/    REST endpoints (auth, admin, booking requests, staff, organizations)
  domain/        JPA entities
  dto/           request/response objects
  repository/    Spring Data repositories
  service/       business logic (booking workflow, password reset, audit log, mail)
src/test/        unit and integration tests
frontend/herms-frontend/src/
  pages/ components/ layouts/ routes/   screens and navigation
  services/ hooks/ context/ utils/      API calls, state, helpers
```

## Security notes

- Passwords are hashed with BCrypt (older SHA-256 hashes are upgraded on the next login).
- Every endpoint except login, registration and forgot/reset password needs a bearer token; admin endpoints
  require the admin role. Each account has one active token, so logging in again signs out the previous session.
- Password-reset links are single-use, expire after 1 hour and are stored hashed.
- Actions such as logins, registrations, approvals and bookings are written to the audit log (*Admin > Audit Logs*).

## Before deploying

- **HTTPS:** terminate TLS in a reverse proxy (nginx, Caddy, a cloud load balancer) in front of the backend, and
  serve the built frontend (`npm run build`, then `dist/`) over HTTPS too. Tokens are sent in a header and must
  never travel over plain HTTP.
- **CORS:** set `HERMS_CORS_ALLOWED_ORIGINS` to the real frontend origin, and `FRONTEND_URL` to the same address.
- **Secrets:** provide `MYSQL_PASSWORD`, the admin credentials and SMTP settings through the host's secret store,
  not files in the repository. Use a MySQL user with only the rights it needs rather than `root`.
- **Database changes:** the schema is managed by Hibernate's `update` mode. For a production database, adopt a
  migration tool (Flyway or Liquibase) so that schema changes are reviewed and versioned.

## Known limitations

- No email or in-app notifications for booking events yet (only password-reset emails).
- No email verification at sign-up, and no "change password" while logged in (use *Forgot password*).
- No rate limiting on login attempts.
- A professional can accept overlapping requests from different organizations.
