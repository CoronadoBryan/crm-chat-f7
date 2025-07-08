import { getPlantillasPorCategoria } from "../services/index.js";

export async function mostrarModalSimple($f7, onMessageSelect) {
  if (!$f7) {
    console.error("Framework7 instance not provided.");
    return;
  }

  // Mostrar loading
  $f7.preloader.show();

  try {
    // Cargar plantillas desde la API
    const response = await getPlantillasPorCategoria();
    
    if (!response.success) {
      throw new Error("Error al cargar plantillas");
    }

    // Organizar plantillas por categoría
    const plantillasPorCategoria = organizarPlantillasPorCategoria(response.data);

    // Crear y mostrar modal
    crearModal(plantillasPorCategoria, $f7, onMessageSelect);

  } catch (error) {
    console.error("Error al cargar plantillas:", error);
    $f7.dialog.alert('Error al cargar las plantillas de mensajes');
  } finally {
    $f7.preloader.hide();
  }
}

// Organizar plantillas por categoría
function organizarPlantillasPorCategoria(plantillas) {
  const categorias = {};
  
  plantillas.forEach(item => {
    const nombreCategoria = item.categoriaNombre;
    
    if (!categorias[nombreCategoria]) {
      categorias[nombreCategoria] = {
        info: {
          id: item.categoriaId,
          nombre: item.categoriaNombre,
          descripcion: item.categoriaDescripcion,
          color: item.categoriaColor
        },
        plantillas: []
      };
    }
    
    categorias[nombreCategoria].plantillas.push({
      id: item.plantillaId,
      alias: item.plantillaAlias,
      contenido: item.plantillaContenido,
      descripcion: item.plantillaDescripcion
    });
  });
  
  return categorias;
}

// Crear y mostrar el modal
function crearModal(plantillasPorCategoria, $f7, onMessageSelect) {
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
        <!-- Header -->
        <div 
          class="modal-header"
          style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: center; align-items: center; background: #f8f9fa; flex-shrink: 0;"
        >
          <h3 style="margin: 0; color: #333; font-size: 18px;">Plantillas de Mensajes</h3>
        </div>
        
        <!-- Contenido -->
        <div 
          class="modal-body"
          style="padding: 20px; overflow-y: auto; flex: 1;"
        >
          
          ${Object.entries(plantillasPorCategoria).map(([nombreCategoria, categoria]) => `
            <div style="margin-bottom: 25px;">
              <h4 style="color: #dc3545; font-size: 16px; font-weight: 600; margin-bottom: 12px; border-bottom: 2px solid #dc3545; padding-bottom: 5px;">
                ${categoria.info.nombre}
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                ${categoria.plantillas.map((plantilla) => `
                  <div 
                    class="mensaje-card" 
                    data-plantilla-id="${plantilla.id}"
                    data-mensaje="${plantilla.contenido}"
                    data-alias="${plantilla.alias}"
                    style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s ease; min-height: 90px; display: flex; flex-direction: column; justify-content: space-between; position: relative;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; this.style.borderColor='#dc3545';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow=''; this.style.borderColor='#e0e0e0';"
                  >
                    <div style="flex: 1;">
                      <div style="font-size: 12px; font-weight: 600; color: #dc3545; margin-bottom: 6px; line-height: 1.2;">
                        ${plantilla.alias}
                      </div>
                      <div style="font-size: 11px; color: #333; line-height: 1.4; margin-bottom: 6px;">
                        ${plantilla.contenido}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Footer -->
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
  
  // Configurar eventos
  configurarEventos($f7, onMessageSelect);
}

// Configurar eventos del modal
function configurarEventos($f7, onMessageSelect) {
  const modal = document.getElementById('mensajes-rapidos-modal');
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
  cancelBtn.addEventListener('click', cerrarModal);
  backdrop.addEventListener('click', cerrarModal);

  // Event listeners para las cards de plantillas
  modal.querySelectorAll('.mensaje-card').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const plantillaId = this.dataset.plantillaId;
      const mensajeCompleto = this.dataset.mensaje;
      const alias = this.dataset.alias;
      
      console.log(`Plantilla seleccionada: ID ${plantillaId}, Alias: ${alias}`);
      
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
        text: `Plantilla "${alias}" seleccionada`,
        position: 'top',
        closeTimeout: 1500
      }).open();
      
      // Cerrar modal
      cerrarModal();
    });
  });
}