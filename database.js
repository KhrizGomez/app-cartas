// CONEXIÓN CON SQL SERVER A TRAVÉS DE API REST
// 
// Este archivo maneja la comunicación con el servidor Express.js
// que a su vez se conecta con SQL Server usando la estructura:
//
// CREATE TABLE cards(
//     id_ int identity(1, 1) primary key,
//     title_ varchar(max) not null,
//     message_ varchar(max) not null,
//     sender_ varchar(max) not null,
//     recipient_ varchar(max) not null,
//     date_ datetime not null
// );

const API_BASE_URL = 'http://localhost:3000/api';

// Función para iniciar "conexión" (verificar que el servidor esté disponible)
async function iniciarConexion() { 
    try {
        const response = await fetch(`${API_BASE_URL}/cards`);
        if (response.ok) {
            console.log('✅ Conexión a API/SQL Server exitosa');
            return true;
        } else {
            throw new Error('Servidor no disponible');
        }
    } catch (err) {
        console.error('❌ Error de conexión a API/SQL Server:', err);
        console.error('💡 Asegúrate de que el servidor esté ejecutándose: npm start');
        throw err;
    }
}

// Función para obtener todas las cartas de SQL Server
async function obtenerCartas() {
    try {
        const response = await fetch(`${API_BASE_URL}/cards`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Cargadas ${result.data.length} cartas desde SQL Server`);
            return result.data;
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch (err) {
        console.error('❌ Error al obtener cartas desde SQL Server:', err);
        return [];
    }
}

// Función para guardar una nueva carta en SQL Server
async function guardarCarta(carta) {
    try {
        const response = await fetch(`${API_BASE_URL}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: carta.title,
                message: carta.message,
                sender: carta.sender,
                recipient: carta.recipient
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Carta guardada en SQL Server con ID: ${result.data.id}`);
            return result.data; // Retorna el objeto completo de la carta
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch (err) {
        console.error('❌ Error al guardar carta en SQL Server:', err);
        throw err;
    }
}

// Función para eliminar una carta de SQL Server
async function eliminarCarta(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Carta con ID ${id} eliminada de SQL Server`);
            return true;
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
        
    } catch (err) {
        console.error('❌ Error al eliminar carta de SQL Server:', err);
        return false;
    }
}

// Cerrar "conexión" (no necesario para API REST)
async function cerrarConexion() {
    try {
        console.log('✅ Conexión cerrada (API REST)');
    } catch (err) {
        console.error('❌ Error al cerrar conexión:', err);
    }
}

// Exportar funciones
export {
    iniciarConexion,
    obtenerCartas,
    guardarCarta,
    eliminarCarta,
    cerrarConexion
};