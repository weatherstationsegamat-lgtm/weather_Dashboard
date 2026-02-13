// Public Google Apps Script Web App URL
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxfMTLttE-y-BLx3LPkUmc0Y06EgwoTCyU9rdh-X12VqgajgWVKa5Y3bfa0B4cckMPNhA/exec";

const tableBody = document.querySelector("#data-table tbody");

// Setup Chart.js
const tempCtx = document.getElementById('tempChart').getContext('2d');
const humidityCtx = document.getElementById('humidityChart').getContext('2d');
const windCtx = document.getElementById('windChart').getContext('2d');

const tempChart = new Chart(tempCtx, {
  type:'line',
  data:{ labels:[], datasets:[{ label:'Temperature (°C)', data:[], borderColor:'red', backgroundColor:'rgba(255,0,0,0.2)', fill:true, tension:0.3 }]},
  options:{ responsive:true }
});

const humidityChart = new Chart(humidityCtx, {
  type:'line',
  data:{ labels:[], datasets:[{ label:'Humidity (%)', data:[], borderColor:'blue', backgroundColor:'rgba(0,0,255,0.2)', fill:true, tension:0.3 }]},
  options:{ responsive:true }
});

const windChart = new Chart(windCtx, {
  type:'line',
  data:{ labels:[], datasets:[{ label:'Wind (m/s)', data:[], borderColor:'green', backgroundColor:'rgba(0,255,0,0.2)', fill:true, tension:0.3 }]},
  options:{ responsive:true }
});

async function fetchData() {
  try {
    const res = await fetch(SPREADSHEET_URL);
    const data = await res.json();

    tableBody.innerHTML = "";

    const timestamps = [], temps = [], hums = [], winds = [];

    for(let i=1; i<data.length; i++) { // skip header
      const row = data[i];
      const tr = document.createElement("tr");
      row.forEach(cell=>{
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);

      timestamps.push(row[0]);
      temps.push(row[1]);
      hums.push(row[2]);
      winds.push(row[3]);
    }

    // Update charts
    tempChart.data.labels = timestamps; tempChart.data.datasets[0].data = temps; tempChart.update();
    humidityChart.data.labels = timestamps; humidityChart.data.datasets[0].data = hums; humidityChart.update();
    windChart.data.labels = timestamps; windChart.data.datasets[0].data = winds; windChart.update();

  } catch(err) {
    console.error("Failed to fetch data:", err);
  }
}

// Fetch every 1 min
fetchData();
setInterval(fetchData, 60000);
