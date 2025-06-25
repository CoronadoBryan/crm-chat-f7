export function panelDerecho(panelDatos, conv) {
  if (!panelDatos) return;

  const camposCompletos =
    conv.nombreCliente &&
    conv.apellidoCliente &&
    conv.marcaCliente &&
    conv.modeloCliente &&
    conv.placaCliente;

  panelDatos.innerHTML = `
    <div class="block block-strong" style="margin-bottom:0; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div class="row" style="align-items:center;">
        <div class="col-auto">
          <div class="avatar" style="width:56px;height:56px;background:linear-gradient(135deg,#007aff,#4bcffa);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <i class="icon f7-icons" style="font-size:32px;">person_fill</i>
          </div>
        </div>
        <div class="col">
          <div style="font-size:22px;font-weight:700;letter-spacing:0.5px;">${
            conv.nombreCliente || ""
          } ${conv.apellidoCliente || ""}</div>
          <div style="color:#666;font-size:15px;margin-top:2px;"><i class="icon f7-icons" style="font-size:15px;vertical-align:middle;">phone_fill</i> ${
            conv.telefono
          }</div>
        </div>
      </div>
    </div>
    <div class="list no-hairlines" style="margin-top:18px;">
      <ul>
        <li>
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="color:#34c759;">car_fill</i></div>
            <div class="item-inner">
              <div class="item-title">Marca</div>
              <div class="item-after">${conv.marcaCliente || "-"}</div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="color:#ff9500;">square_favorites_alt</i></div>
            <div class="item-inner">
              <div class="item-title">Modelo</div>
              <div class="item-after">${conv.modeloCliente || "-"}</div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="color:#5856d6;">number</i></div>
            <div class="item-inner">
              <div class="item-title">Placa</div>
              <div class="item-after">${conv.placaCliente || "-"}</div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="color:#32ade6;">calendar</i></div>
            <div class="item-inner">
              <div class="item-title">Registrado</div>
              <div class="item-after">${
                conv.fechaCreacion?.date
                  ? new Date(conv.fechaCreacion.date).toLocaleDateString()
                  : "-"
              }</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div style="margin-top:20px; text-align:center;">
      ${
        camposCompletos
          ? `<span class="chip color-green" style="font-weight:600;font-size:15px;"><i class="icon f7-icons" style="vertical-align:middle;">checkmark_circle_fill</i> Registro completo</span>`
          : `<span class="chip color-orange" style="font-weight:600;font-size:15px;"><i class="icon f7-icons" style="vertical-align:middle;">exclamationmark_triangle_fill</i> Registro incompleto</span>`
      }
    </div>
  `;
}
