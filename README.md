# Snake

A small Snake game built with plain HTML, CSS, and JavaScript using the Canvas API.

## Project Status

This project started as a fast-coding exercise. It is functional and playable, but it intentionally favors speed of implementation over architecture and polish.

## Tech Stack

- HTML (`snake.html`)
- CSS (`snake.css`)
- Vanilla JavaScript (`snake.js`)
- Browser Canvas 2D rendering context

No build tools, frameworks, or external dependencies are required.

## How to Run

1. Clone or download this repository.
2. Open `snake.html` in any modern browser.

That is all. There is no install step.

## Controls

- `ArrowUp`
- `ArrowDown`
- `ArrowLeft`
- `ArrowRight`

Direct 180-degree turns are blocked (for example, Right to Left in one step).

## Gameplay Rules

- The snake moves on a 30x30 grid.
- Eating red food:
  - grows the snake by one segment
  - increases movement velocity
- Hitting your own body ends the game.
- The board wraps around at edges (moving out on one side appears on the opposite side).

## Power-up Mechanic

- A blue power-up can spawn once speed is high enough.
- If collected, it reduces the snake speed.
- Spawn chance is intentionally low, so it appears rarely.

## Code Structure

- `snake.html`: game canvas and page layout skeleton
- `snake.css`: simple two-column layout (game + sidebar)
- `snake.js`: all gameplay logic, including:
  - input handling
  - render loop
  - snake updates
  - collision checks
  - food and power-up spawning

## Known Limitations

- UI sidebar content is placeholder text.
- Layout is fixed-width and not optimized for mobile screens.
- Game state and rendering are in a single script (not modularized).
- There is no score display, restart UI, or game-over screen.
- No automated tests are included.

## Ideas for Improvement

- Add score, high-score tracking, and restart controls.
- Make layout responsive for smaller screens.
- Split game logic into modules/classes.
- Add pause/resume and difficulty modes.
- Add tests for movement/collision logic.
