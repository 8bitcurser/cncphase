/**
 * StatusManager Component
 *
 * A reusable component for managing status effects on combatants.
 * Provides a clean interface for adding/removing predefined or custom statuses.
 *
 * @module StatusManager
 */

/**
 * Predefined status effects available in the dropdown
 * @constant {string[]}
 */
const PREDEFINED_STATUSES = [
  'Stunned',
  'Prone',
  'Blinded',
  'Poisoned',
  'Restrained',
  'Unconscious'
];

/**
 * Special value representing the custom status option
 * @constant {string}
 */
const CUSTOM_STATUS_VALUE = '__custom__';

/**
 * Creates a StatusManager component for managing combatant status effects
 *
 * @param {Object} options - Configuration options
 * @param {string} options.combatantId - Unique identifier for the combatant
 * @param {string[]} [options.statuses=[]] - Initial status effects to display
 *
 * @returns {HTMLElement} The status manager container element
 *
 * @fires status-add - Fired when a status is added
 * @fires status-remove - Fired when a status is removed
 *
 * @example
 * const statusManager = createStatusManager({
 *   combatantId: 'combatant-123',
 *   statuses: ['Stunned', 'Prone']
 * });
 *
 * document.querySelector('.combatant-card').appendChild(statusManager);
 *
 * // Listen for status changes
 * statusManager.addEventListener('status-add', (e) => {
 *   console.log('Added:', e.detail); // { combatantId, status }
 * });
 */
function createStatusManager(options = {}) {
  const {
    combatantId = '',
    statuses = []
  } = options;

  // Validate required options
  if (!combatantId) {
    console.error('StatusManager: combatantId is required');
  }

  // Create the main container
  const container = createContainer();

  // Create and append child elements
  const controlsSection = createControlsSection();
  const statusListSection = createStatusListSection();

  container.appendChild(controlsSection);
  container.appendChild(statusListSection);

  // Cache DOM references for efficient access
  const elements = {
    container,
    statusSelect: controlsSection.querySelector('.status-select'),
    customInput: controlsSection.querySelector('.custom-status-input'),
    addButton: controlsSection.querySelector('.add-status-button'),
    statusList: statusListSection.querySelector('.status-list')
  };

  // Initialize component state
  const state = {
    currentStatuses: new Set(statuses),
    isCustomMode: false
  };

  // Set up event listeners
  bindEventHandlers(elements, state, combatantId);

  // Render initial statuses
  renderStatusList(elements.statusList, state.currentStatuses, combatantId);

  return container;
}

/**
 * Creates the main container element
 * @private
 * @returns {HTMLElement}
 */
function createContainer() {
  const container = document.createElement('div');
  container.className = 'status-manager';
  return container;
}

/**
 * Creates the controls section (dropdown, input, add button)
 * @private
 * @returns {HTMLElement}
 */
function createControlsSection() {
  const section = document.createElement('div');
  section.className = 'status-controls';

  const selectWrapper = createSelectWrapper();
  const customInputWrapper = createCustomInputWrapper();
  const addButton = createAddButton();

  section.appendChild(selectWrapper);
  section.appendChild(customInputWrapper);
  section.appendChild(addButton);

  return section;
}

/**
 * Creates the select dropdown wrapper
 * @private
 * @returns {HTMLElement}
 */
function createSelectWrapper() {
  const wrapper = document.createElement('div');
  wrapper.className = 'select-wrapper';

  const select = document.createElement('select');
  select.className = 'status-select';
  select.setAttribute('aria-label', 'Select status effect');

  // Default placeholder option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select status...';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  // Add predefined status options
  PREDEFINED_STATUSES.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    select.appendChild(option);
  });

  // Add custom option
  const customOption = document.createElement('option');
  customOption.value = CUSTOM_STATUS_VALUE;
  customOption.textContent = 'Custom...';
  select.appendChild(customOption);

  wrapper.appendChild(select);
  return wrapper;
}

/**
 * Creates the custom status input wrapper
 * @private
 * @returns {HTMLElement}
 */
function createCustomInputWrapper() {
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-input-wrapper';
  wrapper.style.display = 'none'; // Hidden by default

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'custom-status-input';
  input.placeholder = 'Enter custom status...';
  input.setAttribute('aria-label', 'Custom status name');
  input.maxLength = 50; // Reasonable limit for status names

  wrapper.appendChild(input);
  return wrapper;
}

/**
 * Creates the add button
 * @private
 * @returns {HTMLElement}
 */
function createAddButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'add-status-button';
  button.textContent = 'Add';
  button.setAttribute('aria-label', 'Add status effect');
  return button;
}

/**
 * Creates the status list section
 * @private
 * @returns {HTMLElement}
 */
function createStatusListSection() {
  const section = document.createElement('div');
  section.className = 'status-list-section';

  const list = document.createElement('div');
  list.className = 'status-list';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', 'Current status effects');

  section.appendChild(list);
  return section;
}

/**
 * Binds all event handlers for the component
 * @private
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 * @param {string} combatantId - Combatant identifier
 */
function bindEventHandlers(elements, state, combatantId) {
  const { container, statusSelect, customInput, addButton, statusList } = elements;

  // Handle select change - show/hide custom input
  statusSelect.addEventListener('change', (event) => {
    handleSelectChange(event.target.value, elements, state);
  });

  // Handle custom input enter key
  customInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddStatus(elements, state, combatantId);
    }
  });

  // Handle add button click
  addButton.addEventListener('click', () => {
    handleAddStatus(elements, state, combatantId);
  });

  // Handle remove button clicks using event delegation
  statusList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-status-button')) {
      const statusTag = event.target.closest('.status-tag');
      if (statusTag) {
        const statusToRemove = statusTag.dataset.status;
        handleRemoveStatus(statusToRemove, elements, state, combatantId);
      }
    }
  });
}

/**
 * Handles select dropdown changes
 * @private
 * @param {string} selectedValue - The selected option value
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 */
function handleSelectChange(selectedValue, elements, state) {
  const isCustom = selectedValue === CUSTOM_STATUS_VALUE;
  state.isCustomMode = isCustom;

  // Show/hide custom input based on selection
  elements.customInput.parentElement.style.display = isCustom ? 'block' : 'none';

  // Focus custom input when shown
  if (isCustom) {
    elements.customInput.focus();
  }
}

/**
 * Handles adding a status effect
 * @private
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 * @param {string} combatantId - Combatant identifier
 */
function handleAddStatus(elements, state, combatantId) {
  const statusToAdd = getStatusToAdd(elements, state);

  // Validate status
  if (!statusToAdd) {
    return;
  }

  // Check for duplicates
  if (state.currentStatuses.has(statusToAdd)) {
    console.warn(`StatusManager: "${statusToAdd}" is already applied`);
    return;
  }

  // Add to state
  state.currentStatuses.add(statusToAdd);

  // Update UI
  renderStatusList(elements.statusList, state.currentStatuses, combatantId);

  // Emit custom event
  emitStatusEvent(elements.container, 'status-add', combatantId, statusToAdd);

  // Reset controls
  resetControls(elements, state);
}

/**
 * Gets the status to add based on current selection/input
 * @private
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 * @returns {string|null} The status to add, or null if invalid
 */
function getStatusToAdd(elements, state) {
  if (state.isCustomMode) {
    const customStatus = elements.customInput.value.trim();
    if (!customStatus) {
      return null;
    }
    return customStatus;
  }

  const selectedStatus = elements.statusSelect.value;
  if (!selectedStatus || selectedStatus === CUSTOM_STATUS_VALUE) {
    return null;
  }

  return selectedStatus;
}

/**
 * Handles removing a status effect
 * @private
 * @param {string} status - The status to remove
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 * @param {string} combatantId - Combatant identifier
 */
function handleRemoveStatus(status, elements, state, combatantId) {
  if (!state.currentStatuses.has(status)) {
    return;
  }

  // Remove from state
  state.currentStatuses.delete(status);

  // Update UI
  renderStatusList(elements.statusList, state.currentStatuses, combatantId);

  // Emit custom event
  emitStatusEvent(elements.container, 'status-remove', combatantId, status);
}

/**
 * Renders the list of current status effects
 * @private
 * @param {HTMLElement} listElement - The status list container
 * @param {Set<string>} statuses - Current statuses
 * @param {string} combatantId - Combatant identifier
 */
function renderStatusList(listElement, statuses, combatantId) {
  // Clear existing content
  listElement.innerHTML = '';

  // Show empty state if no statuses
  if (statuses.size === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'status-empty-state';
    emptyState.textContent = 'No status effects';
    listElement.appendChild(emptyState);
    return;
  }

  // Create status tags
  statuses.forEach(status => {
    const tag = createStatusTag(status);
    listElement.appendChild(tag);
  });
}

/**
 * Creates a single status tag element
 * @private
 * @param {string} status - The status name
 * @returns {HTMLElement}
 */
function createStatusTag(status) {
  const tag = document.createElement('div');
  tag.className = 'status-tag';
  tag.dataset.status = status;
  tag.setAttribute('role', 'listitem');

  const label = document.createElement('span');
  label.className = 'status-label';
  label.textContent = status;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-status-button';
  removeButton.textContent = '×';
  removeButton.setAttribute('aria-label', `Remove ${status}`);

  tag.appendChild(label);
  tag.appendChild(removeButton);

  return tag;
}

/**
 * Emits a custom event from the component
 * @private
 * @param {HTMLElement} element - Element to dispatch from
 * @param {string} eventName - Name of the event
 * @param {string} combatantId - Combatant identifier
 * @param {string} status - Status name
 */
function emitStatusEvent(element, eventName, combatantId, status) {
  const event = new CustomEvent(eventName, {
    detail: { combatantId, status },
    bubbles: true,
    composed: true
  });
  element.dispatchEvent(event);
}

/**
 * Resets controls to default state after adding a status
 * @private
 * @param {Object} elements - Cached DOM elements
 * @param {Object} state - Component state
 */
function resetControls(elements, state) {
  // Reset select to default
  elements.statusSelect.value = '';

  // Clear and hide custom input
  elements.customInput.value = '';
  elements.customInput.parentElement.style.display = 'none';

  // Update state
  state.isCustomMode = false;
}

// Export for use in other modules
export { createStatusManager, PREDEFINED_STATUSES };
