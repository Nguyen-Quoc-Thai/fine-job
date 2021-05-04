//Start subscription
const publicVapidKey = 'BFRqSgbrK8Ki2cukTfWRjmAhieqS2412837pPTCiNIYA2YISbys3mt16ASxPGuD91dNeWOrxUFC6NGBZF6blm2k';

// Check for service worker
if ('serviceWorker' in navigator) {
  send().catch((err) => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log('Registering service worker...');
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/',
  });
  console.log('Service Worker Registered...');

  // Register Push
  console.log('Registering Push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log('- Subscription: ', subscription);
  console.log('- P256dh: ', new TextDecoder().decode(subscription.getKey('p256dh')));
  console.log('- Auth: ', new TextDecoder().decode(subscription.getKey('auth')));
  console.log('Push Registered...');

  // Send Push Notification
  console.log('Sending Push...');

  const body = {
    subscription: subscription,
    body: {
      title: 'Fetch subscribe',
      body: 'Fetch body',
    },
  };

  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
  console.log('Push Sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}