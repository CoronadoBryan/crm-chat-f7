// src/js/components/ChatNavbar.js
export const ChatNavbar = {
  create: (props) => {
    const { 
      title = "Chat", 
      onBack, 
      onFinalize, 
      onHistory, 
      showMenu = true 
    } = props;

    return `
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link" onclick="onBack()">
              <i class="icon icon-back"></i>
              <span class="if-not-md">Volver</span>
            </a>
          </div>
          <div class="title">${title}</div>
          <div class="right">
            <button class="button button-fill color-red" onclick="onFinalize()">
              Finalizar Conversación
            </button>
            <a class="link icon-only" onclick="onHistory()">
              <i class="icon f7-icons">clock_fill</i>
            </a>
            ${showMenu ? `
              <a href="#" class="link icon-only panel-open" data-panel="right">
                <i class="icon f7-icons">menu</i>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
};