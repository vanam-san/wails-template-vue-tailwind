package main

import "testing"

func TestGreet(t *testing.T) {
	service := &GreetService{}

	t.Run("trims Unicode whitespace and greets the caller", func(t *testing.T) {
		got, err := service.Greet(" \tAda\u00a0")
		const want = "Hello, Ada! Wails v3 is connected to Vue."
		if err != nil || got != want {
			t.Fatalf("Greet() = %q, %v; want %q, nil", got, err, want)
		}
	})

	t.Run("rejects a blank name", func(t *testing.T) {
		if got, err := service.Greet("\n \t"); err == nil || got != "" {
			t.Fatalf("Greet() = %q, %v; want empty result and an error", got, err)
		}
	})
}
