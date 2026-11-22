package main

import (
	"errors"
	"fmt"
	"strings"
)

// GreetService exposes the starter's example Go operation to the webview.
type GreetService struct{}

// Greet validates a name and returns a greeting through the Wails service bridge.
func (s *GreetService) Greet(name string) (string, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return "", errors.New("please enter a name")
	}

	return fmt.Sprintf("Hello, %s! Wails v3 is connected to Vue.", name), nil
}
