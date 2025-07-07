export function mostrarModalSimple($f7, onMessageSelect) {
  if (!$f7) {
    console.error("Framework7 instance not provided.");
    return;
  }

  const mensajesPorCategoria = {
    "Saludos": [
      { mensaje: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?" },
      { mensaje: "¡Buenos días! Estamos aquí para ayudarte." },
      { mensaje: "¡Buenas tardes! ¿Cómo podemos asistirte?" }
    ],
    "Información": [
      { mensaje: "Por favor, proporciónanos más detalles sobre tu consulta para poder asistirte mejor." },
      { mensaje: "Te enviaremos la información que necesitas en un momento." },
      { mensaje: "¿Podrías especificar qué tipo de información necesitas?" }
    ],
    "Espera": [
      { mensaje: "Gracias por tu paciencia. Estamos revisando tu solicitud y te responderemos a la brevedad." },
      { mensaje: "Un momento por favor, estamos verificando la información." },
      { mensaje: "Te pedimos unos minutos mientras consultamos con nuestro equipo." }
    ],
    "Despedidas": [
      { mensaje: "Si necesitas más información, no dudes en escribirnos nuevamente. ¡Estamos para servirte!" },
      { mensaje: "¡Gracias por contactarnos! Que tengas un excelente día." },
      { mensaje: "Esperamos haber resuelto tu consulta. ¡Hasta pronto!" },
      { mensaje: "¡Muchas gracias por tu tiempo! Estamos aquí cuando nos necesites." }
    ],
    "Disculpas": [
      { mensaje: "Lamentamos cualquier inconveniente causado. Estamos aquí para ayudarte a resolverlo." },
      { mensaje: "Nos disculpamos por la demora. Estamos trabajando para solucionarlo." }
    ],
    "Contacto": [
      { mensaje: "Para asuntos urgentes, puedes llamarnos al teléfono que aparece en nuestro sitio web." },
      { mensaje: "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM." },
      { mensaje: "También puedes escribirnos a nuestro correo electrónico para consultas detalladas." }
    ]
  };

  // Crear el modal con estilos inline
  const modalHTML = `
    <div 
      id="mensajes-rapidos-modal"
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.3s ease;"
    >
      <div 
        class="modal-backdrop" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5);"
      ></div>
      
      <div 
        class="modal-container"
        style="background: white; border-radius: 12px; max-width: 90vw; max-height: 85vh; width: 700px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden; transform: scale(0.7); transition: transform 0.3s ease; display: flex; flex-direction: column;"
      >
        <!-- Header fijo -->
        <div 
          class="modal-header"
          style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; flex-shrink: 0;"
        >
          <h3 style="margin: 0; color: #333; font-size: 18px;">💬 Mensajes Rápidos</h3>
          <button 
            class="modal-close" 
            id="modal-close"
            style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background-color 0.2s;"
          >×</button>
        </div>
        
        <!-- Contenido con scroll -->
        <div 
          class="modal-body"
          style="padding: 20px; overflow-y: auto; flex: 1;"
        >
          <p style="text-align: center; color: #666; margin-bottom: 20px; font-size: 14px;">
            Selecciona un mensaje predeterminado para enviar
          </p>
          
          ${Object.entries(mensajesPorCategoria).map(([categoria, mensajes]) => `
            <div style="margin-bottom: 25px;">
              <h4 style="color: #007aff; font-size: 16px; font-weight: 600; margin-bottom: 12px; border-bottom: 2px solid #007aff; padding-bottom: 5px;">
                ${categoria}
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${mensajes.map((item, index) => `
                  <div 
                    class="mensaje-card" 
                    data-mensaje="${item.mensaje}"
                    style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; min-height: 80px; display: flex; align-items: center; justify-content: center;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.borderColor='#007aff';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow=''; this.style.borderColor='#e0e0e0';"
                  >
                    <div style="font-size: 12px; font-weight: 400; color: #333; line-height: 1.4; text-align: center;">
                      ${item.mensaje}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Footer fijo con botón -->
        <div 
          class="modal-footer"
          style="padding: 15px 20px; border-top: 1px solid #eee; text-align: center; background: white; flex-shrink: 0;"
        >
          <button 
            class="btn-cancel" 
            id="btn-cancel"
            style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background-color 0.2s; width: 100%;"
            onmouseover="this.style.background='#c82333';"
            onmouseout="this.style.background='#dc3545';"
          >Cancelar</button>
        </div>
      </div>
    </div>
  `;

  // Insertar el modal en el DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.getElementById('mensajes-rapidos-modal');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('btn-cancel');
  const backdrop = modal.querySelector('.modal-backdrop');

  // Mostrar modal con animación
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.querySelector('.modal-container').style.transform = 'scale(1)';
  }, 10);

  // Función para cerrar modal
  const cerrarModal = () => {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.querySelector('.modal-container').style.transform = 'scale(0.7)';
    setTimeout(() => {
      modal.remove();
    }, 300);
  };

  // Event listeners para cerrar
  closeBtn.addEventListener('click', cerrarModal);
  cancelBtn.addEventListener('click', cerrarModal);
  backdrop.addEventListener('click', cerrarModal);

  // Event listeners para las cards
  modal.querySelectorAll('.mensaje-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const mensajeCompleto = this.dataset.mensaje;
      
      // Callback para insertar el mensaje
      if (onMessageSelect) {
        onMessageSelect(mensajeCompleto);
      }
      
      // Insertar en el textarea
      const inputField = document.querySelector(".chat-message-input");
      if (inputField) {
        inputField.value = mensajeCompleto;
        inputField.focus();
      }
      
      // Feedback visual
      $f7.toast.create({
        text: `Mensaje seleccionado`,
        position: 'top',
        closeTimeout: 1500
      }).open();
      
      // Cerrar modal
      cerrarModal();
    });
  });
}