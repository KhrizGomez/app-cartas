# 🚀 SETUP PARA SQL SERVER - APP CARTAS FLOTANTES

## 📋 Prerrequisitos

1. **SQL Server** instalado y ejecutándose
2. **Node.js** (versión 16 o superior)
3. **Git Bash** o terminal de comandos

## 🗄️ Configuración de SQL Server

### 1. Verificar la configuración de SQL Server
- **Servidor**: localhost
- **Usuario**: sa
- **Contraseña**: 1111
- **Base de datos**: prueba
- **Puerto**: 1433

### 2. Crear la base de datos (si no existe)
```sql
CREATE DATABASE prueba;
```

### 3. Usar la base de datos
```sql
USE prueba;
```

### 4. La tabla se creará automáticamente
El servidor creará automáticamente la tabla `cards` con esta estructura:
```sql
CREATE TABLE cards(
    id_ int identity(1, 1) primary key,
    title_ varchar(max) not null,
    message_ varchar(max) not null,
    sender_ varchar(max) not null,
    recipient_ varchar(max) not null,
    date_ datetime not null
);
```

**Nota**: La tabla se creará vacía. Las cartas se agregarán únicamente cuando las crees desde la interfaz web.

## 🛠️ Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm start
```

### 3. Abrir la aplicación
- El servidor se ejecutará en: `http://localhost:3000`
- Abre tu navegador y ve a: `http://localhost:3000`

## 🔧 Troubleshooting

### Error de conexión a SQL Server
```
❌ Error de conexión a SQL Server
```
**Soluciones:**
1. Verificar que SQL Server esté ejecutándose
2. Comprobar credenciales en `server.js` (líneas 11-19)
3. Verificar que el puerto 1433 esté habilitado
4. Comprobar que SQL Server Authentication esté habilitado

### Error "Failed to fetch"
```
❌ Servidor no disponible
```
**Soluciones:**
1. Asegúrate de ejecutar `npm start` antes de usar la aplicación
2. Verifica que el puerto 3000 esté libre
3. Comprueba la consola del servidor para errores

### Puerto ocupado
```
❌ Error: listen EADDRINUSE :::3000
```
**Solución:**
- Cambiar el puerto en `server.js` línea 8: `const PORT = 3001;`

## 📁 Estructura de Archivos

```
app-cartas/
├── server.js          # Servidor Express.js + SQL Server
├── database.js        # Cliente API REST
├── app.js            # Lógica frontend
├── index.html        # Interfaz web
├── style.css         # Estilos
├── package.json      # Dependencias Node.js
└── SETUP.md         # Este archivo
```

## 🔄 Flujo de Datos

1. **Frontend** (app.js) → **API Client** (database.js) → **Server** (server.js) → **SQL Server**
2. Los datos se envían como JSON a través de endpoints REST
3. El servidor maneja las consultas SQL y retorna JSON
4. El frontend actualiza la interfaz con los datos recibidos

## 📝 API Endpoints

- `GET /api/cards` - Obtener todas las cartas
- `POST /api/cards` - Crear nueva carta
- `DELETE /api/cards/:id` - Eliminar carta

## ✅ Verificación

Si todo está funcionando correctamente verás:
```
✅ Conexión a SQL Server exitosa
✅ Tabla "cards" verificada/creada
📝 Tabla lista para recibir cartas creadas por el usuario
🚀 Servidor ejecutándose en http://localhost:3000
```

## 🎯 Funcionalidades

- ✅ **SQL Server real** con tabla `cards`
- ✅ **API REST** completa (GET, POST, DELETE)
- ✅ **Cargas desde BD** al iniciar la aplicación
- ✅ **Guarda en BD** cada nueva carta
- ✅ **IDs únicos** generados por SQL Server IDENTITY
- ✅ **Tabla vacía** al inicio - cartas creadas solo por el usuario
- ✅ **Error handling** completo
- ✅ **Todas las funcionalidades** originales (drag & drop, animaciones, etc.)
