const API_URL =
"https://script.google.com/macros/s/AKfycbz5pDUHW7snQoheNJXqlZuGezax7D1u5nG8M-2xqoNTAiiKWt-bjkYvHbVDdaly7FgAgA/exec";

let totalHadir = 0;

function onScanSuccess(decodedText) {

    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
            nim: decodedText
        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.success) {

            totalHadir++;

            document
            .getElementById("totalHadir")
            .innerText = totalHadir;

            document
            .getElementById("result")
            .innerHTML = `
            <span class="text-green-400">
                ✅ ${data.nama}
            </span>
            `;

        } else {

            document
            .getElementById("result")
            .innerHTML = `
            <span class="text-red-400">
                ❌ ${data.message}
            </span>
            `;

        }

    });

}

new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: 250
    }
).render(onScanSuccess);