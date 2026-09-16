/**
 * charts.js
 * Visualizzazione dei grafici temporali per monitorare i pesi reali utilizzati
 * in ciascun giorno di palestra. Supporta Chart.js (CDN) con fallback SVG nativo
 * se l'utente è offline o in assenza di connessione.
 */

const GymCharts = {
  activeChartInstance: null,
  volumeChartInstance: null,

  /**
   * Inizializza o aggiorna il grafico di progresso per un esercizio specifico
   */
  renderExerciseProgression(canvasId, exerciseName) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dataPoints = StorageService.getProgressionForExercise(exerciseName);
    const container = canvas.parentElement;

    // Rimuovi eventuale fallback SVG precedente
    const oldSvg = container.querySelector(".svg-chart-fallback");
    if (oldSvg) oldSvg.remove();

    // Se non ci sono dati per questo esercizio
    const noDataEl = container.querySelector(".no-data-msg");
    if (dataPoints.length === 0) {
      canvas.style.display = "none";
      if (!noDataEl) {
        const msg = document.createElement("div");
        msg.className = "no-data-msg text-center py-8 text-gray-400";
        msg.innerHTML = `
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-400 mb-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="font-medium text-slate-300">Nessun carico reale registrato per "${exerciseName}"</p>
          <p class="text-xs text-slate-500 mt-1">Completa una sessione A, B o C registrando il peso per visualizzare la curva di progresso.</p>
        `;
        container.appendChild(msg);
      } else {
        noDataEl.style.display = "block";
      }
      return;
    }

    if (noDataEl) noDataEl.style.display = "none";
    canvas.style.display = "block";

    // Verifica se Chart.js è disponibile
    if (typeof Chart !== "undefined") {
      this.renderWithChartJS(canvas, dataPoints, exerciseName);
    } else {
      this.renderWithNativeSVG(container, canvas, dataPoints, exerciseName);
    }

    // Aggiorna anche le metriche riassuntive dell'esercizio
    this.updateExerciseStats(exerciseName, dataPoints);
  },

  /**
   * Rendering con Chart.js
   */
  renderWithChartJS(canvas, dataPoints, exerciseName) {
    if (this.activeChartInstance) {
      this.activeChartInstance.destroy();
      this.activeChartInstance = null;
    }

    const labels = dataPoints.map(p => p.date);
    const weights = dataPoints.map(p => p.weight);
    const ctx = canvas.getContext("2d");

    // Gradiente moderno per l'area sotto la curva
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.45)");
    gradient.addColorStop(0.7, "rgba(16, 185, 129, 0.1)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

    const minWeight = Math.floor(Math.min(...weights) * 0.85);
    const maxWeight = Math.ceil(Math.max(...weights) * 1.15);

    this.activeChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Carico reale (${exerciseName})`,
            data: weights,
            borderColor: "#38bdf8",
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "#38bdf8"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#38bdf8",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              title: function(items) {
                const idx = items[0].dataIndex;
                const pt = dataPoints[idx];
                return `${pt.fullDate} (Sessione ${pt.sessionId})`;
              },
              label: function(item) {
                return `Peso reale: ${item.parsed.y} kg`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.06)",
              drawBorder: false
            },
            ticks: {
              color: "#94a3b8",
              font: { size: 11, weight: "500" }
            }
          },
          y: {
            min: Math.max(0, minWeight),
            max: maxWeight,
            grid: {
              color: "rgba(255, 255, 255, 0.08)",
              drawBorder: false
            },
            ticks: {
              color: "#94a3b8",
              font: { size: 11, weight: "600" },
              callback: val => `${val} kg`
            }
          }
        }
      }
    });
  },

  /**
   * Fallback SVG autonomo (se offline o CDN non disponibile)
   */
  renderWithNativeSVG(container, canvas, dataPoints, exerciseName) {
    canvas.style.display = "none";
    const width = 340;
    const height = 200;
    const padL = 45;
    const padR = 25;
    const padT = 25;
    const padB = 35;

    const weights = dataPoints.map(p => p.weight);
    const minW = Math.max(0, Math.floor(Math.min(...weights) - 2.5));
    const maxW = Math.ceil(Math.max(...weights) + 2.5);
    const rangeW = maxW - minW || 1;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const getX = idx => {
      if (dataPoints.length === 1) return padL + chartW / 2;
      return padL + (idx / (dataPoints.length - 1)) * chartW;
    };

    const getY = weight => {
      return padT + chartH - ((weight - minW) / rangeW) * chartH;
    };

    let pathD = "";
    let areaD = `M ${getX(0)} ${padT + chartH}`;
    dataPoints.forEach((p, i) => {
      const x = getX(i);
      const y = getY(p.weight);
      if (i === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
      areaD += ` L ${x} ${y}`;
    });
    areaD += ` L ${getX(dataPoints.length - 1)} ${padT + chartH} Z`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("class", "svg-chart-fallback w-full h-full");

    svg.innerHTML = `
      <defs>
        <linearGradient id="fallback-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Grid lines -->
      <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="#334155" stroke-dasharray="3 3"/>
      <line x1="${padL}" y1="${padT + chartH / 2}" x2="${width - padR}" y2="${padT + chartH / 2}" stroke="#334155" stroke-dasharray="3 3"/>
      <line x1="${padL}" y1="${padT + chartH}" x2="${width - padR}" y2="${padT + chartH}" stroke="#475569" stroke-width="1.5"/>

      <!-- Y Axis labels -->
      <text x="${padL - 8}" y="${padT + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${maxW}k</text>
      <text x="${padL - 8}" y="${padT + chartH / 2 + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${Math.round((maxW + minW)/2)}k</text>
      <text x="${padL - 8}" y="${padT + chartH + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${minW}k</text>

      <!-- Area and Line -->
      <path d="${areaD}" fill="url(#fallback-grad)"/>
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data circles & X labels -->
      ${dataPoints.map((p, i) => `
        <circle cx="${getX(i)}" cy="${getY(p.weight)}" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
        <text x="${getX(i)}" y="${getY(p.weight) - 9}" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">${p.weight}kg</text>
        <text x="${getX(i)}" y="${padT + chartH + 18}" fill="#94a3b8" font-size="9.5" text-anchor="middle">${p.date}</text>
      `).join("")}
    `;

    container.appendChild(svg);
  },

  /**
   * Aggiorna i box numerici delle statistiche dell'esercizio (carico max, variazione, ultima seduta)
   */
  updateExerciseStats(exerciseName, dataPoints) {
    const statsContainer = document.getElementById("exerciseStatsBox");
    if (!statsContainer) return;

    if (dataPoints.length === 0) {
      statsContainer.style.display = "none";
      return;
    }

    statsContainer.style.display = "grid";
    const weights = dataPoints.map(p => p.weight);
    const maxWeight = Math.max(...weights);
    const latestWeight = weights[weights.length - 1];
    const firstWeight = weights[0];
    const diff = latestWeight - firstWeight;
    const diffFormatted = diff > 0 ? `+${diff} kg` : (diff === 0 ? "Invariato" : `${diff} kg`);
    const diffClass = diff > 0 ? "text-emerald-400" : (diff < 0 ? "text-rose-400" : "text-slate-400");

    document.getElementById("statLatestWeight").textContent = `${latestWeight} kg`;
    document.getElementById("statMaxWeight").textContent = `${maxWeight} kg`;
    const diffEl = document.getElementById("statDeltaWeight");
    diffEl.textContent = diffFormatted;
    diffEl.className = `text-base font-bold ${diffClass}`;
  },

  /**
   * Renderizza il grafico riassuntivo di tutti i giorni in palestra (volume o carico di picco)
   */
  renderDailySessionsOverview(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const summary = StorageService.getAllGymDaysSummary();
    const container = canvas.parentElement;

    // Ordina cronologicamente
    const chronological = [...summary].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (chronological.length === 0) {
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "block";

    if (this.volumeChartInstance) {
      this.volumeChartInstance.destroy();
      this.volumeChartInstance = null;
    }

    if (typeof Chart === "undefined") return;

    const labels = chronological.map(s => `${s.dateFormatted.slice(0, 5)} (${s.sessionId})`);
    const volumes = chronological.map(s => s.totalVolume);
    const ctx = canvas.getContext("2d");

    const barGradient = ctx.createLinearGradient(0, 0, 0, 200);
    barGradient.addColorStop(0, "#10b981");
    barGradient.addColorStop(1, "#047857");

    this.volumeChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Volume Totale Sollevato (kg)",
            data: volumes,
            backgroundColor: barGradient,
            borderRadius: 6,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#10b981",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: item => `Volume totale: ${item.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 10 } }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.06)" },
            ticks: {
              color: "#94a3b8",
              font: { size: 10 },
              callback: val => `${val}k`
            }
          }
        }
      }
    });
  }
};
