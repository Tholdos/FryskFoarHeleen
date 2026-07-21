# 🚀 Quick Start Guide

Snelle instructies om de app lokaal te draaien.

## ⚡ 5-Minuten Setup

### 1. Dependencies Installeren (✅ Al gedaan!)

```bash
# Root folder (frontend)
npm install

# Server folder (backend)
cd server
npm install
cd ..
```

### 2. Environment Configuratie

**Optie A: Zonder MongoDB (Makkelijkst voor testen)**
- Server gebruikt automatisch fallback data
- Geen configuratie nodig!
- Perfect voor development

**Optie B: Met MongoDB**
```bash
# Kopieer server/.env.example naar server/.env
cd server
cp .env.example .env

# Bewerk server/.env en voeg toe:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frysk_foar_heleen
```

### 3. Start de App

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
✅ Server draait op http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ App draait op http://localhost:5173

### 4. Open in Browser

Ga naar: **http://localhost:5173**

🎉 **Klaar!** Je kunt nu spelen!

---

## 🎮 Test de App

1. **Flashcards**: Klik op "📇 Flashcards"
   - Zie Friese woorden
   - Klik om te flippen
   - Test "Ik wist het" en "Volgende"

2. **Koppelspel**: Klik op "🎯 Koppelen"
   - Klik "Start Spel"
   - Match 5 paren
   - Check je score

3. **Typspel**: Klik op "⌨️ Typen"
   - Kies richting (Fries ↔ Nederlands)
   - Typ de vertaling
   - Test je kennis

---

## 🔧 Development Tips

### Hot Reload
Beide frontend en backend ondersteunen hot reload:
- Bewerk `.vue` files → Browser refresht automatisch
- Bewerk `server/index.js` → Restart server handmatig

### Browser DevTools
- Druk **F12** voor developer tools
- **Console** tab voor errors
- **Network** tab voor API calls

### API Testen
```bash
# Test backend direct
curl http://localhost:3000/api/words

# Of open in browser:
http://localhost:3000/api/words
```

### Nieuwe Woorden Toevoegen

**Zonder database (fallback mode):**
Bewerk `server/index.js` → `fallbackWords` array

**Met database:**
```javascript
// POST naar API
fetch('http://localhost:3000/api/words', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    frisian: 'moarn',
    dutch: 'morgen',
    pronunciation: 'moarn',
    category: 'tijd',
    difficulty: 1
  })
})
```

---

## 📁 Project Structuur

```
FryskFoarHeleen/
├── src/
│   ├── components/        ← Vue componenten (games)
│   ├── stores/           ← Pinia state management
│   ├── App.vue           ← Hoofd app
│   └── main.js           ← Entry point
├── server/
│   └── index.js          ← Express API server
├── public/               ← Static files
└── package.json          ← Dependencies
```

---

## 🐛 Veelvoorkomende Problemen

### "Cannot find module"
```bash
# Verwijder node_modules en herinstalleer
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
# Windows: vind en stop process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Of gebruik andere port in server/index.js
```

### "Port 5173 already in use"
Vite kiest automatisch volgende beschikbare port (5174, 5175, etc.)

### Backend verbindt niet
- Check of server draait (`http://localhost:3000`)
- Verifieer `.env` in root: `VITE_API_URL=http://localhost:3000`
- Check browser console voor CORS errors

### Woorden laden niet
1. Check browser console (F12)
2. Test API: `http://localhost:3000/api/words`
3. Server gebruikt fallback data als MongoDB niet werkt

---

## 🎨 Customization

### Kleuren Aanpassen
`src/style.css` - Globale kleuren
`src/App.vue` - Header gradient
Componenten - Individuele component styles

### Nieuwe Categorieën
Voeg toe aan MongoDB of `fallbackWords`:
```javascript
{
  category: "voedsel"  // nieuwe categorie
}
```

### Moeilijkheidslevels
Filter woorden op difficulty in games (toekomstige feature)

---

## 📚 Volgende Stappen

1. **Meer woorden toevoegen**
   - Zie `MONGODB-SETUP.md`
   - Target: 50-100 woorden

2. **Audio toevoegen**
   - Record Friese uitspraken
   - Upload naar Vercel Blob
   - Update `audioUrl` in database

3. **Deployment**
   - Zie `DEPLOYMENT.md`
   - Deploy naar Vercel + Render + MongoDB Atlas
   - **100% gratis!**

4. **Features uitbreiden**
   - User accounts
   - Progress tracking
   - Daily challenges
   - Leaderboard

---

## 💡 Tips voor Heleen

- Start met Flashcards om woorden te leren
- Gebruik Koppelspel om te oefenen
- Test jezelf met Typspel
- Herhaal moeilijke woorden vaker
- Probeer elke dag 5 nieuwe woorden!

---

## 🆘 Hulp Nodig?

- Check `README.md` voor uitgebreide docs
- Check `DEPLOYMENT.md` voor online zetten
- Check `MONGODB-SETUP.md` voor database help

**Veel plezier met Fries leren!** 🇳🇱 🎉
