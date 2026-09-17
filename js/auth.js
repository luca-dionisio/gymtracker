/**
 * auth.js
 * Modulo per la gestione dell'autenticazione, profili multi-utente
 * e persistenza della sessione attiva.
 */

const AUTH_KEYS = {
  USERS: "gym_tracker_users_v1",
  CURRENT_USER: "gym_tracker_current_user_v1"
};

const AuthService = {
  /**
   * Inizializza il catalogo utenti con l'utenza predefinita se non presente
   */
  init() {
    const users = this.getUsers();
    // Utenza iniziale richiesta dall'utente
    const defaultUser = {
      id: "user_luca_dionisio",
      username: "luca.dionisio@gmail.com",
      name: "Luca Dionisio",
      password: "andersen", // In ambiente client-side
      createdAt: "2026-09-17T09:00:00.000Z"
    };

    const exists = users.find(u => u.username.toLowerCase() === defaultUser.username.toLowerCase());
    if (!exists) {
      users.push(defaultUser);
      localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    }
  },

  /**
   * Restituisce tutti gli utenti registrati
   */
  getUsers() {
    try {
      const data = localStorage.getItem(AUTH_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Errore recupero utenti:", e);
      return [];
    }
  },

  /**
   * Restituisce l'utente attualmente loggato (se presente)
   */
  getCurrentUser() {
    try {
      const data = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Esegue il login controllando username e password
   */
  login(username, password) {
    this.init();
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: "Inserisci username e password" };
    }

    const users = this.getUsers();
    const found = users.find(
      u => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );

    if (found) {
      const sessionUser = {
        id: found.id,
        username: found.username,
        name: found.name || found.username.split("@")[0]
      };
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    return { success: false, error: "Credenziali non corrette. Riprova." };
  },

  /**
   * Registra un nuovo utente
   */
  register(name, username, password) {
    this.init();
    const cleanName = (name || "").trim();
    const cleanUser = (username || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: "Username e password sono obbligatori" };
    }

    if (cleanPass.length < 4) {
      return { success: false, error: "La password deve contenere almeno 4 caratteri" };
    }

    const users = this.getUsers();
    const alreadyExists = users.some(u => u.username.toLowerCase() === cleanUser);
    if (alreadyExists) {
      return { success: false, error: "Questo username/email è già registrato" };
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      username: cleanUser,
      name: cleanName || cleanUser.split("@")[0],
      password: cleanPass,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));

    // Effettua login automatico per il nuovo utente
    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name
    };
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  /**
   * Logout dell'utente corrente
   */
  logout() {
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
  }
};

// Inizializza subito l'utenza predefinita se necessario
if (typeof window !== "undefined") {
  window.AuthService = AuthService;
  try {
    AuthService.init();
  } catch (e) {}
}
