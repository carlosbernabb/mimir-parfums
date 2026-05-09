import nodemailer from "nodemailer";
import { Order, STATUS_LABELS } from "./orders";

const ADMIN_EMAILS = [
  "carbebezu.10@gmail.com",
  "sinfantea@gmail.com",
  "santirene367@gmail.com",
  "anchrishess@gmail.com",
];

const FROM = `MIMIR Parfums <${process.env.GMAIL_USER}>`;
const BASE_URL = process.env.NEXT_PUBLIC_URL!;
const gold = "#C9A84C";
const dark = "#0c0c0c";

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${dark};font-family:'Georgia',serif;color:#f5f0e8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${dark};padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#111111;border:1px solid rgba(201,168,76,0.25);border-radius:4px;">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid rgba(201,168,76,0.12);text-align:center;background:#0d0d0d;">
            <p style="margin:0;font-size:10px;letter-spacing:0.4em;color:${gold};font-family:'Georgia',serif;text-transform:uppercase;">✦ MIMIR PARFUMS ✦</p>
            <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;color:rgba(201,168,76,0.45);font-family:'Georgia',serif;text-transform:uppercase;font-style:italic;">Perfumes Árabes de Élite</p>
          </td>
        </tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr>
          <td style="padding:18px 32px;border-top:1px solid rgba(201,168,76,0.1);text-align:center;background:#0d0d0d;">
            <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.25);letter-spacing:0.1em;font-style:italic;">© 2025 MIMIR Parfums · Todos los derechos reservados</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function itemsTable(order: Order): string {
  const rows = order.items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <span style="color:#f5f0e8;font-size:14px;">${item.name}</span>
        <span style="color:rgba(245,240,232,0.4);font-size:12px;font-style:italic;"> · Eau de Parfum ${item.volume ?? "100ml"}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:center;color:rgba(245,240,232,0.6);font-size:13px;">× ${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;color:#f5f0e8;font-size:14px;">$${(item.price * item.quantity).toLocaleString("es-MX")} MXN</td>
    </tr>`).join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <td style="font-size:10px;letter-spacing:0.2em;color:${gold};text-transform:uppercase;padding-bottom:8px;font-family:'Georgia',serif;">Producto</td>
        <td style="font-size:10px;letter-spacing:0.2em;color:${gold};text-transform:uppercase;padding-bottom:8px;text-align:center;font-family:'Georgia',serif;">Cant.</td>
        <td style="font-size:10px;letter-spacing:0.2em;color:${gold};text-transform:uppercase;padding-bottom:8px;text-align:right;font-family:'Georgia',serif;">Precio</td>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding-top:12px;font-size:14px;color:rgba(245,240,232,0.6);font-style:italic;">Total del pedido</td>
        <td style="padding-top:12px;text-align:right;font-size:20px;color:${gold};font-weight:bold;">$${order.total_mxn.toLocaleString("es-MX")} MXN</td>
      </tr>
    </tfoot>
  </table>`;
}

function infoBlock(title: string, content: string): string {
  return `
  <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(201,168,76,0.12);border-left:2px solid ${gold};padding:16px 20px;margin-bottom:16px;border-radius:2px;">
    <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.25em;color:${gold};text-transform:uppercase;font-family:'Georgia',serif;">${title}</p>
    <p style="margin:0;font-size:14px;line-height:1.9;color:rgba(245,240,232,0.82);font-style:italic;">${content}</p>
  </div>`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  });
}

async function send(to: string | string[], subject: string, html: string, replyTo?: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: FROM,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

// ─── Admin email ─────────────────────────────────────────────────────────────

export async function sendNewOrderToAdmin(order: Order): Promise<void> {
  const s = order.shipping;

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.15em;color:rgba(245,240,232,0.5);text-transform:uppercase;">Nuevo Pedido Recibido</p>
      <p style="margin:0;font-size:38px;letter-spacing:0.25em;color:#f5f0e8;line-height:1;">${order.order_id}</p>
      <p style="margin:8px 0 0;font-size:11px;color:rgba(245,240,232,0.3);font-style:italic;">${formatDate(order.created_at)}</p>
    </div>

    <div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.2);padding:20px 20px 12px;margin-bottom:20px;border-radius:2px;">
      ${itemsTable(order)}
    </div>

    ${infoBlock("Cliente", `${s.nombre}<br>${s.telefono}<br>${order.customer_email}`)}
    ${infoBlock("Dirección de Envío", `${s.calle} ${s.numero}, ${s.colonia}<br>${s.ciudad}, ${s.estado}&nbsp;&nbsp;CP ${s.codigoPostal}<br>México`)}

    <div style="text-align:center;margin:28px 0 20px;">
      <a href="${BASE_URL}/admin" style="display:inline-block;padding:13px 32px;background:${gold};color:#0c0c0c;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Georgia',serif;border-radius:2px;">
        Gestionar Pedido →
      </a>
    </div>

    <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.25);text-align:center;font-style:italic;">
      Rastreo del cliente: ${BASE_URL}/rastreo?orderId=${order.order_id}
    </p>
  `;

  await send(
    ADMIN_EMAILS,
    `🛒 [${order.order_id}] Nuevo pedido — $${order.total_mxn.toLocaleString("es-MX")} MXN — ${order.shipping.nombre}`,
    emailWrapper(body)
  );
}

// ─── Customer confirmation ────────────────────────────────────────────────────

export async function sendConfirmationToCustomer(order: Order): Promise<void> {
  const s = order.shipping;
  const trackingUrl = `${BASE_URL}/rastreo?orderId=${order.order_id}`;

  const body = `
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 10px;font-size:14px;color:rgba(245,240,232,0.65);font-style:italic;">Hola, ${s.nombre.split(" ")[0]}.</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:normal;color:#f5f0e8;">¡Gracias por tu pedido!</h1>
      <p style="margin:0;font-size:14px;color:rgba(245,240,232,0.5);font-style:italic;">Tu pago fue confirmado. Estamos preparando tu fragancia.</p>
    </div>

    <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.25);padding:24px;margin-bottom:24px;border-radius:2px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;color:${gold};text-transform:uppercase;font-family:'Georgia',serif;">Tu número de pedido</p>
      <p style="margin:0;font-size:42px;letter-spacing:0.3em;color:#f5f0e8;line-height:1;">${order.order_id}</p>
      <p style="margin:10px 0 0;font-size:11px;color:rgba(245,240,232,0.35);font-style:italic;">Guárdalo para rastrear tu envío en cualquier momento</p>
    </div>

    <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(201,168,76,0.1);padding:20px 20px 12px;margin-bottom:20px;border-radius:2px;">
      ${itemsTable(order)}
    </div>

    ${infoBlock("Dirección de Entrega", `${s.calle} ${s.numero}, ${s.colonia}<br>${s.ciudad}, ${s.estado}&nbsp;&nbsp;CP ${s.codigoPostal}`)}

    <div style="text-align:center;margin:28px 0 24px;">
      <a href="${trackingUrl}" style="display:inline-block;padding:13px 32px;background:${gold};color:#0c0c0c;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Georgia',serif;border-radius:2px;">
        Rastrear mi Pedido →
      </a>
    </div>

    <p style="margin:0;font-size:12px;color:rgba(245,240,232,0.3);text-align:center;line-height:1.9;font-style:italic;">
      Te notificaremos cuando tu pedido sea enviado.<br>
      ¿Preguntas? Responde este correo o visita ${BASE_URL}/rastreo
    </p>
  `;

  await send(
    order.customer_email,
    `Tu pedido ${order.order_id} está confirmado — MIMIR Parfums`,
    emailWrapper(body)
  );
}

// ─── Status update to customer ────────────────────────────────────────────────

export async function sendStatusUpdateToCustomer(order: Order, newStatus: string): Promise<void> {
  const trackingUrl = `${BASE_URL}/rastreo?orderId=${order.order_id}`;
  const label = STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS] ?? newStatus;

  const messages: Partial<Record<string, string>> = {
    processing: "Estamos preparando tu pedido con mucho cuidado. Te avisamos en cuanto sea enviado.",
    shipped: "¡Tu pedido está en camino! Llegará en <strong>1-3 días hábiles</strong> a tu puerta.",
    delivered: "Tu pedido fue entregado. ¡Esperamos que disfrutes tu fragancia al máximo!",
    cancelled: "Tu pedido ha sido cancelado. Si tienes alguna pregunta, contáctanos.",
  };

  const msg = messages[newStatus] ?? "El estado de tu pedido ha sido actualizado.";

  const trackingBlock = newStatus === "shipped" && (order.tracking_number || order.carrier)
    ? `
    <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(201,168,76,0.15);border-left:2px solid ${gold};padding:16px 20px;margin-bottom:24px;border-radius:2px;">
      <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.25em;color:${gold};text-transform:uppercase;font-family:'Georgia',serif;">Información de Envío</p>
      ${order.carrier ? `<p style="margin:0 0 6px;font-size:14px;color:rgba(245,240,232,0.8);font-style:italic;">Paquetería: <strong style="color:#f5f0e8;">${order.carrier}</strong></p>` : ""}
      ${order.tracking_number ? `<p style="margin:0 0 6px;font-size:14px;color:rgba(245,240,232,0.8);font-style:italic;">Número de guía: <strong style="color:#f5f0e8;letter-spacing:0.08em;">${order.tracking_number}</strong></p>` : ""}
      ${order.tracking_url ? `<p style="margin:10px 0 0;"><a href="${order.tracking_url}" style="color:${gold};font-size:12px;font-style:italic;">Rastrear con la paquetería →</a></p>` : ""}
    </div>`
    : "";

  const body = `
    <h2 style="margin:0 0 6px;font-size:18px;font-weight:normal;color:#f5f0e8;">Actualización de tu pedido</h2>
    <p style="margin:0 0 28px;font-size:13px;color:rgba(245,240,232,0.45);font-style:italic;">${order.order_id}</p>

    <div style="text-align:center;padding:24px;background:${newStatus === "cancelled" ? "rgba(231,76,60,0.06)" : "rgba(201,168,76,0.06)"};border:1px solid ${newStatus === "cancelled" ? "rgba(231,76,60,0.2)" : "rgba(201,168,76,0.2)"};border-radius:2px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;color:${newStatus === "cancelled" ? "#e74c3c" : gold};text-transform:uppercase;font-family:'Georgia',serif;">Estado actual</p>
      <p style="margin:0;font-size:24px;color:#f5f0e8;">${label}</p>
    </div>

    <p style="font-size:14px;color:rgba(245,240,232,0.7);line-height:1.8;margin-bottom:${trackingBlock ? "20px" : "28px"};font-style:italic;">${msg}</p>

    ${trackingBlock}

    <div style="text-align:center;">
      <a href="${trackingUrl}" style="display:inline-block;padding:13px 32px;background:${gold};color:#0c0c0c;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Georgia',serif;border-radius:2px;">
        Ver mi Pedido →
      </a>
    </div>
  `;

  await send(
    order.customer_email,
    `[${order.order_id}] ${label} — MIMIR Parfums`,
    emailWrapper(body)
  );
}

// ─── Retry payment ────────────────────────────────────────────────────────────

export async function sendRetryPaymentEmail(order: Order): Promise<void> {
  const discountCode = "DANKEST";

  const body = `
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 10px;font-size:14px;color:rgba(245,240,232,0.65);font-style:italic;">Hola, ${order.shipping.nombre.split(" ")[0]}.</p>
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:normal;color:#f5f0e8;">Tu pedido quedó pendiente</h1>
      <p style="margin:0;font-size:14px;color:rgba(245,240,232,0.5);font-style:italic;">Notamos que no se completó el proceso de pago para tu fragancia.</p>
    </div>

    <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(201,168,76,0.1);padding:20px 20px 12px;margin-bottom:24px;border-radius:2px;">
      ${itemsTable(order)}
    </div>

    <div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.25);padding:24px;margin-bottom:24px;border-radius:2px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;color:${gold};text-transform:uppercase;font-family:'Georgia',serif;">Tu código exclusivo</p>
      <p style="margin:6px 0;font-size:36px;letter-spacing:0.25em;color:#f5f0e8;font-family:'Georgia',serif;">${discountCode}</p>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(245,240,232,0.55);font-style:italic;">Aplica <strong style="color:${gold};">5% de descuento</strong> + envío gratis en tu próxima compra</p>
    </div>

    <div style="text-align:center;margin:28px 0 24px;">
      <a href="${BASE_URL}" style="display:inline-block;padding:13px 32px;background:${gold};color:#0c0c0c;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Georgia',serif;border-radius:2px;">
        Volver a la Tienda →
      </a>
    </div>

    <p style="margin:0;font-size:12px;color:rgba(245,240,232,0.3);text-align:center;line-height:1.9;font-style:italic;">
      El código <strong style="color:rgba(245,240,232,0.5);">${discountCode}</strong> se aplica en el carrito.<br>
      ¿Tienes preguntas? Responde este correo y te ayudamos.
    </p>
  `;

  await send(
    order.customer_email,
    `¡Tu fragancia te espera, ${order.shipping.nombre.split(" ")[0]}! — Código DANKEST −5%`,
    emailWrapper(body)
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────

export async function sendContactToAdmin(orderId: string, customerEmail: string, message: string): Promise<void> {
  const body = `
    <h2 style="margin:0 0 6px;font-size:18px;font-weight:normal;color:#f5f0e8;">Mensaje de cliente</h2>
    <p style="margin:0 0 28px;font-size:13px;color:rgba(245,240,232,0.45);font-style:italic;">Recibido desde el formulario de rastreo</p>

    ${infoBlock("Número de Pedido", orderId || "No especificado")}
    ${infoBlock("Correo del Cliente", customerEmail)}
    ${infoBlock("Mensaje", message.replace(/\n/g, "<br>"))}

    <p style="margin:20px 0 0;font-size:11px;color:rgba(245,240,232,0.25);font-style:italic;">
      Responde directamente a este correo para contestar al cliente.
    </p>
  `;

  await send(
    ADMIN_EMAILS,
    `📩 Mensaje de cliente${orderId ? ` — ${orderId}` : ""} — MIMIR Parfums`,
    emailWrapper(body),
    customerEmail
  );
}
