/* NurBuy service worker: shows Web Push notifications and opens the right page when one is clicked.
   Same file on minutes.nurbuy.com, seller.nurbuy.com and rider.nurbuy.com. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'NurBuy', body: e.data ? e.data.text() : '' }; }
  var opt = {
    body: d.body || '', icon: d.icon || 'favicon.png', badge: d.badge || 'favicon.png', image: d.img || undefined,
    tag: d.id || d.tag || 'nb', renotify: true, silent: false, vibrate: [180, 80, 180],
    requireInteraction: d.tag === 'order', data: { url: d.url || '/' }, timestamp: Date.now()
  };
  e.waitUntil(self.registration.showNotification(d.title || 'NurBuy', opt));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (new URL(c.url).origin === new URL(url).origin) {
        // the open page moves itself (keeps login and unsaved state); navigate() is the fallback
        c.postMessage({ type: 'nb-open', url: url });
        return c.focus().then(function (w) { return w || c; });
      }
    }
    return self.clients.openWindow(url);
  }));
});
