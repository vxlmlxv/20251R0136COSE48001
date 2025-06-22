# MySQL Database Setup for Preffy Video Flow

This guide explains how to set up and use MySQL as the database for the Preffy Video Flow backend.

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Start MySQL with Docker Compose:**
   ```bash
   cd backend
   docker-compose up -d mysql
   ```

2. **Update Spring Boot profile to use MySQL:**
   - Edit `src/main/resources/application.properties`
   - Change `spring.profiles.active=h2` to `spring.profiles.active=mysql`

3. **Start the Spring Boot application:**
   ```bash
   ./gradlew bootRun
   ```

### Option 2: Using Local MySQL Installation

1. **Install MySQL:**
   ```bash
   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   
   # Windows
   # Download and install from https://dev.mysql.com/downloads/mysql/
   ```

2. **Create database and user:**
   ```sql
   mysql -u root -p
   
   CREATE DATABASE preffydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'preffyuser'@'localhost' IDENTIFIED BY 'preffypass123';
   GRANT ALL PRIVILEGES ON preffydb.* TO 'preffyuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Update Spring Boot profile:**
   - Edit `src/main/resources/application.properties`
   - Change `spring.profiles.active=h2` to `spring.profiles.active=mysql`

## Database Configuration

### MySQL Configuration (`application-mysql.properties`)

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/preffydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
spring.datasource.username=preffyuser
spring.datasource.password=preffypass123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Key Configuration Options

- **`spring.jpa.hibernate.ddl-auto=update`**: Automatically updates database schema
- **Character Encoding**: UTF-8 support for international characters (including Korean)
- **Connection Pool**: HikariCP with optimized settings
- **Timezone**: UTC to avoid timezone issues

## Database Management

### Using phpMyAdmin (Docker)

1. **Start phpMyAdmin:**
   ```bash
   docker-compose up -d phpmyadmin
   ```

2. **Access phpMyAdmin:**
   - URL: http://localhost:8081
   - Username: `preffyuser`
   - Password: `preffypass123`

### Using MySQL Command Line

```bash
# Connect to MySQL (Docker)
docker exec -it preffy-mysql mysql -u preffyuser -p preffydb

# Connect to MySQL (Local)
mysql -u preffyuser -p preffydb
```

## Profile Management

The application supports multiple database profiles:

### Switch Database Profiles

Edit `src/main/resources/application.properties`:

```properties
# For H2 (Development)
spring.profiles.active=h2

# For MySQL (Production/Staging)
spring.profiles.active=mysql

# For PostgreSQL
spring.profiles.active=postgres
```

### Command Line Profile Override

```bash
# Run with MySQL profile
./gradlew bootRun --args='--spring.profiles.active=mysql'

# Run with H2 profile
./gradlew bootRun --args='--spring.profiles.active=h2'
```

## Production Considerations

### Security

1. **Change default passwords:**
   ```properties
   spring.datasource.password=your-secure-password
   ```

2. **Use environment variables:**
   ```properties
   spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/preffydb}
   spring.datasource.username=${DB_USERNAME:preffyuser}
   spring.datasource.password=${DB_PASSWORD:preffypass123}
   ```

3. **Enable SSL:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/preffydb?useSSL=true&requireSSL=true
   ```

### Performance

1. **Connection Pool Tuning:**
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.minimum-idle=5
   spring.datasource.hikari.idle-timeout=300000
   ```

2. **JPA Optimizations:**
   ```properties
   spring.jpa.properties.hibernate.jdbc.batch_size=20
   spring.jpa.properties.hibernate.order_inserts=true
   spring.jpa.properties.hibernate.order_updates=true
   ```

## Troubleshooting

### Common Issues

1. **Connection Refused:**
   - Ensure MySQL is running: `docker-compose ps` or `brew services list`
   - Check port 3306 is not blocked by firewall

2. **Authentication Failed:**
   - Verify username/password in `application-mysql.properties`
   - Check user exists: `SELECT User, Host FROM mysql.user WHERE User='preffyuser';`

3. **Character Encoding Issues:**
   - Ensure database was created with `utf8mb4` charset
   - Check connection URL includes `characterEncoding=UTF-8`

4. **Schema Issues:**
   - Check `spring.jpa.hibernate.ddl-auto` setting
   - For fresh start: `DROP DATABASE preffydb; CREATE DATABASE preffydb;`

### Debug Mode

Enable SQL logging in `application-mysql.properties`:

```properties
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

## Migration from H2/PostgreSQL

### Data Migration

1. **Export existing data** (if any):
   ```bash
   # For H2: Use H2 Console at http://localhost:8080/h2-console
   # For PostgreSQL: Use pg_dump
   ```

2. **Import to MySQL**:
   ```bash
   mysql -u preffyuser -p preffydb < your_data_export.sql
   ```

### Schema Migration

Spring Boot with `ddl-auto=update` will automatically create tables based on your JPA entities. No manual schema migration is typically needed.

## Backup and Restore

### Backup

```bash
# Using Docker
docker exec preffy-mysql mysqldump -u preffyuser -p preffydb > backup.sql

# Local MySQL
mysqldump -u preffyuser -p preffydb > backup.sql
```

### Restore

```bash
# Using Docker
docker exec -i preffy-mysql mysql -u preffyuser -p preffydb < backup.sql

# Local MySQL
mysql -u preffyuser -p preffydb < backup.sql
```

## Setup Verification

Once you have completed the setup, verify that everything is working correctly:

### 1. Check MySQL Container Status

```bash
cd backend
docker-compose ps
```

You should see the MySQL container running:
```
NAME           IMAGE       COMMAND                  SERVICE   CREATED       STATUS       PORTS
preffy-mysql   mysql:8.0   "docker-entrypoint.s…"   mysql     X minutes ago   Up X minutes   0.0.0.0:3306->3306/tcp, 33060/tcp
```

### 2. Verify Spring Boot Connection

Start the application and check the logs:

```bash
./gradlew bootRun
```

Look for these success indicators in the logs:
- `The following 1 profile is active: "mysql"`
- `HikariPool-1 - Start completed.`
- `Database version: 8.0.42`
- `Started PreffyVideoFlowApplication in X.XXX seconds`

### 3. Test API Endpoints

Test the health endpoint:
```bash
curl -X GET http://localhost:8080/api/health
```

Expected response:
```json
{
  "service": "Preffy Video Flow API",
  "version": "1.0.0",
  "status": "UP",
  "timestamp": "2025-06-22T18:04:10.959735"
}
```

### 4. Test Database Operations

Create a test user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123",
    "fullName": "Test User"
  }'
```

This should return a JSON response with a JWT token and user information, confirming that:
- User entity was created in MySQL
- Database operations are working
- Authentication system is functional

### 5. Verify Database Schema

The following tables should be automatically created by Hibernate:
- `users` - User account information
- `projects` - Video project data

Both tables should have proper foreign key relationships and constraints.

## Status: ✅ SETUP COMPLETE

The MySQL database setup has been successfully completed and verified. The Spring Boot application is now using MySQL for data persistence instead of the default H2 in-memory database.

### What's Working:
- ✅ MySQL 8.0 container running via Docker Compose
- ✅ Spring Boot application connecting to MySQL
- ✅ Automatic schema creation via Hibernate
- ✅ User registration and authentication
- ✅ Project creation and retrieval
- ✅ Full CRUD operations verified
- ✅ UTF-8 character encoding (supports Korean text)
