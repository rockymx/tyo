# TyO - Directorio de Enlaces Especializados

Un directorio moderno y especializado de recursos médicos y ortopédicos construido con HTML, CSS y JavaScript vanilla.

## 🚀 Características

- **29 categorías especializadas** de recursos médicos
- **Búsqueda en tiempo real** con filtrado inteligente
- **Sistema de favoritos** con persistencia local
- **Modo claro/oscuro** con transiciones suaves
- **Diseño responsive** optimizado para móviles
- **Modal promocional** interactivo
- **Accesibilidad mejorada** con navegación por teclado
- **Arquitectura modular** con separación de responsabilidades

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Funcionalidad interactiva
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía (Inter)

## 📦 Instalación y Uso

### Opción 1: Servidor Python (Recomendado)
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tyo-directory.git
cd tyo-directory

# Ejecutar servidor de desarrollo
npm run dev
# o directamente con Python
python -m http.server 3000

# Abrir en el navegador
# http://localhost:3000
```

### Opción 2: Servidor Node.js
```bash
# Instalar servidor estático global
npm install -g http-server

# Ejecutar servidor
http-server -p 3000

# Abrir en el navegador
# http://localhost:3000
```

### Opción 3: Abrir directamente
Simplemente abre `index.html` en tu navegador (algunas funcionalidades pueden estar limitadas por CORS).

## 🏗️ Estructura del Proyecto

```
/
├── index.html              # Página principal
├── css/                    # Estilos organizados por funcionalidad
│   ├── base.css           # Variables CSS y estilos base
│   ├── layout.css         # Layout y contenedores
│   ├── header.css         # Estilos del header
│   ├── cards.css          # Estilos de las tarjetas
│   ├── modal.css          # Estilos del modal
│   └── themes.css         # Temas claro/oscuro
├── js/                     # Scripts organizados por funcionalidad
│   ├── main.js            # Aplicación principal
│   ├── search.js          # Funcionalidad de búsqueda
│   ├── favorites.js       # Sistema de favoritos
│   ├── theme.js           # Cambio de tema
│   ├── modal.js           # Modal promocional
│   └── storage.js         # LocalStorage helpers
├── data/
│   └── links.json         # Configuración de categorías
├── img/
│   └── promo.webp         # Imagen promocional
├── package.json           # Configuración del proyecto
└── README.md              # Documentación
```

## 🎯 Categorías Disponibles

- **Últimos Agregados** - Contenido más reciente
- **Nuevos en Español** - Recursos traducidos
- **Abordajes Quirúrgicos** - Técnicas de abordaje
- **Anatomía** - Recursos anatómicos
- **AO Foundation** - Principios de osteosíntesis
- **Artroplastia** - Cirugía de reemplazo articular
- **Artroscopia** - Cirugía mínimamente invasiva
- **Campbell** - Cirugía ortopédica
- **Clínica** - Casos clínicos
- **Imagenología** - Diagnóstico por imágenes
- **Kapandji** - Fisiología articular
- **Master de Trauma** - Especialización en traumatología
- **Operative Techniques** - Técnicas quirúrgicas
- **Orthopedics Review** - Revisiones en ortopedia
- **Ortopedia Deportiva** - Medicina deportiva
- **Ortopedia General** - Principios generales
- **Ortopedia Pediátrica** - Población pediátrica
- **Cirugía de Cadera** - Cadera y pelvis
- **Cirugía de Columna** - Columna vertebral
- **Cirugía de Hombro** - Hombro y extremidad superior
- **Cirugía de Mano** - Mano y muñeca
- **Cirugía de Pie y Tobillo** - Pie y tobillo
- **Cirugía de Rodilla** - Rodilla y meniscos
- **Reemplazo Articular** - Artroplastias y prótesis
- **Rockwood** - Fracturas en adultos y niños
- **Tumores** - Tumores óseos y de tejidos blandos
- **Varios** - Recursos diversos
- **Consentimiento Informado** - Formatos legales
- **Solicitar Acceso** - Acceso completo a la biblioteca

## 📱 Funcionalidades

### Búsqueda Inteligente
- Búsqueda en tiempo real con debouncing (300ms)
- Filtrado por título, categoría y descripción
- Historial de búsquedas persistente
- Atajos de teclado (Ctrl+K, Ctrl+/)

### Sistema de Favoritos
- Agregar/quitar favoritos con animación
- Persistencia en localStorage
- Vista filtrada de favoritos
- Contador de favoritos en el header

### Temas
- Modo oscuro (por defecto)
- Modo claro
- Transiciones suaves entre temas
- Persistencia de preferencia

### Responsive Design
- Optimizado para móviles y tablets
- Header adaptativo con búsqueda colapsible
- Grid responsive con breakpoints
- Interacciones táctiles optimizadas

### Accesibilidad
- Navegación por teclado completa
- Roles ARIA apropiados
- Contraste de colores accesible
- Focus management en modales
- Soporte para lectores de pantalla

## 🔧 Personalización

### Agregar nuevas categorías
Edita el archivo `data/links.json`:

```json
{
  "categories": {
    "nueva-categoria": {
      "title": "Nueva Categoría",
      "description": "Descripción de la categoría",
      "icon": "fas fa-icon-name",
      "color": "custom-color",
      "url": "https://example.com"
    }
  }
}
```

### Personalizar estilos
Los estilos están organizados en archivos CSS modulares:
- `css/base.css` - Variables CSS y estilos base
- `css/themes.css` - Personalizar temas
- `css/cards.css` - Estilos de tarjetas

### Modificar funcionalidad
Los scripts están organizados por funcionalidad:
- `js/main.js` - Lógica principal de la aplicación
- `js/search.js` - Personalizar búsqueda
- `js/favorites.js` - Modificar sistema de favoritos

## 🔗 Enlaces

- **WhatsApp**: [Contacto directo](https://wa.link/s5xddq)
- **Drive**: Enlaces a recursos especializados

## 🚀 Despliegue

### GitHub Pages
1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main como fuente
4. Tu sitio estará disponible en `https://tu-usuario.github.io/tyo-directory`

### Netlify
1. Arrastra la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub para despliegue automático

### Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para solicitar acceso completo a la biblioteca médica, contacta por WhatsApp: https://wa.link/s5xddq

## 🔄 Migración desde Next.js

Este proyecto fue migrado exitosamente desde Next.js/React/TypeScript a HTML/CSS/JS vanilla manteniendo:
- ✅ Toda la funcionalidad original
- ✅ Todos los datos de las 29 categorías
- ✅ Sistema de búsqueda y favoritos
- ✅ Temas claro/oscuro
- ✅ Diseño responsive
- ✅ Accesibilidad
- ✅ Performance optimizada

La nueva arquitectura es más simple, rápida y fácil de mantener sin dependencias externas.