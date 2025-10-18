<?php
/**
 * Session Check - Include this file at the top of protected pages
 */

require_once __DIR__ . '/../includes/functions.php';

// Check if user is logged in
if (!isLoggedIn()) {
    redirect('auth/login.php');
}

// Get current user information
$currentUser = getCurrentUser();
?>
