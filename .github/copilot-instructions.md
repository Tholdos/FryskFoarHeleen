# Frysk Foar Heleen - Project Instructions

Vue 3 + Vite flashcard application for learning Frisian language with Dutch translations.

## Tech Stack
- Frontend: Vue 3 + Vite + Pinia
- Backend: Express + MongoDB
- Deployment: Vercel (frontend) + Render (backend)

## Project Structure
- `/src` - Vue 3 frontend application
  - `/components` - Game components (FlashCard, MatchingGame, TypingGame, AudioPlayer)
  - `/stores` - Pinia state management (wordStore, gameStore)
- `/server` - Express backend API
- `/public` - Static assets

## Development
- Frontend runs on port 5173 (Vite)
- Backend runs on port 3000 (Express)
- Backend has fallback data for development without MongoDB

## Key Features
- Flashcard game with flip animation
- Matching game (pair Frisian/Dutch words)
- Typing exercise game
- Score tracking with Pinia
- MongoDB integration with fallback mode
