const API_URL =
"https://script.google.com/macros/s/AKfycbzrqOpg7WlZyLpJfQ0pQXoFJ_n5iHSZbOfalMS6Eywsq62XJ2uMsIGw9H1svXPoms9YNg/exec";

let lastScan = "";
let lastTime = 0;

// ======================================
// LOAD STATISTIK
// ======================================

async function loadStats() {

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        document.getElementById(
            "totalPeserta"
        ).innerText =
        data.totalPeserta;

        document.getElementById(
            "totalHadir"
        ).innerText =
        data.totalHadir;

        document.getElementById(
            "belumHadir"
        ).innerText =
        data.belumHadir;

    } catch (error) {

        console.error(
            "Load Stats Error:",
            error
        );

    }

}

// ======================================
// TOAST
// ======================================

function showToast(
    text,
    success = true
) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.innerText = text;

    toast.className =
        success
        ? "fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl font-bold z-50"
        : "fixed top-5 right-5 bg-red-500 text-white px-6 py-4 rounded-xl shadow-xl font-bold z-50";

    setTimeout(() => {

        toast.classList.add(
            "hidden"
        );

    }, 3000);

}

// ======================================
// SOUND
// ======================================

function beepSuccess() {

    document
        .getElementById(
            "successSound"
        )
        .play();

}

function beepError() {

    document
        .getElementById(
            "errorSound"
        )
        .play();

}

// ======================================
// STATUS CARD
// ======================================

function tampilSukses(nama) {

    document
        .getElementById(
            "result"
        )
        .innerHTML = `
        <div class="text-3xl font-bold text-green-400">
            ✅ ${nama}
        </div>

        <div class="text-slate-400 mt-2">
            Absensi Berhasil
        </div>
    `;

}

function tampilError(pesan) {

    document
        .getElementById(
            "result"
        )
        .innerHTML = `
        <div class="text-3xl font-bold text-red-400">
            ❌ ${pesan}
        </div>
    `;

}

// ======================================
// RIWAYAT
// ======================================

function tambahRiwayat(nama) {

    const history =
        document.getElementById(
            "history"
        );

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "bg-slate-800 rounded-xl p-4 border border-slate-700";

    item.innerHTML = `
        <div class="font-bold text-green-400">
            ${nama}
        </div>

        <div class="text-xs text-slate-400">
            ${new Date().toLocaleTimeString()}
        </div>
    `;

    history.prepend(item);

    while (
        history.children.length > 3
    ) {

        history.removeChild(
            history.lastChild
        );

    }

}

// ======================================
// QR SCAN
// ======================================

async function onScanSuccess(
    decodedText
) {

    const now =
        Date.now();

    if (
        decodedText === lastScan &&
        now - lastTime < 3000
    ) {
        return;
    }

    lastScan =
        decodedText;

    lastTime =
        now;

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

            beepSuccess();

            showToast(
                "✅ " +
                data.nama +
                " berhasil absen",
                true
            );

            loadStats();

        } else {

            tampilError(
                data.message
            );

            beepError();

            showToast(
                "❌ " +
                data.message,
                false
            );

        }

    } catch (error) {

        console.error(
            error
        );

        tampilError(
            "Gagal Terhubung"
        );

        beepError();

        showToast(
            "❌ Gagal Terhubung API",
            false
        );

    }

}

// ======================================
// START SCANNER
// ======================================

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

// ======================================
// INIT
// ======================================

loadStats();

startScanner();