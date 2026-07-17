# 🚀 Deployment Guide - Frysk Foar Heleen

Complete gids om je Friese leer-app online te zetten **100% GRATIS**!

## 📋 Overzicht

We gebruiken drie gratis services:
- **MongoDB Atlas** (Database) - 512MB gratis
- **Render** (Backend API) - 750 uur/maand gratis
- **Vercel** (Frontend) - Onbeperkt gratis

**Totale kosten: €0/maand** ✅

---

## Deel 1: MongoDB Atlas Setup

### Stap 1: Account Aanmaken
1. Ga naar [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Klik "Try Free"
3. Maak account aan (of login met Google)

### Stap 2: Cluster Aanmaken
1. Klik "Build a Database"
2. Kies **FREE** tier (M0 Sandbox)
3. Selecteer provider: **AWS**
4. Kies regio: **Frankfurt (eu-central-1)** (dichtst bij Nederland)
5. Cluster naam: `frysk-cluster`
6. Klik "Create"

### Stap 3: Database User Aanmaken
1. Ga naar "Database Access" (linker menu)
2. Klik "Add New Database User"
3. Kies "Password" authentication
4. Username: `frysk_admin`
5. Genereer een sterk wachtwoord (sla op!)
6. Database User Privileges: **Read and write to any database**
7. Klik "Add User"

### Stap 4: Network Access Instellen
1. Ga naar "Network Access" (linker menu)
2. Klik "Add IP Address"
3. Kies "Allow Access from Anywhere" (voor Render)
4. Klik "Confirm"

⚠️ Voor productie: beperk dit later tot specifieke IP's

### Stap 5: Connection String Ophalen
1. Ga naar "Database" (linker menu)
2. Klik "Connect" bij je cluster
3. Kies "Connect your application"
4. Copy de connection string:
   ```
   mongodb+srv://frysk_admin:<password>@frysk-cluster.xxxxx.mongodb.net/
   ```
5. Vervang `<password>` met je echte wachtwoord
6. Voeg database naam toe aan het einde: `frysk_app`

**Voorbeeld:**
```
mongodb+srv://frysk_admin:MijnWachtwoord123@frysk-cluster.xxxxx.mongodb.net/frysk_app
```

### Stap 6: Initiële Data Toevoegen
1. Ga naar "Database" → "Browse Collections"
2. Klik "Add My Own Data"
3. Database name: `frysk_app`
4. Collection name: `words`
5. Klik "Create"

6. Klik "Insert Document" en voeg toe:
```json
{
  "frisian": "hûs",
  "dutch": "huis",
  "pronunciation": "hoos",
  "audioUrl": null,
  "category": "zelfstandig naamwoord",
  "difficulty": 1,
  "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
}
```

7. Herhaal voor meer woorden (zie `server/index.js` voor voorbeelden)

---

## Deel 2: Backend Deployen (Render)

### Stap 1: Code naar GitHub
1. Maak GitHub repository aan
2. Push je code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/jouw-username/frysk-foar-heleen.git
   git push -u origin main
   ```

### Stap 2: Render Account
1. Ga naar [render.com](https://render.com)
2. Sign up met GitHub account
3. Geef Render toegang tot je repositories

### Stap 3: Web Service Aanmaken
1. Klik "New +" → "Web Service"
2. Selecteer je `frysk-foar-heleen` repository
3. Configuratie:
   - **Name**: `frysk-backend`
   - **Region**: Frankfurt (EU Central)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Stap 4: Environment Variables Toevoegen
1. Scroll naar "Environment Variables"
2. Klik "Add Environment Variable"
3. Voeg toe:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://frysk_admin:password@frysk-cluster.xxxxx.mongodb.net/frysk_app
   ```
   (gebruik je eigen connection string!)

4. Klik "Create Web Service"

### Stap 5: Deployment Wachten
- Render bouwt en deploy je server (5-10 minuten)
- Kijk naar de logs voor voortgang
- Wacht tot status **"Live"** is

### Stap 6: Backend URL Opslaan
1. Copy de URL bovenaan:
   ```
   https://frysk-backend-xxxx.onrender.com
   ```
2. Test in browser - je moet zien:
   ```json
   {
     "message": "Frysk Foar Heleen API",
     "status": "running",
     "database": "connected"
   }
   ```

⚠️ **Belangrijk**: Free tier servers slapen na 15 min inactiviteit. Eerste request duurt 30 sec om op te starten.

---

## Deel 3: Frontend Deployen (Vercel)

### Stap 1: Production Environment Variable
1. Maak bestand `.env.production` in root:
   ```env
   VITE_API_URL=https://frysk-backend-xxxx.onrender.com
   ```
   (gebruik je Render URL!)

2. Commit en push:
   ```bash
   git add .env.production
   git commit -m "Add production environment"
   git push
   ```

### Stap 2: Vercel Account
1. Ga naar [vercel.com](https://vercel.com)
2. Sign up met GitHub account
3. Klik "Add New..." → "Project"

### Stap 3: Project Importeren
1. Selecteer `frysk-foar-heleen` repository
2. Framework Preset: **Vite** (auto-detected)
3. Root Directory: `./` (blijf bij root)
4. Build Command: `npm run build` (standaard)
5. Output Directory: `dist` (standaard)

### Stap 4: Environment Variables
1. Open "Environment Variables" sectie
2. Voeg toe:
   ```
   Name: VITE_API_URL
   Value: https://frysk-backend-xxxx.onrender.com
   ```
   (gebruik je Render URL!)

3. **Belangrijk**: Selecteer alle environments (Production, Preview, Development)

### Stap 5: Deploy!
1. Klik "Deploy"
2. Wacht 2-3 minuten
3. Vercel bouwt en deploy je app

### Stap 6: Live URL
1. Copy de URL:
   ```
   https://frysk-foar-heleen.vercel.app
   ```
2. Open in browser en test de app! 🎉

---

## Deel 4: CORS Configuratie (Belangrijk!)

Na deployment moet je CORS updaten in de backend:

### Stap 1: Update Backend Code
1. Open `server/index.js`
2. Vind de `cors()` configuratie
3. Update naar:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://frysk-foar-heleen.vercel.app'  // Jouw Vercel URL
     ],
     credentials: true
   }))
   ```

### Stap 2: Push Update
```bash
git add server/index.js
git commit -m "Add Vercel URL to CORS"
git push
```

Render zal automatisch je server opnieuw deployen!

---

## ✅ Post-Deployment Checklist

- [ ] MongoDB Atlas cluster draait
- [ ] Database bevat minimaal 10 woorden
- [ ] Backend draait op Render
- [ ] Backend API is bereikbaar (test met browser)
- [ ] Frontend draait op Vercel
- [ ] Alle 3 spelletjes werken
- [ ] CORS is correct ingesteld
- [ ] Environment variables zijn correct

---

## 🔧 Custom Domain (Optioneel)

### Vercel Custom Domain
1. Koop een domein (bijv. bij Transip.nl)
2. Ga naar Vercel Project → "Settings" → "Domains"
3. Voeg je domein toe: `fryskfoarheleen.nl`
4. Volg DNS configuratie instructies
5. Wacht op SSL certificaat (automatisch)

---

## 📊 Monitoring & Logs

### Render Logs Bekijken
1. Ga naar Render dashboard
2. Klik op je service
3. Tab "Logs" voor real-time logging
4. Tab "Metrics" voor performance

### Vercel Analytics
1. Ga naar Vercel dashboard
2. Klik op je project
3. Tab "Analytics" (gratis tier: 100k events/maand)

### MongoDB Monitoring
1. Ga naar Atlas dashboard
2. Tab "Metrics" voor database performance
3. Tab "Data Explorer" om data te bekijken/bewerken

---

## 🐛 Troubleshooting

### Backend slaapt steeds
**Probleem**: Free tier slaapt na 15 min inactiviteit  
**Oplossing**: 
- Eerste request duurt 30 sec (normaal)
- Voor altijd actief: upgrade naar $7/maand
- Of gebruik cron job om elke 10 min te pingen

### CORS errors in browser
**Probleem**: "Access blocked by CORS policy"  
**Oplossing**:
- Verifieer Vercel URL in `server/index.js` CORS config
- Push update naar GitHub (Render deploy automatisch)

### Database verbinding mislukt
**Probleem**: "MongoDB connection error"  
**Oplossing**:
- Check MONGODB_URI in Render environment variables
- Verifieer IP whitelist in MongoDB Atlas (0.0.0.0/0)
- Test connection string lokaal eerst

### Vercel build faalt
**Probleem**: "Build failed"  
**Oplossing**:
- Check build logs in Vercel dashboard
- Verifieer `package.json` dependencies
- Test `npm run build` lokaal eerst

---

## 🔄 Updates Deployen

### Backend Update
```bash
# Maak changes in server/
git add .
git commit -m "Update backend"
git push
# Render deploy automatisch!
```

### Frontend Update
```bash
# Maak changes in src/
git add .
git commit -m "Update frontend"
git push
# Vercel deploy automatisch!
```

---

## 💰 Kosten Overzicht

| Service | Gratis Tier | Limit | Kosten bij Overschrijding |
|---------|-------------|-------|---------------------------|
| MongoDB Atlas | ✅ | 512MB storage | $0.08/GB |
| Render | ✅ | 750 uur/maand | $7/maand voor altijd aan |
| Vercel | ✅ | 100GB bandwidth | $20/maand Pro |

**Voor persoonlijk gebruik: altijd gratis!** 🎉

---

## 🎉 Succes!

Je Friese leer-app is nu live op internet!

**Deel met vrienden:**
- Frontend URL: `https://frysk-foar-heleen.vercel.app`
- Werkt op alle devices (desktop, tablet, mobiel)
- Toegankelijk vanaf overal ter wereld

**Veel plezier met leren!** 🇳🇱
