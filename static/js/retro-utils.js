/**
 * ============================================================================
 * CROWN AND SKULL - RETRO UI UTILITIES
 * ============================================================================
 *
 * JavaScript utility library for working with 8-bit retro components.
 * Provides helper functions for notifications, dialogs, health bars, and more.
 *
 * Author: BigPoppa
 * Version: 1.0.0
 *
 * Dependencies: None (vanilla JavaScript)
 * Browser Support: Modern browsers (ES6+)
 *
 * Usage:
 *   <script src="/static/js/retro-utils.js"></script>
 *   <script>
 *     RetroUI.notify('Quest completed!', 'success');
 *     RetroUI.updateHealth(element, 75, 100);
 *   </script>
 * ============================================================================
 */

const RetroUI = (function() {
  'use strict';

  /**
   * Configuration object - Can be overridden
   */
  const CONFIG = {
    notificationDuration: 3000,
    notificationPosition: 'top-right', // top-right, top-left, bottom-right, bottom-left
    animationDuration: 300,
    defaultDialogWidth: '400px',
  };

  /**
   * Internal state management
   */
  const state = {
    activeNotifications: [],
    activeDialogs: [],
    soundEnabled: false,
  };


  /* ==========================================================================
     NOTIFICATION SYSTEM
     ========================================================================== */

  /**
   * Display a notification message
   *
   * @param {string} message - The notification message to display
   * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
   * @param {number} duration - How long to show (ms), 0 for persistent
   * @returns {HTMLElement} The notification element
   */
  function showNotification(message, type = 'success', duration = CONFIG.notificationDuration) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Position based on config
    setNotificationPosition(notification);

    // Add to DOM
    document.body.appendChild(notification);

    // Track active notification
    state.activeNotifications.push(notification);

    // Auto-remove after duration (if not persistent)
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(notification);
      }, duration);
    }

    // Allow manual dismissal on click
    notification.addEventListener('click', () => {
      dismissNotification(notification);
    });

    return notification;
  }

  /**
   * Dismiss a notification with animation
   *
   * @param {HTMLElement} notification - The notification element to dismiss
   */
  function dismissNotification(notification) {
    if (!notification || !notification.parentNode) return;

    // Reverse the animation
    notification.style.animation = 'fadeIn 0.3s ease-out reverse';

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }

      // Remove from active notifications
      const index = state.activeNotifications.indexOf(notification);
      if (index > -1) {
        state.activeNotifications.splice(index, 1);
      }
    }, CONFIG.animationDuration);
  }

  /**
   * Set notification position based on configuration
   *
   * @param {HTMLElement} notification - The notification element
   */
  function setNotificationPosition(notification) {
    const positions = {
      'top-right': { top: '16px', right: '16px' },
      'top-left': { top: '16px', left: '16px' },
      'bottom-right': { bottom: '16px', right: '16px' },
      'bottom-left': { bottom: '16px', left: '16px' },
    };

    const pos = positions[CONFIG.notificationPosition] || positions['top-right'];
    Object.assign(notification.style, pos);
  }

  /**
   * Clear all active notifications
   */
  function clearAllNotifications() {
    state.activeNotifications.forEach(notification => {
      dismissNotification(notification);
    });
  }


  /* ==========================================================================
     DIALOG / MODAL SYSTEM
     ========================================================================== */

  /**
   * Show a modal dialog with custom content
   *
   * @param {Object} options - Dialog configuration
   * @param {string} options.title - Dialog title
   * @param {string} options.content - Dialog content (HTML string or text)
   * @param {Array} options.buttons - Array of button configs
   * @param {Function} options.onClose - Callback when dialog closes
   * @param {boolean} options.closeOnOverlay - Allow closing by clicking overlay
   * @returns {Object} Dialog controls { element, close }
   */
  function showDialog(options = {}) {
    const defaults = {
      title: 'Dialog',
      content: '',
      buttons: [],
      onClose: null,
      closeOnOverlay: true,
      width: CONFIG.defaultDialogWidth,
    };

    const config = { ...defaults, ...options };

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    if (config.width) {
      dialog.style.minWidth = config.width;
    }

    // Build dialog content
    let buttonsHTML = '';
    if (config.buttons.length > 0) {
      buttonsHTML = '<div class="btn-group mt-md">';
      config.buttons.forEach(btn => {
        const btnClass = btn.className || 'btn-primary';
        const btnText = btn.text || 'OK';
        buttonsHTML += `<button class="${btnClass}" data-action="${btn.action || 'close'}">${btnText}</button>`;
      });
      buttonsHTML += '</div>';
    }

    dialog.innerHTML = `
      <h3 class="mb-md">${escapeHTML(config.title)}</h3>
      <div class="mb-lg">${config.content}</div>
      ${buttonsHTML}
    `;

    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // Track active dialog
    state.activeDialogs.push({ overlay, dialog });

    // Close function
    const closeDialog = () => {
      overlay.remove();
      dialog.remove();

      // Remove from active dialogs
      const index = state.activeDialogs.findIndex(d => d.dialog === dialog);
      if (index > -1) {
        state.activeDialogs.splice(index, 1);
      }

      // Execute callback
      if (config.onClose) {
        config.onClose();
      }
    };

    // Overlay click handler
    if (config.closeOnOverlay) {
      overlay.addEventListener('click', closeDialog);
    }

    // Button click handlers
    const buttons = dialog.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;

        // Execute button callback if exists
        const buttonConfig = config.buttons.find(b => b.action === action);
        if (buttonConfig && buttonConfig.onClick) {
          buttonConfig.onClick(closeDialog);
        } else if (action === 'close') {
          closeDialog();
        }
      });
    });

    // Keyboard support (ESC to close)
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    document.addEventListener('keydown', keyHandler);

    return {
      element: dialog,
      overlay: overlay,
      close: closeDialog,
    };
  }

  /**
   * Show a confirmation dialog
   *
   * @param {string} message - Confirmation message
   * @param {Function} onConfirm - Callback when confirmed
   * @param {Function} onCancel - Callback when cancelled
   * @returns {Object} Dialog controls
   */
  function confirm(message, onConfirm, onCancel) {
    return showDialog({
      title: 'Confirm',
      content: `<p>${escapeHTML(message)}</p>`,
      buttons: [
        {
          text: 'Confirm',
          className: 'btn-primary',
          action: 'confirm',
          onClick: (close) => {
            if (onConfirm) onConfirm();
            close();
          },
        },
        {
          text: 'Cancel',
          className: 'btn-danger',
          action: 'cancel',
          onClick: (close) => {
            if (onCancel) onCancel();
            close();
          },
        },
      ],
    });
  }

  /**
   * Show an alert dialog
   *
   * @param {string} message - Alert message
   * @param {Function} onClose - Callback when closed
   * @returns {Object} Dialog controls
   */
  function alert(message, onClose) {
    return showDialog({
      title: 'Alert',
      content: `<p>${escapeHTML(message)}</p>`,
      buttons: [
        {
          text: 'OK',
          className: 'btn-primary',
          action: 'close',
        },
      ],
      onClose: onClose,
    });
  }


  /* ==========================================================================
     HEALTH BAR UTILITIES
     ========================================================================== */

  /**
   * Update a health bar element
   *
   * @param {HTMLElement} healthBarElement - The .health-bar element
   * @param {number} currentHealth - Current health value
   * @param {number} maxHealth - Maximum health value
   * @param {boolean} animate - Whether to animate the change
   */
  function updateHealthBar(healthBarElement, currentHealth, maxHealth, animate = true) {
    if (!healthBarElement) return;

    const fill = healthBarElement.querySelector('.health-bar-fill');
    const text = healthBarElement.querySelector('.health-bar-text');

    if (!fill) return;

    // Calculate percentage
    const percentage = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));

    // Update width
    if (animate) {
      fill.style.transition = 'width 0.3s ease-out';
    } else {
      fill.style.transition = 'none';
    }

    fill.style.width = percentage + '%';

    // Update text
    if (text) {
      text.textContent = `${Math.round(currentHealth)} / ${maxHealth}`;
    }

    // Update state classes
    fill.classList.remove('low', 'critical');

    if (percentage <= 35 && percentage > 15) {
      fill.classList.add('low');
    } else if (percentage <= 15) {
      fill.classList.add('critical');

      // Add shake effect to parent on critical
      healthBarElement.classList.add('shake');
      setTimeout(() => {
        healthBarElement.classList.remove('shake');
      }, 500);
    }
  }

  /**
   * Create a new health bar element
   *
   * @param {number} currentHealth - Current health value
   * @param {number} maxHealth - Maximum health value
   * @param {Object} options - Additional options
   * @returns {HTMLElement} The created health bar element
   */
  function createHealthBar(currentHealth, maxHealth, options = {}) {
    const defaults = {
      showText: true,
      className: '',
    };

    const config = { ...defaults, ...options };

    const healthBar = document.createElement('div');
    healthBar.className = `health-bar ${config.className}`;

    const percentage = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    let stateClass = '';

    if (percentage <= 35 && percentage > 15) {
      stateClass = 'low';
    } else if (percentage <= 15) {
      stateClass = 'critical';
    }

    const textHTML = config.showText
      ? `<span class="health-bar-text">${currentHealth} / ${maxHealth}</span>`
      : '';

    healthBar.innerHTML = `
      <div class="health-bar-fill ${stateClass}" style="width: ${percentage}%;">
        ${textHTML}
      </div>
    `;

    return healthBar;
  }


  /* ==========================================================================
     STAT BOX UTILITIES
     ========================================================================== */

  /**
   * Create a stat box element
   *
   * @param {string} label - The stat label (e.g., "HP", "STR")
   * @param {number|string} value - The stat value
   * @param {string} className - Additional CSS classes
   * @returns {HTMLElement} The created stat box element
   */
  function createStatBox(label, value, className = '') {
    const statBox = document.createElement('div');
    statBox.className = `stat-box ${className}`;

    statBox.innerHTML = `
      <span class="stat-label">${escapeHTML(label)}</span>
      <span class="stat-value">${escapeHTML(String(value))}</span>
    `;

    return statBox;
  }

  /**
   * Update a stat box value
   *
   * @param {HTMLElement} statBoxElement - The .stat-box element
   * @param {number|string} newValue - The new value
   * @param {boolean} animate - Whether to animate the change
   */
  function updateStatBox(statBoxElement, newValue, animate = true) {
    if (!statBoxElement) return;

    const valueElement = statBoxElement.querySelector('.stat-value');
    if (!valueElement) return;

    if (animate) {
      // Add glow effect briefly
      valueElement.classList.add('glow');
      setTimeout(() => {
        valueElement.classList.remove('glow');
      }, 1000);
    }

    valueElement.textContent = String(newValue);
  }


  /* ==========================================================================
     LOADING / SPINNER UTILITIES
     ========================================================================== */

  /**
   * Show a loading spinner
   *
   * @param {HTMLElement} container - Container to append spinner to
   * @param {string} message - Optional loading message
   * @returns {HTMLElement} The loading element
   */
  function showLoading(container, message = '') {
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'loading-wrapper text-center p-lg';

    const messageHTML = message
      ? `<p class="mt-md text-muted">${escapeHTML(message)}</p>`
      : '';

    loadingWrapper.innerHTML = `
      <div class="loading"></div>
      ${messageHTML}
    `;

    if (container) {
      container.appendChild(loadingWrapper);
    }

    return loadingWrapper;
  }

  /**
   * Hide a loading spinner
   *
   * @param {HTMLElement} loadingElement - The loading element to remove
   */
  function hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.remove();
    }
  }


  /* ==========================================================================
     ANIMATION UTILITIES
     ========================================================================== */

  /**
   * Apply shake animation to an element
   *
   * @param {HTMLElement} element - Element to shake
   * @param {number} duration - Duration in ms (default 500)
   */
  function shake(element, duration = 500) {
    if (!element) return;

    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, duration);
  }

  /**
   * Apply glow animation to an element
   *
   * @param {HTMLElement} element - Element to glow
   * @param {number} duration - Duration in ms, 0 for permanent
   */
  function glow(element, duration = 2000) {
    if (!element) return;

    element.classList.add('glow');

    if (duration > 0) {
      setTimeout(() => {
        element.classList.remove('glow');
      }, duration);
    }
  }

  /**
   * Apply blink animation to an element
   *
   * @param {HTMLElement} element - Element to blink
   * @param {number} duration - Duration in ms, 0 for permanent
   */
  function blink(element, duration = 3000) {
    if (!element) return;

    element.classList.add('blink');

    if (duration > 0) {
      setTimeout(() => {
        element.classList.remove('blink');
      }, duration);
    }
  }


  /* ==========================================================================
     FORM UTILITIES
     ========================================================================== */

  /**
   * Set error state on a form group
   *
   * @param {HTMLElement} formGroup - The .form-group element
   * @param {string} errorMessage - Error message to display
   */
  function setFormError(formGroup, errorMessage) {
    if (!formGroup) return;

    formGroup.classList.add('error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    if (errorMessage) {
      const errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      formGroup.appendChild(errorElement);
    }

    // Shake the input for attention
    const input = formGroup.querySelector('input, textarea, select');
    if (input) {
      shake(input);
    }
  }

  /**
   * Clear error state from a form group
   *
   * @param {HTMLElement} formGroup - The .form-group element
   */
  function clearFormError(formGroup) {
    if (!formGroup) return;

    formGroup.classList.remove('error');

    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * Validate a form and show errors
   *
   * @param {HTMLFormElement} form - The form element
   * @param {Object} validationRules - Validation rules object
   * @returns {boolean} Whether form is valid
   */
  function validateForm(form, validationRules = {}) {
    if (!form) return false;

    let isValid = true;

    // Clear all existing errors
    form.querySelectorAll('.form-group').forEach(group => {
      clearFormError(group);
    });

    // Validate each field
    Object.keys(validationRules).forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) return;

      const formGroup = input.closest('.form-group');
      const rules = validationRules[fieldName];
      const value = input.value.trim();

      // Required validation
      if (rules.required && !value) {
        setFormError(formGroup, rules.requiredMessage || 'This field is required');
        isValid = false;
        return;
      }

      // Custom validation function
      if (rules.validate && typeof rules.validate === 'function') {
        const error = rules.validate(value);
        if (error) {
          setFormError(formGroup, error);
          isValid = false;
        }
      }
    });

    return isValid;
  }


  /* ==========================================================================
     UTILITY FUNCTIONS
     ========================================================================== */

  /**
   * Escape HTML to prevent XSS
   *
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Play a retro sound effect (if sounds are enabled)
   *
   * @param {string} soundType - Type of sound: 'success', 'error', 'click'
   */
  function playSound(soundType) {
    if (!state.soundEnabled) return;

    // Sound implementation would go here
    // For now, this is a placeholder for future audio support
    console.log(`[Sound] ${soundType}`);
  }

  /**
   * Enable or disable sound effects
   *
   * @param {boolean} enabled - Whether to enable sounds
   */
  function setSoundEnabled(enabled) {
    state.soundEnabled = Boolean(enabled);
  }


  /* ==========================================================================
     PUBLIC API
     ========================================================================== */

  return {
    // Configuration
    config: CONFIG,

    // Notifications
    notify: showNotification,
    dismissNotification: dismissNotification,
    clearAllNotifications: clearAllNotifications,

    // Dialogs
    showDialog: showDialog,
    confirm: confirm,
    alert: alert,

    // Health Bars
    updateHealth: updateHealthBar,
    createHealthBar: createHealthBar,

    // Stat Boxes
    createStatBox: createStatBox,
    updateStatBox: updateStatBox,

    // Loading
    showLoading: showLoading,
    hideLoading: hideLoading,

    // Animations
    shake: shake,
    glow: glow,
    blink: blink,

    // Forms
    setFormError: setFormError,
    clearFormError: clearFormError,
    validateForm: validateForm,

    // Utilities
    escapeHTML: escapeHTML,
    playSound: playSound,
    setSoundEnabled: setSoundEnabled,
  };
})();

// Export for module systems (if available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RetroUI;
}

// Console greeting
console.log(
  '%c⚔️ Crown and Skull Retro UI v1.0.0',
  'font-family: monospace; font-size: 14px; color: #00ff9f; background: #000; padding: 8px;'
);
console.log(
  '%cRetroUI utilities loaded. Use RetroUI.notify(), RetroUI.showDialog(), etc.',
  'font-family: monospace; color: #ffd700; background: #000; padding: 4px;'
);
