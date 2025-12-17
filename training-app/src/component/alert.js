import '../view/alert.css';

// Create a container for alerts if it doesn't exist
let container = document.querySelector('.alert-container');
if (!container) {
  container = document.createElement('div');
  container.className = 'alert-container';
  document.body.appendChild(container);
}

export function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert-popup ${type}`;

  let icon = '';
  switch(type) {
    case 'success':
      icon = '✔️';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'info':
    default:
      icon = 'ℹ️';
      break;
  }

  alert.innerHTML = `
    <span class="icon">${icon}</span>
    <div class="message">${message}</div>
    <span class="close-btn">&times;</span>
  `;

  alert.querySelector('.close-btn').addEventListener('click', () => {
    container.removeChild(alert);
  });

  container.appendChild(alert);

  // Remove alert after a while
  setTimeout(() => {
    if (container.contains(alert)) alert.remove();
  }, 4000);
}
