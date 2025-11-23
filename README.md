# TechTrack – Sonora

Sonora is een webapplicatie die je Spotify‑luistersessie visualiseert als een draaiende vinylplaat in het midden van het scherm, aangevuld met extra datavisualisaties. Elke track krijgt zo zijn eigen “custom vinyl”, gebaseerd op eigenschappen van het nummer, de artiest en het album.

![Sonora Cover](https://github.com/kokjp1/TechTrack/blob/main/wiki/homepage.png)

## Concept in het kort

- In het midden staat een half afgesneden, minimalistische vinylplaat.
- De vinyl draait alleen als er daadwerkelijk een track speelt op Spotify (live sync).
- Verschillende eigenschappen van de plaat zijn gekoppeld aan Spotify‑data, bijvoorbeeld:
  - **Grootte van de plaat** → populariteitscore van het nummer
  - **Rotatiesnelheid** → duur van de track of populariteit
  - **Aantal groeven** → releasejaar (ouder = meer groeven)
  - **Kleur & glow** → kleuren uit de albumcover (via bijv. `node-vibrant`)
- Aanvullende visualisaties (zoals een treemap) tonen o.a. verdeling van genres en artiesten binnen je sessie.

---

## Voor wie is dit?

- Muziekliefhebbers die hun luistergedrag willen verkennen.
- Designers en makers die geïnteresseerd zijn in data‑gedreven visualisaties.
- Iedereen die nieuwsgierig is hoe hun muziek eruitziet als visuele vinylplaat.

---

## Belangrijkste features (huidig + gepland)

- Live koppeling met Spotify (auth + huidige track).
- Vinylvisualisatie die reageert op:
  - trackduur, populariteit, releasejaar, albumcover.
- Extra visualisaties zoals de treemap voor:
  - genres, artiesten, sessies, etc.
- Tekstuele samenvatting onder de treemap (“verhaaltje”).
- Onboarding en uitleg van het concept.
- Connection status (Spotify sessie actief / verlopen).

<img src="https://github.com/kokjp1/TechTrack/blob/main/wiki/session.png" width="50%"><img src="https://github.com/kokjp1/TechTrack/blob/main/wiki/recap.png" width="50%">
<img src="https://github.com/kokjp1/TechTrack/blob/main/wiki/treemap.png">

---

## To‑do

### UI / UX

- [x] Vinyl pauzeren als het liedje op pauze staat.
- [x] “Legenda” voor de vinyl toevoegen (uitleg).

### Visualisatie / data‑weergave

- [ ] Textueel verhaaltje (templating) fixen onder de treemap.

### Techniek / kwaliteit

- [ ] Console‑error fixen voor als er geen song speelt.

### Als ik meer tijd gehad zou hebben;

- Pause / play / next controls integreren
- Nice‑to‑have: klikken op een legenda‑genre om te filteren op dat genre.
- Nice‑to‑have: klikken op een genre in de visualisatie opent de Wikipedia‑pagina van dat genre.

---

## Sonora lokaal draaien

Wil je zelf met Sonora spelen of aan de code sleutelen? Zo start je het project lokaal op je eigen machine.

### 1. Vereisten

- **Node.js** (aanbevolen versie: Meest up-to-date)
- **npm** (package manager)
- Een **Spotify Developer account** + een aangemaakte **app** in het Spotify Dashboard:
  - Client ID
  - Redirect URL die wij in de app gebruiken (bijv. `http://127.0.0.1:5173/callback` of wat jij in je project hebt ingesteld)
    > ivm opgeschroefte veiligheidsmaatregelen MOET je `http://127.0.0.1:5173/callback` gebruiken, en niet localhost.

---

### 2. Repo clonen en dependencies installeren

```bash
# Clone de repository
git clone https://github.com/kokjp1/TechTrack.git
cd TechTrack

# Installeer dependencies
npm install
```

---

### 3. Environment variables instellen

Maak een `.env` in de root van het project en vul daar de benodigde Spotify-variabelen in:

```bash
SPOTIFY_CLIENT_ID=je_client_id
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
SPOTIFY_SCOPES=user-read-currently-playing user-read-playback-state
```

> Uiteindelijk verander je de REDIRECT_URI naar" `www.domein.com/callback`

Pas de namen/waarden aan op basis van hoe het in jouw project is opgezet.

---

### 4. Vite.config.js aanpassen

Wegens eerder benoemde veiligheidsmaatregelen wilt spotify dat je development via `127.0.0.1:5173` verricht, en niet via localhost:5173. Om dit de Vite standard te maken voor dit project; moet `⚡ vite.config.js` er zo uit zien:

```js
export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '127.0.0.1',
		port: 5173,
		strictPort: true
		// Wegens veiligheidsmaatregelen van de spotify API MOET de host (helaas handmatig) gezet worden op 127.0.0.1 ipv alleen localhost:5173
	}
});
```

---

### 5. Development server starten

```bash
npm run dev
```

Open vervolgens de link die in de terminal verschijnt, meestal:

```text
http://127.0.0.1:5173
```

Log in met je Spotify-account via de knop in de app.
Zodra de koppeling gelukt is en er een track speelt op je Spotify-account, begint de vinylvisualisatie live mee te bewegen met jouw sessie.
