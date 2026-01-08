package handlers

import (
	"cncphaser/templates"
	"net/http"
)

func CombatTrackerHandler(w http.ResponseWriter, r *http.Request) {
	templates.CombatTracker().Render(r.Context(), w)
}
