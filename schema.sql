-- Create database and tables for the demo
CREATE DATABASE IF NOT EXISTS security_demo DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE security_demo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('carol', 'carol@example.com');

SELECT * FROM users;

SELECT username, email FROM users WHERE username LIKE '%"' OR '1'='1"%'

SELECT * FROM users WHERE username = 'admin' LIKE '%"' '%${q}%' ;

SELECT * FROM users WHERE username = 'admin' LIKE '%"' '%${q}%' LIMIT 100 -- 