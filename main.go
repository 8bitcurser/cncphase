package main

import (
	"cncphaser/handlers"
	"fmt"
	"log"
	"net/http"
	"os"
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

	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Bind to 0.0.0.0 (all interfaces) for container environments
	addr := "0.0.0.0:" + port
	fmt.Printf("Crown and Skull GM Webapp starting on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(addr, mux))
}
