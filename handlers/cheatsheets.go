package handlers

import (
	"cncphaser/templates"
	"net/http"
)

func CombatCheatsheetHandler(w http.ResponseWriter, r *http.Request) {
	templates.CombatCheatsheet().Render(r.Context(), w)
}

func MagicCheatsheetHandler(w http.ResponseWriter, r *http.Request) {
	templates.MagicCheatsheet().Render(r.Context(), w)
}
