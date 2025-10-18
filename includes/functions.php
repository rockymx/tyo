<?php
/**
 * Helper Functions
 */

require_once __DIR__ . '/config.php';

/**
 * Register a new user
 */
function registerUser($username, $email, $password) {
    $db = getDB();

    // Validate input
    if (strlen($password) < MIN_PASSWORD_LENGTH) {
        return ['success' => false, 'message' => 'La contraseña debe tener al menos ' . MIN_PASSWORD_LENGTH . ' caracteres'];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Email inválido'];
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $db->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);

        return ['success' => true, 'message' => 'Usuario registrado exitosamente'];
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'UNIQUE constraint failed') !== false) {
            return ['success' => false, 'message' => 'El usuario o email ya existe'];
        }
        return ['success' => false, 'message' => 'Error al registrar usuario'];
    }
}

/**
 * Login user
 */
function loginUser($username, $password) {
    $db = getDB();

    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? AND is_active = 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Update last login
            $updateStmt = $db->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$user['id']]);

            // Create session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];

            return ['success' => true, 'message' => 'Login exitoso'];
        } else {
            return ['success' => false, 'message' => 'Usuario o contraseña incorrectos'];
        }
    } catch (PDOException $e) {
        return ['success' => false, 'message' => 'Error al iniciar sesión'];
    }
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Get current user info
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email']
    ];
}

/**
 * Logout user
 */
function logoutUser() {
    $_SESSION = array();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 42000, '/');
    }

    session_destroy();
}

/**
 * Redirect to page
 */
function redirect($url) {
    header("Location: $url");
    exit();
}

/**
 * Sanitize input
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
