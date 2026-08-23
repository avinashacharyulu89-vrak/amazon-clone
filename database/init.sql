CREATE DATABASE IF NOT EXISTS amazon_clone;

USE amazon_clone;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

INSERT IGNORE INTO categories (name, description) VALUES
('Electronics', 'Mobiles, laptops and electronic devices'),
('Mobiles', 'Smartphones and mobile accessories'),
('Laptops', 'Laptops and computers'),
('Fashion', 'Clothing, shoes and accessories'),
('Home & Kitchen', 'Home appliances and kitchen products'),
('Books', 'Books and educational materials'),
('Beauty', 'Beauty and personal care'),
('Sports', 'Sports equipment and accessories');

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'Wireless Headphones',
       'Bluetooth wireless headphones',
       2499.00,
       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
       50
FROM categories WHERE name = 'Electronics';

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'Smartphone',
       'Modern Android smartphone',
       15999.00,
       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
       25
FROM categories WHERE name = 'Mobiles';

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'Laptop',
       'Laptop for work and entertainment',
       54999.00,
       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
       10
FROM categories WHERE name = 'Laptops';

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'Running Shoes',
       'Comfortable running shoes',
       2999.00,
       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
       30
FROM categories WHERE name = 'Sports';

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'T-Shirt',
       'Comfortable casual t-shirt',
       799.00,
       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
       100
FROM categories WHERE name = 'Fashion';

INSERT IGNORE INTO products
(category_id, name, description, price, image_url, stock)
SELECT id,
       'Coffee Maker',
       'Automatic coffee maker',
       4999.00,
       'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
       20
FROM categories WHERE name = 'Home & Kitchen';
