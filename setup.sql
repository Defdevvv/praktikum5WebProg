CREATE DATABASE IF NOT EXISTS praktikum5;
USE praktikum5;

CREATE TABLE IF NOT EXISTS User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Order` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

INSERT INTO User (email, name, role, createdAt, updatedAt) VALUES
('admin@example.com', 'Admin User', 'admin', NOW(), NOW()),
('user1@example.com', 'User One', 'user', NOW(), NOW()),
('user2@example.com', 'User Two', 'user', NOW(), NOW());

INSERT INTO Product (name, description, price, stock, image, createdAt, updatedAt) VALUES
('Laptop Dell XPS 13', 'Professional laptop with Intel i7 processor', 1299.99, 15, 'https://via.placeholder.com/300x200?text=Laptop', NOW(), NOW()),
('Wireless Mouse Logitech', 'Ergonomic wireless mouse with precision tracking', 49.99, 50, 'https://via.placeholder.com/300x200?text=Mouse', NOW(), NOW()),
('USB-C Cable 1m', 'High-speed USB-C charging and data cable', 19.99, 100, 'https://via.placeholder.com/300x200?text=Cable', NOW(), NOW()),
('Monitor ASUS 27"', '4K UHD monitor with HDR support', 399.99, 8, 'https://via.placeholder.com/300x200?text=Monitor', NOW(), NOW()),
('Mechanical Keyboard RGB', 'Gaming mechanical keyboard with RGB lighting', 129.99, 25, 'https://via.placeholder.com/300x200?text=Keyboard', NOW(), NOW());
