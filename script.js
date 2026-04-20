function getMonthName(i) {
    const n = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return n[i];
}

function getFullMonthName(i) {
    const n = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return n[i];
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
    const mi = String(d.getMinutes()).padStart(2, "0");
    return hh + ":" + mi;
}

document.getElementById("bill-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const totalAmount = parseFloat(document.getElementById("totalAmount").value);
    const months = parseInt(document.getElementById("months").value, 10);
    const startMonth = parseInt(document.getElementById("startMonth").value, 10);
    const startYear = parseInt(document.getElementById("startYear").value, 10);
    const customerName = document.getElementById("customerName").value.trim();
    const vehicleNo = document.getElementById("vehicleNo").value.trim();
    const fuelType = document.getElementById("fuelType").value;
    const payMode = document.getElementById("payMode").value;
    const presetFlag = document.getElementById("presetFlag").checked;
    const template = document.getElementById("template").value;
    const paperWidth = document.getElementById("paperWidth").value;

    if (isNaN(totalAmount) || isNaN(months) || months <= 0) {
        alert("Please enter valid values.");
        return;
    }

    const monthlyAmount = Math.round((totalAmount / months) * 100) / 100;
    const assumedRate = fuelType === "Diesel" ? 92.5 : 104.5;
    const liters = Math.round((monthlyAmount / assumedRate) * 100) / 100;
    const container = document.getElementById("bills-container");
    container.innerHTML = "";
    const now = new Date();

    for (let i = 0; i < months; i++) {
        const { month, year } = addMonths(startMonth, startYear, i);
        const receiptNo = 1000 + i;

        const bill = document.createElement("div");
        bill.className = "bill bill-" + paperWidth + " bill-" + template;

        const company = template === "bharat" ? "BHARAT PETROLEUM" : "INDIAN OIL";
        const gstNo = template === "bharat" ? "33ABCDE1234F1Z5" : "33XYZAB5678C1Z9";

        const presetLine = presetFlag ? `
            <div class="bill-row">
                <span class="label">PRESET</span>
                <span>AMOUNT</span>
            </div>
        ` : "";

        bill.innerHTML = `
            <div class="bill-header">
                <div class="logo-box">` + company + `</div>
                <div class="pump-name">` + company + ` RETAIL OUTLET</div>
                <div class="pump-address">Outer Ring Road, Chennai - 600 096</div>
                <div class="gst-line">GSTIN: <span class="gstno">` + gstNo + `</span> | TIN: 1234567890</div>
            </div>

            <div class="bill-section-title">FUEL PURCHASE RECEIPT</div>

            <div class="bill-meta">
                <div class="bill-row">
                    <span class="label">Receipt ID</span>
                    <span>` + receiptNo + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Bill Period</span>
                    <span>` + getFullMonthName(month) + ` ` + year + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Date</span>
                    <span>` + fmtDate(now) + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Time</span>
                    <span>` + fmtTime(now) + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Customer</span>
                    <span>` + (customerName || "-") + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Vehicle</span>
                    <span>` + (vehicleNo || "-") + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Fuel</span>
                    <span>` + fuelType + `</span>
                </div>
                <div class="bill-row">
                    <span class="label">Mode</span>
                    <span>` + payMode + `</span>
                </div>
                ` + presetLine + `
            </div>

            <div class="bill-items">
                <div class="bill-items-header">
                    <span>Product</span>
                    <span>Rate</span>
                    <span>Qty</span>
                    <span>Amt</span>
                </div>
                <div class="bill-items-row">
                    <span>` + fuelType + `</span>
                    <span>` + assumedRate.toFixed(2) + `</span>
                    <span>` + liters.toFixed(2) + `L</span>
                    <span>` + monthlyAmount.toFixed(2) + `</span>
                </div>
            </div>

            <div class="bill-total-row">
                <span class="label">TOTAL (INR)</span>
                <span>` + monthlyAmount.toFixed(2) + `</span>
            </div>

            <div class="bill-divider"></div>

            <div class="bill-footer">
                ORIGINAL FOR RECIPIENT<br/>
                Thank you. Visit Again.<br/>
                Save Fuel, Save Money.
            </div>
        `;

        container.appendChild(bill);
    }

    document.getElementById("downloadButtons").style.display = "flex";
});

async function downloadBillsAsImages(format) {
    const bills = document.querySelectorAll(".bill");
    if (!bills.length) {
        alert("No bills to download.");
        return;
    }

    let index = 1;
    for (const bill of bills) {
        const canvas = await html2canvas(bill, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fbfbfb"
        });

        let mimeType, ext, quality;
        if (format === "jpg") {
            mimeType = "image/jpeg";
            ext = "jpg";
            quality = 0.95;
        } else {
            mimeType = "image/png";
            ext = "png";
            quality = 1.0;
        }

        const dataUrl = canvas.toDataURL(mimeType, quality);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "fuel-bill-" + index + "." + ext;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        index++;
    }
}

document.getElementById("downloadPngBtn").addEventListener("click", function() {
    downloadBillsAsImages("png");
});

document.getElementById("downloadJpgBtn").addEventListener("click", function() {
    downloadBillsAsImages("jpg");
});
