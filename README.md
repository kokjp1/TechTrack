# TechTrack – Sonora

Sonora is een webapplicatie die je Spotify‑luistersessie visualiseert als een draaiende vinylplaat in het midden van het scherm, aangevuld met extra datavisualisaties (zoals een treemap).  
Elke track krijgt zo zijn eigen “custom vinyl”, gebaseerd op eigenschappen van het nummer, de artiest en het album.

## Concept in het kort

- In het midden staat een half afgesneden, minimalistische vinylplaat.
- De vinyl draait alleen als er daadwerkelijk een track speelt op Spotify (live sync).
- Verschillende eigenschappen van de plaat zijn gekoppeld aan Spotify‑data, bijvoorbeeld:
  - **Grootte van de plaat** → populariteitscore van het nummer
  - **Rotatiesnelheid** → duur van de track of populariteit
  - **Aantal groeven** → releasejaar (ouder = meer groeven)
  - **Kleur & glow** → kleuren uit de albumcover (via bijv. `node-vibrant`)
- Aanvullende visualisaties (zoals een treemap) tonen o.a. verdeling van genres en artiesten binnen je sessie.

Doel: niet een droog statistiekendashboard, maar een visuele, speelse manier om te zien hoe jouw muziek “aanvoelt”.

---

## Voor wie is dit?

- Muziekliefhebbers die hun luistergedrag willen verkennen.
- Designers en makers die geïnteresseerd zijn in data‑gedreven visualisaties.
- Studenten / data‑nerds die willen spelen met real‑time Spotify‑data.
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

---

## To‑do

### UI / UX

- [ ] Fix: album + artist line layout.
- [ ] Vinyl pauzeren als het liedje op pauze staat.
- [ ] “Legenda” voor de vinyl toevoegen (uitleg).
- [ ] Onboarding maken die uitlegt wat het doel van de app is.
- [ ] Pause / play / next controls integreren.

### Visualisatie / data‑weergave

- [ ] Textueel verhaaltje (templating) fixen onder de treemap.
- [ ] Nice‑to‑have: klikken op een legenda‑genre om te filteren op dat genre.
- [ ] Nice‑to‑have: klikken op een genre in de visualisatie opent de Wikipedia‑pagina van dat genre.

*(Reeds gedaan of tijdelijk gepauzeerd – ter referentie)*

- [ ] Song image toevoegen aan tooltip bij treemap ⌛
- [ ] Treemap kleuren zelf doen ⌛
- [ ] Filters / sorteeropties toevoegen aan treemap ⌛
- [ ] Record/stopbutton netter positioneren (en history button) ⌛
- [ ] Terugknop mooier maken op treemap‑pagina ⌛
- [ ] Buttons op recap‑pagina mooier maken ⌛
- [ ] Mobiele responsiveness checken ⌛  
  - [ ] Barcode mogelijk verticaal maken op mobile (slice i.p.v. dice + meer height) ⌛
- [x] Popularity tooltips netter maken (niet openen als je over de area hovert) ✅

### Techniek / kwaliteit

- [ ] Console‑error fixen voor als er geen song speelt.
- [ ] Connection status fixen (Spotify connected / sessie verlopen).
- [ ] Code opschonen 🔁

---

## Referenties & inspiratie

Structuur en API‑design:

- https://dev.to/larswaechter/how-i-structure-my-rest-apis-11k4  
- https://www.thatsoftwaredude.com/content/12869/a-simple-nextjs-api-folder-structure  
- https://www.reddit.com/r/golang/comments/tfmzv6/rest_api_folder_structure/

D3 / SVG:

- https://github.com/edeno/d3-save-svg/blob/gh-pages/README.md

---