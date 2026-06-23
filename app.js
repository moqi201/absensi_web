const API_URL =
"https://script.google.com/macros/s/AKfycbzEwK0MjaVJSup53wMuc8ADwn89-wRxJUiRQAJMGdoL8Mgg7zVi4QrV7v6BXo39mnuesQ/exec"
let lastScan = "";
let lastTime = 0;

// =====================
// LOAD STATISTIK
// =====================

async function loadStats() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        document
            .getElementById("totalPeserta")
            .innerText =
            data.totalPeserta;

        document
            .getElementById("totalHadir")
            .innerText =
            data.totalHadir;

        document
            .getElementById("belumHadir")
            .innerText =
            data.belumHadir;

    } catch (error) {

        console.error(
            "Gagal load statistik:",
            error
        );

    }
}

// =====================
// RIWAYAT
// =====================

function tambahRiwayat(nama) {

    const history =
        document.getElementById("history");

    const waktu =
        new Date()
        .toLocaleTimeString();

    const item =
        document.createElement("div");

    item.className =
        "bg-slate-800 p-3 rounded-lg border border-slate-700";

    item.innerHTML = `
        <div class="font-semibold text-green-400">
            ${nama}
        </div>

        <div class="text-xs text-slate-400">
            ${waktu}
        </div>
    `;

    history.prepend(item);

}

// =====================
// STATUS
// =====================

function tampilSukses(nama) {

    document
        .getElementById("result")
        .innerHTML = `
            <div class="text-green-400 text-2xl font-bold">
                ✅ ${nama}
            </div>

            <div class="text-slate-400">
                Absensi Berhasil
            </div>
        `;

}

function tampilError(pesan) {

    document
        .getElementById("result")
        .innerHTML = `
            <div class="text-red-400 text-2xl font-bold">
                ❌ ${pesan}
            </div>
        `;

}

// =====================
// SCAN QR
// =====================

async function onScanSuccess(decodedText) {

    const now = Date.now();

    if (
        decodedText === lastScan &&
        now - lastTime < 3000
    ) {
        return;
    }

    lastScan = decodedText;
    lastTime = now;

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        nim: decodedText
                    })
                }
            );

        const data =
            await response.json();

        if (data.success) {

            tampilSukses(
                data.nama
            );

            tambahRiwayat(
                data.nama
            );

            loadStats();

        } else {

            tampilError(
                data.message
            );

        }

    } catch (error) {

        console.error(error);

        tampilError(
            "Gagal Terhubung"
        );

    }

}

// =====================
// START SCANNER
// =====================

function startScanner() {

    const scanner =
        new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            },
            false
        );

    scanner.render(
        onScanSuccess
    );

}

// =====================
// INIT
// =====================

loadStats();

startScanner();