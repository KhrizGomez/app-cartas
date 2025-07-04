// Importar funciones de base de datos
import { obtenerCartas, guardarCarta, eliminarCarta } from './database.js';

// Array para almacenar las cartas (ahora se cargará desde la BD)
let cards = [];

// Sistema de posicionamiento sin superposiciones
let occupiedPositions = [];
const cardWidth = 280;
const cardHeight = 200;
const minDistance = 50; // Distancia mínima entre cartas

// Variables para el sistema de arrastre
let isDragging = false;
let draggedCard = null;
let dragStartPos = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };
let clickTimeout = null;
let hasMoved = false; // Nueva variable para detectar si realmente se movió
let currentZIndex = 100; // Para manejar el orden de las cartas (z-index)

// Variables para los modales
const cardModal = document.getElementById('cardModal');
const createModal = document.getElementById('createModal');
const createCardBtn = document.getElementById('createCardBtn');
const cardsContainer = document.getElementById('cardsContainer');
const createCardForm = document.getElementById('createCardForm');

// Función para cargar cartas desde la base de datos
async function loadCardsFromDatabase() {
    try {
        cards = await obtenerCartas();
        console.log(`Cargadas ${cards.length} cartas desde la base de datos`);
    } catch (error) {
        console.error('Error al cargar cartas desde la base de datos:', error);
        cards = []; // Mantener array vacío si hay error
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    await loadCardsFromDatabase();
    renderCards();
    setupEventListeners();
});

// Función para verificar si dos rectángulos se superponen más del 50%
function isOverlapping(rect1, rect2) {
    // Calcular área de intersección
    const overlapLeft = Math.max(rect1.left, rect2.left);
    const overlapRight = Math.min(rect1.right, rect2.right);
    const overlapTop = Math.max(rect1.top, rect2.top);
    const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
    
    // Si no hay intersección
    if (overlapLeft >= overlapRight || overlapTop >= overlapBottom) {
        return false;
    }
    
    // Calcular área de intersección
    const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);
    
    // Calcular área de cada rectángulo
    const area1 = (rect1.right - rect1.left) * (rect1.bottom - rect1.top);
    const area2 = (rect2.right - rect2.left) * (rect2.bottom - rect2.top);
    
    // Verificar si la superposición es mayor al 50% de cualquiera de las dos cartas
    const overlapPercentage1 = overlapArea / area1;
    const overlapPercentage2 = overlapArea / area2;
    
    // Solo considerar superposición problemática si cubre más del 50% de alguna carta
    return overlapPercentage1 > 0.5 || overlapPercentage2 > 0.5;
}

// Función para encontrar una posición válida sin superposiciones mayores al 50%
function findValidPosition() {
    const container = cardsContainer;
    const containerRect = container.getBoundingClientRect();
    const maxWidth = containerRect.width - cardWidth - 40; // 40px de padding
    const maxHeight = containerRect.height - cardHeight - 40;
    
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        const x = Math.random() * maxWidth + 20; // 20px de margen
        const y = Math.random() * maxHeight + 20;
        
        const newRect = {
            left: x,
            top: y,
            right: x + cardWidth,
            bottom: y + cardHeight
        };
        
        // Verificar si se superpone más del 50% con alguna posición existente
        let hasProblematicOverlap = false;
        for (let occupiedRect of occupiedPositions) {
            if (isOverlapping(newRect, occupiedRect)) {
                hasProblematicOverlap = true;
                break;
            }
        }
        
        if (!hasProblematicOverlap) {
            occupiedPositions.push(newRect);
            return { x, y };
        }
        
        attempts++;
    }
    
    // Si no se encuentra posición después de muchos intentos, usar una posición en grid
    const gridX = (occupiedPositions.length % 3) * (cardWidth + minDistance) + 20;
    const gridY = Math.floor(occupiedPositions.length / 3) * (cardHeight + minDistance) + 20;
    
    const gridRect = {
        left: gridX,
        top: gridY,
        right: gridX + cardWidth,
        bottom: gridY + cardHeight
    };
    
    occupiedPositions.push(gridRect);
    return { x: gridX, y: gridY };
}

// Función para guardar la posición actual de una carta
function saveCardPosition(cardId, element) {
    const rect = element.getBoundingClientRect();
    const containerRect = cardsContainer.getBoundingClientRect();
    
    const position = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top
    };
    
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.position = position;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para crear nueva carta
    createCardBtn.addEventListener('click', () => {
        openCreateModal();
    });

    // Cerrar modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Botón cancelar en formulario
    document.querySelector('.cancel-btn').addEventListener('click', () => {
        closeModal(createModal);
    });

    // Enviar nueva carta
    createCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createNewCard();
    });

    // Tecla ESC para cerrar modales
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(cardModal);
            closeModal(createModal);
        }
    });

    // Event listeners para el arrastre
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
}

// Renderizar todas las cartas
function renderCards() {
    cardsContainer.innerHTML = '';
    occupiedPositions = []; // Limpiar posiciones ocupadas
    
    cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardsContainer.appendChild(cardElement);
    });
}

// Crear elemento de carta (sobre)
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'floating-card';
    cardDiv.style.animationDelay = `${index * 0.3}s`; // Delay más rápido
    
    // Usar posición guardada o encontrar una nueva
    let position;
    if (card.position) {
        position = card.position;
        // Agregar la posición guardada a las ocupadas
        occupiedPositions.push({
            left: position.x,
            top: position.y,
            right: position.x + cardWidth,
            bottom: position.y + cardHeight
        });
    } else {
        position = findValidPosition();
        card.position = position;
    }
    
    cardDiv.style.left = `${position.x}px`;
    cardDiv.style.top = `${position.y}px`;
    cardDiv.style.zIndex = currentZIndex++;
    
    cardDiv.innerHTML = `
        <div class="envelope" data-card-id="${card.id}">
            <div class="envelope-body"></div>
            <div class="envelope-flap"></div>
            <div class="envelope-stamp">✉</div>
            <div class="envelope-address">
                Para: ${card.recipient}<br>
                De: ${card.sender}
            </div>
            <div class="envelope-content">
                <h3>${card.title}</h3>
                <div class="card-preview">${card.message}</div>
                <div class="card-info">
                    <span class="card-from">De: ${card.sender}</span>
                    <span class="card-date">${card.date}</span>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners para arrastre
    cardDiv.addEventListener('mousedown', (e) => handleMouseDown(e, cardDiv, card));
    cardDiv.addEventListener('touchstart', (e) => handleTouchStart(e, cardDiv, card), { passive: false });
    
    return cardDiv;
}

// Abrir sobre con animación
function openEnvelope(cardElement, card) {
    const envelope = cardElement.querySelector('.envelope');
    
    // Prevenir múltiples clics
    if (envelope.classList.contains('opening') || envelope.classList.contains('clicked')) {
        return;
    }
    
    // Agregar clase de apertura
    envelope.classList.add('opening', 'clicked');
    
    // Sonido de papel (simulado con vibración en dispositivos móviles)
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
    
    // Después de la animación, mostrar el modal
    setTimeout(() => {
        openCardModal(card);
        
        // Restablecer el sobre después de cerrar el modal
        setTimeout(() => {
            envelope.classList.remove('opening', 'clicked');
        }, 500);
    }, 800); // Tiempo reducido para que se complete más rápido
}

// Abrir modal de carta
function openCardModal(card) {
    document.getElementById('modalTitle').textContent = card.title;
    document.getElementById('modalDate').textContent = `${card.date} - De: ${card.sender} Para: ${card.recipient}`;
    document.getElementById('modalContent').textContent = card.message;
    
    cardModal.style.display = 'block';
    setTimeout(() => {
        cardModal.style.opacity = '1';
    }, 10);
}

// Abrir modal de creación
function openCreateModal() {
    createModal.style.display = 'block';
    setTimeout(() => {
        createModal.style.opacity = '1';
        document.getElementById('cardTitle').focus();
    }, 10);
}

// Cerrar modal
function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Crear nueva carta
async function createNewCard() {
    const title = document.getElementById('cardTitle').value.trim();
    const message = document.getElementById('cardMessage').value.trim();
    const recipient = document.getElementById('cardRecipient').value.trim() || 'Anónimo';
    const sender = document.getElementById('cardSender').value.trim() || 'Anónimo';
    
    if (!title || !message) {
        alert('Por favor, completa el título y el mensaje de la carta.');
        return;
    }
    
    const newCardData = {
        title: title,
        message: message,
        sender: sender,
        recipient: recipient,
        date: new Date().toLocaleDateString('es-ES')
    };
    
    try {
        // Guardar en la base de datos
        const savedCard = await guardarCarta(newCardData);
        
        // Usar la carta completa retornada por el servidor (incluye ID de BD)
        const newCard = {
            id: savedCard.id,
            title: savedCard.title,
            message: savedCard.message,
            sender: savedCard.sender,
            recipient: savedCard.recipient,
            date: savedCard.date,
            position: null
        };
        
        // Agregar al array local
        cards.push(newCard);
        
        // Crear solo el nuevo elemento sin re-renderizar todo
        const newCardElement = createCardElement(newCard, cards.length - 1);
        cardsContainer.appendChild(newCardElement);
        
        closeModal(createModal);
        
        // Limpiar formulario
        createCardForm.reset();
        
        // Mostrar la nueva carta después de un momento (simular envío)
        setTimeout(() => {
            // Efecto de aparición especial para nueva carta
            newCardElement.style.transform = 'scale(0) rotate(360deg)';
            newCardElement.style.opacity = '0';
            
            setTimeout(() => {
                newCardElement.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                newCardElement.style.transform = 'scale(1) rotate(0deg)';
                newCardElement.style.opacity = '1';
            }, 100);
        }, 500);
        
        console.log('Nueva carta guardada en SQL Server con ID:', savedCard.id);
        
        // Efecto de notificación
        showNotification('¡Carta enviada exitosamente!');
        
    } catch (error) {
        console.error('Error al guardar la carta:', error);
        
        // Mostrar mensaje de error más específico
        let errorMessage = 'Error al guardar la carta. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Servidor no disponible. Asegúrate de ejecutar: npm start';
        } else {
            errorMessage += 'Por favor, inténtalo de nuevo.';
        }
        
        alert(errorMessage);
    }
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== SISTEMA DE ARRASTRE =====

// Manejar inicio de arrastre con mouse
function handleMouseDown(e, cardElement, card) {
    e.preventDefault();
    
    const rect = cardElement.getBoundingClientRect();
    const containerRect = cardsContainer.getBoundingClientRect();
    
    // Calcular offset relativo al contenedor, no al elemento
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    dragStartPos.x = e.clientX;
    dragStartPos.y = e.clientY;
    
    startDrag(cardElement, card);
}

// Manejar inicio de arrastre con touch
function handleTouchStart(e, cardElement, card) {
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = cardElement.getBoundingClientRect();
    const containerRect = cardsContainer.getBoundingClientRect();
    
    // Calcular offset relativo al contenedor, no al elemento
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
    dragStartPos.x = touch.clientX;
    dragStartPos.y = touch.clientY;
    
    startDrag(cardElement, card);
}

// Iniciar arrastre
function startDrag(cardElement, card) {
    isDragging = true;
    hasMoved = false; // Resetear el flag de movimiento
    draggedCard = cardElement;
    
    // Traer la carta al frente al interactuar con ella
    cardElement.style.zIndex = currentZIndex++;
    
    // No agregar la clase 'dragging' inmediatamente
    // Solo cuando realmente se mueva
}

// Manejar movimiento con mouse
function handleMouseMove(e) {
    if (!isDragging || !draggedCard) return;
    
    // Calcular distancia desde el punto inicial
    const deltaX = Math.abs(e.clientX - dragStartPos.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Solo considerar que se está moviendo si la distancia es mayor a 5px
    if (distance > 5 && !hasMoved) {
        hasMoved = true;
        draggedCard.classList.add('dragging');
        
        // Remover la posición de las ocupadas cuando realmente empiece a moverse
        removeCardFromOccupiedPositions(draggedCard);
    }
    
    if (hasMoved) {
        e.preventDefault();
        moveCard(e.clientX, e.clientY);
    }
}

// Manejar movimiento con touch
function handleTouchMove(e) {
    if (!isDragging || !draggedCard) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragStartPos.x);
    const deltaY = Math.abs(touch.clientY - dragStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 5 && !hasMoved) {
        hasMoved = true;
        draggedCard.classList.add('dragging');
        removeCardFromOccupiedPositions(draggedCard);
    }
    
    if (hasMoved) {
        e.preventDefault();
        moveCard(touch.clientX, touch.clientY);
    }
}

// Mover carta
function moveCard(clientX, clientY) {
    const containerRect = cardsContainer.getBoundingClientRect();
    
    let newX = clientX - containerRect.left - dragOffset.x;
    let newY = clientY - containerRect.top - dragOffset.y;
    
    // Mantener dentro de los límites del contenedor
    const maxX = containerRect.width - cardWidth - 20;
    const maxY = containerRect.height - cardHeight - 20;
    
    newX = Math.max(20, Math.min(newX, maxX));
    newY = Math.max(20, Math.min(newY, maxY));
    
    draggedCard.style.left = `${newX}px`;
    draggedCard.style.top = `${newY}px`;
}

// Remover carta de posiciones ocupadas
function removeCardFromOccupiedPositions(cardElement) {
    const cardRect = cardElement.getBoundingClientRect();
    const containerRect = cardsContainer.getBoundingClientRect();
    const cardX = cardRect.left - containerRect.left;
    const cardY = cardRect.top - containerRect.top;
    
    const cardIndex = occupiedPositions.findIndex(pos => {
        return Math.abs(pos.left - cardX) < 10 && Math.abs(pos.top - cardY) < 10;
    });
    
    if (cardIndex > -1) {
        occupiedPositions.splice(cardIndex, 1);
    }
}

// Manejar fin de arrastre con mouse
function handleMouseUp(e) {
    if (!isDragging) return;
    endDrag();
}

// Manejar fin de arrastre con touch
function handleTouchEnd(e) {
    if (!isDragging) return;
    endDrag();
}

// Finalizar arrastre
function endDrag() {
    if (!draggedCard) return;
    
    const wasReallyDragged = hasMoved;
    
    isDragging = false;
    draggedCard.classList.remove('dragging');
    
    if (wasReallyDragged) {
        // Solo procesar posición si realmente se movió
        const draggedRect = draggedCard.getBoundingClientRect();
        const containerRect = cardsContainer.getBoundingClientRect();
        
        const newX = draggedRect.left - containerRect.left;
        const newY = draggedRect.top - containerRect.top;
        
        const newRect = {
            left: newX,
            top: newY,
            right: newX + cardWidth,
            bottom: newY + cardHeight
        };
        
        // Verificar superposición mayor al 50%
        let needsRepositioning = false;
        for (let occupiedRect of occupiedPositions) {
            if (isOverlapping(newRect, occupiedRect)) {
                needsRepositioning = true;
                break;
            }
        }
        
        if (needsRepositioning) {
            // Si hay superposición mayor al 50%, encontrar nueva posición
            const validPosition = findValidPosition();
            draggedCard.style.left = `${validPosition.x}px`;
            draggedCard.style.top = `${validPosition.y}px`;
            
            // Actualizar posición en el objeto carta
            const envelope = draggedCard.querySelector('.envelope');
            const cardId = parseInt(envelope.getAttribute('data-card-id'));
            const card = cards.find(c => c.id === cardId);
            if (card) {
                card.position = validPosition;
            }
        } else {
            // Posición válida (superposición menor al 50%), agregar a ocupadas
            occupiedPositions.push(newRect);
            
            // Actualizar posición en el objeto carta
            const envelope = draggedCard.querySelector('.envelope');
            const cardId = parseInt(envelope.getAttribute('data-card-id'));
            const card = cards.find(c => c.id === cardId);
            if (card) {
                card.position = { x: newX, y: newY };
            }
        }
    } else {
        // No se movió, es un click - abrir la carta
        const envelope = draggedCard.querySelector('.envelope');
        const cardId = parseInt(envelope.getAttribute('data-card-id'));
        const card = cards.find(c => c.id === cardId);
        
        if (card) {
            saveCardPosition(card.id, draggedCard);
            openEnvelope(draggedCard, card);
        }
        
        // Restaurar la posición en las ocupadas ya que no se movió
        const cardRect = draggedCard.getBoundingClientRect();
        const containerRect = cardsContainer.getBoundingClientRect();
        const cardX = cardRect.left - containerRect.left;
        const cardY = cardRect.top - containerRect.top;
        
        occupiedPositions.push({
            left: cardX,
            top: cardY,
            right: cardX + cardWidth,
            bottom: cardY + cardHeight
        });
    }
    
    draggedCard = null;
    hasMoved = false;
}