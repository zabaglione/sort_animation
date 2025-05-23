# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A web-based visualization tool for demonstrating sorting algorithms using vanilla JavaScript and HTML5 Canvas.

## Commands
- Run local server: `python3 -m http.server 8000`
- Visit application: http://localhost:8000/index.html

## Code Style Guidelines
- Use vanilla JavaScript without external dependencies
- Indent with 4 spaces
- Use camelCase for variable and function names
- Employ descriptive variable names in English (code) with Japanese UI text
- Use async/await for asynchronous operations
- Use ES6+ features (arrow functions, destructuring, template literals)
- Add comments for complex logic (in English)
- Handle errors gracefully with try/catch where appropriate

## Conventions
- Use proper HTML5 semantic elements
- Maintain responsive canvas sizing
- Keep animation logic consistent across sorting algorithms
- Ensure consistent pause/resume functionality
- Use const for variables that don't change
- Follow modular function design