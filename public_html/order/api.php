<?php
/**
 * Order Management API Backend
 * 
 * @author Xpert Forex Trade Inc
 * @version 1.0.0
 * @date 2025-12-19
 * 
 * This file provides a RESTful API for order management with:
 * - Database connection and management
 * - Request routing and handling
 * - Event logging and audit trail
 * - Error handling and validation
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../logs/api-errors.log');

// Set content type and CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Define configuration constants
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'xpert_orders');
define('DB_PORT', getenv('DB_PORT') ?: 3306);
define('LOG_DIR', __DIR__ . '/../../logs');
define('API_VERSION', '1.0.0');

// Ensure log directory exists
if (!is_dir(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

/**
 * Database Connection Class
 */
class Database {
    private $connection;
    private $host;
    private $user;
    private $password;
    private $database;
    private $port;
    
    public function __construct($host, $user, $password, $database, $port = 3306) {
        $this->host = $host;
        $this->user = $user;
        $this->password = $password;
        $this->database = $database;
        $this->port = $port;
        $this->connect();
    }
    
    private function connect() {
        try {
            $this->connection = new mysqli(
                $this->host,
                $this->user,
                $this->password,
                $this->database,
                $this->port
            );
            
            if ($this->connection->connect_error) {
                throw new Exception('Database Connection Error: ' . $this->connection->connect_error);
            }
            
            $this->connection->set_charset('utf8mb4');
            EventLogger::log('DATABASE', 'Connection established successfully', 'SUCCESS');
        } catch (Exception $e) {
            EventLogger::log('DATABASE', $e->getMessage(), 'ERROR');
            $this->respondError('Database connection failed', 500);
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function query($sql) {
        $result = $this->connection->query($sql);
        if (!$result) {
            EventLogger::log('DATABASE', 'Query Error: ' . $this->connection->error, level: 'ERROR');
            return false;
        }
        return $result;
    }
    
    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }
    
    public function escape($string) {
        return $this->connection->real_escape_string($string);
    }
    
    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
    
    private function respondError($message, $code) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'code' => $code
        ]);
        exit();
    }
}

/**
 * Event Logger Class
 */
class EventLogger {
    private static $logFile = null;
    
    public static function initialize() {
        self::$logFile = LOG_DIR . '/events-' . date('Y-m-d') . '.log';
    }
    
    public static function log($category, $message, $level = 'INFO') {
        if (self::$logFile === null) {
            self::initialize();
        }
        
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = sprintf(
            "[%s] [%s] [%s] %s\n",
            $timestamp,
            strtoupper($level),
            $category,
            $message
        );
        
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND);
    }
    
    public static function logAction($action, $orderId, $details = '') {
        $message = "Action: {$action}, Order ID: {$orderId}";
        if ($details) {
            $message .= ", Details: {$details}";
        }
        self::log('ORDER_ACTION', $message, 'INFO');
    }
    
    public static function logError($error, $context = '') {
        $message = "Error: {$error}";
        if ($context) {
            $message .= ", Context: {$context}";
        }
        self::log('ERROR', $message, 'ERROR');
    }
}

/**
 * Request Router Class
 */
class Router {
    private $method;
    private $path;
    private $params;
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->parsePath();
        $this->parseParams();
    }
    
    private function parsePath() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $this->path = str_replace('/order/api.php', '', $uri);
        if (empty($this->path)) {
            $this->path = '/';
        }
    }
    
    private function parseParams() {
        $this->params = [];
        
        if ($this->method === 'GET') {
            $this->params = $_GET;
        } else {
            $input = file_get_contents('php://input');
            if (!empty($input)) {
                $this->params = json_decode($input, true) ?? [];
            }
        }
    }
    
    public function route() {
        $path = $this->path;
        
        // Route handling
        switch ($path) {
            case '/':
                $this->handleRoot();
                break;
            case '/orders':
                if ($this->method === 'GET') {
                    $this->handleGetOrders();
                } elseif ($this->method === 'POST') {
                    $this->handleCreateOrder();
                } else {
                    $this->respondError('Method not allowed', 405);
                }
                break;
            case preg_match('/^\/orders\/(\d+)$/', $path, $matches) ? $path : null:
                $orderId = $matches[1];
                if ($this->method === 'GET') {
                    $this->handleGetOrder($orderId);
                } elseif ($this->method === 'PUT') {
                    $this->handleUpdateOrder($orderId);
                } elseif ($this->method === 'DELETE') {
                    $this->handleDeleteOrder($orderId);
                } else {
                    $this->respondError('Method not allowed', 405);
                }
                break;
            case '/orders/search':
                $this->handleSearchOrders();
                break;
            case '/health':
                $this->handleHealthCheck();
                break;
            default:
                $this->respondError('Endpoint not found', 404);
        }
    }
    
    private function handleRoot() {
        $this->respondSuccess([
            'api' => 'Order Management API',
            'version' => API_VERSION,
            'timestamp' => date('Y-m-d H:i:s'),
            'endpoints' => [
                'GET /orders' => 'Retrieve all orders',
                'POST /orders' => 'Create a new order',
                'GET /orders/{id}' => 'Retrieve a specific order',
                'PUT /orders/{id}' => 'Update an order',
                'DELETE /orders/{id}' => 'Delete an order',
                'GET /orders/search' => 'Search orders',
                'GET /health' => 'Health check'
            ]
        ]);
    }
    
    private function handleGetOrders() {
        $limit = isset($this->params['limit']) ? (int)$this->params['limit'] : 20;
        $offset = isset($this->params['offset']) ? (int)$this->params['offset'] : 0;
        
        // Validate limit
        $limit = min(max($limit, 1), 100);
        
        $sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleGetOrders');
            $this->respondError('Failed to retrieve orders', 500);
        }
        
        $stmt->bind_param('ii', $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        $stmt->close();
        
        EventLogger::log('ORDERS', "Retrieved {$limit} orders (offset: {$offset})", 'INFO');
        $this->respondSuccess([
            'count' => count($orders),
            'limit' => $limit,
            'offset' => $offset,
            'orders' => $orders
        ]);
    }
    
    private function handleGetOrder($orderId) {
        $sql = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleGetOrder');
            $this->respondError('Failed to retrieve order', 500);
        }
        
        $stmt->bind_param('i', $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            EventLogger::logAction('GET', $orderId, 'Order not found');
            $this->respondError('Order not found', 404);
        }
        
        $order = $result->fetch_assoc();
        $stmt->close();
        
        EventLogger::logAction('GET', $orderId, 'Retrieved successfully');
        $this->respondSuccess(['order' => $order]);
    }
    
    private function handleCreateOrder() {
        // Validate required fields
        $required = ['customer_name', 'product_id', 'quantity', 'total_amount'];
        foreach ($required as $field) {
            if (empty($this->params[$field])) {
                EventLogger::logError('Missing required field', "Field: {$field}");
                $this->respondError("Missing required field: {$field}", 400);
            }
        }
        
        $customerName = $this->db->escape($this->params['customer_name']);
        $productId = (int)$this->params['product_id'];
        $quantity = (int)$this->params['quantity'];
        $totalAmount = (float)$this->params['total_amount'];
        $status = isset($this->params['status']) ? $this->db->escape($this->params['status']) : 'pending';
        $notes = isset($this->params['notes']) ? $this->db->escape($this->params['notes']) : '';
        
        // Validate quantity and amount
        if ($quantity <= 0 || $totalAmount < 0) {
            EventLogger::logError('Invalid order parameters', "Quantity: {$quantity}, Amount: {$totalAmount}");
            $this->respondError('Invalid quantity or amount', 400);
        }
        
        $sql = "INSERT INTO orders (customer_name, product_id, quantity, total_amount, status, notes, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleCreateOrder');
            $this->respondError('Failed to create order', 500);
        }
        
        $stmt->bind_param('siidss', $customerName, $productId, $quantity, $totalAmount, $status, $notes);
        
        if (!$stmt->execute()) {
            EventLogger::logError('Failed to execute insert', 'handleCreateOrder: ' . $stmt->error);
            $stmt->close();
            $this->respondError('Failed to create order', 500);
        }
        
        $orderId = $stmt->insert_id;
        $stmt->close();
        
        EventLogger::logAction('CREATE', $orderId, "Customer: {$customerName}, Amount: {$totalAmount}");
        
        http_response_code(201);
        $this->respondSuccess([
            'message' => 'Order created successfully',
            'order_id' => $orderId
        ]);
    }
    
    private function handleUpdateOrder($orderId) {
        // Check if order exists
        $checkSql = "SELECT id FROM orders WHERE id = ?";
        $checkStmt = $this->db->prepare($checkSql);
        $checkStmt->bind_param('i', $orderId);
        $checkStmt->execute();
        
        if ($checkStmt->get_result()->num_rows === 0) {
            $checkStmt->close();
            EventLogger::logAction('UPDATE', $orderId, 'Order not found');
            $this->respondError('Order not found', 404);
        }
        $checkStmt->close();
        
        // Build update query based on provided fields
        $allowed = ['customer_name', 'product_id', 'quantity', 'total_amount', 'status', 'notes'];
        $updates = [];
        $types = '';
        $values = [];
        
        foreach ($allowed as $field) {
            if (isset($this->params[$field])) {
                $updates[] = "{$field} = ?";
                $values[] = $this->params[$field];
                
                if (in_array($field, ['product_id', 'quantity'])) {
                    $types .= 'i';
                } elseif ($field === 'total_amount') {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }
            }
        }
        
        if (empty($updates)) {
            EventLogger::logAction('UPDATE', $orderId, 'No fields to update');
            $this->respondError('No fields to update', 400);
        }
        
        $updates[] = 'updated_at = NOW()';
        $values[] = $orderId;
        $types .= 'i';
        
        $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleUpdateOrder');
            $this->respondError('Failed to update order', 500);
        }
        
        $stmt->bind_param($types, ...$values);
        
        if (!$stmt->execute()) {
            EventLogger::logError('Failed to execute update', 'handleUpdateOrder: ' . $stmt->error);
            $stmt->close();
            $this->respondError('Failed to update order', 500);
        }
        
        $stmt->close();
        
        EventLogger::logAction('UPDATE', $orderId, 'Order updated successfully');
        $this->respondSuccess(['message' => 'Order updated successfully']);
    }
    
    private function handleDeleteOrder($orderId) {
        // Check if order exists
        $checkSql = "SELECT id FROM orders WHERE id = ?";
        $checkStmt = $this->db->prepare($checkSql);
        $checkStmt->bind_param('i', $orderId);
        $checkStmt->execute();
        
        if ($checkStmt->get_result()->num_rows === 0) {
            $checkStmt->close();
            EventLogger::logAction('DELETE', $orderId, 'Order not found');
            $this->respondError('Order not found', 404);
        }
        $checkStmt->close();
        
        $sql = "DELETE FROM orders WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleDeleteOrder');
            $this->respondError('Failed to delete order', 500);
        }
        
        $stmt->bind_param('i', $orderId);
        
        if (!$stmt->execute()) {
            EventLogger::logError('Failed to execute delete', 'handleDeleteOrder: ' . $stmt->error);
            $stmt->close();
            $this->respondError('Failed to delete order', 500);
        }
        
        $stmt->close();
        
        EventLogger::logAction('DELETE', $orderId, 'Order deleted successfully');
        $this->respondSuccess(['message' => 'Order deleted successfully']);
    }
    
    private function handleSearchOrders() {
        $query = isset($this->params['q']) ? $this->db->escape($this->params['q']) : '';
        
        if (empty($query)) {
            $this->respondError('Search query is required', 400);
        }
        
        $sql = "SELECT * FROM orders WHERE customer_name LIKE ? OR id = ? OR status LIKE ? ORDER BY created_at DESC";
        $stmt = $this->db->prepare($sql);
        
        if (!$stmt) {
            EventLogger::logError('Failed to prepare statement', 'handleSearchOrders');
            $this->respondError('Failed to search orders', 500);
        }
        
        $searchTerm = "%{$query}%";
        $orderId = (int)$query;
        
        $stmt->bind_param('sis', $searchTerm, $orderId, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        
        $stmt->close();
        
        EventLogger::log('SEARCH', "Searched for: {$query}, Found: " . count($orders) . " results", 'INFO');
        $this->respondSuccess([
            'query' => $query,
            'count' => count($orders),
            'orders' => $orders
        ]);
    }
    
    private function handleHealthCheck() {
        $this->respondSuccess([
            'status' => 'healthy',
            'timestamp' => date('Y-m-d H:i:s'),
            'database' => 'connected'
        ]);
    }
    
    private function respondSuccess($data) {
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
    
    private function respondError($message, $code) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'code' => $code,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit();
    }
}

/**
 * Initialize API
 */
try {
    // Initialize event logger
    EventLogger::initialize();
    EventLogger::log('API', 'Request started', 'INFO');
    
    // Create database connection
    $database = new Database(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    
    // Route request
    $router = new Router($database);
    $router->route();
    
    // Close database connection
    $database->close();
    
} catch (Exception $e) {
    EventLogger::logError('Uncaught exception', $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'code' => 500,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
