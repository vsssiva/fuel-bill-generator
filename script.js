const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getMonthIndex(name) {
    return MONTHS.indexOf(name);
}

function getShortMonth(i) {
    const n = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return n[i % 12];
}

function addMonths(sm, sy, offset) {
    const t = sm + offset;
    return { month: t % 12, year: sy + Math.floor(t / 12) };
}

function fmtDate(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return dd + "-" + mm + "-" + d.getFullYear();
}

function fmtTime(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mn = String(d.getMinutes()).padStart(2, "0");
    return hh + ":" + mn;
}

function getRate(fuelType) {
    const rates = { Petrol: 102, Diesel: 92, XP95: 108, Power: 98 };
    return rates[fuelType] || 102;
}

function generateBills() {
    const totalAmount = parseFloat(document.getElementById("totalAmount").value) || 0;
    const numMonths = parseInt(document.getElementById("months").value) || 1;
    const startMonthName = document.getElementById("startMonth").value;
    const startYear = parseInt(document.getElementById("startYear").value) || new Date().getFullYear();
    const customerName = document.getElementById("customerName").value.trim();
    const vehicleNo = document.getElementById("vehicleNo").value.trim();
    const fuelType = document.getElementById("fuelType").value;
    const payMode = document.getElementById("payMode").value;
    const presetFlag = document.getElementById("presetFlag").checked;
    const template = document.getElementById("template").value;
    const paperWidth = document.getElementById("paperWidth").value;

    if (totalAmount <= 0) {
        alert("Please enter a valid total amount");
        return;
    }

    const perMonthAmount = totalAmount / numMonths;
    const rate = getRate(fuelType);
    const volume = perMonthAmount / rate;

    const startMonthIdx = getMonthIndex(startMonthName);
    const container = document.getElementById("bills-container");
    container.innerHTML = "";

    for (let i = 0; i < numMonths; i++) {
        const mInfo = addMonths(startMonthIdx, startYear, i);
        const monthName = MONTHS[mInfo.month];
        const receiptNo = 2467 + i;
        const billDate = new Date(startYear, mInfo.month, 1);
        const bill = document.createElement("div");
        bill.className = "bill width-" + paperWidth;
        bill.dataset.index = i;

        const logoHtml = template === "Indian Oil" ?
            '<div class="io-logo"><div class="circle"><span>IO</span></div></div><div class="brand-name">Indian Oil</div>' :
            '<div class="bp-logo"><div class="swirl"></div></div><div class="brand-name">Bharat Petroleum</div>';

        bill.innerHTML = '<div class="bill-header">' +
            logoHtml +
            '<div class="welcome">WELCOME!!!</div>' +
            '<div class="outlet-name">Bharat Petroleum Murugan</div>' +
            '<div class="outlet-name">oil Bharat Petroleum Murugan</div>' +
            '<div class="outlet-name">oil</div>' +
            '<div class="outlet-name">TEL NO: 4068199</div>' +
            '</div>' +
            '<div class="receipt-info">' +
            '<div class="row"><span>RECEIPT NO:</span><span>' + receiptNo + '</span></div>' +
            '<div class="row"><span>FCC ID:</span><span></span></div>' +
            '<div class="row"><span>FLP NO:</span><span></span></div>' +
            '<div class="row"><span>NOZZLE NO:</span><span></span></div>' +
            '</div>' +
            '<div class="product-section">' +
            '<div class="row"><span>PRODUCT:</span><span>' + fuelType + '</span></div>' +
            '<div class="row"><span>RATE/LTR:</span><span>' + rate.toFixed(2) + '</span></div>' +
            '<div class="row amount-row"><span>AMOUNT:</span><span>' + perMonthAmount.toFixed(2) + '</span></div>' +
            '<div class="row"><span>VOLUME(LTR):</span><span>' + volume.toFixed(2) + ' lt</span></div>' +
            '</div>' +
            '<div class="vehicle-section">' +
            '<div class="row"><span>VEH TYPE:</span><span>' + fuelType + '</span></div>' +
            '<div class="row"><span>VEH NO:</span><span>' + vehicleNo + '</span></div>' +
            '<div class="row"><span>CUSTOMER NAME:</span><span>' + customerName + '</span></div>' +
            '</div>' +
            '<div class="footer-section">' +
            '<div class="row"><span>DATE:</span><span>' + fmtDate(billDate) + '</span></div>' +
            '<div class="row"><span>MODE:</span><span>' + payMode + '</span></div>' +
            '<div class="row"><span>LST NO:</span><span></span></div>' +
            '<div class="row"><span>VAT NO:</span><span></span></div>' +
            '<div class="row"><span>ATTENDANT ID:</span><span>not available</span></div>' +
            '<div class="divider"></div>' +
            '<div class="thank-you">' +
            '<div class="line1">Thank You! Visit Again</div>' +
            '<div class="line2">Save Fuel, Save Money.</div>' +
            '</div>' +
            '</div>';

        container.appendChild(bill);
    }

    document.getElementById("actionButtons").style.display = "flex";
}

async function downloadAll(format) {
    const bills = document.querySelectorAll(".bill");
    for (let i = 0; i < bills.length; i++) {
        const bill = bills[i];
        const canvas = await html2canvas(bill, { backgroundColor: "#f5f5f0" });
        const link = document.createElement("a");
        link.download = "fuel-bill-" + (i + 1) + "." + format;
        link.href = canvas.toDataURL("image/" + format);
        link.click();
        await new Promise(r => setTimeout(r, 300));
    }
}

document.getElementById("bill-form").addEventListener("submit", function(e) {
    e.preventDefault();
    generateBills();
});

document.getElementById("downloadPng").addEventListener("click", function() {
    downloadAll("png");
});

document.getElementById("downloadJpg").addEventListener("click", function() {
    downloadAll("jpeg");
});
