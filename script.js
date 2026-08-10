const UPI_ID = "Rishabh.Bansal777@okaxis";

const PAYEE_NAME = "Rishabh Bansal";


// --------------------------------------------------
// Read URL parameters
// Example:
// /pay?name=Manoj&amount=446
// --------------------------------------------------

const params = new URLSearchParams(window.location.search);

const playerName =
    params.get("name") || "Player";

const rawAmount =
    params.get("amount");


// --------------------------------------------------
// Validate amount
// --------------------------------------------------

const amount = Number(rawAmount);

if (
    !rawAmount ||
    !Number.isFinite(amount) ||
    amount <= 0
) {
    document.getElementById("amount").textContent = "—";

    document.getElementById("payButton").style.display = "none";

    document.getElementById("qrCode").style.display = "none";

    showMessage("Invalid payment amount.", true);

} else {

    initializePayment();

}


// --------------------------------------------------
// Initialize payment page
// --------------------------------------------------

function initializePayment() {

    document.getElementById("playerName")
        .textContent = playerName;

    document.getElementById("amount")
        .textContent = formatAmount(amount);


    // Build UPI payment URI

    const upiLink =
        buildUpiLink(
            UPI_ID,
            PAYEE_NAME,
            amount,
            playerName
        );


    // Pay button

    const payButton =
        document.getElementById("payButton");

    payButton.href = upiLink;


    // Generate QR code

    generateQRCode(upiLink);
}


// --------------------------------------------------
// Build UPI deep link
// --------------------------------------------------

function buildUpiLink(
    upiId,
    payeeName,
    amount,
    playerName
) {

    const params =
        new URLSearchParams({

            pa: upiId,

            pn: payeeName,

            am: Number(amount).toFixed(2),

            cu: "INR",

            tn: `Badminton payment - ${playerName}`

        });


    return `upi://pay?${params.toString()}`;
}


// --------------------------------------------------
// Format amount
// --------------------------------------------------

function formatAmount(value) {

    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2
    }).format(value);

}


// --------------------------------------------------
// QR Code
// --------------------------------------------------

function generateQRCode(upiLink) {

    const qrCode =
        document.getElementById("qrCode");


    /*
        QRServer generates an image containing
        the UPI deep link.

        The payment itself does NOT go through
        QRServer.
    */

    const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=300x300&data=" +
        encodeURIComponent(upiLink);


    qrCode.src = qrUrl;
}


// --------------------------------------------------
// Copy UPI ID
// --------------------------------------------------

document
    .getElementById("copyButton")
    .addEventListener(
        "click",
        async function () {

            try {

                await navigator.clipboard.writeText(UPI_ID);

                showMessage(
                    "UPI ID copied!"
                );

            } catch (error) {

                showMessage(
                    "Could not copy UPI ID.",
                    true
                );

            }

        }
    );


// --------------------------------------------------
// Message
// --------------------------------------------------

function showMessage(
    text,
    isError = false
) {

    const message =
        document.getElementById("message");

    message.textContent = text;

    message.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";

}