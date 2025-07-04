# ✨ SETUP PARA SQL SERVER - AURORA POSTAL 🌌

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

- `GET /api/cards` - Obtener las 30 cartas más recientes (ordenadas por fecha DESC)
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
- ✅ **Optimización de rendimiento** - Solo muestra las 30 cartas más recientes
- ✅ **Superposición configurable** - Permitida hasta 75% entre cartas
- ✨ **Tema Aurora Boreal** - Fondo espacial con gradientes dinámicos y partículas
- � **Cartas Clásicas Originales** - Sobres con colores tradicionales beige/crema
- 🌌 **Contraste elegante** - Fondo futurista con cartas de estilo clásico original


## Registros falsos

INSERT INTO cards (title_, message_, sender_, recipient_, date_) VALUES
('Feliz Cumpleaños', 'Espero que tengas un día maravilloso lleno de alegría y sorpresas. Que todos tus deseos se hagan realidad en este nuevo año de vida.', 'María González', 'Carlos Rodríguez', '2024-12-15 10:30:00'),
('Invitación a Boda', 'Nos complace invitarte a nuestra boda el próximo mes. Será una celebración inolvidable y esperamos contar contigo en este día tan especial.', 'Ana y Pedro', 'Familia López', '2024-11-20 14:45:00'),
('Gracias por Todo', 'Quiero agradecerte por todo el apoyo que me has brindado durante estos meses difíciles. Tu amistad significa mucho para mí.', 'Luis Martín', 'Sofia Chen', '2024-10-08 09:15:00'),
('Graduación Exitosa', '¡Felicidades por tu graduación! Todo tu esfuerzo y dedicación han dado frutos. Estoy muy orgulloso de ti y de todo lo que has logrado.', 'Dr. Roberto Silva', 'Estudiantes 2024', '2024-06-15 16:20:00'),
('Navidad en Familia', 'Te esperamos en casa para celebrar la Navidad juntos. Será una noche mágica llena de amor, risas y buenos recuerdos familiares.', 'Abuela Carmen', 'Nietos queridos', '2024-12-24 18:00:00'),
('Nuevo Trabajo', 'Tengo excelentes noticias que compartir contigo. He conseguido el trabajo que tanto deseaba y quería que fueras la primera en saberlo.', 'Diego Morales', 'Claudia Vega', '2024-09-12 11:30:00'),
('Aniversario de Bodas', 'Celebrando 25 años de matrimonio. Gracias por caminar a mi lado durante todo este tiempo y por hacer cada día especial.', 'Manuel Torres', 'Elena Torres', '2024-08-03 20:15:00'),
('Recuperación Rápida', 'Espero que te recuperes pronto de tu enfermedad. Todos en la oficina te extrañamos y esperamos verte de vuelta muy pronto.', 'Equipo Marketing', 'Andrea Ruiz', '2024-11-05 13:45:00'),
('Baby Shower', 'Estás invitada al baby shower de nuestra querida amiga. Será una tarde llena de alegría celebrando la llegada del nuevo bebé.', 'Amigas del Club', 'Futuras Mamás', '2024-10-22 15:30:00'),
('Viaje de Aventura', 'Acabamos de regresar de nuestro increíble viaje por Europa. Tenemos tantas historias que contarte y fotos que compartir contigo.', 'Mochileros 2024', 'Familia Aventurera', '2024-07-28 12:00:00'),
('Día de las Madres', 'Eres la mejor madre del mundo. Gracias por todos los sacrificios, el amor incondicional y por ser mi ejemplo a seguir siempre.', 'Hijos agradecidos', 'Mamá del Corazón', '2024-05-12 08:30:00'),
('Promoción Laboral', 'Me han promovido a gerente regional. Quería compartir esta alegría contigo porque sé cuánto me has apoyado en mi carrera profesional.', 'Javier Campos', 'Mentor Querido', '2024-04-18 17:45:00'),
('Mudanza Nueva', 'Nos mudamos a una nueva ciudad por trabajo. Aunque será difícil estar lejos, prometemos mantenernos en contacto siempre.', 'Familia Emigrante', 'Amigos de Siempre', '2024-03-10 14:20:00'),
('Reunión Escolar', 'Después de 20 años nos volvemos a encontrar. Será emocionante revivir viejos recuerdos y conocer las nuevas historias de todos.', 'Comité Organizador', 'Ex-Alumnos 2004', '2024-11-30 19:00:00'),
('Condolencias', 'Lamento mucho tu pérdida. Aunque las palabras no pueden quitar el dolor, quiero que sepas que estoy aquí para apoyarte.', 'Amigo Solidario', 'Familia en Duelo', '2024-09-25 10:45:00'),
('Inauguración Negocio', 'Después de tanto esfuerzo, finalmente abrimos nuestro restaurante. Te invitamos a la inauguración para celebrar juntos este logro.', 'Emprendedores Unidos', 'Comunidad Local', '2024-08-15 12:30:00'),
('Vacaciones Soñadas', 'Las vacaciones en la playa fueron increíbles. El mar, el sol y la tranquilidad nos ayudaron a relajarnos y recargar energías.', 'Familia Viajera', 'Oficina Estresada', '2024-07-05 16:10:00'),
('Día del Padre', 'Papá, eres mi héroe y mi ejemplo. Gracias por enseñarme valores, por tu paciencia y por siempre creer en mis sueños y capacidades.', 'Hija Orgullosa', 'Papá Ejemplar', '2024-06-21 07:45:00'),
('Concurso Ganado', '¡Gané el primer lugar en el concurso de fotografía! Estoy muy emocionado y quería compartir esta victoria contigo inmediatamente.', 'Artista Emergente', 'Crítico de Arte', '2024-05-30 21:15:00'),
('Reconciliación', 'Han pasado meses desde nuestra discusión. Echo de menos nuestra amistad y me gustaría que pudiéramos hablar y solucionar nuestras diferencias.', 'Amigo Arrepentido', 'Ex-Mejor Amiga', '2024-04-08 11:00:00'),
('San Valentín', 'En este día del amor quiero recordarte lo mucho que significas para mí. Eres la luz de mi vida y mi compañero perfecto.', 'Corazón Enamorado', 'Alma Gemela', '2024-02-14 18:30:00'),
('Año Nuevo', 'Que este nuevo año te traiga salud, prosperidad y muchas alegrías. Espero que todos tus proyectos se cumplan exitosamente.', 'Optimista Esperanzado', 'Futuro Prometedor', '2024-01-01 00:01:00'),
('Adopción Mascota', 'Adoptamos un perrito del refugio y estamos muy felices. Ya es parte de nuestra familia y llena la casa de alegría y travesuras.', 'Familia Perruna', 'Amantes Animales', '2024-03-22 13:15:00'),
('Maratón Completado', 'Después de meses de entrenamiento, logré completar mi primera maratón. Fue agotador pero increíblemente satisfactorio y motivador.', 'Corredor Novato', 'Entrenador Personal', '2024-10-15 06:30:00'),
('Libro Publicado', 'Mi primera novela acaba de ser publicada. Después de años escribiendo, finalmente veo mi sueño hecho realidad en las librerías.', 'Escritora Debutante', 'Editor Confiado', '2024-09-08 15:45:00'),
('Jardín Florecido', 'El jardín que plantamos juntos está floreciendo hermosamente. Cada flor me recuerda los buenos momentos que hemos compartido en casa.', 'Jardinero Aficionado', 'Vecina Verde', '2024-04-25 09:20:00'),
('Concierto Inolvidable', 'El concierto de anoche fue espectacular. La música, la energía del público y toda la experiencia superaron mis expectativas completamente.', 'Melómano Extático', 'Banda Favorita', '2024-11-18 23:45:00'),
('Curso Terminado', 'Finalmente terminé el curso de cocina francesa. Ahora puedo preparar platos deliciosos y espero invitarte pronto a cenar a casa.', 'Chef Principiante', 'Catador Exigente', '2024-08-28 14:30:00'),
('Mudanza Completada', 'La mudanza fue exitosa y ya estamos instalados en nuestra nueva casa. Tenemos un cuarto de huéspedes esperándote para tu visita.', 'Nuevos Residentes', 'Amigos Lejanos', '2024-07-12 16:00:00'),
('Examen Aprobado', 'Aprobé el examen médico con excelentes calificaciones. Todos esos años de estudio intensivo finalmente han dado sus frutos esperados.', 'Estudiante Medicina', 'Profesores Guía', '2024-06-30 12:45:00'),
('Voluntariado Social', 'La experiencia como voluntario en el hogar de ancianos ha sido muy enriquecedora. He aprendido tanto de sus historias de vida.', 'Voluntario Comprometido', 'Director Hogar', '2024-05-18 10:15:00'),
('Bicicleta Nueva', 'Me compré una bicicleta nueva para hacer ejercicio y cuidar el medio ambiente. Ya estoy planeando rutas ciclisticas por la ciudad.', 'Ciclista Urbano', 'Grupo Ecologista', '2024-04-03 08:00:00'),
('Receta Familiar', 'Encontré la receta secreta de la abuela en sus papeles. Preparé el pastel y quedó exactamente como ella lo hacía años atrás.', 'Nieta Nostálgica', 'Memoria Familiar', '2024-12-05 17:30:00'),
('Teatro Comunitario', 'La obra de teatro del grupo comunitario fue un éxito total. El público disfrutó mucho y ya estamos planeando la próxima producción.', 'Actor Aficionado', 'Audiencia Entusiasta', '2024-11-12 20:00:00'),
('Clase de Yoga', 'Las clases de yoga me han ayudado mucho a encontrar paz interior y mejorar mi flexibilidad. Te recomiendo que pruebes esta práctica.', 'Yogui Principiante', 'Amiga Estresada', '2024-10-01 07:00:00'),
('Huerta Urbana', 'Mi huerta en el balcón está produciendo tomates y hierbas deliciosas. Es increíble cultivar tu propia comida en espacios pequeños.', 'Agricultor Urbano', 'Vecinos Curiosos', '2024-09-20 11:30:00'),
('Idioma Aprendido', 'Después de un año estudiando italiano, finalmente puedo mantener una conversación fluida. Estoy planeando un viaje a Italia pronto.', 'Estudiante Idiomas', 'Profesora Italiana', '2024-08-10 13:00:00'),
('Donación Sangre', 'Doné sangre por primera vez y me sentí muy bien ayudando a salvar vidas. Es una experiencia que recomiendo a todos.', 'Donante Solidario', 'Banco de Sangre', '2024-07-18 09:45:00'),
('Fotografía Nocturna', 'Capturé unas fotos increíbles de las estrellas anoche. La fotografía nocturna se está convirtiendo en mi nueva pasión artística favorita.', 'Fotógrafo Estrellado', 'Club Astronomía', '2024-06-08 02:30:00'),
('Meditación Diaria', 'Llevo un mes meditando todos los días y noto una gran diferencia en mi nivel de estrés y concentración. Es una práctica transformadora.', 'Meditador Novato', 'Maestro Zen', '2024-05-05 06:15:00'),
('Pintura Terminada', 'Finalmente terminé el cuadro que había estado pintando durante meses. Capturé perfectamente el atardecer sobre el lago de mi infancia.', 'Artista Paciente', 'Galería Local', '2024-04-12 15:20:00'),
('Cumpleaños Sorpresa', 'La fiesta sorpresa que organizaste fue perfecta. No puedo creer que mantuvieras el secreto durante tanto tiempo. Fue muy emocionante.', 'Cumpleañero Feliz', 'Organizadora Secreta', '2024-03-15 19:45:00'),
('Triatlón Completado', 'Completé mi primer triatlón y aunque fue extremadamente desafiante, la sensación de logro al cruzar la meta fue indescriptible.', 'Triatleta Orgulloso', 'Entrenador Motivador', '2024-08-22 14:15:00'),
('Clases de Baile', 'Las clases de salsa han sido increíbles. No solo he mejorado mi coordinación, sino que también he conocido gente muy divertida.', 'Bailarín Principiante', 'Pareja de Baile', '2024-07-25 20:30:00'),
('Proyecto Escolar', 'El proyecto de ciencias de mi hijo ganó el primer lugar en la feria escolar. Estoy muy orgulloso de su creatividad y dedicación.', 'Padre Orgulloso', 'Maestros Escuela', '2024-11-08 16:45:00'),
('Caminata Montaña', 'La caminata a la cima de la montaña fue agotadora pero las vistas desde arriba valieron completamente todo el esfuerzo realizado.', 'Excursionista Cansado', 'Grupo Montañismo', '2024-09-30 12:20:00'),
('Curso Online', 'Terminé el curso online de marketing digital. Los conocimientos adquiridos ya los estoy aplicando en mi trabajo con excelentes resultados.', 'Estudiante Virtual', 'Jefe Innovador', '2024-08-05 11:10:00'),
('Mascota Rescatada', 'Rescatamos un gatito de la calle y ahora está completamente recuperado. Se ha adaptado perfectamente a nuestra familia y hogar.', 'Rescatista Animal', 'Veterinaria Dedicada', '2024-06-12 14:50:00'),
('Cumpleaños Abuela', 'La abuela cumplió 90 años y toda la familia se reunió para celebrarlo. Fue un día lleno de amor, historias y mucha felicidad.', 'Familia Unida', 'Matriarca Querida', '2024-05-28 13:35:00'),
('Primer Empleo', 'Conseguí mi primer trabajo después de graduarme. Estoy muy nervioso pero también emocionado por comenzar esta nueva etapa profesional.', 'Recién Graduado', 'Consejero Vocacional', '2024-09-15 08:45:00');

## 🚀 Optimización de Rendimiento

### Limitación de Cartas Mostradas
Para mantener un rendimiento óptimo y una interfaz limpia, la aplicación está configurada para mostrar únicamente **las 30 cartas más recientes**. Esto evita:

- **Sobrecarga visual** con demasiadas cartas en pantalla
- **Problemas de rendimiento** en el navegador
- **Lentitud en animaciones** de drag & drop
- **Uso excesivo de memoria** del navegador

### Comportamiento del Sistema
- La consulta SQL usa `TOP 30` para limitar los resultados
- Las cartas se ordenan por `date_ DESC` (más recientes primero)
- Al crear una nueva carta, aparecerá automáticamente en la vista
- Las cartas más antiguas permanecen en la base de datos pero no se muestran

### Modificar el Límite
Si deseas cambiar el número de cartas mostradas, edita `server.js` línea 79:
```sql
SELECT TOP 30 id_, title_, message_, sender_, recipient_, date_
```
Cambia `30` por el número deseado.

## ✨ Tema Aurora Boreal + Cartas Clásicas

### 🎨 Diseño Visual Restaurado
La aplicación combina el fondo espacial con el diseño original de cartas:

**Fondo Aurora Boreal (mantenido)**:
- **Gradientes espaciales**: Colores que cambian suavemente simulando auroras
- **Efectos de partículas**: 8 partículas brillantes flotando (turquesa, verde, azul, púrpura)
- **Animaciones de fondo**: Movimiento sutil y colores dinámicos

**Cartas Estilo Original (restaurado)**:
- **Colores clásicos**: Beige, crema y tonos tierra tradicionales
- **Diseño limpio**: Gradientes suaves sin texturas añadidas
- **Sello rojo original**: Color coral/rojo original (#ff6b6b)
- **Tipografía estándar**: Arial y fuentes del sistema

### 🎭 Paleta de Colores

**Fondo Aurora (efectos espaciales)**:
- Turquesa aurora (`#40e0d0`)
- Verde esmeralda (`#10b981`) 
- Azul espacio (`#3b82f6`)
- Púrpura místico (`#9333ea`)

**Cartas Originales (colores tradicionales)**:
- Papel crema (`#f8f4e6`, `#e8dcc0`)
- Contenido blanco (`rgba(255, 255, 255, 0.95)`)
- Texto oscuro (`#333`, `#666`, `#888`)
- Sello coral (`#ff6b6b`, `#ee5a6f`)
- Dirección marrón (`#8b4513`)

### 🌟 Características
- **Diseño original** de sobres completamente restaurado
- **Fondo espacial** mantenido para contraste visual único
- **Colores tradicionales** sin efectos vintage o envejecido
- **Animaciones suaves** originales sin filtros de color
- **Sombras clásicas** en lugar de efectos especiales