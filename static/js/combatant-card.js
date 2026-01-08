/**
 * CombatantCard Component
 *
 * A reusable component for displaying and managing combatant information in a combat tracker.
 * Handles HP modifications, status effects, and emits custom events for parent components to handle.
 *
 * @module CombatantCard
 */

/**
 * Creates a combatant card element with interactive controls
 *
 * @param {Object} combatant - The combatant data
 * @param {string} combatant.id - Unique identifier for the combatant
 * @param {string} combatant.name - Display name of the combatant
 * @param {string} combatant.type - Type of combatant ('PC' or 'Enemy')
 * @param {number[]} combatant.phases - Phases the combatant acts in (1-5)
 * @param {number} combatant.defense - Defense value
 * @param {number} [combatant.atk=0] - ATK value (enemy penalty to player defense rolls)
 * @param {number} [combatant.def=0] - DEF value (reduces incoming damage)
 * @param {Array} [combatant.inventory=[]] - Inventory items (skills and equipment)
 * @param {string[]} [combatant.statuses=[]] - Array of status effect names
 * @param {boolean} [combatant.isActive=false] - Whether this combatant is currently active
 * @param {boolean} [combatant.hitToHeart=false] - Whether combatant has been hit to heart
 * @returns {HTMLElement} The combatant card element
 *
 * @fires inventory-change - Dispatched when inventory is modified
 * @fires combatant-delete - Dispatched when delete button is clicked
 * @fires status-remove - Dispatched when a status effect is removed
 *
 * @example
 * const combatant = {
 *   id: 'warrior-1',
 *   name: 'Aragorn',
 *   type: 'PC',
 *   phases: [2],
 *   defense: 14,
 *   inventory: ['Longsword', 'Shield', 'Muscle'],
 *   statuses: ['Blessed'],
 *   isActive: true
 * };
 *
 * const card = createCombatantCard(combatant);
 * card.addEventListener('inventory-change', (e) => {
 *   console.log('Inventory changed:', e.detail);
 * });
 * document.body.appendChild(card);
 */
export function createCombatantCard(combatant) {
  const {
    id,
    name,
    type,
    phases,
    defense,
    statuses = [],
    isActive = false
  } = combatant;

  // Validate required fields
  if (!id || !name || !phases || !phases.length || defense === undefined) {
    throw new Error('CombatantCard requires id, name, phases, and defense');
  }

  // Create the card container
  const card = document.createElement('div');
  card.className = 'combatant-card';
  card.dataset.combatantId = id;

  if (isActive) {
    card.classList.add('active');
  }

  // Build the card structure
  card.innerHTML = buildCardHTML(combatant);

  // Set up event delegation
  setupEventHandlers(card, combatant);

  return card;
}

/**
 * Builds the HTML structure for the combatant card
 *
 * @private
 * @param {Object} combatant - The combatant data
 * @returns {string} HTML string for the card content
 */
function buildCardHTML(combatant) {
  const {
    name,
    type,
    phases,
    defense,
    atk = 0,
    def = 0,
    inventory = [],
    statuses = [],
    hitToHeart = false
  } = combatant;

  const typeBadgeClass = type === 'PC' ? 'type-badge type-badge--pc' : 'type-badge type-badge--enemy';
  const phasesDisplay = phases.join(', ');
  const isEnemy = type === 'Enemy';

  return `
    <div class="combatant-card__header">
      <div class="combatant-card__title-row">
        <h3 class="combatant-card__name">${escapeHtml(name)}</h3>
        <span class="${typeBadgeClass}">${type}</span>
      </div>
      <button class="combatant-card__delete-btn"
              type="button"
              aria-label="Delete ${escapeHtml(name)}"
              title="Delete combatant">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="combatant-card__stats">
      <div class="combatant-card__stat">
        <span class="combatant-card__stat-label">Phase${phases.length > 1 ? 's' : ''}</span>
        <span class="combatant-card__stat-value">${phasesDisplay}</span>
      </div>
      <div class="combatant-card__stat">
        <span class="combatant-card__stat-label">Defense</span>
        <span class="combatant-card__stat-value">${defense}</span>
      </div>
      ${isEnemy ? `
        <div class="combatant-card__stat">
          <span class="combatant-card__stat-label">ATK</span>
          <span class="combatant-card__stat-value">${atk}</span>
        </div>
        <div class="combatant-card__stat">
          <span class="combatant-card__stat-label">DEF</span>
          <span class="combatant-card__stat-value">${def}</span>
        </div>
      ` : ''}
    </div>

    ${hitToHeart ? `
      <div class="combatant-card__death-warning">
        ⚠️ Hit to Heart! Dies at end of Phase 5 unless healed!
      </div>
    ` : ''}

    <div class="combatant-card__inventory-section">
      <div class="combatant-card__inventory-label">
        Inventory (${inventory.length}/20)
        ${type === 'PC' ? '<small>Skills & Equipment</small>' : ''}
      </div>
      <div class="combatant-card__inventory-info">
        ${inventory.length === 0
          ? '<em>No inventory items (vulnerable to death!)</em>'
          : `${inventory.length} item${inventory.length !== 1 ? 's' : ''} remaining`}
      </div>
      <div class="combatant-card__inventory-note">
        <small>Track attrition by crossing off items when damaged</small>
      </div>
    </div>

    ${statuses.length > 0 ? buildStatusesHTML(statuses) : ''}
  `;
}

/**
 * Builds the HTML for the status effects section
 *
 * @private
 * @param {string[]} statuses - Array of status effect names
 * @returns {string} HTML string for status effects
 */
function buildStatusesHTML(statuses) {
  const statusTags = statuses.map(status => `
    <span class="status-tag">
      ${escapeHtml(status)}
      <button class="status-tag__remove-btn"
              type="button"
              data-status="${escapeHtml(status)}"
              aria-label="Remove ${escapeHtml(status)} status"
              title="Remove status">
        <span aria-hidden="true">&times;</span>
      </button>
    </span>
  `).join('');

  return `
    <div class="combatant-card__statuses">
      <div class="combatant-card__statuses-label">Status Effects</div>
      <div class="combatant-card__statuses-list">
        ${statusTags}
      </div>
    </div>
  `;
}

/**
 * Sets up event handlers using event delegation
 *
 * @private
 * @param {HTMLElement} card - The card element
 * @param {Object} combatant - The combatant data
 */
function setupEventHandlers(card, combatant) {
  card.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    // Handle status removal
    if (target.classList.contains('status-tag__remove-btn')) {
      const status = target.dataset.status;
      dispatchStatusRemoveEvent(card, combatant.id, status);
    }

    // Handle combatant deletion
    else if (target.classList.contains('combatant-card__delete-btn')) {
      dispatchDeleteEvent(card, combatant.id);
    }
  });
}

/**
 * Dispatches a custom inventory-change event
 *
 * @private
 * @param {HTMLElement} card - The card element
 * @param {string} id - Combatant ID
 * @param {Array} inventory - The new inventory array
 */
function dispatchInventoryChangeEvent(card, id, inventory) {
  const event = new CustomEvent('inventory-change', {
    bubbles: true,
    detail: { id, inventory }
  });
  card.dispatchEvent(event);
}

/**
 * Dispatches a custom combatant-delete event
 *
 * @private
 * @param {HTMLElement} card - The card element
 * @param {string} id - Combatant ID
 */
function dispatchDeleteEvent(card, id) {
  const event = new CustomEvent('combatant-delete', {
    bubbles: true,
    detail: { id }
  });
  card.dispatchEvent(event);
}

/**
 * Dispatches a custom status-remove event
 *
 * @private
 * @param {HTMLElement} card - The card element
 * @param {string} id - Combatant ID
 * @param {string} status - Status effect name to remove
 */
function dispatchStatusRemoveEvent(card, id, status) {
  const event = new CustomEvent('status-remove', {
    bubbles: true,
    detail: { id, status }
  });
  card.dispatchEvent(event);
}

/**
 * Clamps a value between a minimum and maximum
 *
 * @private
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} The clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Escapes HTML special characters to prevent XSS
 *
 * @private
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Updates an existing combatant card with new data
 *
 * @param {HTMLElement} card - The card element to update
 * @param {Object} combatant - The updated combatant data
 *
 * @example
 * const card = document.querySelector('[data-combatant-id="warrior-1"]');
 * updateCombatantCard(card, {
 *   id: 'warrior-1',
 *   name: 'Aragorn',
 *   type: 'PC',
 *   phases: [2],
 *   defense: 14,
 *   inventory: ['Longsword', 'Shield'],
 *   statuses: ['Blessed'],
 *   isActive: false
 * });
 */
export function updateCombatantCard(card, combatant) {
  if (!card) {
    throw new Error('Card element is required');
  }

  // Update active state
  if (combatant.isActive) {
    card.classList.add('active');
  } else {
    card.classList.remove('active');
  }

  // For more complex updates, rebuild the card content
  card.innerHTML = buildCardHTML(combatant);
  setupEventHandlers(card, combatant);
}
