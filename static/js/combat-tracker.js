/**
 * CombatTracker - Main Controller
 *
 * Orchestrates the entire combat tracking application. Manages state, coordinates
 * between components (CombatantCard and StatusManager), handles user interactions,
 * and persists combat state to localStorage.
 *
 * @module CombatTracker
 */

import { createCombatantCard } from './combatant-card.js';
import { createStatusManager } from './status-manager.js';

/**
 * LocalStorage key for persisting combat state
 * @constant {string}
 */
const STORAGE_KEY = 'cncphaser_combat_state';

/**
 * Maximum combatant name length
 * @constant {number}
 */
const MAX_NAME_LENGTH = 50;

/**
 * Creates and initializes the Combat Tracker application
 *
 * @returns {Object} Public API for the combat tracker
 *
 * @example
 * const tracker = createCombatTracker();
 * // The tracker automatically initializes and restores state
 */
export function createCombatTracker() {
  // Cache all DOM element references upfront
  const elements = cacheDOMElements();

  // Initialize combat state
  const state = initializeState();

  // Set up all event listeners
  bindEventHandlers(elements, state);

  // Restore previous state if available
  restoreStateFromStorage(state, elements);

  // Initial render
  render(state, elements);

  // Return public API
  return {
    getState: () => ({ ...state }),
    reset: () => resetCombat(state, elements),
    addCombatant: (combatant) => addCombatant(combatant, state, elements),
    nextPhase: () => advanceToNextPhase(state, elements)
  };
}

/**
 * Caches all required DOM element references for efficient access
 *
 * @private
 * @returns {Object} Object containing all cached DOM elements
 */
function cacheDOMElements() {
  const elements = {
    roundDisplay: document.getElementById('round-display'),
    phaseDisplay: document.getElementById('phase-display'),
    addCombatantBtn: document.getElementById('add-combatant-btn'),
    formContainer: document.getElementById('add-combatant-form'),
    form: document.getElementById('new-combatant-form'),
    cancelBtn: document.getElementById('cancel-add-btn'),
    nextPhaseBtn: document.getElementById('next-phase-btn'),
    resetBtn: document.getElementById('reset-combat-btn'),
    combatantsList: document.getElementById('combatants-list'),
    emptyState: document.getElementById('empty-state')
  };

  // Validate that all required elements exist
  const missingElements = Object.entries(elements)
    .filter(([key, element]) => !element)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error(
      'CombatTracker: Missing required DOM elements:',
      missingElements.join(', ')
    );
  }

  return elements;
}

/**
 * Initializes the combat state with default values
 *
 * @private
 * @returns {Object} Initial state object
 */
function initializeState() {
  return {
    round: 1,
    currentPhase: 1,
    combatants: []
  };
}

/**
 * Binds all event handlers for the application
 *
 * @private
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Combat state
 */
function bindEventHandlers(elements, state) {
  // Show add combatant form
  elements.addCombatantBtn?.addEventListener('click', () => {
    showAddCombatantForm(elements);
  });

  // Hide add combatant form
  elements.cancelBtn?.addEventListener('click', () => {
    hideAddCombatantForm(elements);
  });

  // Handle form submission
  elements.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit(event.target, state, elements);
  });

  // Advance to next phase
  elements.nextPhaseBtn?.addEventListener('click', () => {
    advanceToNextPhase(state, elements);
  });

  // Reset combat
  elements.resetBtn?.addEventListener('click', () => {
    resetCombat(state, elements);
  });

  // Set up event delegation for combatant interactions
  elements.combatantsList?.addEventListener('inventory-change', (event) => {
    handleInventoryChange(event.detail, state, elements);
  });

  elements.combatantsList?.addEventListener('status-add', (event) => {
    handleStatusAdd(event.detail, state, elements);
  });

  elements.combatantsList?.addEventListener('status-remove', (event) => {
    handleStatusRemove(event.detail, state, elements);
  });

  elements.combatantsList?.addEventListener('combatant-delete', (event) => {
    handleCombatantDelete(event.detail, state, elements);
  });
}

/**
 * Shows the add combatant form
 *
 * @private
 * @param {Object} elements - Cached DOM elements
 */
function showAddCombatantForm(elements) {
  if (!elements.formContainer) return;

  elements.formContainer.classList.remove('hidden');

  // Focus the first input field
  const firstInput = elements.form?.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

/**
 * Hides the add combatant form and resets it
 *
 * @private
 * @param {Object} elements - Cached DOM elements
 */
function hideAddCombatantForm(elements) {
  if (!elements.formContainer) return;

  elements.formContainer.classList.add('hidden');
  elements.form?.reset();
}

/**
 * Handles form submission to add a new combatant
 *
 * @private
 * @param {HTMLFormElement} form - The form element
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function handleFormSubmit(form, state, elements) {
  // Extract form data
  const formData = new FormData(form);
  const combatantData = extractCombatantData(formData);

  // Validate combatant data
  if (!isValidCombatant(combatantData)) {
    console.error('CombatTracker: Invalid combatant data');
    return;
  }

  // Add the combatant
  addCombatant(combatantData, state, elements);

  // Reset and hide form
  form.reset();
  hideAddCombatantForm(elements);
}

/**
 * Extracts combatant data from form data
 *
 * @private
 * @param {FormData} formData - The form data
 * @returns {Object} Combatant data object
 */
function extractCombatantData(formData) {
  const name = formData.get('name')?.trim() || '';
  const type = formData.get('type') || 'PC';
  const phaseInput = formData.get('phase')?.trim() || '1';
  const defense = parseInt(formData.get('defense'), 10) || 10;
  const atk = parseInt(formData.get('atk'), 10) || 0;
  const def = parseInt(formData.get('def'), 10) || 0;

  // Parse phases - can be single number or comma-separated for enemies
  const phases = phaseInput.split(',').map(p => parseInt(p.trim(), 10)).filter(p => p >= 1 && p <= 5);

  // Create default inventory (20 slots for PCs, calculated for enemies)
  const inventorySize = type === 'PC' ? 20 : 20; // Default 20, can be customized
  const inventory = Array(inventorySize).fill('INV');

  return {
    id: generateUniqueId(),
    name: name.substring(0, MAX_NAME_LENGTH),
    type: type,
    phases: phases,
    defense: defense,
    atk: atk,
    def: def,
    inventory: inventory,
    statuses: [],
    hitToHeart: false,
    deathPhase: null
  };
}

/**
 * Validates combatant data
 *
 * @private
 * @param {Object} combatant - Combatant data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCombatant(combatant) {
  return (
    combatant.name.length > 0 &&
    combatant.phases && combatant.phases.length > 0 &&
    Number.isFinite(combatant.defense)
  );
}

/**
 * Adds a new combatant to the combat tracker
 *
 * @private
 * @param {Object} combatantData - The combatant to add
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function addCombatant(combatantData, state, elements) {
  // Add to state
  state.combatants.push(combatantData);

  // Sort by phase (lowest first)
  sortCombatantsByPhase(state);

  // Reset phase to 1 when adding first combatant
  if (state.combatants.length === 1) {
    state.currentPhase = 1;
    state.round = 1;
  }

  // Save and render
  saveStateToStorage(state);
  render(state, elements);
}

/**
 * Sorts combatants by their first phase
 *
 * @private
 * @param {Object} state - Combat state
 */
function sortCombatantsByPhase(state) {
  state.combatants.sort((a, b) => {
    // Sort by lowest phase first
    const aPhase = Math.min(...a.phases);
    const bPhase = Math.min(...b.phases);

    if (aPhase !== bPhase) {
      return aPhase - bPhase;
    }

    // If phase is tied, maintain existing order (stable sort)
    return 0;
  });
}

/**
 * Advances to the next phase in combat
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function advanceToNextPhase(state, elements) {
  if (state.combatants.length === 0) {
    return;
  }

  // Move to next phase
  state.currentPhase++;

  // Check if we've wrapped around to a new round
  if (state.currentPhase > 5) {
    state.currentPhase = 1;
    state.round++;

    // Check for death at end of phase 5
    checkForDeaths(state, elements);
  }

  // Save and render
  saveStateToStorage(state);
  render(state, elements);
}

/**
 * Checks for combatants who should die at end of phase 5
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function checkForDeaths(state, elements) {
  state.combatants.forEach(combatant => {
    if (combatant.hitToHeart && combatant.deathPhase === state.round - 1) {
      // Mark as dead
      if (!combatant.statuses.includes('Dead')) {
        combatant.statuses.push('Dead');
      }
    }
  });
}

/**
 * Resets the entire combat tracker
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function resetCombat(state, elements) {
  // Confirm before resetting
  const confirmed = confirm(
    'Are you sure you want to reset combat? This will remove all combatants and start over.'
  );

  if (!confirmed) {
    return;
  }

  // Reset state
  state.round = 1;
  state.currentPhase = 1;
  state.combatants = [];

  // Clear storage and render
  clearStorage();
  render(state, elements);
}

/**
 * Handles inventory changes (attrition) from combatant cards
 *
 * @private
 * @param {Object} detail - Event detail containing id and inventory changes
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function handleInventoryChange(detail, state, elements) {
  const { id, inventory } = detail;

  // Find and update the combatant
  const combatant = findCombatantById(state, id);
  if (!combatant) {
    console.error(`CombatTracker: Combatant not found: ${id}`);
    return;
  }

  // Update inventory
  combatant.inventory = inventory;

  // Check if hit to heart (no inventory left)
  if (inventory.length === 0 && !combatant.hitToHeart) {
    combatant.hitToHeart = true;
    combatant.deathPhase = state.round;
    combatant.statuses.push('Hit to Heart');
  }

  // Save to storage
  saveStateToStorage(state);
  render(state, elements);
}

/**
 * Handles status addition events
 *
 * @private
 * @param {Object} detail - Event detail containing combatantId and status
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function handleStatusAdd(detail, state, elements) {
  const { combatantId, status } = detail;

  // Find the combatant
  const combatant = findCombatantById(state, combatantId);
  if (!combatant) {
    console.error(`CombatTracker: Combatant not found: ${combatantId}`);
    return;
  }

  // Add status if not already present
  if (!combatant.statuses.includes(status)) {
    combatant.statuses.push(status);
    saveStateToStorage(state);
  }
}

/**
 * Handles status removal events
 *
 * @private
 * @param {Object} detail - Event detail containing id/combatantId and status
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function handleStatusRemove(detail, state, elements) {
  // Support both 'id' and 'combatantId' for compatibility
  const combatantId = detail.combatantId || detail.id;
  const { status } = detail;

  // Find the combatant
  const combatant = findCombatantById(state, combatantId);
  if (!combatant) {
    console.error(`CombatTracker: Combatant not found: ${combatantId}`);
    return;
  }

  // Remove status
  const statusIndex = combatant.statuses.indexOf(status);
  if (statusIndex !== -1) {
    combatant.statuses.splice(statusIndex, 1);
    saveStateToStorage(state);
    render(state, elements);
  }
}

/**
 * Handles combatant deletion events
 *
 * @private
 * @param {Object} detail - Event detail containing id
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function handleCombatantDelete(detail, state, elements) {
  const { id } = detail;

  // Find combatant index
  const index = state.combatants.findIndex(c => c.id === id);
  if (index === -1) {
    console.error(`CombatTracker: Combatant not found: ${id}`);
    return;
  }

  // Remove the combatant
  state.combatants.splice(index, 1);

  // Reset if last combatant removed
  if (state.combatants.length === 0) {
    state.currentPhase = 1;
    state.round = 1;
  }

  // Save and render
  saveStateToStorage(state);
  render(state, elements);
}

/**
 * Finds a combatant by ID
 *
 * @private
 * @param {Object} state - Combat state
 * @param {string} id - Combatant ID
 * @returns {Object|undefined} The combatant if found
 */
function findCombatantById(state, id) {
  return state.combatants.find(c => c.id === id);
}

/**
 * Renders the entire combat tracker UI
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function render(state, elements) {
  updateRoundDisplay(state, elements);
  updateCombatantsList(state, elements);
  updateEmptyState(state, elements);
  updateControlsState(state, elements);
  renderPhaseMap(state);
}

/**
 * Updates the round and phase display
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function updateRoundDisplay(state, elements) {
  if (elements.roundDisplay) {
    elements.roundDisplay.textContent = `${state.round}`;
  }

  if (elements.phaseDisplay) {
    elements.phaseDisplay.textContent = `${state.currentPhase}`;
  }
}

/**
 * Updates the combatants list
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function updateCombatantsList(state, elements) {
  if (!elements.combatantsList) return;

  // Clear existing content
  elements.combatantsList.innerHTML = '';

  // Render each combatant
  state.combatants.forEach((combatant) => {
    // Check if combatant acts in current phase
    const isActive = combatant.phases.includes(state.currentPhase);

    // Create combatant container
    const container = createCombatantContainer(combatant, isActive);

    // Create and append combatant card
    const card = createCombatantCard({
      ...combatant,
      isActive,
      currentPhase: state.currentPhase
    });

    // Create and append status manager
    const statusManager = createStatusManager({
      combatantId: combatant.id,
      statuses: combatant.statuses
    });

    container.appendChild(card);
    container.appendChild(statusManager);
    elements.combatantsList.appendChild(container);
  });
}

/**
 * Creates a container for a combatant and its status manager
 *
 * @private
 * @param {Object} combatant - Combatant data
 * @param {boolean} isActive - Whether this combatant is active
 * @returns {HTMLElement} Container element
 */
function createCombatantContainer(combatant, isActive) {
  const container = document.createElement('div');
  container.className = 'combatant-container';
  container.dataset.combatantId = combatant.id;

  if (isActive) {
    container.classList.add('combatant-container--active');
  }

  return container;
}

/**
 * Updates the empty state visibility
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function updateEmptyState(state, elements) {
  if (!elements.emptyState) return;

  const isEmpty = state.combatants.length === 0;
  elements.emptyState.style.display = isEmpty ? 'block' : 'none';
}

/**
 * Updates the state of control buttons
 *
 * @private
 * @param {Object} state - Combat state
 * @param {Object} elements - Cached DOM elements
 */
function updateControlsState(state, elements) {
  const hasCombatants = state.combatants.length > 0;

  // Enable/disable next phase button
  if (elements.nextPhaseBtn) {
    elements.nextPhaseBtn.disabled = !hasCombatants;
  }

  // Enable/disable reset button
  if (elements.resetBtn) {
    elements.resetBtn.disabled = !hasCombatants;
  }
}

/**
 * Saves combat state to localStorage
 *
 * @private
 * @param {Object} state - Combat state to save
 */
function saveStateToStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('CombatTracker: Failed to save state to localStorage', error);
  }
}

/**
 * Restores combat state from localStorage
 *
 * @private
 * @param {Object} state - Combat state object to populate
 * @param {Object} elements - Cached DOM elements
 */
function restoreStateFromStorage(state, elements) {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);

    if (!serializedState) {
      return;
    }

    const savedState = JSON.parse(serializedState);

    // Validate saved state structure
    if (!isValidSavedState(savedState)) {
      console.warn('CombatTracker: Invalid saved state, ignoring');
      clearStorage();
      return;
    }

    // Restore state
    state.round = savedState.round;
    state.currentPhase = savedState.currentPhase || 1;
    state.combatants = savedState.combatants;

    // Ensure currentPhase is valid
    if (state.currentPhase < 1 || state.currentPhase > 5) {
      state.currentPhase = 1;
    }

  } catch (error) {
    console.error('CombatTracker: Failed to restore state from localStorage', error);
    clearStorage();
  }
}

/**
 * Validates saved state structure
 *
 * @private
 * @param {*} savedState - The saved state to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidSavedState(savedState) {
  return (
    savedState &&
    typeof savedState === 'object' &&
    typeof savedState.round === 'number' &&
    typeof savedState.currentPhase === 'number' &&
    Array.isArray(savedState.combatants)
  );
}

/**
 * Clears saved state from localStorage
 *
 * @private
 */
function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('CombatTracker: Failed to clear localStorage', error);
  }
}

/**
 * Generates a unique identifier for combatants
 *
 * @private
 * @returns {string} Unique identifier
 */
function generateUniqueId() {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback to timestamp + random number
  return `combatant_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
 * Checks for and handles pending combatant from sessionStorage
 * Used for quick-add from Enemy Manager
 *
 * @private
 * @param {Object} tracker - Combat tracker instance
 */
function handlePendingCombatant(tracker) {
  try {
    const pending = sessionStorage.getItem('pending_combatant');
    if (pending) {
      const combatant = JSON.parse(pending);
      tracker.addCombatant(combatant);
      sessionStorage.removeItem('pending_combatant');
    }
  } catch (error) {
    console.error('Failed to handle pending combatant:', error);
    sessionStorage.removeItem('pending_combatant');
  }
}

/**
 * Renders the phase map showing which combatants are in which phase
 *
 * @private
 * @param {Object} state - Combat state
 */
function renderPhaseMap(state) {
  // Clear all phase columns
  for (let phase = 1; phase <= 5; phase++) {
    const phaseColumn = document.querySelector(`.phase-column[data-phase="${phase}"]`);
    const combatantsContainer = document.getElementById(`phase-combatants-${phase}`);

    if (phaseColumn && combatantsContainer) {
      // Highlight active phase
      if (phase === state.currentPhase) {
        phaseColumn.classList.add('phase-active');
      } else {
        phaseColumn.classList.remove('phase-active');
      }

      // Clear and repopulate combatants
      combatantsContainer.innerHTML = '';

      state.combatants.forEach(combatant => {
        if (combatant.phases.includes(phase)) {
          const chip = document.createElement('div');
          chip.className = `phase-combatant-chip ${combatant.type.toLowerCase()}`;
          chip.title = combatant.name;

          const initial = document.createElement('div');
          initial.className = 'phase-combatant-initial';
          initial.textContent = combatant.name.charAt(0).toUpperCase();

          const name = document.createElement('span');
          name.textContent = combatant.name.length > 10 ?
            combatant.name.substring(0, 10) + '...' :
            combatant.name;

          chip.appendChild(initial);
          chip.appendChild(name);
          combatantsContainer.appendChild(chip);
        }
      });
    }
  }
}

// Initialize combat tracker on page load
document.addEventListener('DOMContentLoaded', async () => {
  const tracker = createCombatTracker();
  handlePendingCombatant(tracker);

  // Load enemies data for search
  let enemiesData = null;
  try {
    const response = await fetch('/static/data/enemies.json');
    enemiesData = await response.json();
  } catch (error) {
    console.error('Failed to load enemies data:', error);
  }

  // Player Management Modal Handlers
  const managePlayersBtn = document.getElementById('manage-players-btn');
  const playerManagementModal = document.getElementById('player-management-modal');
  const createPlayerBtn = document.getElementById('create-new-player-btn');
  const playerFormModal = document.getElementById('player-form-modal');
  const playerForm = document.getElementById('player-form');

  managePlayersBtn?.addEventListener('click', () => {
    renderSavedPlayers();
    playerManagementModal?.classList.remove('hidden');
  });

  createPlayerBtn?.addEventListener('click', () => {
    playerManagementModal?.classList.add('hidden');
    document.getElementById('player-form-title').textContent = 'Create Player';
    playerForm?.reset();
    playerForm?.removeAttribute('data-player-id');
    playerFormModal?.classList.remove('hidden');
  });

  playerForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(playerForm);
    const player = {
      id: playerForm.dataset.playerId || null,
      name: formData.get('name'),
      phase: parseInt(formData.get('phase'), 10),
      defense: parseInt(formData.get('defense'), 10),
      inventory: parseInt(formData.get('inventory'), 10)
    };

    const saved = savePlayerData(player);

    if (saved) {
      // Close form modal
      playerFormModal?.classList.add('hidden');
      // Reset form
      playerForm?.reset();
      playerForm?.removeAttribute('data-player-id');
      // Show management modal with updated list
      renderSavedPlayers();
      playerManagementModal?.classList.remove('hidden');
    }
  });

  // Load Players Modal
  const loadPlayersBtn = document.getElementById('load-players-btn');
  const loadPlayersModal = document.getElementById('load-players-modal');
  const loadSelectedBtn = document.getElementById('load-selected-players-btn');

  loadPlayersBtn?.addEventListener('click', () => {
    renderLoadPlayersList();
    loadPlayersModal?.classList.remove('hidden');
  });

  loadSelectedBtn?.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.player-item-checkbox:checked');
    const players = getSavedPlayersData();

    checkboxes.forEach(checkbox => {
      const playerId = checkbox.value;
      const player = players.find(p => p.id === playerId);
      if (player) {
        const combatant = playerToCombatantData(player);
        tracker.addCombatant(combatant);
      }
    });

    loadPlayersModal?.classList.add('hidden');
  });

  // Enemy Search Modal
  const searchEnemyBtn = document.getElementById('search-enemy-btn');
  const enemySearchModal = document.getElementById('enemy-search-modal');
  const enemySearchInput = document.getElementById('enemy-quick-search');
  const searchResults = document.getElementById('enemy-search-results');

  searchEnemyBtn?.addEventListener('click', () => {
    enemySearchModal?.classList.remove('hidden');
    enemySearchInput?.focus();
    renderEnemySearchResults('', enemiesData);
  });

  enemySearchInput?.addEventListener('input', (e) => {
    renderEnemySearchResults(e.target.value, enemiesData);
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = btn.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // Click outside to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // Override the render function to include phase map
  const originalRender = render;
  window.renderWithPhaseMap = function(state, elements) {
    originalRender(state, elements);
    renderPhaseMap(state);
  };
});

// Player management helper functions
function getSavedPlayersData() {
  try {
    const stored = localStorage.getItem('cncphaser_saved_players');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load players:', error);
    return [];
  }
}

function savePlayerData(player) {
  try {
    const players = getSavedPlayersData();

    if (player.id) {
      const index = players.findIndex(p => p.id === player.id);
      if (index !== -1) {
        players[index] = player;
      }
    } else {
      player.id = `player_${Date.now()}`;
      players.push(player);
    }

    localStorage.setItem('cncphaser_saved_players', JSON.stringify(players));
    return player;
  } catch (error) {
    console.error('Failed to save player:', error);
    return null;
  }
}

function deletePlayerData(playerId) {
  try {
    const players = getSavedPlayersData();
    const filtered = players.filter(p => p.id !== playerId);
    localStorage.setItem('cncphaser_saved_players', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete player:', error);
    return false;
  }
}

function playerToCombatantData(player) {
  return {
    id: generateUniqueId(),
    name: player.name,
    type: 'PC',
    phases: [player.phase],
    defense: player.defense,
    atk: 0,
    def: 0,
    inventory: Array(player.inventory || 20).fill('INV'),
    statuses: [],
    hitToHeart: false,
    deathPhase: null
  };
}

function renderSavedPlayers() {
  const container = document.getElementById('saved-players-list');
  if (!container) return;

  const players = getSavedPlayersData();

  if (players.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">No saved players. Create one to get started!</p>';
    return;
  }

  container.innerHTML = players.map(player => `
    <div class="player-item">
      <div class="player-item-info">
        <div class="player-item-name">${escapeHtml(player.name)}</div>
        <div class="player-item-stats">Phase ${player.phase} | Defense ${player.defense} | ${player.inventory} Inventory</div>
      </div>
      <div class="player-item-actions">
        <button class="btn-sm" onclick="editPlayer('${player.id}')">Edit</button>
        <button class="btn-sm btn-danger" onclick="removePlayer('${player.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderLoadPlayersList() {
  const container = document.getElementById('load-players-list');
  if (!container) return;

  const players = getSavedPlayersData();

  if (players.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">No saved players. Create some first!</p>';
    return;
  }

  container.innerHTML = players.map(player => `
    <div class="player-item">
      <input type="checkbox" class="player-item-checkbox" value="${player.id}"/>
      <div class="player-item-info">
        <div class="player-item-name">${escapeHtml(player.name)}</div>
        <div class="player-item-stats">Phase ${player.phase} | Defense ${player.defense}</div>
      </div>
    </div>
  `).join('');
}

function renderEnemySearchResults(query, enemiesData) {
  const container = document.getElementById('enemy-search-results');
  if (!container || !enemiesData) return;

  const searchLower = query.toLowerCase();
  const filtered = enemiesData.enemies.filter(enemy =>
    enemy.name.toLowerCase().includes(searchLower) ||
    (enemy.category && enemy.category.toLowerCase().includes(searchLower))
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding:16px; color: var(--color-text-muted);">No enemies found</p>';
    return;
  }

  container.innerHTML = filtered.slice(0, 20).map(enemy => {
    const hpDisplay = typeof enemy.hp === 'number' ? enemy.hp :
      (enemy.hp.base ? enemy.hp.base : '?');
    const phases = Array.isArray(enemy.phases) ? enemy.phases.join(',') : enemy.phases;

    return `
      <div class="search-result-item" data-enemy-id="${enemy.id}">
        <div class="search-result-name">${escapeHtml(enemy.name)}</div>
        <div class="search-result-stats">
          HP: ${hpDisplay} | ATK: ${enemy.atk} | DEF: ${enemy.def} | Phase: ${phases}
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  container.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const enemyId = item.dataset.enemyId;
      const enemy = enemiesData.enemies.find(e => e.id === enemyId);
      if (enemy) {
        fillFormWithEnemy(enemy);
        document.getElementById('enemy-search-modal')?.classList.add('hidden');
      }
    });
  });
}

function fillFormWithEnemy(enemy) {
  // Calculate actual HP for inventory
  let actualHP = 20; // default
  if (typeof enemy.hp === 'number') {
    actualHP = enemy.hp;
  } else if (enemy.hp && enemy.hp.base) {
    actualHP = enemy.hp.base;
  }

  // Auto-fill the add combatant form
  const nameInput = document.getElementById('combatant-name');
  const typeSelect = document.getElementById('combatant-type');
  const phaseInput = document.getElementById('combatant-phase');
  const defenseInput = document.getElementById('combatant-defense');
  const atkInput = document.getElementById('combatant-atk');
  const defInput = document.getElementById('combatant-def');

  if (nameInput) nameInput.value = enemy.name;
  if (typeSelect) typeSelect.value = 'Enemy';

  const phases = Array.isArray(enemy.phases) ? enemy.phases.join(',') : String(enemy.phases);
  if (phaseInput) phaseInput.value = phases;

  const defense = 6 + (enemy.def || 0);
  if (defenseInput) defenseInput.value = defense;
  if (atkInput) atkInput.value = enemy.atk || 0;
  if (defInput) defInput.value = enemy.def || 0;

  // Show the form
  const form = document.getElementById('add-combatant-form');
  if (form) {
    form.classList.remove('hidden');
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Focus on name field
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 100);
  }
}

// Global functions for inline handlers
window.editPlayer = function(playerId) {
  const players = getSavedPlayersData();
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  document.getElementById('player-form-title').textContent = 'Edit Player';
  document.getElementById('player-name').value = player.name;
  document.getElementById('player-phase').value = player.phase;
  document.getElementById('player-defense').value = player.defense;
  document.getElementById('player-inventory').value = player.inventory;

  const form = document.getElementById('player-form');
  form.dataset.playerId = player.id;

  document.getElementById('player-management-modal')?.classList.add('hidden');
  document.getElementById('player-form-modal')?.classList.remove('hidden');
};

window.removePlayer = function(playerId) {
  if (confirm('Delete this player?')) {
    deletePlayerData(playerId);
    renderSavedPlayers();
  }
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
