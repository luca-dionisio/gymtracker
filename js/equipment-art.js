/**
 * equipment-art.js
 * Grafica vettoriale SVG ad alta definizione per ciascun attrezzo da palestra.
 * Ottimizzata per schermi smartphone ad alta densità (Retina/AMOLED).
 */

const EQUIPMENT_SVGS = {
  chest_press: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metal-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="neon-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <linearGradient id="pad-accent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <!-- Background base glow -->
      <circle cx="160" cy="110" r="95" fill="rgba(56, 189, 248, 0.06)" />
      
      <!-- Floor Shadow -->
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Main Frame Base -->
      <rect x="70" y="180" width="180" height="12" rx="4" fill="url(#metal-dark)" stroke="#475569" stroke-width="2"/>
      
      <!-- Weight Stack Tower (Right) -->
      <rect x="200" y="45" width="46" height="135" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <!-- Weight Plates -->
      <line x1="205" y1="75" x2="241" y2="75" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="90" x2="241" y2="90" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="105" x2="241" y2="105" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="120" x2="241" y2="120" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="135" x2="241" y2="135" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="150" x2="241" y2="150" stroke="#64748b" stroke-width="3"/>
      <line x1="205" y1="165" x2="241" y2="165" stroke="#64748b" stroke-width="3"/>
      <!-- Selector Pin -->
      <circle cx="223" cy="120" r="4" fill="#38bdf8"/>
      <!-- Guide Rods -->
      <line x1="215" y1="50" x2="215" y2="175" stroke="#94a3b8" stroke-width="2"/>
      <line x1="231" y1="50" x2="231" y2="175" stroke="#94a3b8" stroke-width="2"/>

      <!-- Seat Frame Post -->
      <rect x="110" y="90" width="14" height="90" rx="3" fill="url(#metal-dark)" stroke="#64748b" stroke-width="1.5"/>

      <!-- Seat Cushion -->
      <rect x="95" y="130" width="48" height="14" rx="4" fill="url(#pad-accent)" stroke="#065f46" stroke-width="2"/>
      
      <!-- Backrest Cushion -->
      <rect x="120" y="65" width="16" height="70" rx="5" fill="url(#pad-accent)" stroke="#065f46" stroke-width="2"/>

      <!-- Chest Press Lever Arms -->
      <path d="M 125 55 L 175 40 L 170 100 L 140 105" fill="none" stroke="url(#neon-cyan)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="125" cy="55" r="7" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      
      <!-- Handles -->
      <rect x="135" y="95" width="10" height="22" rx="3" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>

      <!-- Cable connection to weight stack -->
      <path d="M 175 40 L 223 35 L 223 50" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="2 1"/>
      <circle cx="223" cy="35" r="4" fill="#64748b"/>

      <!-- Exercise Badge / Target indicator -->
      <g transform="translate(18, 22)">
        <rect width="90" height="22" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="45" y="15" fill="#10b981" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">CHEST PRESS</text>
      </g>
    </svg>
  `,

  lat_machine: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lm-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="lm-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
        <linearGradient id="lm-pad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(56, 189, 248, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="75" y="180" width="170" height="12" rx="4" fill="url(#lm-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Main Upright Tower -->
      <rect x="180" y="30" width="40" height="150" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      
      <!-- Weight plates in tower -->
      <line x1="184" y1="70" x2="216" y2="70" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="85" x2="216" y2="85" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="100" x2="216" y2="100" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="115" x2="216" y2="115" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="130" x2="216" y2="130" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="145" x2="216" y2="145" stroke="#64748b" stroke-width="3"/>
      <line x1="184" y1="160" x2="216" y2="160" stroke="#64748b" stroke-width="3"/>
      <circle cx="200" cy="115" r="4" fill="#38bdf8"/>

      <!-- Top Overhead Curved Arm -->
      <path d="M 200 30 L 200 24 Q 170 20 120 28" fill="none" stroke="#64748b" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Pulley Wheel at tip -->
      <circle cx="120" cy="30" r="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
      <circle cx="195" cy="25" r="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>

      <!-- Cable Drop -->
      <line x1="120" y1="36" x2="120" y2="65" stroke="#cbd5e1" stroke-width="2.5"/>
      <line x1="120" y1="28" x2="195" y2="23" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="195" y1="25" x2="195" y2="70" stroke="#cbd5e1" stroke-width="2"/>

      <!-- Lat Pulldown Wide Bar -->
      <path d="M 70 76 Q 120 62 170 76" fill="none" stroke="url(#lm-accent)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="120" cy="67" r="3.5" fill="#f8fafc"/>

      <!-- Thigh Pad Rollers (Cuscini blocco cosce) -->
      <rect x="105" y="112" width="30" height="14" rx="7" fill="url(#lm-pad)" stroke="#065f46" stroke-width="1.5"/>

      <!-- Seat -->
      <rect x="100" y="138" width="40" height="12" rx="4" fill="url(#lm-pad)" stroke="#065f46" stroke-width="1.5"/>
      <rect x="116" y="150" width="8" height="30" fill="url(#lm-metal)"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="90" height="22" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="45" y="15" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">LAT MACHINE</text>
      </g>
    </svg>
  `,

  shoulder_press: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sp-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="sp-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(245, 158, 11, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="65" y="180" width="190" height="12" rx="4" fill="url(#sp-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Stack Tower (Left) -->
      <rect x="75" y="50" width="44" height="130" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="80" y1="80" x2="114" y2="80" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="95" x2="114" y2="95" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="110" x2="114" y2="110" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="125" x2="114" y2="125" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="140" x2="114" y2="140" stroke="#64748b" stroke-width="3"/>
      <line x1="80" y1="155" x2="114" y2="155" stroke="#64748b" stroke-width="3"/>
      <circle cx="97" cy="110" r="4" fill="#f59e0b"/>

      <!-- Seat Frame -->
      <rect x="175" y="105" width="12" height="75" rx="3" fill="url(#sp-metal)" stroke="#64748b" stroke-width="1.5"/>
      <!-- Seat Bottom -->
      <rect x="160" y="135" width="42" height="12" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      <!-- Upright 90° Backrest -->
      <rect x="188" y="70" width="14" height="65" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>

      <!-- Press Levers (Upward push trajectory) -->
      <path d="M 215 130 L 225 80 L 180 50" fill="none" stroke="url(#sp-accent)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="215" cy="130" r="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
      
      <!-- Handles at shoulder level / upward -->
      <line x1="174" y1="46" x2="186" y2="54" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
      <line x1="174" y1="72" x2="186" y2="80" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>

      <!-- Upward motion arrow -->
      <path d="M 160 70 L 160 40 M 154 48 L 160 38 L 166 48" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="115" height="22" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="57" y="15" fill="#f59e0b" font-size="10.5" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">SHOULDER PRESS</text>
      </g>
    </svg>
  `,

  rematore: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rem-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="rem-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(6, 182, 212, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="65" y="180" width="190" height="12" rx="4" fill="url(#rem-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Front Chest Support Pillar -->
      <rect x="175" y="70" width="12" height="110" fill="url(#rem-metal)" stroke="#64748b" stroke-width="1.5"/>
      <!-- Chest Support Cushion -->
      <rect x="165" y="80" width="12" height="45" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>

      <!-- Seat -->
      <rect x="110" y="130" width="40" height="12" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      <rect x="125" y="142" width="10" height="38" fill="url(#rem-metal)"/>

      <!-- Weight Stack (Front) -->
      <rect x="215" y="60" width="42" height="120" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="220" y1="85" x2="252" y2="85" stroke="#64748b" stroke-width="3"/>
      <line x1="220" y1="100" x2="252" y2="100" stroke="#64748b" stroke-width="3"/>
      <line x1="220" y1="115" x2="252" y2="115" stroke="#64748b" stroke-width="3"/>
      <line x1="220" y1="130" x2="252" y2="130" stroke="#64748b" stroke-width="3"/>
      <line x1="220" y1="145" x2="252" y2="145" stroke="#64748b" stroke-width="3"/>
      <circle cx="236" cy="115" r="4" fill="#06b6d4"/>

      <!-- Row Pull Arms -->
      <path d="M 215 100 L 185 85 L 145 95" fill="none" stroke="url(#rem-cyan)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="185" cy="85" r="5" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
      
      <!-- Handles -->
      <rect x="138" y="86" width="7" height="18" rx="3" fill="#f8fafc" stroke="#06b6d4" stroke-width="1.5"/>

      <!-- Pull Arrow -->
      <path d="M 160 95 L 125 95 M 135 90 L 123 95 L 135 100" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="115" height="22" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5"/>
        <text x="57" y="15" fill="#06b6d4" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">REMATORE / ROW</text>
      </g>
    </svg>
  `,

  leg_press: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lp-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="lp-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(249, 115, 22, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="55" y="180" width="210" height="12" rx="4" fill="url(#lp-metal)" stroke="#475569" stroke-width="2"/>

      <!-- 45-degree Guide Rails -->
      <line x1="90" y1="170" x2="225" y2="55" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
      <line x1="100" y1="180" x2="235" y2="65" stroke="#64748b" stroke-width="5" stroke-linecap="round"/>

      <!-- Reclined Seat -->
      <g transform="translate(60, 115) rotate(-25)">
        <rect x="0" y="25" width="45" height="12" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
        <rect x="0" y="-35" width="14" height="60" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      </g>

      <!-- Sled Carriage & Large Foot Plate -->
      <!-- Sled on rail -->
      <g transform="translate(170, 95) rotate(-45)">
        <!-- Carriage body -->
        <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
        <!-- Weight Pegs with Plates -->
        <rect x="-10" y="-32" width="20" height="8" rx="2" fill="url(#lp-orange)"/>
        <circle cx="0" cy="-28" r="14" fill="#334155" stroke="#f97316" stroke-width="2"/>
        <!-- Foot Plate -->
        <rect x="-28" y="14" width="56" height="10" rx="3" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
      </g>

      <!-- Push Force Indicator -->
      <path d="M 145 130 L 175 100 M 165 98 L 178 97 L 177 110" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="90" height="22" rx="6" fill="#0f172a" stroke="#f97316" stroke-width="1.5"/>
        <text x="45" y="15" fill="#f97316" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">LEG PRESS</text>
      </g>
    </svg>
  `,

  manubri: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="db-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="db-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(168, 85, 247, 0.05)" />
      <ellipse cx="160" cy="185" rx="100" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Dumbbell 1 (Foreground, slightly tilted) -->
      <g transform="translate(150, 110) rotate(-22)">
        <!-- Knurled Handle -->
        <rect x="-35" y="-5" width="70" height="10" rx="3" fill="url(#db-steel)" stroke="#cbd5e1" stroke-width="1"/>
        <!-- Texture hatch for knurling -->
        <line x1="-20" y1="-4" x2="-20" y2="4" stroke="#64748b" stroke-width="1.5"/>
        <line x1="-10" y1="-4" x2="-10" y2="4" stroke="#64748b" stroke-width="1.5"/>
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748b" stroke-width="1.5"/>
        <line x1="10" y1="-4" x2="10" y2="4" stroke="#64748b" stroke-width="1.5"/>
        <line x1="20" y1="-4" x2="20" y2="4" stroke="#64748b" stroke-width="1.5"/>

        <!-- Left Outer Plates -->
        <rect x="-52" y="-30" width="17" height="60" rx="6" fill="url(#db-plate)" stroke="#a855f7" stroke-width="2"/>
        <rect x="-62" y="-24" width="10" height="48" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="1"/>

        <!-- Right Outer Plates -->
        <rect x="35" y="-30" width="17" height="60" rx="6" fill="url(#db-plate)" stroke="#a855f7" stroke-width="2"/>
        <rect x="52" y="-24" width="10" height="48" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="1"/>

        <!-- Weight Stamp -->
        <text x="-43" y="4" fill="#e2e8f0" font-size="10" font-family="sans-serif" font-weight="bold" transform="rotate(90 -43 4)">KG</text>
        <text x="44" y="4" fill="#e2e8f0" font-size="10" font-family="sans-serif" font-weight="bold" transform="rotate(90 44 4)">KG</text>
      </g>

      <!-- Dumbbell 2 (Background pair) -->
      <g transform="translate(180, 140) rotate(15)" opacity="0.55">
        <rect x="-30" y="-4" width="60" height="8" rx="2" fill="url(#db-steel)"/>
        <rect x="-44" y="-24" width="14" height="48" rx="5" fill="url(#db-plate)"/>
        <rect x="30" y="-24" width="14" height="48" rx="5" fill="url(#db-plate)"/>
      </g>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="120" height="22" rx="6" fill="#0f172a" stroke="#a855f7" stroke-width="1.5"/>
        <text x="60" y="15" fill="#a855f7" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">MANUBRI / PESI</text>
      </g>
    </svg>
  `,

  pulley_basso: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(14, 165, 233, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Main Long Bench Base -->
      <rect x="50" y="175" width="220" height="12" rx="4" fill="url(#pb-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Low Cable Tower (Right) -->
      <rect x="220" y="50" width="44" height="130" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="225" y1="80" x2="259" y2="80" stroke="#64748b" stroke-width="3"/>
      <line x1="225" y1="95" x2="259" y2="95" stroke="#64748b" stroke-width="3"/>
      <line x1="225" y1="110" x2="259" y2="110" stroke="#64748b" stroke-width="3"/>
      <line x1="225" y1="125" x2="259" y2="125" stroke="#64748b" stroke-width="3"/>
      <line x1="225" y1="140" x2="259" y2="140" stroke="#64748b" stroke-width="3"/>
      <circle cx="242" cy="110" r="4" fill="#0ea5e9"/>

      <!-- Low Pulley Wheel -->
      <circle cx="218" cy="155" r="7" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.5"/>

      <!-- Foot plates for pressing feet -->
      <polygon points="192,135 202,135 198,168 188,168" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>

      <!-- Seated Bench Cushion -->
      <rect x="80" y="145" width="80" height="12" rx="4" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      <rect x="110" y="157" width="10" height="20" fill="url(#pb-metal)"/>

      <!-- Cable pulled towards user -->
      <line x1="218" y1="155" x2="150" y2="132" stroke="#e2e8f0" stroke-width="3"/>
      <!-- V-bar / triangle handle -->
      <polygon points="144,124 154,132 144,140" fill="none" stroke="#38bdf8" stroke-width="3"/>

      <!-- Pull Action Glow Arrow -->
      <path d="M 180 120 L 140 120 M 150 114 L 138 120 L 150 126" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="115" height="22" rx="6" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5"/>
        <text x="57" y="15" fill="#0ea5e9" font-size="10.5" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">PULLEY BASSO</text>
      </g>
    </svg>
  `,

  incline_chest_press: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="icp-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(16, 185, 129, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="65" y="180" width="190" height="12" rx="4" fill="url(#icp-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Stack Tower (Right) -->
      <rect x="210" y="45" width="44" height="135" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="215" y1="75" x2="249" y2="75" stroke="#64748b" stroke-width="3"/>
      <line x1="215" y1="90" x2="249" y2="90" stroke="#64748b" stroke-width="3"/>
      <line x1="215" y1="105" x2="249" y2="105" stroke="#64748b" stroke-width="3"/>
      <line x1="215" y1="120" x2="249" y2="120" stroke="#64748b" stroke-width="3"/>
      <circle cx="232" cy="105" r="4" fill="#10b981"/>

      <!-- Incline Seat & Backrest (35-45°) -->
      <rect x="90" y="145" width="35" height="12" rx="3" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      <g transform="translate(120, 145) rotate(-35)">
        <rect x="0" y="-70" width="15" height="70" rx="4" fill="#10b981" stroke="#065f46" stroke-width="2"/>
        <rect x="-8" y="-60" width="8" height="60" fill="url(#icp-metal)"/>
      </g>

      <!-- Upward Angled Lever Arms -->
      <path d="M 120 70 L 165 50 L 155 100" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="120" cy="70" r="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <rect x="148" y="90" width="10" height="20" rx="3" fill="#f8fafc" stroke="#10b981" stroke-width="2"/>

      <!-- Incline Spinta Arrow -->
      <path d="M 140 115 L 165 75 M 154 74 L 168 73 L 168 87" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="140" height="22" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="70" y="15" fill="#10b981" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">INCLINE CHEST PRESS</text>
      </g>
    </svg>
  `,

  tricipiti_cavo: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tc-cable" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(56, 189, 248, 0.05)" />
      <ellipse cx="160" cy="195" rx="100" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Cable Machine Column -->
      <rect x="135" y="25" width="50" height="160" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      
      <!-- Top Pulley Arm -->
      <path d="M 160 25 L 160 15 L 115 15 L 115 25" fill="none" stroke="#64748b" stroke-width="6"/>
      <circle cx="115" cy="28" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>

      <!-- Cable Coming Down -->
      <line x1="115" y1="36" x2="115" y2="85" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Carabiner -->
      <ellipse cx="115" cy="88" rx="3" ry="5" fill="none" stroke="#f8fafc" stroke-width="2"/>

      <!-- Triceps V-Bar / Rope with balls -->
      <path d="M 115 92 L 95 130" stroke="url(#tc-cable)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 115 92 L 135 130" stroke="url(#tc-cable)" stroke-width="5" stroke-linecap="round"/>
      <!-- Rubber stop balls at bottom of ropes -->
      <circle cx="93" cy="132" r="6" fill="#f43f5e"/>
      <circle cx="137" cy="132" r="6" fill="#f43f5e"/>

      <!-- Pushdown Downward Arrows -->
      <path d="M 75 105 L 75 140 M 69 132 L 75 142 L 81 132" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 155 105 L 155 140 M 149 132 L 155 142 L 161 132" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="135" height="22" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="67" y="15" fill="#38bdf8" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">PUSH-DOWN TRICIPITI</text>
      </g>
    </svg>
  `,

  face_pull: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fp-rope" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#be185d"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(236, 72, 153, 0.05)" />
      <ellipse cx="160" cy="195" rx="100" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Tower Column -->
      <rect x="60" y="30" width="45" height="155" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      
      <!-- Adjustable Slider Pulley (Set at upper chest/face level) -->
      <rect x="56" y="70" width="53" height="20" rx="3" fill="#475569" stroke="#cbd5e1" stroke-width="1.5"/>
      <circle cx="112" cy="80" r="8" fill="#0f172a" stroke="#ec4899" stroke-width="2.5"/>

      <!-- Dual Rope pulled towards athlete's face -->
      <path d="M 120 80 L 195 62" stroke="url(#fp-rope)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 120 80 L 195 98" stroke="url(#fp-rope)" stroke-width="5" stroke-linecap="round"/>

      <!-- Rope Ends -->
      <circle cx="198" cy="60" r="6" fill="#f43f5e"/>
      <circle cx="198" cy="100" r="6" fill="#f43f5e"/>

      <!-- Face pull separation arrows -->
      <path d="M 215 72 L 215 54 M 210 60 L 215 52 L 220 60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 215 88 L 215 106 M 210 100 L 215 108 L 220 100" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="100" height="22" rx="6" fill="#0f172a" stroke="#ec4899" stroke-width="1.5"/>
        <text x="50" y="15" fill="#ec4899" font-size="10.5" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">FACE PULL (CAVO)</text>
      </g>
    </svg>
  `,

  corpo_libero: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mat-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(16, 185, 129, 0.05)" />
      <ellipse cx="160" cy="180" rx="120" ry="14" fill="#030712" opacity="0.5"/>

      <!-- Fitness Mat (Tappetino) Isometric -->
      <polygon points="50,150 250,110 275,145 75,185" fill="url(#mat-grad)" stroke="#34d399" stroke-width="2"/>
      
      <!-- Alignment lines on mat -->
      <line x1="85" y1="145" x2="235" y2="115" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="8 6"/>
      <ellipse cx="162" cy="147" rx="14" ry="7" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>

      <!-- Stylized Plank Silhouette -->
      <g transform="translate(30, 25)">
        <!-- Head -->
        <circle cx="195" cy="85" r="9" fill="#38bdf8"/>
        <!-- Torso & Legs line in plank -->
        <line x1="90" y1="122" x2="185" y2="92" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
        <!-- Forearms on mat -->
        <line x1="175" y1="96" x2="175" y2="124" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
        <!-- Feet toes on mat -->
        <line x1="88" y1="122" x2="84" y2="132" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      </g>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="150" height="22" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
        <text x="75" y="15" fill="#10b981" font-size="10.5" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">TAPPETINO / CORPO LIBERO</text>
      </g>
    </svg>
  `,

  crunch_cavi: `
    <svg viewBox="0 0 320 220" class="equipment-illustration" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cr-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <circle cx="160" cy="110" r="95" fill="rgba(244, 63, 94, 0.05)" />
      <ellipse cx="160" cy="195" rx="110" ry="12" fill="#030712" opacity="0.6"/>

      <!-- Base -->
      <rect x="65" y="180" width="190" height="12" rx="4" fill="url(#cr-metal)" stroke="#475569" stroke-width="2"/>

      <!-- Stack Tower -->
      <rect x="205" y="40" width="44" height="140" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="210" y1="70" x2="244" y2="70" stroke="#64748b" stroke-width="3"/>
      <line x1="210" y1="85" x2="244" y2="85" stroke="#64748b" stroke-width="3"/>
      <line x1="210" y1="100" x2="244" y2="100" stroke="#64748b" stroke-width="3"/>
      <line x1="210" y1="115" x2="244" y2="115" stroke="#64748b" stroke-width="3"/>
      <circle cx="227" cy="100" r="4" fill="#f43f5e"/>

      <!-- Crunch Seat / Kneeling pad -->
      <rect x="95" y="145" width="45" height="12" rx="3" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
      <rect x="110" y="157" width="12" height="23" fill="url(#cr-metal)"/>

      <!-- Top pulley & Cable -->
      <circle cx="165" cy="40" r="7" fill="#0f172a" stroke="#f43f5e" stroke-width="2.5"/>
      <line x1="165" y1="47" x2="135" y2="90" stroke="#cbd5e1" stroke-width="3"/>

      <!-- Overhead Crunch Harness / Handles -->
      <rect x="125" y="85" width="18" height="20" rx="5" fill="#f43f5e" stroke="#ffe4e6" stroke-width="2"/>

      <!-- Ab contraction curl arrow -->
      <path d="M 155 85 Q 120 95 115 130" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4 2"/>
      <polygon points="110,125 115,135 122,127" fill="#38bdf8"/>

      <!-- Badge -->
      <g transform="translate(18, 22)">
        <rect width="135" height="22" rx="6" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5"/>
        <text x="67" y="15" fill="#f43f5e" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">CRUNCH MACCHINA/CAVO</text>
      </g>
    </svg>
  `
};
