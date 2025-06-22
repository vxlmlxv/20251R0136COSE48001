-- MySQL initialization script for Preffy Video Flow
-- This script runs when the MySQL container starts for the first time

-- Create the database with proper character encoding
CREATE DATABASE IF NOT EXISTS preffydb 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE preffydb;

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON preffydb.* TO 'preffyuser'@'%';
FLUSH PRIVILEGES;

-- Optional: Create some initial tables or data if needed
-- (Spring Boot will handle table creation via JPA/Hibernate)
