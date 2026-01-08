package handlers

import (
	"cncphaser/templates"
	"net/http"
)

func RandomTablesHandler(w http.ResponseWriter, r *http.Request) {
	templates.RandomTables().Render(r.Context(), w)
}
