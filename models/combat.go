package models

type Combatant struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	Type       string   `json:"type"` // "PC" or "NPC"
	CurrentHP  int      `json:"currentHp"`
	MaxHP      int      `json:"maxHp"`
	Initiative int      `json:"initiative"`
	Statuses   []string `json:"statuses"`
}

type CombatState struct {
	Round       int         `json:"round"`
	ActiveIndex int         `json:"activeIndex"`
	Combatants  []Combatant `json:"combatants"`
}
