# Retro Component Patterns - Copy & Paste Ready

## Character Sheet Pattern

```html
<div class="card card-glow">
    <div class="card-header">
        <h2>Thorin Ironshield - Level 6 Warrior</h2>
    </div>

    <!-- Attribute Stats -->
    <div class="mb-lg">
        <h4 class="mb-sm text-secondary">Attributes</h4>
        <div class="stat-box">
            <span class="stat-label">STR</span>
            <span class="stat-value">18</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">DEX</span>
            <span class="stat-value">14</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">CON</span>
            <span class="stat-value">16</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">INT</span>
            <span class="stat-value">10</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">WIS</span>
            <span class="stat-value">12</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">CHA</span>
            <span class="stat-value">13</span>
        </div>
    </div>

    <!-- Health and Mana -->
    <div class="mb-md">
        <h4 class="mb-sm">Health Points</h4>
        <div class="health-bar">
            <div class="health-bar-fill" style="width: 85%;">
                <span class="health-bar-text">85 / 100</span>
            </div>
        </div>
    </div>

    <div class="mb-lg">
        <h4 class="mb-sm">Mana Points</h4>
        <div class="health-bar">
            <div class="health-bar-fill" style="width: 60%; background-color: #72f1b8;">
                <span class="health-bar-text">30 / 50</span>
            </div>
        </div>
    </div>

    <!-- Character Info -->
    <div class="panel mb-md">
        <div class="grid grid-2 gap-sm">
            <div>
                <span class="text-muted">Race:</span> Dwarf
            </div>
            <div>
                <span class="text-muted">Class:</span> Warrior
            </div>
            <div>
                <span class="text-muted">Level:</span> 6
            </div>
            <div>
                <span class="text-muted">XP:</span> 8,500 / 10,000
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="btn-group">
        <button class="btn-primary">Attack</button>
        <button>Defend</button>
        <button class="btn-accent">Use Item</button>
    </div>
</div>
```

## Combat Tracker Pattern

```html
<div class="card">
    <div class="card-header">
        <h2>Combat - Round 3</h2>
    </div>

    <!-- Initiative Order -->
    <div class="panel mb-md">
        <h4 class="mb-md">Initiative Order</h4>

        <!-- Active Combatant -->
        <div class="mb-sm p-sm" style="background: #2b0f54; border: 2px solid #00ff9f;">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong class="text-secondary">Thorin</strong>
                    <span class="badge success ml-xs">Player</span>
                </div>
                <span class="text-accent">Initiative: 18</span>
            </div>
            <div class="health-bar" style="height: 12px;">
                <div class="health-bar-fill" style="width: 85%;"></div>
            </div>
        </div>

        <!-- Other Combatants -->
        <div class="mb-sm p-sm" style="background: #1a1a1a; border: 2px solid #463464;">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong>Goblin Scout</strong>
                    <span class="badge danger ml-xs">Enemy</span>
                </div>
                <span class="text-muted">Initiative: 15</span>
            </div>
            <div class="health-bar" style="height: 12px;">
                <div class="health-bar-fill low" style="width: 30%;"></div>
            </div>
        </div>

        <div class="mb-sm p-sm" style="background: #1a1a1a; border: 2px solid #463464;">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong class="text-secondary">Elara</strong>
                    <span class="badge success ml-xs">Player</span>
                </div>
                <span class="text-muted">Initiative: 12</span>
            </div>
            <div class="health-bar" style="height: 12px;">
                <div class="health-bar-fill" style="width: 95%;"></div>
            </div>
        </div>
    </div>

    <!-- Combat Log -->
    <div class="panel mb-md">
        <h4 class="mb-sm">Combat Log</h4>
        <div style="font-size: 10px; line-height: 1.6;">
            <p class="mb-xs"><span class="text-accent">Round 3:</span> Thorin attacks Goblin Scout</p>
            <p class="mb-xs"><span class="text-secondary">Hit!</span> Rolled 18 + 5 = 23</p>
            <p class="mb-xs"><span class="text-danger">Damage:</span> 12 points</p>
            <div class="divider my-xs"></div>
            <p class="mb-xs"><span class="text-accent">Round 2:</span> Goblin Scout attacks Thorin</p>
            <p class="mb-xs"><span class="text-muted">Miss!</span> Rolled 7 + 3 = 10</p>
        </div>
    </div>

    <!-- Actions -->
    <div class="btn-group">
        <button class="btn-primary">Next Turn</button>
        <button class="btn-accent">Add Combatant</button>
        <button class="btn-danger">End Combat</button>
    </div>
</div>
```

## Inventory/Item Grid Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Inventory</h3>
    </div>

    <div class="grid grid-4 gap-sm mb-md">
        <!-- Item Slot - Filled -->
        <div class="panel text-center p-sm" style="cursor: pointer;">
            <div style="font-size: 32px;" class="mb-xs">⚔️</div>
            <div style="font-size: 8px;">Iron Sword</div>
            <div style="font-size: 8px;" class="text-accent">Dmg: 1d8+2</div>
        </div>

        <!-- Item Slot - Filled -->
        <div class="panel text-center p-sm" style="cursor: pointer;">
            <div style="font-size: 32px;" class="mb-xs">🛡️</div>
            <div style="font-size: 8px;">Steel Shield</div>
            <div style="font-size: 8px;" class="text-secondary">AC: +2</div>
        </div>

        <!-- Item Slot - Filled -->
        <div class="panel text-center p-sm" style="cursor: pointer;">
            <div style="font-size: 32px;" class="mb-xs">🧪</div>
            <div style="font-size: 8px;">Health Potion</div>
            <div style="font-size: 8px;" class="text-accent">Heal: 2d4+2</div>
        </div>

        <!-- Item Slot - Empty -->
        <div class="panel text-center p-sm" style="cursor: pointer; opacity: 0.3;">
            <div style="font-size: 32px;" class="mb-xs">—</div>
            <div style="font-size: 8px;">Empty</div>
        </div>

        <!-- More slots... -->
        <div class="panel text-center p-sm" style="cursor: pointer; opacity: 0.3;">
            <div style="font-size: 32px;" class="mb-xs">—</div>
            <div style="font-size: 8px;">Empty</div>
        </div>

        <div class="panel text-center p-sm" style="cursor: pointer; opacity: 0.3;">
            <div style="font-size: 32px;" class="mb-xs">—</div>
            <div style="font-size: 8px;">Empty</div>
        </div>

        <div class="panel text-center p-sm" style="cursor: pointer; opacity: 0.3;">
            <div style="font-size: 32px;" class="mb-xs">—</div>
            <div style="font-size: 8px;">Empty</div>
        </div>

        <div class="panel text-center p-sm" style="cursor: pointer; opacity: 0.3;">
            <div style="font-size: 32px;" class="mb-xs">—</div>
            <div style="font-size: 8px;">Empty</div>
        </div>
    </div>

    <div class="flex justify-between align-center">
        <span class="text-muted" style="font-size: 10px;">Weight: 45 / 150 lbs</span>
        <span class="text-accent" style="font-size: 10px;">Gold: 250 GP</span>
    </div>
</div>
```

## Spell Book Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Spell Book</h3>
    </div>

    <!-- Spell Slots -->
    <div class="mb-md p-sm" style="background: #2a2a2a;">
        <div class="flex justify-between align-center mb-xs">
            <span class="text-muted" style="font-size: 10px;">Level 1 Slots</span>
            <div style="font-size: 12px;">
                <span class="text-secondary">●●●</span>
                <span class="text-muted">○</span>
            </div>
        </div>
        <div class="flex justify-between align-center mb-xs">
            <span class="text-muted" style="font-size: 10px;">Level 2 Slots</span>
            <div style="font-size: 12px;">
                <span class="text-secondary">●●</span>
                <span class="text-muted">○</span>
            </div>
        </div>
        <div class="flex justify-between align-center">
            <span class="text-muted" style="font-size: 10px;">Level 3 Slots</span>
            <div style="font-size: 12px;">
                <span class="text-secondary">●</span>
                <span class="text-muted">○</span>
            </div>
        </div>
    </div>

    <!-- Known Spells -->
    <div class="mb-sm">
        <h4 class="mb-sm" style="font-size: 12px;">Known Spells</h4>

        <!-- Spell Card -->
        <div class="panel mb-sm" style="cursor: pointer;">
            <div class="flex justify-between align-center mb-xs">
                <strong class="text-secondary" style="font-size: 10px;">MAGIC MISSILE</strong>
                <span class="badge">Lvl 1</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;" class="text-muted mb-xs">
                Range: 120 ft | Duration: Instant
            </p>
            <p style="font-size: 8px; line-height: 1.4;">
                3 darts of magical force. Each dart hits for 1d4+1 damage.
            </p>
        </div>

        <!-- Spell Card -->
        <div class="panel mb-sm" style="cursor: pointer;">
            <div class="flex justify-between align-center mb-xs">
                <strong class="text-accent" style="font-size: 10px;">FIREBALL</strong>
                <span class="badge warning">Lvl 3</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;" class="text-muted mb-xs">
                Range: 150 ft | Duration: Instant
            </p>
            <p style="font-size: 8px; line-height: 1.4;">
                20-ft radius explosion. 8d6 fire damage, half on save.
            </p>
        </div>
    </div>

    <button class="btn-primary">Cast Spell</button>
</div>
```

## Party Overview Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Adventure Party</h3>
    </div>

    <div class="grid grid-2 gap-md">
        <!-- Party Member 1 -->
        <div class="panel">
            <div class="flex justify-between align-center mb-sm">
                <h4 style="font-size: 12px;">Thorin</h4>
                <span class="badge success">Tank</span>
            </div>
            <div class="mb-xs text-muted" style="font-size: 8px;">
                Dwarf Warrior - Level 6
            </div>
            <div class="health-bar mb-xs" style="height: 12px;">
                <div class="health-bar-fill" style="width: 85%;"></div>
            </div>
            <div class="flex justify-between" style="font-size: 8px;">
                <span class="text-accent">HP: 85/100</span>
                <span class="text-secondary">MP: 10/10</span>
            </div>
        </div>

        <!-- Party Member 2 -->
        <div class="panel">
            <div class="flex justify-between align-center mb-sm">
                <h4 style="font-size: 12px;">Elara</h4>
                <span class="badge" style="background: #ffd700; color: #000;">DPS</span>
            </div>
            <div class="mb-xs text-muted" style="font-size: 8px;">
                Elf Mage - Level 5
            </div>
            <div class="health-bar mb-xs" style="height: 12px;">
                <div class="health-bar-fill" style="width: 95%;"></div>
            </div>
            <div class="flex justify-between" style="font-size: 8px;">
                <span class="text-accent">HP: 38/40</span>
                <span class="text-secondary">MP: 60/80</span>
            </div>
        </div>

        <!-- Party Member 3 -->
        <div class="panel">
            <div class="flex justify-between align-center mb-sm">
                <h4 style="font-size: 12px;">Garrick</h4>
                <span class="badge" style="background: #72f1b8; color: #000;">Support</span>
            </div>
            <div class="mb-xs text-muted" style="font-size: 8px;">
                Human Cleric - Level 5
            </div>
            <div class="health-bar mb-xs" style="height: 12px;">
                <div class="health-bar-fill low" style="width: 30%;"></div>
            </div>
            <div class="flex justify-between" style="font-size: 8px;">
                <span class="text-danger">HP: 18/60</span>
                <span class="text-secondary">MP: 45/70</span>
            </div>
        </div>

        <!-- Party Member 4 -->
        <div class="panel">
            <div class="flex justify-between align-center mb-sm">
                <h4 style="font-size: 12px;">Shadow</h4>
                <span class="badge danger">DPS</span>
            </div>
            <div class="mb-xs text-muted" style="font-size: 8px;">
                Halfling Rogue - Level 6
            </div>
            <div class="health-bar mb-xs" style="height: 12px;">
                <div class="health-bar-fill" style="width: 70%;"></div>
            </div>
            <div class="flex justify-between" style="font-size: 8px;">
                <span class="text-accent">HP: 42/60</span>
                <span class="text-muted">MP: 0/0</span>
            </div>
        </div>
    </div>

    <div class="divider-glow my-md"></div>

    <div class="flex justify-between align-center">
        <span class="text-muted" style="font-size: 10px;">Party Level: 5-6</span>
        <button class="btn-sm btn-accent">Long Rest</button>
    </div>
</div>
```

## Dice Roller Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Dice Roller</h3>
    </div>

    <!-- Quick Roll Buttons -->
    <div class="mb-md">
        <h4 class="mb-sm" style="font-size: 12px;">Quick Roll</h4>
        <div class="grid grid-4 gap-xs">
            <button class="btn-sm">d4</button>
            <button class="btn-sm">d6</button>
            <button class="btn-sm">d8</button>
            <button class="btn-sm">d10</button>
            <button class="btn-sm">d12</button>
            <button class="btn-sm btn-primary">d20</button>
            <button class="btn-sm">d100</button>
            <button class="btn-sm">2d6</button>
        </div>
    </div>

    <!-- Custom Roll -->
    <div class="mb-md">
        <h4 class="mb-sm" style="font-size: 12px;">Custom Roll</h4>
        <div class="flex gap-sm">
            <div class="form-group" style="flex: 1; margin: 0;">
                <input type="text" placeholder="1d20+5" style="font-size: 10px;">
            </div>
            <button class="btn-primary">Roll</button>
        </div>
    </div>

    <!-- Result Display -->
    <div class="panel text-center p-md" style="background: #2b0f54; border: 2px solid #00ff9f;">
        <div class="text-muted mb-xs" style="font-size: 10px;">Last Roll: 1d20+5</div>
        <div class="text-accent" style="font-size: 32px; text-shadow: 2px 2px 0 #000, 0 0 10px #ffd700;">
            23
        </div>
        <div class="text-secondary" style="font-size: 10px;">Rolled: 18 | Modifier: +5</div>
    </div>

    <!-- Roll History -->
    <div class="mt-md">
        <h4 class="mb-sm" style="font-size: 12px;">History</h4>
        <div style="font-size: 8px;">
            <div class="flex justify-between mb-xs">
                <span class="text-muted">1d20+5</span>
                <span class="text-accent">23 (18+5)</span>
            </div>
            <div class="flex justify-between mb-xs">
                <span class="text-muted">2d6</span>
                <span>7 (4+3)</span>
            </div>
            <div class="flex justify-between mb-xs">
                <span class="text-muted">1d8+3</span>
                <span>11 (8+3)</span>
            </div>
        </div>
    </div>
</div>
```

## Quest Log Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Quest Log</h3>
    </div>

    <!-- Active Quests -->
    <div class="mb-md">
        <h4 class="mb-sm text-secondary">Active Quests</h4>

        <!-- Quest Entry -->
        <div class="panel mb-sm">
            <div class="flex justify-between align-center mb-xs">
                <strong style="font-size: 10px;">THE MISSING HEIR</strong>
                <span class="badge warning">Main</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;" class="mb-sm text-muted">
                Find the lost prince in the Shadowwood Forest.
            </p>
            <div style="font-size: 8px;">
                <div class="mb-xs">
                    <span class="text-secondary">✓</span> Speak with the King
                </div>
                <div class="mb-xs">
                    <span class="text-secondary">✓</span> Gather clues in the village
                </div>
                <div class="mb-xs">
                    <span class="text-accent">›</span> Search Shadowwood Forest
                </div>
                <div class="text-muted">
                    <span>○</span> Return to the King
                </div>
            </div>
        </div>

        <!-- Quest Entry -->
        <div class="panel mb-sm">
            <div class="flex justify-between align-center mb-xs">
                <strong style="font-size: 10px;">GOBLIN TROUBLES</strong>
                <span class="badge">Side</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;" class="mb-sm text-muted">
                Clear the goblin camp threatening the village.
            </p>
            <div style="font-size: 8px;">
                <div class="mb-xs">
                    <span class="text-secondary">✓</span> Accept quest from innkeeper
                </div>
                <div class="mb-xs">
                    <span class="text-accent">›</span> Defeat goblins (5/12)
                </div>
                <div class="text-muted">
                    <span>○</span> Claim reward
                </div>
            </div>
        </div>
    </div>

    <!-- Completed Quests -->
    <div>
        <h4 class="mb-sm text-muted">Completed</h4>
        <div class="panel" style="opacity: 0.6;">
            <div class="flex justify-between align-center">
                <strong style="font-size: 10px;">RESCUE THE MERCHANT</strong>
                <span class="badge success">Done</span>
            </div>
        </div>
    </div>
</div>
```

## Shop/Merchant Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Blacksmith's Forge</h3>
    </div>

    <div class="mb-md text-center">
        <span style="font-size: 16px;">🔨</span>
        <p style="font-size: 10px;" class="text-muted">Welcome, traveler! Browse me wares!</p>
    </div>

    <!-- Player Gold -->
    <div class="panel mb-md text-center">
        <span class="text-muted" style="font-size: 10px;">Your Gold:</span>
        <span class="text-accent" style="font-size: 16px;"> 450 GP</span>
    </div>

    <!-- Items for Sale -->
    <div class="mb-md">
        <h4 class="mb-sm" style="font-size: 12px;">Weapons</h4>

        <!-- Item -->
        <div class="panel mb-sm">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong style="font-size: 10px;">Longsword</strong>
                    <span style="font-size: 8px;" class="text-muted"> | 1d8 damage</span>
                </div>
                <span class="text-accent" style="font-size: 10px;">50 GP</span>
            </div>
            <div class="flex justify-between align-center">
                <p style="font-size: 8px;" class="text-muted">Versatile, martial weapon</p>
                <button class="btn-sm btn-primary">Buy</button>
            </div>
        </div>

        <!-- Item -->
        <div class="panel mb-sm">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong style="font-size: 10px;">Battleaxe</strong>
                    <span style="font-size: 8px;" class="text-muted"> | 1d10 damage</span>
                </div>
                <span class="text-accent" style="font-size: 10px;">75 GP</span>
            </div>
            <div class="flex justify-between align-center">
                <p style="font-size: 8px;" class="text-muted">Heavy, two-handed</p>
                <button class="btn-sm btn-primary">Buy</button>
            </div>
        </div>
    </div>

    <div class="mb-md">
        <h4 class="mb-sm" style="font-size: 12px;">Armor</h4>

        <!-- Item - Can't Afford -->
        <div class="panel mb-sm" style="opacity: 0.5;">
            <div class="flex justify-between align-center mb-xs">
                <div>
                    <strong style="font-size: 10px;">Plate Armor</strong>
                    <span style="font-size: 8px;" class="text-muted"> | AC 18</span>
                </div>
                <span class="text-danger" style="font-size: 10px;">1500 GP</span>
            </div>
            <div class="flex justify-between align-center">
                <p style="font-size: 8px;" class="text-muted">Heavy armor, best protection</p>
                <button class="btn-sm" disabled>Too Expensive</button>
            </div>
        </div>
    </div>

    <div class="btn-group">
        <button>Sell Items</button>
        <button class="btn-danger">Leave Shop</button>
    </div>
</div>
```

## Status Effects Pattern

```html
<div class="card">
    <div class="card-header">
        <h3>Active Effects</h3>
    </div>

    <!-- Positive Effects -->
    <div class="mb-md">
        <h4 class="mb-sm text-secondary" style="font-size: 12px;">Buffs</h4>

        <div class="panel mb-sm" style="border-color: #00ff9f;">
            <div class="flex justify-between align-center mb-xs">
                <strong style="font-size: 10px;" class="text-secondary">BLESSED</strong>
                <span style="font-size: 8px;" class="text-muted">3 rounds left</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;">+1d4 to attack rolls and saving throws</p>
        </div>

        <div class="panel mb-sm" style="border-color: #00ff9f;">
            <div class="flex justify-between align-center mb-xs">
                <strong style="font-size: 10px;" class="text-secondary">HASTE</strong>
                <span style="font-size: 8px;" class="text-muted">5 rounds left</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;">Double movement speed, +2 AC, extra action</p>
        </div>
    </div>

    <!-- Negative Effects -->
    <div class="mb-md">
        <h4 class="mb-sm text-danger" style="font-size: 12px;">Debuffs</h4>

        <div class="panel blink" style="border-color: #ff0040;">
            <div class="flex justify-between align-center mb-xs">
                <strong style="font-size: 10px;" class="text-danger">POISONED</strong>
                <span style="font-size: 8px;" class="text-muted">2 rounds left</span>
            </div>
            <p style="font-size: 8px; line-height: 1.4;">Take 1d6 poison damage at start of turn</p>
        </div>
    </div>

    <button class="btn-sm btn-accent">Dispel Magic</button>
</div>
```

## Level Up Notification Pattern

```html
<!-- This would typically be shown via JavaScript -->
<div class="dialog-overlay"></div>
<div class="dialog" style="min-width: 400px;">
    <h2 class="text-accent mb-md" style="text-align: center;">LEVEL UP!</h2>

    <div class="text-center mb-lg">
        <div style="font-size: 48px; line-height: 1;" class="text-accent glow">7</div>
        <p class="text-muted" style="font-size: 10px;">New Level</p>
    </div>

    <div class="panel mb-md">
        <h4 class="mb-sm text-secondary" style="font-size: 12px;">Improvements</h4>
        <div style="font-size: 10px; line-height: 1.6;">
            <div class="flex justify-between mb-xs">
                <span>Hit Points:</span>
                <span class="text-accent">+8 (108 total)</span>
            </div>
            <div class="flex justify-between mb-xs">
                <span>Mana Points:</span>
                <span class="text-secondary">+5 (55 total)</span>
            </div>
            <div class="flex justify-between">
                <span>Proficiency Bonus:</span>
                <span class="text-accent">+3</span>
            </div>
        </div>
    </div>

    <div class="mb-lg">
        <h4 class="mb-sm" style="font-size: 12px;">Choose One Ability:</h4>
        <div class="btn-group flex-column gap-sm">
            <button class="btn-primary">+2 Strength</button>
            <button class="btn-primary">+2 Dexterity</button>
            <button class="btn-primary">New Feat: Power Attack</button>
        </div>
    </div>

    <button class="btn-accent">Confirm</button>
</div>
```
