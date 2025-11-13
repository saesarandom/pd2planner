/**
 * Notification System
 * Provides styled toast notifications instead of default browser alerts
 */

class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Add CSS styles
    this.addStyles();

    // Create notification container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  addStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .notification {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid rgba(0, 255, 136, 0.3);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 136, 0.2);
        color: #fff;
        font-family: Oswald, sans-serif;
        animation: slideIn 0.3s ease-out;
        position: relative;
        overflow: hidden;
      }

      .notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(to bottom, #00ff88, #00d4ff);
      }

      .notification.success {
        border-color: rgba(0, 255, 136, 0.5);
      }

      .notification.success::before {
        background: linear-gradient(to bottom, #00ff88, #00aa66);
      }

      .notification.error {
        border-color: rgba(255, 85, 85, 0.5);
      }

      .notification.error::before {
        background: linear-gradient(to bottom, #ff5555, #cc3333);
      }

      .notification.info {
        border-color: rgba(0, 212, 255, 0.5);
      }

      .notification.info::before {
        background: linear-gradient(to bottom, #00d4ff, #0099cc);
      }

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }

      .notification-title {
        font-size: 16px;
        font-weight: bold;
        color: #00ff88;
        margin: 0;
      }

      .notification.error .notification-title {
        color: #ff5555;
      }

      .notification.info .notification-title {
        color: #00d4ff;
      }

      .notification-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
        margin-left: 10px;
      }

      .notification-close:hover {
        color: #fff;
      }

      .notification-message {
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .notification-url {
        margin-top: 12px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        border: 1px solid rgba(0, 255, 136, 0.2);
      }

      .notification-url-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .notification-url-content {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .notification-url-text {
        flex: 1;
        font-size: 13px;
        color: #00d4ff;
        word-break: break-all;
        font-family: monospace;
      }

      .notification-copy-btn {
        background: linear-gradient(135deg, #00ff88, #00d4ff);
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        color: #000;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        transition: transform 0.2s, opacity 0.2s;
        white-space: nowrap;
      }

      .notification-copy-btn:hover {
        transform: scale(1.05);
      }

      .notification-copy-btn:active {
        transform: scale(0.95);
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .notification.closing {
        animation: slideOut 0.3s ease-in forwards;
      }

      @media (max-width: 600px) {
        .notification-container {
          left: 10px;
          right: 10px;
          max-width: calc(100% - 20px);
        }

        .notification-url-text {
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @param {string} options.title - Notification title
   * @param {string} options.message - Notification message
   * @param {string} options.type - Notification type: 'success', 'error', 'info' (default: 'info')
   * @param {number} options.duration - Auto-close duration in ms (default: 5000, 0 for no auto-close)
   * @param {string} options.url - Optional URL to display with copy button
   */
  show({ title, message, type = 'info', duration = 5000, url = null }) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const header = document.createElement('div');
    header.className = 'notification-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'notification-title';
    titleEl.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.close(notification);

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    const messageEl = document.createElement('div');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;

    notification.appendChild(header);
    notification.appendChild(messageEl);

    // Add URL section if provided
    if (url) {
      const urlContainer = document.createElement('div');
      urlContainer.className = 'notification-url';

      const urlLabel = document.createElement('div');
      urlLabel.className = 'notification-url-label';
      urlLabel.textContent = 'Share URL';

      const urlContent = document.createElement('div');
      urlContent.className = 'notification-url-content';

      const urlText = document.createElement('div');
      urlText.className = 'notification-url-text';
      urlText.textContent = url;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'notification-copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(url);
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          copyBtn.textContent = 'Failed';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 2000);
        }
      };

      urlContent.appendChild(urlText);
      urlContent.appendChild(copyBtn);
      urlContainer.appendChild(urlLabel);
      urlContainer.appendChild(urlContent);
      notification.appendChild(urlContainer);
    }

    this.container.appendChild(notification);

    // Auto-close if duration is set
    if (duration > 0) {
      setTimeout(() => {
        this.close(notification);
      }, duration);
    }

    return notification;
  }

  close(notification) {
    notification.classList.add('closing');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Convenience methods
  success(title, message, options = {}) {
    return this.show({ title, message, type: 'success', ...options });
  }

  error(title, message, options = {}) {
    return this.show({ title, message, type: 'error', ...options });
  }

  info(title, message, options = {}) {
    return this.show({ title, message, type: 'info', ...options });
  }
}

// Initialize global notification system
if (typeof window !== 'undefined') {
  window.notificationSystem = new NotificationSystem();
}
