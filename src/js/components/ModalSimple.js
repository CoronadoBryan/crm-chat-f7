export function mostrarModalSimple($f7, onMessageSelect) {
  if (!$f7) {
    console.error("Framework7 instance not provided.");
    return;
  }

  const mensajesPredeterminados = [
    "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?",
    "Por favor, proporciónanos más detalles sobre tu consulta para poder asistirte mejor.",
    "Gracias por tu paciencia. Estamos revisando tu solicitud y te responderemos a la brevedad.",
    "Lamentamos cualquier inconveniente causado. Estamos aquí para ayudarte a resolverlo.",
    "Si necesitas más información, no dudes en escribirnos nuevamente. ¡Estamos para servirte!",
  ];

  const actionSheetButtons = mensajesPredeterminados.map((mensaje) => ({
    text: mensaje,
    onClick: () => {
      if (onMessageSelect) onMessageSelect(mensaje);

      // Insert the selected message into the input field
      const inputField = document.querySelector(".messagebar textarea");
      if (inputField) {
        inputField.value = mensaje;
        inputField.focus();
      }
    },
  }));

  actionSheetButtons.push({
    text: "Cancelar",
    color: "red",
    close: true,
  });

  const actionSheet = $f7.actions.create({
    buttons: actionSheetButtons,
  });

  actionSheet.open();
}
