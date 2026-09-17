# GymTracker Web App 🏋️‍♂️

Applicazione web progressiva (PWA / mobile-first) progettata per il monitoraggio avanzato degli allenamenti in palestra, con autenticazione multi-utente, guida passo per passo agli esercizi, illustrazioni vettoriali degli attrezzi, timer di recupero e grafici interattivi sull'evoluzione dei carichi reali.

Disponibile online su GitHub Pages:  
👉 **https://luca-dionisio.github.io/gymtracker/**

---

## 🔐 Credenziali Predefinite

L'applicazione è configurata con un profilo utente iniziale predefinito:
- **Email / Nome Utente:** `dionisio.luca@gmail.com`
- **Password:** `andersen`

È inoltre presente il pulsante **"⚡ Accesso rapido (Luca)"** nella schermata di login per accedere con un singolo tocco su smartphone.

### Profili Multi-Utente
- È possibile creare ulteriori account dalla schermata **"Registrati"** (es. per compagni di allenamento o personal trainer).
- Ciascun utente ha il proprio database segregato in localStorage (`gym_tracker_{userId}_history`, `gym_tracker_{userId}_active`):
  - I carichi registrati non vengono sovrascritti o condivisi tra profili diversi.
  - La sessione in corso di un utente resta salvata e non interferisce con gli altri utenti.
  - Il pulsante di disconnessione (logout) è posizionato direttamente nell'angolo superiore dell'header.

---

## 📱 Caratteristiche Principali

1. **Ottimizzazione Mobile & Dark Gym Theme:**
   - Palette scura ad alto contrasto (sfondo antracite `#0a0d14`, accenti ciano `#38bdf8` e verde smeraldo `#10b981`).
   - Touch target minimi di 48px con feedback tattile (vibrazione aptica supportata).
   - Prevenzione dello zoom accidentale su iOS/Android (`font-size: 16px` sugli input).

2. **3 Sessioni Settimanali Strutturate (A, B, C):**
   - **Sessione A:** Gambe, Petto & Spalle (Squat, Chest press, Shoulder press, Crunch, ecc.).
   - **Sessione B:** Dorso, Petto & Braccia (Lat machine, Chest press, Pulley, Bicipiti, Tricipiti, Plank).
   - **Sessione C:** Gambe, Spalle & Progressione (Leg press, Alzate laterali, Rematore, ecc.).

3. **Guida Esercizio Passo-Passo:**
   - Illustrazione vettoriale chiara e moderna di ogni attrezzo da palestra.
   - Indicazione di serie previste, ripetizioni obiettivo, recupero e carico suggerito.
   - Tracciamento visivo delle singole serie (checkbox interattive).

4. **Validazione Obbligatoria del Carico Reale:**
   - Prima di passare all'esercizio successivo, l'app richiede obbligatoriamente il peso effettivo utilizzato.
   - Stepper rapido con bottoni dedicati (`−2.5 kg`, `+1 kg`, `+2.5 kg`, `+5 kg`) o inserimento numerico diretto.

5. **Timer di Recupero Flottante:**
   - Timer acustico e con vibrazione tra le serie, regolabile al volo (`+15s`, `−15s`).

6. **Riepilogo & Grafici di Progressione:**
   - Grafico ad area/linea dell'evoluzione del peso reale per ciascun esercizio nel tempo.
   - Grafico a barre del volume di allenamento e cronologia dettagliata di tutte le sessioni svolte.
