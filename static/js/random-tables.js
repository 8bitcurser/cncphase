/**
 * Random Tables Roller - GM utility for rolling on Crown and Skull tables
 */

let tablesData = null;
let currentTable = null;
let rollHistory = [];
const MAX_HISTORY = 20;

// Load tables data
async function loadTables() {
  try {
    const response = await fetch('/static/data/random-tables.json');
    tablesData = await response.json();

    renderTableNav();
  } catch (error) {
    console.error('Failed to load random tables:', error);
  }
}

// Render table navigation
function renderTableNav() {
  const nav = document.getElementById('table-nav');
  if (!nav || !tablesData) return;

  // Group tables by category
  const categories = {
    'NPCs & Encounters': ['npc-town', 'npc-wilderness'],
    'Treasure': ['treasure-coins', 'treasure-heirloom-coins', 'treasure-gems', 'treasure-rare-gems'],
    'Magic & Potions': ['potions', 'potions-potent', 'magic-scrolls'],
    'Weapons & Armor': ['unusual-armaments', 'weapon-cache'],
    'Enemy Mods': ['enemy-modifications', 'enemy-events'],
    'Herbalism': ['herbalism-desert', 'herbalism-forest', 'herbalism-bog']
  };

  let navHTML = '';

  for (const [category, tableIds] of Object.entries(categories)) {
    navHTML += `<div class="nav-category">
      <div class="category-header">${category}</div>
      <ul class="category-list">`;

    tableIds.forEach(tableId => {
      const table = tablesData.tables[tableId];
      if (table) {
        navHTML += `<li>
          <button class="table-nav-btn" data-table-id="${tableId}">
            ${table.name}
          </button>
        </li>`;
      }
    });

    navHTML += `</ul></div>`;
  }

  nav.innerHTML = navHTML;

  // Add click handlers
  nav.querySelectorAll('.table-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableId = btn.dataset.tableId;
      loadTable(tableId);

      // Update active state
      nav.querySelectorAll('.table-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Load and display a specific table
function loadTable(tableId) {
  if (!tablesData) return;

  const table = tablesData.tables[tableId];
  if (!table) {
    console.error(`Table not found: ${tableId}`);
    return;
  }

  currentTable = table;

  // Update header
  document.getElementById('table-name').textContent = table.name;
  document.getElementById('table-description').textContent = table.description || '';
  document.getElementById('table-dice').textContent = table.dice;

  // Enable roll button
  const rollBtn = document.getElementById('roll-table-btn');
  rollBtn.disabled = false;

  // Render entries
  renderTableEntries(table.entries);

  // Hide previous result
  document.getElementById('roll-result').classList.add('hidden');
}

// Render table entries
function renderTableEntries(entries) {
  const container = document.getElementById('table-entries');
  if (!container) return;

  let html = '<table class="entries-table"><thead><tr><th>Roll</th><th>Result</th></tr></thead><tbody>';

  entries.forEach(entry => {
    html += `<tr>
      <td class="roll-cell">${entry.roll}</td>
      <td class="result-cell">${escapeHtml(entry.result)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Roll on current table
function rollTable() {
  if (!currentTable) return;

  const dice = currentTable.dice;
  const roll = rollDice(dice);

  // Find matching entry
  const entry = currentTable.entries.find(e => e.roll === roll);
  const result = entry ? entry.result : 'No result found';

  // Display result
  displayResult(roll, result);

  // Add to history
  addToHistory(currentTable.name, dice, roll, result);
}

// Roll dice (supports formats like "1d20", "1d10", "1d6", etc.)
function rollDice(diceString) {
  const match = diceString.match(/(\d+)d(\d+)/i);
  if (!match) return 1;

  const numDice = parseInt(match[1], 10);
  const diceSize = parseInt(match[2], 10);

  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSize) + 1;
  }

  return total;
}

// Display roll result
function displayResult(roll, result) {
  const resultContainer = document.getElementById('roll-result');
  const rolledNumber = document.getElementById('rolled-number');
  const resultText = document.getElementById('result-text');

  rolledNumber.textContent = roll;
  resultText.textContent = result;

  resultContainer.classList.remove('hidden');

  // Animate the result
  resultContainer.classList.add('result-animate');
  setTimeout(() => {
    resultContainer.classList.remove('result-animate');
  }, 500);
}

// Add roll to history
function addToHistory(tableName, dice, roll, result) {
  const timestamp = new Date().toLocaleTimeString();

  const historyEntry = {
    table: tableName,
    dice: dice,
    roll: roll,
    result: result,
    time: timestamp
  };

  rollHistory.unshift(historyEntry);

  // Limit history size
  if (rollHistory.length > MAX_HISTORY) {
    rollHistory = rollHistory.slice(0, MAX_HISTORY);
  }

  renderHistory();
}

// Render roll history
function renderHistory() {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;

  if (rollHistory.length === 0) {
    historyList.innerHTML = '<li class="empty-history">No rolls yet</li>';
    return;
  }

  historyList.innerHTML = rollHistory.map(entry => `
    <li class="history-item">
      <div class="history-header">
        <strong>${escapeHtml(entry.table)}</strong>
        <span class="history-time">${entry.time}</span>
      </div>
      <div class="history-roll">
        <span class="history-dice">${entry.dice}</span>
        <span class="history-result-num">${entry.roll}</span>
      </div>
      <div class="history-result">${escapeHtml(entry.result)}</div>
    </li>
  `).join('');
}

// Clear history
function clearHistory() {
  if (confirm('Clear all roll history?')) {
    rollHistory = [];
    renderHistory();
  }
}

// Setup event listeners
function setupEventListeners() {
  const rollBtn = document.getElementById('roll-table-btn');
  rollBtn?.addEventListener('click', rollTable);

  const clearHistoryBtn = document.getElementById('clear-history-btn');
  clearHistoryBtn?.addEventListener('click', clearHistory);

  // Keyboard shortcut: Space to roll
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      if (currentTable) {
        rollTable();
      }
    }
  });
}

// HTML escape utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTables();
  setupEventListeners();
  renderHistory();
});
