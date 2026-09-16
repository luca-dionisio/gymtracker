/**
 * app.js
 * Controller principale dell'applicazione GymTracker.
 * Gestisce la navigazione, il flusso guidato dell'allenamento passo per passo,
 * la validazione del peso reale obbligatorio e l'aggiornamento dei grafici.
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  activeSession: null,      // Oggetto sessione in corso
  currentExerciseIndex: 0,  // Indice esercizio corrente
  activeTab: "dashboard",   // Tab visualizzata: 'dashboard' | 'workout' | 'summary' | 'plan'
  selectedChartExercise: "Chest press",

  /**
   * Inizializzazione dell'applicazione
   */
  init() {
    this.bindEvents();
    this.initTimerUI();
    this.populateExerciseSelect();
    this.renderPlanView("A");
    this.refreshDashboardStats();

    // Controlla se c'è una sessione attiva salvata
    const savedActive = StorageService.getActiveWorkout();
    if (savedActive && savedActive.exercises && savedActive.exercises.length > 0) {
      this.restoreActiveWorkout(savedActive);
    } else {
      this.switchTab("dashboard");
    }

    // Se non ci sono dati storici, mostra un avviso amichevole
    const history = StorageService.getHistory();
    if (history.length === 0) {
      // Inizializza con visualizzazione vuota
    } else {
      this.updateSummaryCharts();
    }
  },

  /**
   * Collega tutti gli ascoltatori di eventi DOM
   */
  bindEvents() {
    // Navigazione Bottom Tab Bar
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });

    // Selezione Sessione A, B, C dalla Dashboard
    document.querySelectorAll(".session-select-card").forEach(card => {
      card.addEventListener("click", () => {
        const sessionId = card.dataset.session;
        this.startWorkout(sessionId);
      });
    });

    // Segmented control per la visualizzazione della scheda
    document.querySelectorAll(".plan-tabs-segmented .segment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".plan-tabs-segmented .segment-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderPlanView(btn.dataset.plan);
      });
    });

    // Selettore esercizio per i grafici
    const exerciseSelect = document.getElementById("exerciseChartSelect");
    if (exerciseSelect) {
      exerciseSelect.addEventListener("change", (e) => {
        this.selectedChartExercise = e.target.value;
        GymCharts.renderExerciseProgression("exerciseChartCanvas", this.selectedChartExercise);
      });
    }

    // Bottoni gestione dati (Demo, Export, Import, Reset)
    const btnDemo = document.getElementById("btnLoadDemoData");
    if (btnDemo) {
      btnDemo.addEventListener("click", () => {
        if (confirm("Vuoi caricare 3 settimane di allenamenti dimostrativi per testare i grafici di progresso?")) {
          StorageService.loadDemoData();
          this.refreshDashboardStats();
          this.updateSummaryCharts();
          this.renderHistoryList();
          alert("Dati demo caricati con successo! Controlla i grafici qui sotto.");
        }
      });
    }

    const btnExport = document.getElementById("btnExportData");
    if (btnExport) {
      btnExport.addEventListener("click", () => StorageService.exportData());
    }

    const btnImport = document.getElementById("btnImportData");
    const fileImportInput = document.getElementById("fileImportInput");
    if (btnImport && fileImportInput) {
      btnImport.addEventListener("click", () => fileImportInput.click());
      fileImportInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = StorageService.importData(event.target.result);
          if (res.success) {
            alert(`Importati con successo ${res.count} allenamenti!`);
            this.refreshDashboardStats();
            this.updateSummaryCharts();
            this.renderHistoryList();
          } else {
            alert("Errore nell'importazione: " + res.error);
          }
        };
        reader.readAsText(file);
      });
    }

    const btnClear = document.getElementById("btnClearData");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        if (confirm("Sei sicuro di voler azzerare tutti i dati registrati? L'azione è irreversibile.")) {
          StorageService.clearAll();
          this.refreshDashboardStats();
          this.updateSummaryCharts();
          this.renderHistoryList();
          this.abandonWorkout(false);
          alert("Tutti i dati sono stati cancellati.");
        }
      });
    }

    // Tasto annulla allenamento in corso
    const btnCancelWorkout = document.getElementById("btnCancelWorkout");
    if (btnCancelWorkout) {
      btnCancelWorkout.addEventListener("click", () => {
        if (confirm("Vuoi interrompere l'allenamento in corso? I dati non salvati andranno persi.")) {
          this.abandonWorkout(true);
        }
      });
    }

    // Tasto chiusura modal celebrazione
    const btnCloseRecap = document.getElementById("btnCloseRecap");
    if (btnCloseRecap) {
      btnCloseRecap.addEventListener("click", () => {
        document.getElementById("workoutRecapModal").classList.remove("open");
        this.switchTab("summary");
      });
    }
  },

  /**
   * Cambia tab attiva e sincronizza l'interfaccia
   */
  switchTab(tabName) {
    this.activeTab = tabName;

    // Aggiorna classi active nei bottoni nav
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Mostra la sezione corretta
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const targetSection = document.getElementById(`view-${tabName}`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Azioni specifiche per tab
    if (tabName === "summary") {
      this.updateSummaryCharts();
    } else if (tabName === "history") {
      this.renderHistoryList();
    } else if (tabName === "dashboard") {
      this.refreshDashboardStats();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  /**
   * Aggiorna le metriche della dashboard
   */
  refreshDashboardStats() {
    const history = StorageService.getHistory();
    const totalWorkouts = history.length;
    document.getElementById("statTotalWorkouts").textContent = totalWorkouts;

    // Calcolo streak o ultima data
    if (history.length > 0) {
      const last = history[0];
      const d = new Date(last.date);
      document.getElementById("statLastDate").textContent = `${d.getDate()}/${d.getMonth() + 1}`;
      document.getElementById("statLastSession").textContent = `Sess. ${last.sessionId}`;
    } else {
      document.getElementById("statLastDate").textContent = "-";
      document.getElementById("statLastSession").textContent = "Nessuna";
    }

    // Badge sessione in corso nell'header
    const headerBadge = document.getElementById("headerActiveBadge");
    if (this.activeSession) {
      headerBadge.style.display = "inline-flex";
      document.getElementById("headerSessionLetter").textContent = this.activeSession.sessionId;
    } else {
      headerBadge.style.display = "none";
    }
  },

  /**
   * Avvia una nuova sessione di allenamento (A, B, o C)
   */
  startWorkout(sessionId) {
    const config = WORKOUT_SESSIONS[sessionId];
    if (!config) return;

    // Clona la configurazione degli esercizi per la sessione corrente
    const sessionExercises = config.exercises.map(ex => {
      // Cerca se esiste un peso utilizzato nella sessione precedente
      const prev = StorageService.getLastWeightForExercise(ex.name);
      const initialWeight = prev ? prev.weight : ex.defaultWeight;

      // Crea le serie
      const sets = [];
      for (let s = 1; s <= ex.sets; s++) {
        sets.push({
          setNumber: s,
          repsPlanned: ex.reps,
          weight: initialWeight,
          completed: false
        });
      }

      return {
        ...ex,
        setsData: sets,
        actualWeight: initialWeight,
        confirmed: false
      };
    });

    this.activeSession = {
      id: `workout_${Date.now()}`,
      sessionId: sessionId,
      sessionTitle: config.title,
      startTime: new Date().toISOString(),
      exercises: sessionExercises
    };

    this.currentExerciseIndex = 0;
    StorageService.saveActiveWorkout(this.activeSession);
    this.refreshDashboardStats();
    this.renderCurrentExercise();
    this.switchTab("workout");
  },

  /**
   * Ripristina una sessione attiva da localStorage
   */
  restoreActiveWorkout(savedState) {
    this.activeSession = savedState;
    // Trova il primo esercizio non ancora confermato
    const firstUnfinished = this.activeSession.exercises.findIndex(e => !e.confirmed);
    this.currentExerciseIndex = firstUnfinished !== -1 ? firstUnfinished : 0;
    this.renderCurrentExercise();
    this.refreshDashboardStats();
  },

  /**
   * Renderizza l'esercizio corrente nel Workout Player
   */
  renderCurrentExercise() {
    if (!this.activeSession) return;

    const totalExercises = this.activeSession.exercises.length;
    const currentEx = this.activeSession.exercises[this.currentExerciseIndex];
    if (!currentEx) return;

    // Header & Progresso
    document.getElementById("workoutProgressText").textContent = `Esercizio ${this.currentExerciseIndex + 1} di ${totalExercises}`;
    document.getElementById("workoutSessionTag").textContent = `Sessione ${this.activeSession.sessionId}`;
    const progressPercent = ((this.currentExerciseIndex) / totalExercises) * 100;
    document.getElementById("workoutProgressFill").style.width = `${progressPercent}%`;

    // Titolo e note
    document.getElementById("exerciseTitle").textContent = currentEx.name;
    document.getElementById("exerciseNotes").textContent = currentEx.notes;

    // Attrezzo - Grafica SVG e Metadati
    const equipKey = currentEx.equipmentKey || "corpo_libero";
    const equipInfo = EQUIPMENT_CATALOG[equipKey] || { name: "Attrezzo da palestra", category: "Standard" };
    const artContainer = document.getElementById("equipmentArtContainer");
    artContainer.innerHTML = EQUIPMENT_SVGS[equipKey] || EQUIPMENT_SVGS["corpo_libero"];

    document.getElementById("equipmentNameTag").textContent = equipInfo.name;
    document.getElementById("equipmentCategoryTag").textContent = equipInfo.category;

    // Target Chips
    document.getElementById("targetSets").textContent = `${currentEx.sets} serie`;
    document.getElementById("targetReps").textContent = currentEx.reps;
    document.getElementById("targetWeight").textContent = currentEx.targetWeight;
    document.getElementById("targetRest").textContent = `${currentEx.restSeconds}s`;

    // Riferimento Ultima Volta
    const lastSession = StorageService.getLastWeightForExercise(currentEx.name);
    const lastRefEl = document.getElementById("lastWeightRef");
    if (lastSession) {
      lastRefEl.style.display = "flex";
      document.getElementById("lastWeightValue").textContent = `${lastSession.weight} kg (${lastSession.date})`;
    } else {
      lastRefEl.style.display = "none";
    }

    // Inserimento Peso Reale
    const weightInput = document.getElementById("realWeightInput");
    const weightUnit = document.getElementById("realWeightUnit");
    const inputSection = document.getElementById("weightInputSection");
    inputSection.classList.remove("error-highlight");
    document.getElementById("weightValidationAlert").classList.remove("show");

    if (currentEx.isBodyweight) {
      weightUnit.textContent = "sec / kg";
      weightInput.value = currentEx.actualWeight || 0;
    } else {
      weightUnit.textContent = "kg";
      weightInput.value = currentEx.actualWeight || currentEx.defaultWeight || 0;
    }

    // Serie Log Checklist
    this.renderSetsTracker(currentEx);

    // Testo Pulsante Prossimo / Fine
    const isLast = this.currentExerciseIndex === totalExercises - 1;
    const nextBtn = document.getElementById("btnNextExercise");
    nextBtn.innerHTML = isLast
      ? `<span>Concludi Allenamento</span>
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
      : `<span>Completa & Prossimo Esercizio</span>
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;

    // Gestione Eventi Stepper Peso
    this.bindStepperButtons(currentEx);
  },

  /**
   * Collega i pulsanti per incrementare / decrementare il peso
   */
  bindStepperButtons(currentEx) {
    const input = document.getElementById("realWeightInput");

    const updateWeight = (val) => {
      let num = parseFloat(val);
      if (isNaN(num) || num < 0) num = 0;
      num = Math.round(num * 10) / 10;
      input.value = num;
      currentEx.actualWeight = num;
      // Aggiorna anche le serie non ancora completate
      currentEx.setsData.forEach(s => {
        if (!s.completed) s.weight = num;
      });
      StorageService.saveActiveWorkout(this.activeSession);
      this.renderSetsTracker(currentEx);
    };

    // Tasti - e + rotondi principali
    document.getElementById("btnMinusWeight").onclick = () => {
      const step = currentEx.isBodyweight ? 5 : 2.5;
      updateWeight(parseFloat(input.value || 0) - step);
    };

    document.getElementById("btnPlusWeight").onclick = () => {
      const step = currentEx.isBodyweight ? 5 : 2.5;
      updateWeight(parseFloat(input.value || 0) + step);
    };

    // Bottoni incremento rapido (+1, +2.5, +5, -2.5)
    document.querySelectorAll(".btn-pill-increment").forEach(btn => {
      btn.onclick = () => {
        const delta = parseFloat(btn.dataset.delta);
        updateWeight(parseFloat(input.value || 0) + delta);
      };
    });

    // Input manuale da tastiera
    input.oninput = () => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        currentEx.actualWeight = val;
        StorageService.saveActiveWorkout(this.activeSession);
      }
    };

    // Pulsante Procedi al prossimo esercizio con VALIDAZIONE OBBLIGATORIA
    document.getElementById("btnNextExercise").onclick = () => {
      this.submitAndProceedToNext(currentEx);
    };
  },

  /**
   * Renderizza la lista delle serie con checkbox e carico specifico
   */
  renderSetsTracker(currentEx) {
    const container = document.getElementById("setsRowsContainer");
    container.innerHTML = "";

    currentEx.setsData.forEach((setData, idx) => {
      const row = document.createElement("div");
      row.className = "set-item-row";
      row.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="set-badge-label">Serie ${setData.setNumber}</span>
          <span class="text-xs text-slate-400">(${setData.repsPlanned} reps)</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <input type="number" step="0.5" class="set-weight-input" value="${setData.weight}" data-index="${idx}">
            <span class="text-xs text-slate-400">${currentEx.isBodyweight ? "s" : "kg"}</span>
          </div>
          <button type="button" class="set-check-btn ${setData.completed ? "completed" : ""}" data-index="${idx}" title="Segna serie completata">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </button>
        </div>
      `;

      // Input peso per singola serie
      const weightInput = row.querySelector(".set-weight-input");
      weightInput.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value) || 0;
        setData.weight = val;
        StorageService.saveActiveWorkout(this.activeSession);
      });

      // Spunta completamento serie
      const checkBtn = row.querySelector(".set-check-btn");
      checkBtn.addEventListener("click", () => {
        setData.completed = !setData.completed;
        checkBtn.classList.toggle("completed", setData.completed);
        
        // Se si completa la serie, avvia automaticamente il timer di recupero!
        if (setData.completed) {
          GymTimer.playBeep(660, 0.1);
          this.triggerRestTimer(currentEx.restSeconds);
        }
        StorageService.saveActiveWorkout(this.activeSession);
      });

      container.appendChild(row);
    });
  },

  /**
   * VALIDAZIONE E AVANZAMENTO:
   * Prima di procedere all'esercizio successivo, richiede e valida
   * il peso reale utilizzato durante la sessione di allenamento.
   */
  submitAndProceedToNext(currentEx) {
    const input = document.getElementById("realWeightInput");
    const weightVal = parseFloat(input.value);
    const alertBox = document.getElementById("weightValidationAlert");
    const inputSection = document.getElementById("weightInputSection");

    // Validazione: il peso non può essere vuoto o NaN (per corpo libero è concesso 0 o secondi)
    if (isNaN(weightVal) || (!currentEx.isBodyweight && weightVal <= 0)) {
      alertBox.classList.add("show");
      inputSection.classList.add("error-highlight");
      input.focus();
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      return;
    }

    // Validazione superata: salva il carico confermato
    alertBox.classList.remove("show");
    inputSection.classList.remove("error-highlight");

    currentEx.actualWeight = weightVal;
    currentEx.confirmed = true;

    // Calcola il peso massimo utilizzato tra le serie
    const seriesWeights = currentEx.setsData.map(s => Number(s.weight || weightVal));
    currentEx.maxWeight = Math.max(weightVal, ...seriesWeights);

    // Salva lo stato
    StorageService.saveActiveWorkout(this.activeSession);

    // Avvia il recupero se previsto
    this.triggerRestTimer(currentEx.restSeconds);

    const total = this.activeSession.exercises.length;
    if (this.currentExerciseIndex < total - 1) {
      // Prossimo esercizio
      this.currentExerciseIndex++;
      this.renderCurrentExercise();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Ultimo esercizio completato: conclusione allenamento!
      this.finishWorkout();
    }
  },

  /**
   * Avvia il timer di riposo nella barra flottante
   */
  triggerRestTimer(seconds) {
    const banner = document.getElementById("timerFloatingBanner");
    const display = document.getElementById("timerDisplay");
    const dial = document.getElementById("timerDialMini");

    banner.classList.add("active");

    GymTimer.start(
      seconds,
      (rem, tot, progress) => {
        display.textContent = RestTimer.formatTime(rem);
        dial.textContent = rem;
        dial.style.borderColor = rem <= 5 ? "var(--accent-rose)" : "var(--accent-cyan)";
      },
      () => {
        banner.classList.remove("active");
      }
    );
  },

  /**
   * Configura i comandi della barra flottante del timer
   */
  initTimerUI() {
    const banner = document.getElementById("timerFloatingBanner");
    document.getElementById("btnTimerPlus15").onclick = () => GymTimer.adjustTime(15);
    document.getElementById("btnTimerMinus15").onclick = () => GymTimer.adjustTime(-15);
    document.getElementById("btnTimerDismiss").onclick = () => {
      GymTimer.stop();
      banner.classList.remove("active");
    };
  },

  /**
   * Conclude l'allenamento e salva il log nello storico permanente
   */
  finishWorkout() {
    GymTimer.stop();
    document.getElementById("timerFloatingBanner").classList.remove("active");

    const startTime = new Date(this.activeSession.startTime);
    const endTime = new Date();
    const durationMinutes = Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)));

    const finalLog = {
      id: this.activeSession.id,
      date: endTime.toISOString(),
      dateFormatted: endTime.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }),
      sessionId: this.activeSession.sessionId,
      sessionTitle: this.activeSession.sessionTitle,
      durationMinutes: durationMinutes,
      exercises: this.activeSession.exercises.map(e => ({
        id: e.id,
        name: e.name,
        equipmentKey: e.equipmentKey,
        targetWeight: e.targetWeight,
        isBodyweight: e.isBodyweight,
        setsCount: e.sets,
        reps: e.reps,
        actualWeight: e.actualWeight,
        maxWeight: e.maxWeight,
        sets: e.setsData
      }))
    };

    // Salva nello storico
    StorageService.saveWorkout(finalLog);
    this.activeSession = null;
    this.refreshDashboardStats();

    // Mostra il modal riepilogativo di congratulazioni
    this.showRecapModal(finalLog);
  },

  /**
   * Mostra il modal di celebrazione con i pesi effettivi sollevati
   */
  showRecapModal(log) {
    const modal = document.getElementById("workoutRecapModal");
    document.getElementById("recapSessionBadge").textContent = `Sessione ${log.sessionId}`;
    document.getElementById("recapDuration").textContent = `${log.durationMinutes} min`;

    const table = document.getElementById("recapExercisesTable");
    table.innerHTML = "";

    log.exercises.forEach(ex => {
      const row = document.createElement("div");
      row.className = "recap-row";
      const unit = ex.isBodyweight ? "sec" : "kg";
      row.innerHTML = `
        <span class="recap-row-name">${ex.name}</span>
        <span class="recap-row-val">${ex.actualWeight} ${unit}</span>
      `;
      table.appendChild(row);
    });

    modal.classList.add("open");
  },

  /**
   * Annulla o abbandona l'allenamento attivo
   */
  abandonWorkout(askConfirm = true) {
    if (askConfirm && !confirm("Sei sicuro di voler uscire dalla sessione corrente?")) return;
    this.activeSession = null;
    StorageService.clearActiveWorkout();
    GymTimer.stop();
    document.getElementById("timerFloatingBanner").classList.remove("active");
    this.refreshDashboardStats();
    this.switchTab("dashboard");
  },

  /**
   * Popola il menu a tendina con tutti gli esercizi per i grafici
   */
  populateExerciseSelect() {
    const select = document.getElementById("exerciseChartSelect");
    if (!select) return;
    select.innerHTML = "";

    // Raccoglie tutti gli esercizi unici di A, B e C
    const uniqueNames = new Set();
    Object.values(WORKOUT_SESSIONS).forEach(session => {
      session.exercises.forEach(ex => {
        if (!ex.isBodyweight) {
          uniqueNames.add(ex.name);
        }
      });
    });

    uniqueNames.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      if (name === this.selectedChartExercise) opt.selected = true;
      select.appendChild(opt);
    });
  },

  /**
   * Aggiorna tutti i grafici nella sezione Riepilogo
   */
  updateSummaryCharts() {
    this.populateExerciseSelect();
    GymCharts.renderExerciseProgression("exerciseChartCanvas", this.selectedChartExercise);
    GymCharts.renderDailySessionsOverview("volumeChartCanvas");
  },

  /**
   * Renderizza la scheda degli esercizi (Sessione A, B o C) per sola consultazione
   */
  renderPlanView(planId) {
    const container = document.getElementById("planExerciseListContainer");
    const sessionConfig = WORKOUT_SESSIONS[planId];
    if (!container || !sessionConfig) return;

    container.innerHTML = "";
    document.getElementById("planFocusDesc").textContent = sessionConfig.focus;
    document.getElementById("planEstimatedTime").textContent = `~${sessionConfig.estimatedMinutes} min`;

    sessionConfig.exercises.forEach((ex, idx) => {
      const equip = EQUIPMENT_CATALOG[ex.equipmentKey] || { name: "Attrezzo" };
      const item = document.createElement("div");
      item.className = "plan-exercise-item";
      item.innerHTML = `
        <div class="plan-ex-thumb">
          ${EQUIPMENT_SVGS[ex.equipmentKey] || ""}
        </div>
        <div class="plan-ex-content">
          <div class="flex items-center justify-between">
            <h4 class="plan-ex-title">${idx + 1}. ${ex.name}</h4>
          </div>
          <p class="plan-ex-sub">${equip.name}</p>
          <div class="plan-ex-badges">
            <span class="badge-outline">${ex.sets} serie</span>
            <span class="badge-outline">${ex.reps} reps</span>
            <span class="badge-outline">${ex.targetWeight}</span>
            <span class="badge-outline">${ex.restSeconds}s rec</span>
          </div>
        </div>
      `;
      container.appendChild(item);
    });
  },

  /**
   * Renderizza la cronologia degli allenamenti registrati
   */
  renderHistoryList() {
    const container = document.getElementById("historyListContainer");
    if (!container) return;

    const history = StorageService.getHistory();
    if (history.length === 0) {
      container.innerHTML = `
        <div class="card text-center py-10">
          <p class="text-slate-400 font-medium">Nessun allenamento registrato.</p>
          <p class="text-xs text-slate-500 mt-1">Avvia una sessione o carica i dati dimostrativi per esplorare la cronologia.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    history.forEach(workout => {
      const card = document.createElement("div");
      card.className = "history-item-card";
      
      const tagClass = workout.sessionId === "A" ? "tag-a" : (workout.sessionId === "B" ? "tag-b" : "tag-c");
      
      const pillsHtml = (workout.exercises || []).map(e => {
        const unit = e.isBodyweight ? "s" : "kg";
        return `<span class="history-ex-pill">${e.name}: <strong>${e.actualWeight}${unit}</strong></span>`;
      }).join("");

      card.innerHTML = `
        <div class="history-item-top">
          <div class="history-date-badge">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>${workout.dateFormatted || workout.date.slice(0, 10)}</span>
          </div>
          <span class="history-session-tag ${tagClass}">Sessione ${workout.sessionId}</span>
        </div>
        <div class="text-xs text-slate-400 mb-2">
          Durata: ${workout.durationMinutes || 60} min • ${workout.exercises?.length || 0} esercizi completati
        </div>
        <div class="history-exercise-tags">
          ${pillsHtml}
        </div>
      `;
      container.appendChild(card);
    });
  }
};

window.App = App;
