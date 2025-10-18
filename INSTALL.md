# Guía de Instalación - TyO Directory

## Requisitos

- PHP 7.4 o superior
- Extensión SQLite para PHP (generalmente incluida por defecto)
- Servidor web (Apache, Nginx, o el servidor integrado de PHP)

## Instalación

### 1. Inicializar la Base de Datos

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
php db/init.php
```

Este comando creará el archivo `db/database.db` con todas las tablas necesarias:
- `users` - Usuarios del sistema
- `sessions` - Sesiones de usuario
- `user_favorites` - Favoritos por usuario

### 2. Configurar Permisos

Asegúrate de que el directorio `db/` tiene permisos de escritura:

```bash
chmod 755 db/
chmod 644 db/database.db  # Después de crearlo
```

### 3. Iniciar el Servidor

#### Opción A: Servidor integrado de PHP (Desarrollo)

```bash
php -S localhost:8000
```

Accede a: `http://localhost:8000/index.php`

#### Opción B: Apache/Nginx (Producción)

Configura tu servidor web para apuntar al directorio del proyecto.

**Apache (.htaccess ya incluido):**
```apache
<VirtualHost *:80>
    DocumentRoot "/ruta/al/proyecto"
    <Directory "/ruta/al/proyecto">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name tyo-directory.local;
    root /ruta/al/proyecto;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

## Estructura de la Base de Datos

### Tabla: users
- `id` - ID único del usuario
- `username` - Nombre de usuario (único)
- `email` - Correo electrónico (único)
- `password` - Contraseña hasheada (bcrypt)
- `created_at` - Fecha de creación
- `last_login` - Último inicio de sesión
- `is_active` - Estado activo/inactivo

### Tabla: sessions
- `id` - ID de la sesión
- `user_id` - ID del usuario
- `session_token` - Token de sesión
- `created_at` - Fecha de creación
- `expires_at` - Fecha de expiración

### Tabla: user_favorites
- `id` - ID del favorito
- `user_id` - ID del usuario
- `link_id` - ID del enlace favorito
- `created_at` - Fecha de creación

## Uso

### Registro de Usuario
Accede a: `http://localhost:8000/auth/register.php`

### Inicio de Sesión
Accede a: `http://localhost:8000/auth/login.php`

### Cerrar Sesión
Haz clic en el menú de usuario y selecciona "Cerrar Sesión"

## Configuración

Puedes modificar la configuración en `includes/config.php`:

- `SESSION_LIFETIME` - Duración de la sesión (por defecto 24 horas)
- `MIN_PASSWORD_LENGTH` - Longitud mínima de contraseña (por defecto 6 caracteres)

## Seguridad

- Las contraseñas se almacenan usando `password_hash()` con bcrypt
- Las sesiones de PHP se usan para autenticación
- Los inputs se sanitizan con `htmlspecialchars()`
- Protección contra CSRF incluida en formularios
- Base de datos SQLite con permisos restrictivos

## Solución de Problemas

### Error: "Database connection failed"
- Verifica que la extensión SQLite esté habilitada en PHP
- Verifica permisos del directorio `db/`

### Error: "SQLSTATE[HY000]: General error: 8 attempt to write a readonly database"
- Verifica permisos de escritura en `db/database.db` y el directorio `db/`

### Las sesiones no persisten
- Verifica que PHP pueda escribir en el directorio de sesiones
- Revisa la configuración de `session.save_path` en `php.ini`
