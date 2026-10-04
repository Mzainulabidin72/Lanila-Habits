self.addEventListener('push',e=>{const d=e.data?e.data.json():{};
 e.waitUntil(self.registration.showNotification(d.title||'Lanila Habits',{body:d.body||'',icon:'/logo.png',data:{url:d.url||'/'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
 e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{const c=l.find(x=>'focus' in x);return c?c.focus():clients.openWindow(e.notification.data.url)}))});
