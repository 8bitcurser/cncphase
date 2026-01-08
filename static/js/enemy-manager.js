/**
 * Enemy Manager - Manage and browse Crown and Skull enemies/NPCs
 */

let enemiesData = null;
let customEnemies = [];
const CUSTOM_ENEMIES_KEY = 'cncphaser_custom_enemies';

// Load enemy database and custom enemies
async function loadEnemies() {
  try {
    const response = await fetch('/static/data/enemies.json');
    enemiesData = await response.json();

    // Load custom enemies from localStorage
    const stored = localStorage.getItem(CUSTOM_ENEMIES_KEY);
    if (stored) {
      customEnemies = JSON.parse(stored);
    }

    renderEnemyGrid(getAllEnemies());
  } catch (error) {
    console.error('Failed to load enemies:', error);
  }
}

// Get all enemies (database + custom)
function getAllEnemies() {
  if (!enemiesData) return customEnemies;
  return [...enemiesData.enemies, ...customEnemies];
}

// Render enemy grid
function renderEnemyGrid(enemies) {
  const grid = document.getElementById('enemy-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (enemies.length === 0) {
    grid.innerHTML = '<p class="empty-state">No enemies found</p>';
    return;
  }

  enemies.forEach(enemy => {
    const card = createEnemyCard(enemy);
    grid.appendChild(card);
  });
}

// Create enemy card element
function createEnemyCard(enemy) {
  const card = document.createElement('div');
  card.className = 'enemy-card';
  card.dataset.enemyId = enemy.id;

  const hpDisplay = formatHP(enemy.hp);
  const phasesDisplay = Array.isArray(enemy.phases) ? enemy.phases.join(', ') : enemy.phases;
  const atkDisplay = enemy.atk !== null ? enemy.atk : 'N/A';
  const defDisplay = enemy.def !== null ? enemy.def : 'N/A';

  card.innerHTML = `
    <div class="enemy-card-header">
      <h3 class="enemy-card-name">${escapeHtml(enemy.name)}</h3>
      <span class="enemy-category-badge category-${enemy.category.toLowerCase()}">${enemy.category}</span>
    </div>

    <div class="enemy-stats-grid">
      <div class="stat-box">
        <div class="stat-label">HP</div>
        <div class="stat-value">${hpDisplay}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">ATK</div>
        <div class="stat-value">${atkDisplay}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">DEF</div>
        <div class="stat-value">${defDisplay}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Phase</div>
        <div class="stat-value">${phasesDisplay}</div>
      </div>
    </div>

    <div class="enemy-description">
      ${escapeHtml(enemy.description || 'No description')}
    </div>

    <div class="enemy-card-actions">
      <button class="btn-sm btn-primary quick-add-btn">Quick Add</button>
      <button class="btn-sm view-details-btn">View Details</button>
    </div>
  `;

  // Event listeners
  const quickAddBtn = card.querySelector('.quick-add-btn');
  const viewDetailsBtn = card.querySelector('.view-details-btn');

  quickAddBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    quickAddToCombat(enemy);
  });

  viewDetailsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showEnemyDetails(enemy);
  });

  return card;
}

// Format HP display
function formatHP(hp) {
  if (typeof hp === 'number') return hp;
  if (typeof hp === 'object') {
    if (hp.multiplier) {
      return `${hp.base} × ${hp.multiplier}`;
    }
    return hp.base;
  }
  return hp;
}

// Show enemy details in modal
function showEnemyDetails(enemy) {
  const modal = document.getElementById('enemy-detail-modal');
  const content = document.getElementById('enemy-detail-content');

  if (!modal || !content) return;

  const hpDisplay = formatHP(enemy.hp);
  const phasesDisplay = Array.isArray(enemy.phases) ? enemy.phases.join(', ') : enemy.phases;
  const atkDisplay = enemy.atk !== null ? enemy.atk : 'N/A';
  const defDisplay = enemy.def !== null ? enemy.def : 'N/A';

  content.innerHTML = `
    <h2>${escapeHtml(enemy.name)}</h2>
    <p class="enemy-category-large">${enemy.category}</p>

    <div class="stats-display-large">
      <div><strong>HP:</strong> ${hpDisplay}</div>
      <div><strong>ATK:</strong> ${atkDisplay}</div>
      <div><strong>DEF:</strong> ${defDisplay}</div>
      <div><strong>Phases:</strong> ${phasesDisplay}</div>
      <div><strong>Tactics:</strong> ${enemy.tactics}</div>
      <div><strong>Attrition:</strong> ${enemy.attritionType || 'Basic'}</div>
    </div>

    <p><strong>Description:</strong> ${escapeHtml(enemy.description || 'No description')}</p>

    <div class="tactics-section">
      <h4>Tactics</h4>
      ${enemy.tactic1 ? `<p><strong>Tactic 1 (Move):</strong> ${escapeHtml(enemy.tactic1)}</p>` : ''}
      ${enemy.tactic2_5 ? `<p><strong>Tactics 2-5 (Attack):</strong> ${escapeHtml(enemy.tactic2_5)}</p>` : ''}
      ${enemy.tactic6 ? `<p><strong>Tactic 6 (AoE):</strong> ${escapeHtml(enemy.tactic6)}</p>` : ''}
    </div>

    ${enemy.special ? `<p class="special-note"><strong>Special:</strong> ${escapeHtml(enemy.special)}</p>` : ''}

    ${enemy.variants && enemy.variants.length > 0 ? renderVariants(enemy.variants) : ''}
  `;

  modal.classList.remove('hidden');

  // Store current enemy for actions
  modal.dataset.currentEnemyId = enemy.id;
}

// Render variants
function renderVariants(variants) {
  let html = '<div class="variants-section"><h4>Variants</h4>';
  variants.forEach(variant => {
    html += `<div class="variant-item">
      <strong>${escapeHtml(variant.name)}:</strong>
      HP ${variant.hp}, ATK ${variant.atk}, DEF ${variant.def}
      ${variant.special ? ` - ${escapeHtml(variant.special)}` : ''}
    </div>`;
  });
  html += '</div>';
  return html;
}

// Quick add to combat
function quickAddToCombat(enemy) {
  // Calculate actual HP
  let actualHP = enemy.hp;
  if (typeof enemy.hp === 'object' && enemy.hp.base) {
    actualHP = enemy.hp.base;
    // For multipliers like "1D10", just use base for simplicity
  }

  const combatant = {
    name: enemy.name,
    type: 'Enemy',
    phases: Array.isArray(enemy.phases) ? enemy.phases : [enemy.phases],
    defense: calculateDefense(enemy),
    atk: enemy.atk || 0,
    def: enemy.def || 0,
    inventory: Array(actualHP || 20).fill('HP'), // Simple inventory representation
    statuses: [],
    hitToHeart: false
  };

  // Store in sessionStorage to transfer to combat tracker
  sessionStorage.setItem('pending_combatant', JSON.stringify(combatant));

  // Redirect to combat tracker
  window.location.href = '/combat-tracker';
}

// Calculate defense for PC-style stat
function calculateDefense(enemy) {
  // Base defense is 6 + DEF value (armor equivalent)
  return 6 + (enemy.def || 0);
}

// Search and filter
function setupSearchAndFilters() {
  const searchInput = document.getElementById('enemy-search');
  const categoryFilter = document.getElementById('category-filter');
  const phaseFilter = document.getElementById('phase-filter');

  const applyFilters = () => {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value || '';
    const phase = phaseFilter?.value || '';

    let filtered = getAllEnemies();

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enemy =>
        enemy.name.toLowerCase().includes(searchTerm) ||
        (enemy.description && enemy.description.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter(enemy => enemy.category === category);
    }

    // Phase filter
    if (phase) {
      const phaseNum = parseInt(phase, 10);
      filtered = filtered.filter(enemy => {
        if (Array.isArray(enemy.phases)) {
          return enemy.phases.includes(phaseNum);
        }
        return enemy.phases === phaseNum;
      });
    }

    renderEnemyGrid(filtered);
  };

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  phaseFilter?.addEventListener('change', applyFilters);
}

// Random enemy
function getRandomEnemy() {
  const enemies = getAllEnemies();
  if (enemies.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * enemies.length);
  return enemies[randomIndex];
}

// Setup modal controls
function setupModals() {
  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.add('hidden');
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

  // Detail modal actions
  const addToCombatBtn = document.getElementById('add-to-combat-btn');
  addToCombatBtn?.addEventListener('click', () => {
    const modal = document.getElementById('enemy-detail-modal');
    const enemyId = modal?.dataset.currentEnemyId;
    if (enemyId) {
      const enemy = getAllEnemies().find(e => e.id === enemyId);
      if (enemy) {
        quickAddToCombat(enemy);
      }
    }
  });
}

// Setup create enemy form
function setupCreateEnemyForm() {
  const createBtn = document.getElementById('create-enemy-btn');
  const modal = document.getElementById('create-enemy-modal');
  const form = document.getElementById('enemy-create-form');

  createBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const phases = formData.get('phases').split(',').map(p => parseInt(p.trim(), 10)).filter(p => p >= 1 && p <= 5);

    const newEnemy = {
      id: `custom-${Date.now()}`,
      name: formData.get('name'),
      category: formData.get('category'),
      hp: { base: parseInt(formData.get('hp'), 10) },
      atk: parseInt(formData.get('atk'), 10),
      def: parseInt(formData.get('def'), 10),
      phases: phases,
      tactics: parseInt(formData.get('tactics'), 10),
      description: formData.get('description'),
      tactic1: formData.get('tactic1'),
      tactic2_5: formData.get('tactic2_5'),
      tactic6: formData.get('tactic6'),
      attritionType: formData.get('attritionType'),
      special: formData.get('special') || undefined
    };

    // Add to custom enemies
    customEnemies.push(newEnemy);

    // Save to localStorage
    localStorage.setItem(CUSTOM_ENEMIES_KEY, JSON.stringify(customEnemies));

    // Refresh grid
    renderEnemyGrid(getAllEnemies());

    // Close modal and reset form
    modal?.classList.add('hidden');
    form.reset();

    // Show success message (optional)
    alert(`Enemy "${newEnemy.name}" created successfully!`);
  });
}

// Random enemy button
function setupRandomEnemy() {
  const randomBtn = document.getElementById('random-enemy-btn');

  randomBtn?.addEventListener('click', () => {
    const enemy = getRandomEnemy();
    if (enemy) {
      showEnemyDetails(enemy);
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
  loadEnemies();
  setupSearchAndFilters();
  setupModals();
  setupCreateEnemyForm();
  setupRandomEnemy();
});
