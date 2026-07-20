# MongoDB Setup Guide

Complete instructies voor het opzetten van je MongoDB database voor Frysk Foar Heleen.

## 🗄️ Database Structuur

### Database: `frysk_app`
### Collections:
- `words` - Individuele woorden
- `sentences` - Hele zinnen
- `sounds` - Klankcombinaasjes en uitspraak

## 📝 Schemas

### Words Schema
```javascript
{
  _id: ObjectId,              // Auto-generated
  frisian: String,            // Fries woord (verplicht)
  dutch: String,              // Nederlandse vertaling (verplicht)
  pronunciation: String,      // Uitspraak hulp
  audioUrl: String | null,    // Pad naar audio bestand
  category: String,           // Categorie (familie, tijd, etc.)
  difficulty: Number,         // 1-5 (makkelijk naar moeilijk)
  createdAt: Date            // Aanmaak datum
}
```

### Sentences Schema
```javascript
{
  _id: ObjectId,              // Auto-generated
  frisian: String,            // Friese zin (verplicht)
  dutch: String,              // Nederlandse vertaling (verplicht)
  pronunciation: String,      // Uitspraak hulp
  audioUrl: String | null,    // Pad naar audio bestand
  createdAt: Date            // Aanmaak datum
}
```

### Sounds Schema
```javascript
{
  _id: ObjectId,              // Auto-generated
  combination: String,        // Lettercombinaasje (verplicht)
  pronunciation: String,      // Uitspraak uitleg (verplicht)
  example: String,            // Voorbeeld woorden
  audioUrl: String | null     // Pad naar audio bestand
}
```

## 🚀 Snelle Start

### Optie 1: MongoDB Atlas (Aanbevolen voor productie)

1. **Maak gratis account**: https://www.mongodb.com/cloud/atlas
2. **Maak cluster** (M0 Sandbox - gratis)
3. **Maak database user** met read/write rechten
4. **Whitelist IP**: 0.0.0.0/0 (of specifiek IP)
5. **Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/frysk_app
   ```

### Optie 2: Lokaal (Development)

1. **Installeer MongoDB**: https://www.mongodb.com/try/download/community
2. **Start MongoDB**:
   ```bash
   mongod --dbpath /path/to/data
   ```
3. **Connection String**:
   ```
   mongodb://localhost:27017/frysk_app
   ```

## 🌱 Data Importeren (AANBEVOLEN)

### Automatisch met Seed Script

De makkelijkste manier om woorden en zinnen te importeren:

1. **Zorg dat MONGODB_URI is ingesteld** in `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frysk_app
   ```

2. **Navigeer naar server directory**:
   ```bash
   cd server
   ```

3. **Run seed script**:
   ```bash
   npm run seed
   ```
   
   Dit importeert automatisch:
   - Alle woorden uit `words-data.json`
   - Alle zinnen uit `sentences-data.json`
   - Alle klanken uit `sounds-data.json`

4. **Om bestaande data te vervangen**:
   ```bash
   npm run seed:clear
   ```
   ⚠️ Dit verwijdert ALLE bestaande woorden, zinnen en klanken en importeert ze opnieuw!

### Wat doet het seed script?
- ✅ Controleert of collecties al data bevatten
- ✅ Importeert alleen als collecties leeg zijn (safe)
- ✅ Geeft duidelijke feedback over wat er gebeurt
- ✅ Importeert woorden, zinnen en klanken in één keer

## 📊 Initiële Data (Handmatig)

### Via MongoDB Compass

1. **Download Compass**: https://www.mongodb.com/try/download/compass
2. **Connect** met je connection string
3. **Maak database**: `frysk_app`
4. **Maak collection**: `words`
5. **Insert Document** → Copy onderstaande JSON

### Voorbeeld Woorden

```json
[
  {
    "frisian": "hûs",
    "dutch": "huis",
    "pronunciation": "hoos",
    "audioUrl": null,
    "category": "zelfstandig naamwoord",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "heit",
    "dutch": "vader",
    "pronunciation": "hait",
    "audioUrl": null,
    "category": "familie",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "mem",
    "dutch": "moeder",
    "pronunciation": "mem",
    "audioUrl": null,
    "category": "familie",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "wetter",
    "dutch": "water",
    "pronunciation": "vetter",
    "audioUrl": null,
    "category": "zelfstandig naamwoord",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "wyn",
    "dutch": "wind",
    "pronunciation": "win",
    "audioUrl": null,
    "category": "zelfstandig naamwoord",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "leafde",
    "dutch": "liefde",
    "pronunciation": "leevde",
    "audioUrl": null,
    "category": "zelfstandig naamwoord",
    "difficulty": 2,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "boek",
    "dutch": "boek",
    "pronunciation": "book",
    "audioUrl": null,
    "category": "zelfstandig naamwoord",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "berntsje",
    "dutch": "kind",
    "pronunciation": "berntsjuh",
    "audioUrl": null,
    "category": "familie",
    "difficulty": 2,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "dei",
    "dutch": "dag",
    "pronunciation": "dai",
    "audioUrl": null,
    "category": "tijd",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  },
  {
    "frisian": "nacht",
    "dutch": "nacht",
    "pronunciation": "nacht",
    "audioUrl": null,
    "category": "tijd",
    "difficulty": 1,
    "createdAt": {"$date": "2026-07-17T12:00:00.000Z"}
  }
]
```

### Via MongoDB Shell

```javascript
// Connect naar database
use frysk_app

// Insert meerdere documenten
db.words.insertMany([
  {
    frisian: "hûs",
    dutch: "huis",
    pronunciation: "hoos",
    audioUrl: null,
    category: "zelfstandig naamwoord",
    difficulty: 1,
    createdAt: new Date()
  },
  // ... meer woorden
])

// Verifieer
db.words.countDocuments()
db.words.find().pretty()
```

## 🔍 Handige Queries

### Woorden

#### Alle woorden
```javascript
db.words.find()
```

### Woorden per categorie
```javascript
db.words.find({ category: "familie" })
```

### Makkelijke woorden
```javascript
db.words.find({ difficulty: 1 })
```

### Zoek specifiek woord
```javascript
db.words.find({ frisian: "hûs" })
```

### Random woorden (voor spel)
```javascript
db.words.aggregate([{ $sample: { size: 5 } }])
```

### Update woord
```javascript
db.words.updateOne(
  { frisian: "hûs" },
  { $set: { audioUrl: "audio/huus.mp3" } }
)
```

### Voeg woord toe
```javascript
db.words.insertOne({
  frisian: "freon",
  dutch: "vriend",
  pronunciation: "fre-un",
  audioUrl: null,
  category: "mensen",
  difficulty: 2,
  createdAt: new Date()
})
```

### Zinnen

#### Alle zinnen
```javascript
db.sentences.find()
```

#### Random zinnen (voor spel)
```javascript
db.sentences.aggregate([{ $sample: { size: 5 } }])
```

#### Voeg zin toe
```javascript
db.sentences.insertOne({
  frisian: "Ik yt in appel",
  dutch: "Ik eet een appel",
  pronunciation: "ik eet in appel",
  audioUrl: null,
  createdAt: new Date()
})
```

#### Update zin
```javascript
db.sentences.updateOne(
  { frisian: "Hoe giet it mei dy?" },
  { $set: { audioUrl: "hoe-giet-it.mp3" } }
)
```

### Algemeen

### Verwijder document
```javascript
db.words.deleteOne({ frisian: "test" })
db.sentences.deleteOne({ frisian: "test zin" })
```

## 📁 Categorieën

Aanbevolen categorieën:
- `familie` - Familieleden
- `zelfstandig naamwoord` - Algemene zelfstandige naamwoorden
- `tijd` - Tijd gerelateerd (dag, nacht, etc.)
- `kleuren` - Kleuren
- `getallen` - Nummers
- `werkwoorden` - Acties
- `bijvoeglijk naamwoord` - Beschrijvende woorden
- `voedsel` - Eten en drinken
- `dieren` - Dieren
- `natuur` - Natuur elementen

## 🎚️ Moeilijkheidsgraden

- **1** - Basis woorden (huis, water, dag)
- **2** - Veelvoorkomend (familie woorden, kleuren)
- **3** - Gemiddeld (complexere concepten)
- **4** - Gevorderd (abstract, specifiek)
- **5** - Expert (zeldzaam, dialectisch)

## 🔐 Security Best Practices

### Voor Productie
1. **Maak dedicated database user** per applicatie
2. **Beperk IP whitelist** tot specifieke servers
3. **Gebruik sterke passwords** (min. 16 karakters)
4. **Enable authentication** altijd
5. **Regular backups** (Atlas doet dit automatisch)

### Connection String Veilig Houden
```bash
# NOOIT in code committen!
# Gebruik environment variables

# .env file (niet in git!)
MONGODB_URI=mongodb+srv://user:pass@cluster.net/frysk_app
```

## 🔄 Backup & Restore

### Atlas (Automatisch)
- Daily snapshots (gratis tier)
- Point-in-time restore (betaalde tiers)
- Download via UI mogelijk

### Handmatig Export
```bash
# Export naar JSON
mongoexport --uri="mongodb+srv://..." --collection=words --out=words.json

# Import van JSON
mongoimport --uri="mongodb+srv://..." --collection=words --file=words.json
```

## 📈 Indexing (Voor Performance)

```javascript
// Index op Fries woord (sneller zoeken)
db.words.createIndex({ frisian: 1 })

// Index op categorie (voor filters)
db.words.createIndex({ category: 1 })

// Compound index (categorie + difficulty)
db.words.createIndex({ category: 1, difficulty: 1 })

// Text search index (zoeken in alle velden)
db.words.createIndex({ 
  frisian: "text", 
  dutch: "text" 
})
```

## 🐛 Troubleshooting

### Connection weigert
- Check IP whitelist in Atlas
- Verifieer username/password
- Test met MongoDB Compass eerst

### Slow queries
- Add indexes op vaak-gezochte velden
- Check Atlas Performance Advisor

### Storage vol (512MB gratis)
- Verwijder oude/test data
- Upgrade naar M2 tier ($9/maand voor 2GB)

## 📚 Meer Leren

- [MongoDB Docs](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Gratis courses
- [Atlas Documentation](https://docs.atlas.mongodb.com/)

## ✅ Checklist

- [ ] MongoDB Atlas account aangemaakt
- [ ] Cluster created (M0 gratis tier)
- [ ] Database user met credentials
- [ ] IP whitelist geconfigureerd
- [ ] Connection string opgeslagen in `.env`
- [ ] Database `frysk_app` bestaat
- [ ] Collection `words` bestaat
- [ ] Collection `sentences` bestaat
- [ ] Collection `sounds` bestaat
- [ ] Data geïmporteerd met `npm run seed`
- [ ] Backend kan verbinden
- [ ] Indexes aangemaakt (optioneel)
