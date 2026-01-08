package handlers

import (
	"cncphaser/templates"
	"net/http"
)

func EnemyManagerHandler(w http.ResponseWriter, r *http.Request) {
	templates.EnemyManager().Render(r.Context(), w)
}
