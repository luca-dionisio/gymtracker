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
    if (typeof AuthService !== "undefined") {
      AuthService.init();
    }
    this.bindEvents();

    const currentUser = (typeof AuthService !== "undefined") ? AuthService.getCurrentUser() : null;
    if (!currentUser) {
      this.showLoginView();
      return;
    }

    this.onUserLoggedIn(currentUser);
  },

  /**
   * Configura l'app quando l'utente è autenticato
   */
  onUserLoggedIn(user) {
    // Mostra la barra di navigazione inferiore
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "flex";

    // Mostra e configura il badge profilo nell'header
    const headerProfile = document.getElementById("headerUserProfile");
    if (headerProfile) headerProfile.style.display = "flex";

    const avatarEl = document.getElementById("headerUserAvatar");
    if (avatarEl) {
      const initial = (user.name || user.username || "U").trim().charAt(0).toUpperCase();
      avatarEl.textContent = initial;
    }

    const nameEl = document.getElementById("headerUserName");
    if (nameEl) {
      const displayName = (user.name || user.username.split("@")[0] || "Atleta").trim().split(" ")[0];
      nameEl.textContent = displayName;
    }

    // Saluto personalizzato in Dashboard
    const greetingEl = document.getElementById("dashboardGreeting");
    if (greetingEl) {
      const displayName = (user.name || user.username.split("@")[0] || "Atleta").trim().split(" ")[0];
      greetingEl.textContent = `Ciao, ${displayName}! 👋`;
    }

    this.initTimerUI();
    this.populateExerciseSelect();
    this.renderPlanView("A");
    this.refreshDashboardStats();

    // Controlla se c'è una sessione attiva salvata per questo utente
    const savedActive = StorageService.getActiveWorkout();
    if (savedActive && savedActive.exercises && savedActive.exercises.length > 0) {
      this.restoreActiveWorkout(savedActive);
    } else {
      this.switchTab("dashboard");
    }

    this.updateSummaryCharts();
  },

  /**
   * Mostra la schermata di login e nasconde le altre sezioni e la barra di navigazione
   */
  showLoginView() {
    // Nascondi badge utente e badge sessione
    const headerProfile = document.getElementById("headerUserProfile");
    if (headerProfile) headerProfile.style.display = "none";
    const headerBadge = document.getElementById("headerActiveBadge");
    if (headerBadge) headerBadge.style.display = "none";

    // Nascondi la barra di navigazione inferiore
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "none";

    // Ferma timer se in esecuzione
    if (typeof GymTimer !== "undefined") {
      GymTimer.stop();
    }
    const timerBanner = document.getElementById("timerFloatingBanner");
    if (timerBanner) timerBanner.classList.remove("active");

    // Nascondi alert di errore login
    const errAlert = document.getElementById("loginErrorAlert");
    if (errAlert) errAlert.classList.remove("show");

    // Ripristina card di login e nascondi card registrazione
    const loginCard = document.getElementById("loginFormCard");
    const regCard = document.getElementById("registerFormCard");
    if (loginCard) loginCard.style.display = "block";
    if (regCard) regCard.style.display = "none";

    // Pulisce i campi di input login
    const userInput = document.getElementById("loginUsername");
    const passInput = document.getElementById("loginPassword");
    if (userInput) userInput.value = "";
    if (passInput) passInput.value = "";

    // Disattiva tutte le viste e attiva la vista login
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    const loginSec = document.getElementById("view-login");
    if (loginSec) loginSec.classList.add("active");

    this.activeSession = null;
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  },

  /**
   * Collega tutti gli ascoltatori di eventi DOM (in modo permanente ed universale)
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

    // Pulsanti Avvio rapido da stato vuoto Sessione
    document.querySelectorAll(".btn-start-empty-session").forEach(btn => {
      btn.addEventListener("click", () => {
        const sessionId = btn.dataset.session;
        this.startWorkout(sessionId);
      });
    });

    // Stepper Peso Reale: pulsanti - e + rotondi principali
    const btnMinus = document.getElementById("btnMinusWeight");
    if (btnMinus) {
      btnMinus.addEventListener("click", (e) => {
        e.preventDefault();
        const currentEx = this.getCurrentExercise();
        const step = (currentEx && currentEx.isBodyweight) ? 5 : 2.5;
        this.adjustWeight(-step);
      });
    }

    const btnPlus = document.getElementById("btnPlusWeight");
    if (btnPlus) {
      btnPlus.addEventListener("click", (e) => {
        e.preventDefault();
        const currentEx = this.getCurrentExercise();
        const step = (currentEx && currentEx.isBodyweight) ? 5 : 2.5;
        this.adjustWeight(step);
      });
    }

    // Bottoni incremento rapido (+1, +2.5, +5, -2.5)
    document.querySelectorAll(".btn-pill-increment").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const delta = parseFloat(btn.dataset.delta || 0);
        this.adjustWeight(delta);
      });
    });

    // Input manuale peso
    const realWeightInput = document.getElementById("realWeightInput");
    if (realWeightInput) {
      realWeightInput.addEventListener("input", (e) => {
        this.setWeight(parseFloat(e.target.value));
      });
    }

    // Pulsante Prossimo Esercizio
    const btnNext = document.getElementById("btnNextExercise");
    if (btnNext) {
      btnNext.addEventListener("click", (e) => {
        e.preventDefault();
        this.submitAndProceedToNext();
      });
    }

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

    // --- GESTIONE AUTENTICAZIONE E PROFILI UTENTE ---
    const formLogin = document.getElementById("formLogin");
    const btnLoginSubmit = document.getElementById("btnLoginSubmit");
    const handleLogin = () => {
      const userField = document.getElementById("loginUsername");
      const passField = document.getElementById("loginPassword");
      const username = userField ? userField.value : "";
      const password = passField ? passField.value : "";

      const res = AuthService.login(username, password);
      const errAlert = document.getElementById("loginErrorAlert");
      const errText = document.getElementById("loginErrorText");

      if (res.success) {
        if (errAlert) errAlert.classList.remove("show");
        this.onUserLoggedIn(res.user);
      } else {
        if (errText) errText.textContent = res.error || "Credenziali non valide.";
        if (errAlert) errAlert.classList.add("show");
      }
    };

    if (btnLoginSubmit) {
      btnLoginSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogin();
      });
    }

    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        handleLogin();
      });
    }

    // Toggle visibilità password login
    const btnTogglePass = document.getElementById("btnToggleLoginPass");
    if (btnTogglePass) {
      btnTogglePass.addEventListener("click", () => {
        const passInput = document.getElementById("loginPassword");
        if (!passInput) return;
        if (passInput.type === "password") {
          passInput.type = "text";
          btnTogglePass.textContent = "Nascondi";
        } else {
          passInput.type = "password";
          btnTogglePass.textContent = "Mostra";
        }
      });
    }

    // Switch card tra Login e Registrazione
    const btnShowReg = document.getElementById("btnShowRegister");
    const btnShowLog = document.getElementById("btnShowLogin");
    const loginCard = document.getElementById("loginFormCard");
    const regCard = document.getElementById("registerFormCard");
    const errAlert = document.getElementById("loginErrorAlert");

    if (btnShowReg) {
      btnShowReg.addEventListener("click", () => {
        if (loginCard) loginCard.style.display = "none";
        if (regCard) regCard.style.display = "block";
        if (errAlert) errAlert.classList.remove("show");
      });
    }

    if (btnShowLog) {
      btnShowLog.addEventListener("click", () => {
        if (regCard) regCard.style.display = "none";
        if (loginCard) loginCard.style.display = "block";
        if (errAlert) errAlert.classList.remove("show");
      });
    }

    // Submit Registrazione nuovo utente
    const formReg = document.getElementById("formRegister");
    const btnRegSubmit = document.getElementById("btnRegisterSubmit");
    const handleRegister = () => {
      const name = document.getElementById("regName")?.value;
      const username = document.getElementById("regUsername")?.value;
      const password = document.getElementById("regPassword")?.value;

      const res = AuthService.register(name, username, password);
      const errAlert = document.getElementById("loginErrorAlert");
      const errText = document.getElementById("loginErrorText");

      if (res.success) {
        if (errAlert) errAlert.classList.remove("show");
        this.onUserLoggedIn(res.user);
      } else {
        if (errText) errText.textContent = res.error || "Errore durante la registrazione.";
        if (errAlert) errAlert.classList.add("show");
      }
    };

    if (btnRegSubmit) {
      btnRegSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        handleRegister();
      });
    }

    if (formReg) {
      formReg.addEventListener("submit", (e) => {
        e.preventDefault();
        handleRegister();
      });
    }

    // Logout utente dall'icona nell'header
    const btnLogout = document.getElementById("btnLogoutHeader");
    if (btnLogout) {
      btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Vuoi disconnetterti dal profilo?")) {
          AuthService.logout();
          this.showLoginView();
        }
      });
    }
  },

  /**
   * Restituisce l'esercizio corrente dell'allenamento attivo
   */
  getCurrentExercise() {
    if (!this.activeSession || !Array.isArray(this.activeSession.exercises)) return null;
    return this.activeSession.exercises[this.currentExerciseIndex] || null;
  },

  /**
   * Modifica il peso di delta kg (+ / -) in modo reattivo
   */
  adjustWeight(delta) {
    const input = document.getElementById("realWeightInput");
    if (!input) return;
    let currentVal = parseFloat(input.value);
    if (isNaN(currentVal)) currentVal = 0;
    let newVal = Math.max(0, currentVal + delta);
    newVal = Math.round(newVal * 10) / 10;
    input.value = newVal;

    const currentEx = this.getCurrentExercise();
    if (currentEx) {
      currentEx.actualWeight = newVal;
      if (Array.isArray(currentEx.setsData)) {
        currentEx.setsData.forEach(s => {
          if (!s.completed) s.weight = newVal;
        });
      }
      StorageService.saveActiveWorkout(this.activeSession);

      // Aggiorna gli input visivi delle serie senza distruggere il DOM
      const setInputs = document.querySelectorAll(".set-weight-input");
      setInputs.forEach((inp, idx) => {
        if (currentEx.setsData[idx] && !currentEx.setsData[idx].completed) {
          inp.value = newVal;
        }
      });
    }
  },

  /**
   * Imposta manualmente il peso da input testuale
   */
  setWeight(val) {
    const num = isNaN(val) ? 0 : Math.max(0, Math.round(val * 10) / 10);
    const currentEx = this.getCurrentExercise();
    if (currentEx) {
      currentEx.actualWeight = num;
      if (Array.isArray(currentEx.setsData)) {
        currentEx.setsData.forEach(s => {
          if (!s.completed) s.weight = num;
        });
      }
      StorageService.saveActiveWorkout(this.activeSession);
    }
  },

  /**
   * Cambia tab attiva e sincronizza l'interfaccia
   */
  switchTab(tabName) {
    // Se non autenticato, reindirizza alla schermata di login
    if (typeof AuthService !== "undefined" && !AuthService.getCurrentUser()) {
      this.showLoginView();
      return;
    }

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
    if (tabName === "workout") {
      const emptyEl = document.getElementById("workoutEmptyState");
      const activeEl = document.getElementById("workoutActiveContent");
      if (this.activeSession && this.activeSession.exercises && this.activeSession.exercises.length > 0) {
        if (emptyEl) emptyEl.style.display = "none";
        if (activeEl) activeEl.style.display = "block";
        this.renderCurrentExercise();
      } else {
        if (emptyEl) emptyEl.style.display = "block";
        if (activeEl) activeEl.style.display = "none";
      }
    } else if (tabName === "summary") {
      this.updateSummaryCharts();
    } else if (tabName === "history") {
      this.renderHistoryList();
    } else if (tabName === "dashboard") {
      this.refreshDashboardStats();
    }

    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  },

  /**
   * Aggiorna le metriche della dashboard
   */
  refreshDashboardStats() {
    const history = StorageService.getHistory();
    const totalWorkouts = history.length;
    const statTotal = document.getElementById("statTotalWorkouts");
    if (statTotal) statTotal.textContent = totalWorkouts;

    if (history.length > 0) {
      const last = history[0];
      const d = new Date(last.date);
      const statDate = document.getElementById("statLastDate");
      const statSess = document.getElementById("statLastSession");
      if (statDate) statDate.textContent = `${d.getDate()}/${d.getMonth() + 1}`;
      if (statSess) statSess.textContent = `Sess. ${last.sessionId}`;
    } else {
      const statDate = document.getElementById("statLastDate");
      const statSess = document.getElementById("statLastSession");
      if (statDate) statDate.textContent = "-";
      if (statSess) statSess.textContent = "Nessuna";
    }

    // Badge sessione in corso nell'header
    const headerBadge = document.getElementById("headerActiveBadge");
    if (headerBadge) {
      if (this.activeSession) {
        headerBadge.style.display = "inline-flex";
        const letter = document.getElementById("headerSessionLetter");
        if (letter) letter.textContent = this.activeSession.sessionId;
      } else {
        headerBadge.style.display = "none";
      }
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
      const prev = StorageService.getLastWeightForExercise(ex.name);
      const initialWeight = prev ? prev.weight : ex.defaultWeight;

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
    this.switchTab("workout");
  },

  /**
   * Ripristina una sessione attiva da localStorage
   */
  restoreActiveWorkout(savedState) {
    this.activeSession = savedState;
    const firstUnfinished = this.activeSession.exercises.findIndex(e => !e.confirmed);
    this.currentExerciseIndex = firstUnfinished !== -1 ? firstUnfinished : 0;
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

    // Assicura che la vista attiva sia visibile
    const emptyEl = document.getElementById("workoutEmptyState");
    const activeEl = document.getElementById("workoutActiveContent");
    if (emptyEl) emptyEl.style.display = "none";
    if (activeEl) activeEl.style.display = "block";

    // Header & Progresso
    const progressText = document.getElementById("workoutProgressText");
    if (progressText) progressText.textContent = `Esercizio ${this.currentExerciseIndex + 1} di ${totalExercises}`;
    
    const sessionTag = document.getElementById("workoutSessionTag");
    if (sessionTag) sessionTag.textContent = `Sessione ${this.activeSession.sessionId}`;
    
    const progressFill = document.getElementById("workoutProgressFill");
    if (progressFill) {
      const progressPercent = ((this.currentExerciseIndex) / totalExercises) * 100;
      progressFill.style.width = `${progressPercent}%`;
    }

    // Titolo e note
    const exTitle = document.getElementById("exerciseTitle");
    if (exTitle) exTitle.textContent = currentEx.name;

    const exNotes = document.getElementById("exerciseNotes");
    if (exNotes) exNotes.textContent = currentEx.notes;

    // Attrezzo - Grafica SVG e Metadati
    const equipKey = currentEx.equipmentKey || "corpo_libero";
    const equipInfo = EQUIPMENT_CATALOG[equipKey] || { name: "Attrezzo da palestra", category: "Standard" };
    const artContainer = document.getElementById("equipmentArtContainer");
    if (artContainer) {
      artContainer.innerHTML = EQUIPMENT_SVGS[equipKey] || EQUIPMENT_SVGS["corpo_libero"];
    }

    const nameTag = document.getElementById("equipmentNameTag");
    if (nameTag) nameTag.textContent = equipInfo.name;

    const catTag = document.getElementById("equipmentCategoryTag");
    if (catTag) catTag.textContent = equipInfo.category;

    // Target Chips
    const tSets = document.getElementById("targetSets");
    if (tSets) tSets.textContent = `${currentEx.sets} serie`;

    const tReps = document.getElementById("targetReps");
    if (tReps) tReps.textContent = currentEx.reps;

    const tWeight = document.getElementById("targetWeight");
    if (tWeight) tWeight.textContent = currentEx.targetWeight;

    const tRest = document.getElementById("targetRest");
    if (tRest) tRest.textContent = `${currentEx.restSeconds}s`;

    // Riferimento Ultima Volta
    const lastSession = StorageService.getLastWeightForExercise(currentEx.name);
    const lastRefEl = document.getElementById("lastWeightRef");
    if (lastRefEl) {
      if (lastSession) {
        lastRefEl.style.display = "flex";
        const valEl = document.getElementById("lastWeightValue");
        if (valEl) valEl.textContent = `${lastSession.weight} kg (${lastSession.date})`;
      } else {
        lastRefEl.style.display = "none";
      }
    }

    // Inserimento Peso Reale
    const weightInput = document.getElementById("realWeightInput");
    const weightUnit = document.getElementById("realWeightUnit");
    const inputSection = document.getElementById("weightInputSection");
    const alertBox = document.getElementById("weightValidationAlert");
    if (inputSection) inputSection.classList.remove("error-highlight");
    if (alertBox) alertBox.classList.remove("show");

    if (weightInput) {
      if (currentEx.isBodyweight) {
        if (weightUnit) weightUnit.textContent = "sec / kg";
        weightInput.value = currentEx.actualWeight || 0;
      } else {
        if (weightUnit) weightUnit.textContent = "kg";
        weightInput.value = currentEx.actualWeight || currentEx.defaultWeight || 0;
      }
    }

    // Serie Log Checklist
    this.renderSetsTracker(currentEx);

    // Testo Pulsante Prossimo / Fine
    const isLast = this.currentExerciseIndex === totalExercises - 1;
    const nextBtn = document.getElementById("btnNextExercise");
    if (nextBtn) {
      nextBtn.innerHTML = isLast
        ? `<span>Concludi Allenamento</span>
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
        : `<span>Completa & Prossimo Esercizio</span>
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
    }
  },

  /**
   * Renderizza la lista delle serie con checkbox e carico specifico
   */
  renderSetsTracker(currentEx) {
    const container = document.getElementById("setsRowsContainer");
    if (!container) return;
    container.innerHTML = "";

    (currentEx.setsData || []).forEach((setData, idx) => {
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
      if (weightInput) {
        weightInput.addEventListener("change", (e) => {
          const val = parseFloat(e.target.value) || 0;
          setData.weight = val;
          StorageService.saveActiveWorkout(this.activeSession);
        });
      }

      // Spunta completamento serie
      const checkBtn = row.querySelector(".set-check-btn");
      if (checkBtn) {
        checkBtn.addEventListener("click", () => {
          setData.completed = !setData.completed;
          checkBtn.classList.toggle("completed", setData.completed);
          
          // Se si completa la serie, avvia il timer di recupero
          if (setData.completed) {
            try { GymTimer.playBeep(660, 0.1); } catch(e) {}
            try { this.triggerRestTimer(currentEx.restSeconds); } catch(e) {}
          }
          StorageService.saveActiveWorkout(this.activeSession);
        });
      }

      container.appendChild(row);
    });
  },

  /**
   * VALIDAZIONE E AVANZAMENTO:
   * Valida il peso reale utilizzato e procede all'esercizio successivo
   */
  submitAndProceedToNext() {
    if (!this.activeSession || !this.activeSession.exercises) {
      this.startWorkout("A");
      return;
    }

    const currentEx = this.getCurrentExercise();
    if (!currentEx) return;

    const input = document.getElementById("realWeightInput");
    const weightVal = parseFloat(input ? input.value : 0);
    const alertBox = document.getElementById("weightValidationAlert");
    const inputSection = document.getElementById("weightInputSection");

    // Validazione: il peso non può essere vuoto o NaN (per corpo libero è concesso 0 o durata)
    if (isNaN(weightVal) || (!currentEx.isBodyweight && weightVal <= 0)) {
      if (alertBox) alertBox.classList.add("show");
      if (inputSection) inputSection.classList.add("error-highlight");
      if (input) input.focus();
      try {
        if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      } catch (e) {}
      return;
    }

    // Validazione superata
    if (alertBox) alertBox.classList.remove("show");
    if (inputSection) inputSection.classList.remove("error-highlight");

    currentEx.actualWeight = weightVal;
    currentEx.confirmed = true;

    // Calcola il peso massimo utilizzato tra le serie
    const seriesWeights = (currentEx.setsData || []).map(s => Number(s.weight || weightVal));
    currentEx.maxWeight = Math.max(weightVal, ...seriesWeights);

    // Salva lo stato
    StorageService.saveActiveWorkout(this.activeSession);

    // Avvia il recupero in modo sicuro (senza bloccare se audio disabilitato)
    try {
      this.triggerRestTimer(currentEx.restSeconds || 90);
    } catch (e) {
      console.warn("Timer non avviato:", e);
    }

    const total = this.activeSession.exercises.length;
    if (this.currentExerciseIndex < total - 1) {
      // Prossimo esercizio
      this.currentExerciseIndex++;
      this.renderCurrentExercise();
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
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
