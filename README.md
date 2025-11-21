# TechTrack – Sonora

Sonora is een webapplicatie die je Spotify‑luistersessie visualiseert als een draaiende vinylplaat in het midden van het scherm, aangevuld met extra datavisualisaties.   Elke track krijgt zo zijn eigen “custom vinyl”, gebaseerd op eigenschappen van het nummer, de artiest en het album.

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

- [ ] Vinyl pauzeren als het liedje op pauze staat.
- [ ] “Legenda” voor de vinyl toevoegen (uitleg).

### Visualisatie / data‑weergave

- [ ] Textueel verhaaltje (templating) fixen onder de treemap.

### Techniek / kwaliteit

- [ ] Console‑error fixen voor als er geen song speelt.
- [ ] Code opschonen 🔁

### Als ik meer tijd gehad zou hebben;

- Pause / play / next controls integreren
- Nice‑to‑have: klikken op een legenda‑genre om te filteren op dat genre.
- Nice‑to‑have: klikken op een genre in de visualisatie opent de Wikipedia‑pagina van dat genre.

---
