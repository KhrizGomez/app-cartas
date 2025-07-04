const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos

// Configuración de SQL Server
const config = {
    server: "localhost", 
    user: "sa",               
    password: "1111",         
    database: "prueba",      
    port: 1433,
    options: {
        encrypt: false,          
        trustServerCertificate: true
    }
};

let pool = null;

// Función para inicializar la conexión
async function initializeConnection() {
    try {
        pool = await sql.connect(config);
        console.log('✅ Conexión a SQL Server exitosa');
        
        // Verificar si la tabla existe, si no, crearla
        await createTableIfNotExists();
        
        return pool;
    } catch (err) {
        console.error('❌ Error de conexión a SQL Server:', err);
        throw err;
    }
}

// Función para crear la tabla si no existe
async function createTableIfNotExists() {
    try {
        const checkTableQuery = `
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='cards' AND xtype='U')
            CREATE TABLE cards(
                id_ int identity(1, 1) primary key,
                title_ varchar(max) not null,
                message_ varchar(max) not null,
                sender_ varchar(max) not null,
                recipient_ varchar(max) not null,
                date_ datetime not null
            )
        `;
        
        await pool.request().query(checkTableQuery);
        console.log('✅ Tabla "cards" verificada/creada');
        console.log('📝 Tabla lista para recibir cartas creadas por el usuario');
        
    } catch (err) {
        console.error('❌ Error al crear/verificar tabla:', err);
    }
}

// RUTAS DE LA API

// Obtener todas las cartas
app.get('/api/cards', async (req, res) => {
    try {
        if (!pool) {
            await initializeConnection();
        }
        
        const result = await pool.request().query(`
            SELECT TOP 30 id_, title_, message_, sender_, recipient_, date_
            FROM cards 
            ORDER BY date_ DESC
        `);
        
        const cards = result.recordset.map(card => ({
            id: card.id_,
            title: card.title_,
            message: card.message_,
            sender: card.sender_,
            recipient: card.recipient_,
            date: new Date(card.date_).toLocaleDateString('es-ES'),
            position: null
        }));
        
        res.json({ success: true, data: cards });
        
    } catch (err) {
        console.error('❌ Error al obtener cartas:', err);
        res.status(500).json({ success: false, error: 'Error al obtener cartas' });
    }
});

// Crear nueva carta
app.post('/api/cards', async (req, res) => {
    try {
        if (!pool) {
            await initializeConnection();
        }
        
        const { title, message, sender, recipient } = req.body;
        
        if (!title || !message || !sender || !recipient) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos los campos son requeridos' 
            });
        }
        
        const request = pool.request();
        request.input('title', sql.VarChar, title);
        request.input('message', sql.VarChar, message);
        request.input('sender', sql.VarChar, sender);
        request.input('recipient', sql.VarChar, recipient);
        request.input('date', sql.DateTime, new Date());
        
        const result = await request.query(`
            INSERT INTO cards (title_, message_, sender_, recipient_, date_)
            OUTPUT INSERTED.id_, INSERTED.title_, INSERTED.message_, 
                   INSERTED.sender_, INSERTED.recipient_, INSERTED.date_
            VALUES (@title, @message, @sender, @recipient, @date)
        `);
        
        const newCard = result.recordset[0];
        const responseCard = {
            id: newCard.id_,
            title: newCard.title_,
            message: newCard.message_,
            sender: newCard.sender_,
            recipient: newCard.recipient_,
            date: new Date(newCard.date_).toLocaleDateString('es-ES'),
            position: null
        };
        
        res.json({ success: true, data: responseCard });
        
    } catch (err) {
        console.error('❌ Error al crear carta:', err);
        res.status(500).json({ success: false, error: 'Error al crear carta' });
    }
});

// Eliminar carta
app.delete('/api/cards/:id', async (req, res) => {
    try {
        if (!pool) {
            await initializeConnection();
        }
        
        const { id } = req.params;
        
        const request = pool.request();
        request.input('id', sql.Int, parseInt(id));
        
        const result = await request.query('DELETE FROM cards WHERE id_ = @id');
        
        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'Carta eliminada exitosamente' });
        } else {
            res.status(404).json({ success: false, error: 'Carta no encontrada' });
        }
        
    } catch (err) {
        console.error('❌ Error al eliminar carta:', err);
        res.status(500).json({ success: false, error: 'Error al eliminar carta' });
    }
});

// Servir la aplicación web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
async function startServer() {
    try {
        await initializeConnection();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📁 Archivos estáticos servidos desde: ${__dirname}`);
            console.log(`🗄️  Base de datos: ${config.database} en ${config.server}`);
        });
        
    } catch (err) {
        console.error('❌ Error al inicializar servidor:', err);
        process.exit(1);
    }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('\n⏹️  Cerrando servidor...');
    if (pool) {
        await pool.close();
        console.log('✅ Conexión a base de datos cerrada');
    }
    process.exit(0);
});

// Inicializar
startServer();
