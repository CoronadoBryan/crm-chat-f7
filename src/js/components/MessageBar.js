export const MessageBar = {
  create: (props) => {
    const { onSend, placeholder = "Escribe un mensaje..." } = props;
    
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendClick();
      }
    };

    const handleSendClick = () => {
      const textarea = document.getElementById("message-input");
      const messageText = textarea?.value?.trim();
      if (!messageText) return;
      
      onSend(messageText);
      textarea.value = "";
      textarea.focus();
    };

    return `
      <div class="toolbar messagebar">
        <div class="toolbar-inner">
          <div class="messagebar-area">
            <textarea id="message-input" class="resizable" placeholder="${placeholder}"></textarea>
          </div>
          <a class="link icon-only" onclick="handleSendClick()">
            <i class="icon f7-icons">arrow_up_circle_fill</i>
          </a>
        </div>
      </div>
    `;
  }
};