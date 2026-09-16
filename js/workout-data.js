/**
 * workout-data.js
 * Dati ufficiali della scheda di allenamento per le sessioni A, B, C
 * estratti fedelmente dal documento PDF.
 */

const EQUIPMENT_CATALOG = {
  chest_press: {
    name: "Chest Press Machine",
    category: "Macchina Isotonica",
    description: "Macchina guidata con sedile e impugnature orizzontali ad altezza petto.",
    icon: "chest_press"
  },
  lat_machine: {
    name: "Lat Machine",
    category: "Cavi & Pulegge",
    description: "Torretta con barra alta e cuscini di blocco per le cosce per trazioni verso il petto.",
    icon: "lat_machine"
  },
  shoulder_press: {
    name: "Shoulder Press Machine",
    category: "Macchina Spalle",
    description: "Macchina per spinte verticali verso l'alto con schienale regolato a 90°.",
    icon: "shoulder_press"
  },
  rematore: {
    name: "Rematore Macchina / Cavo",
    category: "Macchina / Cavi",
    description: "Panca con appoggio pettorale o pedana con cavo per trazione orizzontale.",
    icon: "rematore"
  },
  leg_press: {
    name: "Leg Press 45° / Orizzontale",
    category: "Macchina Gambe",
    description: "Pressa con sedile inclinato e pedana regolabile per spinta arti inferiori.",
    icon: "leg_press"
  },
  manubri: {
    name: "Manubri Singoli / Coppia",
    category: "Pesi Liberi",
    description: "Coppia di manubri gommati su rastrelliera con peso calibrato.",
    icon: "manubri"
  },
  pulley_basso: {
    name: "Pulley Basso (Low Row)",
    category: "Cavo Basso",
    description: "Cavo basso da seduti con pedane d'appoggio per piedi e triangolo di trazione.",
    icon: "pulley_basso"
  },
  incline_chest_press: {
    name: "Incline Chest Press Machine",
    category: "Macchina Petto Alto",
    description: "Panca inclinata (~30-45°) con leve convergenti per petto alto.",
    icon: "incline_chest_press"
  },
  tricipiti_cavo: {
    name: "Cavo Alto (Push-down Tricipiti)",
    category: "Cavi & Carrucole",
    description: "Cavo alto con fune doppia o sbarra a V per estensione dei gomiti.",
    icon: "tricipiti_cavo"
  },
  face_pull: {
    name: "Face Pull al Cavo",
    category: "Cavi & Carrucole",
    description: "Cavo regolato ad altezza occhi/spalle con corda doppia per trazione verso il viso.",
    icon: "face_pull"
  },
  corpo_libero: {
    name: "Tappetino / Corpo Libero",
    category: "Corpo Libero",
    description: "Tappetino fitness imbottito a terra per core e stabilità.",
    icon: "corpo_libero"
  },
  crunch_cavi: {
    name: "Crunch Macchina o ai Cavi",
    category: "Addome",
    description: "Macchina crunch guidata con presa toracica o cavo alto con fune.",
    icon: "crunch_cavi"
  }
};

const WORKOUT_SESSIONS = {
  A: {
    id: "A",
    title: "Sessione A",
    subtitle: "Petto, Schiena, Gambe & Spalle",
    focus: "Full Body A - Trazione & Spinta",
    estimatedMinutes: 60,
    exercises: [
      {
        id: "a1",
        name: "Chest press",
        sets: 3,
        reps: "10–12",
        targetWeight: "20–30 kg",
        defaultWeight: 25,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "chest_press",
        notes: "Regola l'altezza del sedile affinché le impugnature siano a livello del petto medio."
      },
      {
        id: "a2",
        name: "Lat machine avanti",
        sets: 3,
        reps: "10–12",
        targetWeight: "25–35 kg",
        defaultWeight: 30,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "lat_machine",
        notes: "Presa poco più larga delle spalle. Tira verso l'alto petto aprendo le spalle."
      },
      {
        id: "a3",
        name: "Shoulder press machine",
        sets: 3,
        reps: "10",
        targetWeight: "10–20 kg",
        defaultWeight: 15,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "shoulder_press",
        notes: "Spinta fluida verso l'alto senza iperestendere i gomiti al culmine."
      },
      {
        id: "a4",
        name: "Rematore macchina/cavo",
        sets: 3,
        reps: "10–12",
        targetWeight: "20–30 kg",
        defaultWeight: 25,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "rematore",
        notes: "Schiena diritta, adduci le scapole durante la fase di trazione."
      },
      {
        id: "a5",
        name: "Leg press",
        sets: 3,
        reps: "12",
        targetWeight: "60–80 kg*",
        defaultWeight: 70,
        isBodyweight: false,
        restSeconds: 105,
        equipmentKey: "leg_press",
        notes: "Piedi alla larghezza delle spalle. Non bloccare le ginocchia a fine corsa."
      },
      {
        id: "a6",
        name: "Alzate laterali",
        sets: 3,
        reps: "12–15",
        targetWeight: "4–6 kg/manubrio",
        defaultWeight: 5,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "manubri",
        notes: "Solleva con i gomiti leggermente flessi guidando con i deltoidi laterali."
      },
      {
        id: "a7",
        name: "Plank",
        sets: 3,
        reps: "25–40 s",
        targetWeight: "Corpo libero",
        defaultWeight: 0,
        isBodyweight: true,
        restSeconds: 50,
        equipmentKey: "corpo_libero",
        notes: "Bacino neutro, glutei contratti e addome attivo. Respira regolarmente."
      },
      {
        id: "a8",
        name: "Crunch macchina/cavo",
        sets: 2,
        reps: "12–15",
        targetWeight: "Leggero/moderato",
        defaultWeight: 20,
        isBodyweight: false,
        restSeconds: 60,
        equipmentKey: "crunch_cavi",
        notes: "Movimento controllato focalizzato sulla contrazione del retto addominale."
      }
    ]
  },
  B: {
    id: "B",
    title: "Sessione B",
    subtitle: "Dorsali, Petto Inclinato & Braccia",
    focus: "Full Body B - Braccia, Spalle & Core",
    estimatedMinutes: 65,
    exercises: [
      {
        id: "b1",
        name: "Lat machine",
        sets: 3,
        reps: "10–12",
        targetWeight: "25–35 kg",
        defaultWeight: 30,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "lat_machine",
        notes: "Concentrati sul tirare con i dorsali senza oscillare eccessivamente."
      },
      {
        id: "b2",
        name: "Chest press",
        sets: 3,
        reps: "10–12",
        targetWeight: "20–30 kg",
        defaultWeight: 25,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "chest_press",
        notes: "Piedi saldi a terra, schiena aderente allo schienale."
      },
      {
        id: "b3",
        name: "Pulley basso",
        sets: 3,
        reps: "10–12",
        targetWeight: "20–30 kg",
        defaultWeight: 25,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "pulley_basso",
        notes: "Ginocchia leggermente flesse, petto in fuori, trazione all'ombelico."
      },
      {
        id: "b4",
        name: "Incline chest press",
        sets: 3,
        reps: "10",
        targetWeight: "15–25 kg",
        defaultWeight: 20,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "incline_chest_press",
        notes: "Focus sulla parte clavicolare (alta) del gran pettorale."
      },
      {
        id: "b5",
        name: "Curl bicipiti manubri",
        sets: 3,
        reps: "10–12",
        targetWeight: "6–8 kg/manubrio",
        defaultWeight: 7,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "manubri",
        notes: "Gomiti fermi aderenti ai fianchi, rotazione supina fluida."
      },
      {
        id: "b6",
        name: "Push-down tricipiti",
        sets: 3,
        reps: "10–12",
        targetWeight: "10–15 kg",
        defaultWeight: 12.5,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "tricipiti_cavo",
        notes: "Blocca i gomiti ai fianchi ed estendi completamente verso il basso."
      },
      {
        id: "b7",
        name: "Face pull",
        sets: 3,
        reps: "12–15",
        targetWeight: "7,5–12,5 kg",
        defaultWeight: 10,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "face_pull",
        notes: "Tira la corda verso gli occhi allargando le mani e ruotando le spalle all'esterno."
      },
      {
        id: "b8",
        name: "Plank laterale",
        sets: 2,
        reps: "20–30 s/lato",
        targetWeight: "Corpo libero",
        defaultWeight: 0,
        isBodyweight: true,
        restSeconds: 50,
        equipmentKey: "corpo_libero",
        notes: "Gomito sotto la spalla, corpo allineato dalla testa ai piedi."
      },
      {
        id: "b9",
        name: "Dead bug",
        sets: 2,
        reps: "8–10/lato",
        targetWeight: "Corpo libero",
        defaultWeight: 0,
        isBodyweight: true,
        restSeconds: 50,
        equipmentKey: "corpo_libero",
        notes: "Lombare schiacciata al tappetino, movimento alternato braccio/gamba opposta."
      }
    ]
  },
  C: {
    id: "C",
    title: "Sessione C",
    subtitle: "Progressione Petto/Dorso & Volume",
    focus: "Full Body C - Intensità & Rifinitura",
    estimatedMinutes: 65,
    exercises: [
      {
        id: "c1",
        name: "Chest press",
        sets: 3,
        reps: "8–10",
        targetWeight: "+2,5–5% vs A quando possibile",
        defaultWeight: 27.5,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "chest_press",
        notes: "Serie più pesanti rispetto alla Sessione A. Prova un incremento di peso se te la senti!"
      },
      {
        id: "c2",
        name: "Lat machine",
        sets: 3,
        reps: "8–10",
        targetWeight: "+2,5–5% vs A quando possibile",
        defaultWeight: 32.5,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "lat_machine",
        notes: "Mantieni l'esecuzione pulita e tenta l'incremento di peso rispetto ad A."
      },
      {
        id: "c3",
        name: "Leg press",
        sets: 3,
        reps: "10–12",
        targetWeight: "60–80 kg*",
        defaultWeight: 70,
        isBodyweight: false,
        restSeconds: 105,
        equipmentKey: "leg_press",
        notes: "Profondità controllata con talloni ben piantati sulla pedana."
      },
      {
        id: "c4",
        name: "Rematore",
        sets: 3,
        reps: "10",
        targetWeight: "20–30 kg",
        defaultWeight: 25,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "rematore",
        notes: "Fase eccentrica controllata, tirata decisa verso il torace."
      },
      {
        id: "c5",
        name: "Shoulder press",
        sets: 3,
        reps: "10",
        targetWeight: "10–20 kg",
        defaultWeight: 15,
        isBodyweight: false,
        restSeconds: 90,
        equipmentKey: "shoulder_press",
        notes: "Non inarcare la zona lombare; mantieni l'addome compatto."
      },
      {
        id: "c6",
        name: "Alzate laterali",
        sets: 3,
        reps: "12–15",
        targetWeight: "4–6 kg/manubrio",
        defaultWeight: 5,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "manubri",
        notes: "Isolamento deltoidi senza darsi slancio con il busto."
      },
      {
        id: "c7",
        name: "Curl bicipiti",
        sets: 2,
        reps: "10–12",
        targetWeight: "6–8 kg/manubrio",
        defaultWeight: 7,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "manubri",
        notes: "2 serie ad alta intensità con massima contrazione in cima."
      },
      {
        id: "c8",
        name: "Tricipiti al cavo",
        sets: 2,
        reps: "10–12",
        targetWeight: "10–15 kg",
        defaultWeight: 12.5,
        isBodyweight: false,
        restSeconds: 70,
        equipmentKey: "tricipiti_cavo",
        notes: "Pushdown con corda o barra, apertura finale per picco di contrazione."
      },
      {
        id: "c9",
        name: "Crunch",
        sets: 3,
        reps: "15",
        targetWeight: "Leggero/moderato",
        defaultWeight: 15,
        isBodyweight: false,
        restSeconds: 60,
        equipmentKey: "crunch_cavi",
        notes: "Espira stringendo l'addome alla salita, discesa lenta."
      },
      {
        id: "c10",
        name: "Plank",
        sets: 3,
        reps: "30–45 s",
        targetWeight: "Corpo libero",
        defaultWeight: 0,
        isBodyweight: true,
        restSeconds: 50,
        equipmentKey: "corpo_libero",
        notes: "Ultimo esercizio! Mantieni la stabilità fino all'ultimo secondo."
      }
    ]
  }
};
