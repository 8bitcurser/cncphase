/**
 * Player Manager - Handle player character management
 */

const PLAYERS_STORAGE_KEY = 'cncphaser_saved_players';

// Get all saved players
export function getSavedPlayers() {
  try {
    const stored = localStorage.getItem(PLAYERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load saved players:', error);
    return [];
  }
}

// Save a player
export function savePlayer(player) {
  try {
    const players = getSavedPlayers();

    if (player.id) {
      // Update existing
      const index = players.findIndex(p => p.id === player.id);
      if (index !== -1) {
        players[index] = player;
      }
    } else {
      // Create new
      player.id = `player_${Date.now()}`;
      players.push(player);
    }

    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    return player;
  } catch (error) {
    console.error('Failed to save player:', error);
    return null;
  }
}

// Delete a player
export function deletePlayer(playerId) {
  try {
    const players = getSavedPlayers();
    const filtered = players.filter(p => p.id !== playerId);
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete player:', error);
    return false;
  }
}

// Convert player to combatant format
export function playerToCombatant(player) {
  return {
    name: player.name,
    type: 'PC',
    phases: [player.phase],
    defense: player.defense,
    atk: 0,
    def: 0,
    inventory: Array(player.inventory || 20).fill('INV'),
    statuses: [],
    hitToHeart: false
  };
}
