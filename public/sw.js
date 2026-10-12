// Service worker de notificaciones — recibe el aviso que manda nuestro
// servidor (vía Web Push) y lo muestra, aunque la app esté cerrada.
self.addEventListener('push', (event) => {
  let datos = { titulo: 'EucaristíaViva', cuerpo: 'Tu Autopista de 3 minutos te espera.', url: '/app' };
  try {
    if (event.data) datos = { ...datos, ...event.data.json() };
  } catch {
    // Si el aviso no trae datos (poco común), se usa el texto por defecto.
  }
  event.waitUntil(
    self.registration.showNotification(datos.titulo, {
      body: datos.cuerpo,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: datos.url },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      const abierta = lista.find((c) => c.url.includes(url));
      if (abierta) return abierta.focus();
      return self.clients.openWindow(url);
    }),
  );
});
