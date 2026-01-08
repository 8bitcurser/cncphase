package main

import (
	"cncphaser/handlers"
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	// Static files
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// Routes
	mux.HandleFunc("/", handlers.HomeHandler)
	mux.HandleFunc("/cheatsheet/combat", handlers.CombatCheatsheetHandler)
	mux.HandleFunc("/cheatsheet/magic", handlers.MagicCheatsheetHandler)
	mux.HandleFunc("/combat-tracker", handlers.CombatTrackerHandler)
	mux.HandleFunc("/enemy-manager", handlers.EnemyManagerHandler)
	mux.HandleFunc("/random-tables", handlers.RandomTablesHandler)

	port := ":8080"
	fmt.Printf("Crown and Skull GM Webapp starting on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, mux))
}
