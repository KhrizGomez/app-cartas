@echo off
echo Iniciando servidor de Cartas Flotantes...
echo.
echo Verificando SQL Server:
echo   - Servidor: localhost
echo   - Usuario: sa
echo   - Contrasena: 1111
echo   - Base de datos: prueba
echo   - Puerto: 1433
echo.
echo El servidor creara automaticamente la tabla 'cards' si no existe
echo La tabla estara vacia - las cartas se crean desde la interfaz web
echo.
echo Iniciando servidor en puerto 3000...
echo.

node server.js

echo.
echo Servidor detenido
pause
