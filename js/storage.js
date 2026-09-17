/**
 * storage.js
 * Gestione dello storage locale (localStorage) per i log degli allenamenti,
 * carichi registrati, stato dell'allenamento attivo ed esportazione/importazione dati.
 */

const STORAGE_KEYS = {
  HISTORY: "gym_tracker_history_v1",
  ACTIVE_WORKOUT: "gym_tracker_active_v1",
  SETTINGS: "gym_tracker_settings_v1"
};

const StorageService = {
  /**
   * Restituisce l'ID dell'utente attualmente autenticato
   */
  getCurrentUserId() {
    const user = typeof AuthService !== "undefined" ? AuthService.getCurrentUser() : null;
    return user ? user.id : "guest";
  },

  /**
   * Genera la chiave di storage specifica per l'utente loggato
   */
  getUserKey(suffix) {
    return `gym_tracker_${this.getCurrentUserId()}_${suffix}`;
  },

  /**
   * Recupera l'intero storico degli allenamenti ordinati dal più recente al più vecchio
   */
  getHistory() {
    try {
      const key = this.getUserKey("history");
      let data = localStorage.getItem(key);
      
      // Migrazione automatica: se l'utente è Luca e non ha ancora dati salvati con chiave dedicata,
      // recupera l'eventuale storico precedente non segregato
      if (!data) {
        const user = typeof AuthService !== "undefined" ? AuthService.getCurrentUser() : null;
        if (user && user.id === "user_luca_dionisio") {
          const oldData = localStorage.getItem("gym_tracker_history_v1");
          if (oldData) {
            localStorage.setItem(key, oldData);
            data = oldData;
          }
        }
      }

      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Errore nel recupero dello storico:", e);
      return [];
    }
  },

  /**
   * Salva un nuovo allenamento completato nello storico dell'utente
   */
  saveWorkout(workoutLog) {
    try {
      const history = this.getHistory();
      history.unshift(workoutLog);
      localStorage.setItem(this.getUserKey("history"), JSON.stringify(history));
      this.clearActiveWorkout();
      return true;
    } catch (e) {
      console.error("Errore nel salvataggio dell'allenamento:", e);
      return false;
    }
  },

  /**
   * Elimina un allenamento dallo storico per ID
   */
  deleteWorkout(id) {
    try {
      const history = this.getHistory().filter(item => item.id !== id);
      localStorage.setItem(this.getUserKey("history"), JSON.stringify(history));
      return true;
    } catch (e) {
      console.error("Errore nell'eliminazione dell'allenamento:", e);
      return false;
    }
  },

  /**
   * Recupera l'allenamento attualmente in corso per l'utente corrente
   */
  getActiveWorkout() {
    try {
      const data = localStorage.getItem(this.getUserKey("active"));
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Salva lo stato dell'allenamento attivo per l'utente
   */
  saveActiveWorkout(state) {
    try {
      localStorage.setItem(this.getUserKey("active"), JSON.stringify(state));
    } catch (e) {
      console.error("Errore nel salvataggio stato attivo:", e);
    }
  },

  /**
   * Elimina la sessione attiva dell'utente corrente
   */
  clearActiveWorkout() {
    localStorage.removeItem(this.getUserKey("active"));
  },

  /**
   * Trova l'ultimo carico reale utilizzato per un esercizio specifico
   */
  getLastWeightForExercise(exerciseName) {
    const history = this.getHistory();
    for (const workout of history) {
      const ex = workout.exercises?.find(
        e => e.name.toLowerCase().trim() === exerciseName.toLowerCase().trim()
      );
      if (ex && ex.actualWeight !== undefined && ex.actualWeight !== null) {
        return {
          weight: ex.actualWeight,
          date: workout.dateFormatted || new Date(workout.date).toLocaleDateString(),
          sessionId: workout.sessionId
        };
      }
    }
    return null;
  },

  /**
   * Estrae i dati storici dei carichi per un determinato esercizio (per i grafici)
   * Restituisce array di { date: "DD/MM", rawDate: timestamp, weight: number, sessionId: "A"|"B"|"C" }
   */
  getProgressionForExercise(exerciseName) {
    const history = this.getHistory();
    // Ordina cronologicamente (dal più vecchio al più recente per il grafico da sx a dx)
    const chronological = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const points = [];
    for (const workout of chronological) {
      const ex = workout.exercises?.find(
        e => e.name.toLowerCase().trim() === exerciseName.toLowerCase().trim()
      );
      if (ex && ex.actualWeight !== undefined && ex.actualWeight !== null && !ex.isBodyweight) {
        const d = new Date(workout.date);
        const dayMonth = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        points.push({
          date: dayMonth,
          fullDate: d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" }),
          rawDate: d.getTime(),
          weight: Number(ex.actualWeight),
          maxWeight: ex.maxWeight !== undefined ? Number(ex.maxWeight) : Number(ex.actualWeight),
          sessionId: workout.sessionId,
          reps: ex.reps || ""
        });
      }
    }
    return points;
  },

  /**
   * Estrae tutte le date in cui si è andati in palestra e un riepilogo dei carichi utilizzati
   */
  getAllGymDaysSummary() {
    const history = this.getHistory();
    return history.map(w => {
      const d = new Date(w.date);
      const totalVolume = (w.exercises || []).reduce((acc, ex) => {
        if (!ex.isBodyweight && ex.actualWeight) {
          const setsCount = Array.isArray(ex.sets) ? ex.sets.length : (ex.setsCount || 3);
          return acc + (Number(ex.actualWeight) * setsCount);
        }
        return acc;
      }, 0);

      const exercisesCount = (w.exercises || []).length;
      const maxWeightLifted = Math.max(
        0,
        ...(w.exercises || []).map(e => (e.isBodyweight ? 0 : Number(e.actualWeight || 0)))
      );

      return {
        id: w.id,
        date: w.date,
        dateFormatted: d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }),
        dayName: d.toLocaleDateString("it-IT", { weekday: "short" }),
        sessionId: w.sessionId,
        durationMinutes: w.durationMinutes || 60,
        totalVolume: Math.round(totalVolume),
        exercisesCount,
        maxWeightLifted,
        exercises: w.exercises || []
      };
    });
  },

  /**
   * Esporta tutti i dati in file JSON scaricabile
   */
  exportData() {
    const data = {
      history: this.getHistory(),
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Importa dati da stringa JSON
   */
  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.history)) {
        localStorage.setItem(this.getUserKey("history"), JSON.stringify(parsed.history));
        return { success: true, count: parsed.history.length };
      } else if (Array.isArray(parsed)) {
        localStorage.setItem(this.getUserKey("history"), JSON.stringify(parsed));
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "Formato non valido" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Genera dati storici dimostrativi (3 settimane di allenamenti A, B, C)
   * per mostrare subito grafici accattivanti se l'utente lo desidera
   */
  loadDemoData() {
    const now = new Date();
    const demoWorkouts = [];

    // 9 sessioni passate: 3 settimane con A, B, C
    const timeline = [
      { daysAgo: 21, session: "A", factor: 0.90 },
      { daysAgo: 19, session: "B", factor: 0.90 },
      { daysAgo: 16, session: "C", factor: 0.92 },
      { daysAgo: 14, session: "A", factor: 0.95 },
      { daysAgo: 12, session: "B", factor: 0.95 },
      { daysAgo: 9,  session: "C", factor: 0.97 },
      { daysAgo: 7,  session: "A", factor: 1.00 },
      { daysAgo: 5,  session: "B", factor: 1.00 },
      { daysAgo: 2,  session: "C", factor: 1.05 }
    ];

    timeline.forEach((item, index) => {
      const date = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
      const sessionConfig = WORKOUT_SESSIONS[item.session];
      
      const exercisesLogged = sessionConfig.exercises.map(ex => {
        let weight = ex.defaultWeight;
        if (!ex.isBodyweight && weight > 0) {
          weight = Math.round(weight * item.factor * 2) / 2; // Arrotonda a 0.5 kg
        }
        
        // Simula serie
        const setsArray = [];
        for (let s = 1; s <= ex.sets; s++) {
          setsArray.push({
            set: s,
            weight: weight,
            reps: ex.reps.split("–")[0] || 10,
            completed: true
          });
        }

        return {
          id: ex.id,
          name: ex.name,
          equipmentKey: ex.equipmentKey,
          targetWeight: ex.targetWeight,
          isBodyweight: ex.isBodyweight,
          setsCount: ex.sets,
          reps: ex.reps,
          actualWeight: weight,
          maxWeight: weight,
          sets: setsArray
        };
      });

      demoWorkouts.push({
        id: `demo_${index + 1}_${date.getTime()}`,
        date: date.toISOString(),
        dateFormatted: date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }),
        sessionId: item.session,
        durationMinutes: 55 + (index % 3) * 5,
        notes: "Sessione demo completata regolarmente.",
        exercises: exercisesLogged
      });
    });

    localStorage.setItem(this.getUserKey("history"), JSON.stringify(demoWorkouts));
    return demoWorkouts;
  },

  /**
   * Resetta tutti i dati salvati per l'utente corrente
   */
  clearAll() {
    localStorage.removeItem(this.getUserKey("history"));
    localStorage.removeItem(this.getUserKey("active"));
  }
};
