# 🇳🇱 Frysk Foar Heleen

Een interactieve flashcard applicatie om de Friese taal te leren met Nederlandse vertalingen.

![Vue 3](https://img.shields.io/badge/Vue-3-green.svg)
![Vite](https://img.shields.io/badge/Vite-8-blue.svg)
![Express](https://img.shields.io/badge/Express-4-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green.svg)

## ✨ Features

- **📇 Flashcards**: Leer woorden met flip-animatie
- **🎯 Koppelspel**: Match Friese en Nederlandse woorden
- **⌨️ Typspel**: Typ de juiste vertaling
- **🔊 Audio uitspraak**: Luister naar de correcte uitspraak (toekomstig)
- **📊 Score tracking**: Houd je voortgang bij

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Modern reactive framework
- **Vite** - Supersnel development
- **Pinia** - State management
- **CSS3** - Custom styling met animaties

### Backend
- **Express.js** - REST API server
- **MongoDB** - Database voor woordenlijst
- **Node.js** - Runtime environment

### Deployment
- **Vercel** - Frontend hosting (gratis)
- **Render** - Backend hosting (gratis)
- **MongoDB Atlas** - Cloud database (gratis)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 of hoger)
- npm of yarn
- MongoDB account (voor productie)

### Installation

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd FryskFoarHeleen
   ```

2. **Installeer frontend dependencies**
   ```bash
   npm install
   ```

3. **Installeer backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configureer environment variables**
   ```bash
   # Root .env voor frontend
   cp .env.example .env
   
   # Server .env voor backend
   cd server
   cp .env.example .env
   # Bewerk server/.env en voeg je MongoDB URI toe
   ```

### Development

1. **Start de backend server** (in terminal 1)
   ```bash
   cd server
   npm start
   ```
   Server draait op: http://localhost:3000

2. **Start de frontend** (in terminal 2)
   ```bash
   npm run dev
   ```
   App draait op: http://localhost:5173

3. **Open in browser**
   Ga naar http://localhost:5173

## 📁 Project Structure

```
FryskFoarHeleen/
├── src/
│   ├── components/           # Vue componenten
│   │   ├── FlashCard.vue    # Flashcard component
│   │   ├── MatchingGame.vue # Koppelspel
│   │   ├── TypingGame.vue   # Typspel
│   │   └── AudioPlayer.vue  # Audio player
│   ├── stores/              # Pinia stores
│   │   ├── wordStore.js     # Woorden state
│   │   └── gameStore.js     # Spel state
│   ├── App.vue              # Hoofd component
│   ├── main.js              # Entry point
│   └── style.css            # Global styles
├── server/
│   ├── index.js             # Express server
│   ├── package.json         # Server dependencies
│   └── .env.example         # Environment template
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuratie
└── vercel.json             # Vercel deployment config
```

## 🎮 Hoe te Spelen

### Flashcards
1. Klik op "📇 Flashcards"
2. Zie een Fries woord
3. Klik op de kaart om de Nederlandse vertaling te zien
4. Klik "Ik wist het" als je het goed had
5. Klik "Volgende" voor een nieuw woord

### Koppelspel
1. Klik op "🎯 Koppelen"
2. Klik "Start Spel"
3. Selecteer een Fries woord (links)
4. Selecteer de bijbehorende Nederlandse vertaling (rechts)
5. Match alle 5 paren correct!

### Typspel
1. Klik op "⌨️ Typen"
2. Kies richting (Fries → Nederlands of andersom)
3. Klik "Start Spel"
4. Typ de juiste vertaling
5. Druk Enter of klik "Controleer"

## 🗄️ Database Schema

### Words Collection
```javascript
{
  _id: ObjectId,
  frisian: String,        // Fries woord
  dutch: String,          // Nederlandse vertaling
  pronunciation: String,  // Uitspraak gids
  audioUrl: String,       // Pad naar audio bestand
  category: String,       // Categorie (familie, tijd, etc.)
  difficulty: Number,     // Moeilijkheidsgraad (1-5)
  createdAt: Date        // Aanmaak datum
}
```

## 🌐 Deployment

Zie [DEPLOYMENT.md](./DEPLOYMENT.md) voor volledige deployment instructies voor:
- Vercel (frontend)
- Render (backend)
- MongoDB Atlas (database)

**Kosten: €0/maand** met gratis tiers! 🎉

## 📝 API Endpoints

### GET /api/words
Haal alle woorden op
```json
[
  {
    "_id": "...",
    "frisian": "hûs",
    "dutch": "huis",
    "pronunciation": "hoos",
    ...
  }
]
```

### GET /api/words/random/:count
Haal random woorden op voor het spel

### GET /api/words/:id
Haal specifiek woord op via ID

### POST /api/words
Voeg nieuw woord toe (toekomstige admin functie)

## 🎨 Customization

### Kleuren aanpassen
Bewerk `src/style.css` en component styles voor custom kleuren

### Nieuwe woorden toevoegen
1. Gebruik MongoDB Compass of Atlas UI
2. Of POST naar `/api/words` endpoint
3. Volg het database schema

### Audio toevoegen
1. Upload audio bestanden naar Vercel Blob Storage
2. Update `audioUrl` veld in database
3. Implementeer audio serving in backend

## 🐛 Troubleshooting

### Backend verbindt niet
- Controleer of MongoDB URI correct is in `server/.env`
- Controleer of server draait op port 3000
- Check `VITE_API_URL` in frontend `.env`

### Woorden laden niet
- Controleer browser console voor errors
- Verifieer dat backend API bereikbaar is
- Server heeft fallback data als MongoDB niet werkt

### Vite build errors
- Verwijder `node_modules` en `package-lock.json`
- Run `npm install` opnieuw
- Controleer Node.js versie (v18+)

## 🔮 Roadmap

- [ ] Audio pronunciatie implementeren
- [ ] User accounts en voortgang opslaan
- [ ] Meer woordcategorieën
- [ ] Dagelijkse uitdaging
- [ ] Moeilijkheidslevels
- [ ] Admin panel voor woorden beheren
- [ ] Spaced repetition algoritme
- [ ] Mobile app versie

## 📄 License

Dit project is gemaakt voor persoonlijk gebruik.

## 💝 Made with Love

Speciaal gemaakt voor Heleen om Fries te leren! 🇳🇱
