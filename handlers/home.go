package handlers

import (
	"cncphaser/templates"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	templates.Home().Render(r.Context(), w)
}
