-- =====================================================
-- XPERT Forex Trade Inc - Database Schema
-- Created: 2025-12-19
-- Description: Complete database schema with tables and stored procedures
-- =====================================================

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT DEFAULT 0,
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_sku (sku),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    address VARCHAR(255),
    customer_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (customer_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2),
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_code VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_date (order_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ORDER_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PAYMENT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL UNIQUE,
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'other') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_id VARCHAR(255) UNIQUE,
    status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_date TIMESTAMP,
    due_date TIMESTAMP,
    gateway_reference VARCHAR(255),
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    order_id INT,
    customer_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    user_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_order_id (order_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT_LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100),
    record_id INT,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_name (table_name),
    INDEX idx_changed_at (changed_at),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- =====================================================
-- PROCEDURE: CreateOrder
-- Description: Creates a new order with validation
-- =====================================================
DELIMITER //

DROP PROCEDURE IF EXISTS CreateOrder//
CREATE PROCEDURE CreateOrder(
    IN p_customer_id INT,
    IN p_order_number VARCHAR(50),
    IN p_total_amount DECIMAL(12, 2),
    IN p_shipping_address VARCHAR(255),
    IN p_billing_address VARCHAR(255),
    OUT p_order_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_status = 'ERROR';
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Validate customer exists
    IF NOT EXISTS (SELECT 1 FROM customers WHERE id = p_customer_id AND customer_status = 'active') THEN
        SET p_status = 'INVALID_CUSTOMER';
        ROLLBACK;
    ELSE
        -- Insert order
        INSERT INTO orders (
            customer_id, order_number, total_amount, 
            shipping_address, billing_address, status
        ) VALUES (
            p_customer_id, p_order_number, p_total_amount,
            p_shipping_address, p_billing_address, 'pending'
        );
        
        SET p_order_id = LAST_INSERT_ID();
        SET p_status = 'SUCCESS';
        
        -- Log event
        INSERT INTO events (
            event_type, entity_type, entity_id, order_id,
            customer_id, action, description
        ) VALUES (
            'order', 'orders', p_order_id, p_order_id,
            p_customer_id, 'CREATE', CONCAT('Order created: ', p_order_number)
        );
        
        COMMIT;
    END IF;
END//

-- =====================================================
-- PROCEDURE: AddOrderItem
-- Description: Adds an item to an order
-- =====================================================
DROP PROCEDURE IF EXISTS AddOrderItem//
CREATE PROCEDURE AddOrderItem(
    IN p_order_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_unit_price DECIMAL(10, 2);
    DECLARE v_total_price DECIMAL(12, 2);
    DECLARE v_stock_available INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_status = 'ERROR';
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Check product exists and has stock
    SELECT price, stock_quantity INTO v_unit_price, v_stock_available
    FROM products WHERE id = p_product_id AND status = 'active' FOR UPDATE;
    
    IF v_unit_price IS NULL THEN
        SET p_status = 'PRODUCT_NOT_FOUND';
        ROLLBACK;
    ELSEIF v_stock_available < p_quantity THEN
        SET p_status = 'INSUFFICIENT_STOCK';
        ROLLBACK;
    ELSE
        SET v_total_price = v_unit_price * p_quantity;
        
        -- Insert order item
        INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price
        ) VALUES (
            p_order_id, p_product_id, p_quantity, v_unit_price, v_total_price
        );
        
        -- Update stock
        UPDATE products SET stock_quantity = stock_quantity - p_quantity
        WHERE id = p_product_id;
        
        -- Update order total
        UPDATE orders SET total_amount = total_amount + v_total_price
        WHERE id = p_order_id;
        
        SET p_status = 'SUCCESS';
        COMMIT;
    END IF;
END//

-- =====================================================
-- PROCEDURE: ProcessPayment
-- Description: Processes payment for an order
-- =====================================================
DROP PROCEDURE IF EXISTS ProcessPayment//
CREATE PROCEDURE ProcessPayment(
    IN p_order_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_amount DECIMAL(12, 2),
    IN p_transaction_id VARCHAR(255),
    OUT p_payment_id INT,
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_order_total DECIMAL(12, 2);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_status = 'ERROR';
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Get order total
    SELECT total_amount INTO v_order_total FROM orders WHERE id = p_order_id;
    
    IF v_order_total IS NULL THEN
        SET p_status = 'ORDER_NOT_FOUND';
        ROLLBACK;
    ELSEIF p_amount < v_order_total THEN
        SET p_status = 'INSUFFICIENT_AMOUNT';
        ROLLBACK;
    ELSE
        -- Insert payment record
        INSERT INTO payments (
            order_id, payment_method, amount, transaction_id, status, payment_date
        ) VALUES (
            p_order_id, p_payment_method, p_amount, p_transaction_id, 'completed', NOW()
        );
        
        SET p_payment_id = LAST_INSERT_ID();
        
        -- Update order status
        UPDATE orders SET status = 'confirmed' WHERE id = p_order_id;
        
        -- Log event
        INSERT INTO events (
            event_type, entity_type, entity_id, order_id,
            action, description, status
        ) VALUES (
            'payment', 'payments', p_payment_id, p_order_id,
            'PROCESS', CONCAT('Payment processed: ', p_transaction_id), 'completed'
        );
        
        SET p_status = 'SUCCESS';
        COMMIT;
    END IF;
END//

-- =====================================================
-- PROCEDURE: UpdateOrderStatus
-- Description: Updates order status and logs event
-- =====================================================
DROP PROCEDURE IF EXISTS UpdateOrderStatus//
CREATE PROCEDURE UpdateOrderStatus(
    IN p_order_id INT,
    IN p_new_status VARCHAR(50),
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_status = 'ERROR';
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Get current status
    SELECT status INTO v_old_status FROM orders WHERE id = p_order_id;
    
    IF v_old_status IS NULL THEN
        SET p_status = 'ORDER_NOT_FOUND';
        ROLLBACK;
    ELSE
        -- Update order status
        UPDATE orders SET status = p_new_status WHERE id = p_order_id;
        
        -- Log event
        INSERT INTO events (
            event_type, entity_type, entity_id, order_id,
            action, description, old_value, new_value
        ) VALUES (
            'order', 'orders', p_order_id, p_order_id,
            'UPDATE', CONCAT('Order status changed from ', v_old_status, ' to ', p_new_status),
            v_old_status, p_new_status
        );
        
        SET p_status = 'SUCCESS';
        COMMIT;
    END IF;
END//

-- =====================================================
-- PROCEDURE: GetOrderDetails
-- Description: Retrieves complete order details
-- =====================================================
DROP PROCEDURE IF EXISTS GetOrderDetails//
CREATE PROCEDURE GetOrderDetails(
    IN p_order_id INT
)
BEGIN
    SELECT 
        o.id,
        o.order_number,
        o.customer_id,
        c.email,
        c.first_name,
        c.last_name,
        o.order_date,
        o.status,
        o.total_amount,
        o.subtotal,
        o.tax_amount,
        o.shipping_cost,
        o.discount_amount,
        o.currency
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = p_order_id;
    
    SELECT 
        oi.id,
        oi.product_id,
        p.product_name,
        oi.quantity,
        oi.unit_price,
        oi.total_price
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = p_order_id;
END//

-- =====================================================
-- PROCEDURE: GetOrdersByCustomer
-- Description: Retrieves all orders for a customer
-- =====================================================
DROP PROCEDURE IF EXISTS GetOrdersByCustomer//
CREATE PROCEDURE GetOrdersByCustomer(
    IN p_customer_id INT
)
BEGIN
    SELECT 
        id,
        order_number,
        order_date,
        status,
        total_amount,
        currency,
        created_at
    FROM orders
    WHERE customer_id = p_customer_id
    ORDER BY order_date DESC;
END//

-- =====================================================
-- PROCEDURE: GetSalesReport
-- Description: Generates sales report for a date range
-- =====================================================
DROP PROCEDURE IF EXISTS GetSalesReport//
CREATE PROCEDURE GetSalesReport(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        DATE(o.order_date) as order_date,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as average_order_value,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
    FROM orders o
    WHERE DATE(o.order_date) BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(o.order_date)
    ORDER BY DATE(o.order_date) DESC;
END//

-- =====================================================
-- PROCEDURE: GetPaymentStats
-- Description: Gets payment statistics and status breakdown
-- =====================================================
DROP PROCEDURE IF EXISTS GetPaymentStats//
CREATE PROCEDURE GetPaymentStats()
BEGIN
    SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
    FROM payments
    GROUP BY status;
END//

DELIMITER ;

-- =====================================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- =====================================================

-- Insert sample products
INSERT INTO products (product_name, description, category, price, sku, stock_quantity, status)
VALUES 
('Premium Trading Course', 'Complete forex trading course for beginners', 'Education', 99.99, 'SKU-001', 100, 'active'),
('Advanced Strategies Guide', 'Advanced trading strategies and techniques', 'Education', 149.99, 'SKU-002', 50, 'active'),
('Trading Software License', 'Annual subscription to trading software', 'Software', 299.99, 'SKU-003', 200, 'active'),
('Market Analysis Tool', 'Real-time market analysis and signals', 'Tools', 49.99, 'SKU-004', 150, 'active')
ON DUPLICATE KEY UPDATE stock_quantity = VALUES(stock_quantity);

-- Insert sample customer
INSERT INTO customers (email, first_name, last_name, phone, country, city, customer_status)
VALUES 
('john.doe@example.com', 'John', 'Doe', '+1234567890', 'United States', 'New York', 'active')
ON DUPLICATE KEY UPDATE customer_status = VALUES(customer_status);

-- =====================================================
-- FINAL NOTES
-- =====================================================
-- This schema includes:
-- 1. Core tables: products, customers, orders, order_items, payments, events, audit_log
-- 2. Comprehensive stored procedures for common operations
-- 3. Proper indexing for performance optimization
-- 4. Foreign key relationships for data integrity
-- 5. Timestamps for audit trail
-- 6. Enum types for status fields
-- 7. Transaction support for data consistency
--
-- For production use:
-- - Ensure proper backup strategies
-- - Monitor query performance
-- - Review and optimize indexes as needed
-- - Implement regular maintenance tasks
-- =====================================================
