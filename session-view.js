const sessionTitle =
    document.getElementById("sessionTitle");

const sessionDate =
    document.getElementById("sessionDate");

const sessionPlayers =
    document.getElementById("sessionPlayers");

const sessionTotal =
    document.getElementById("sessionTotal");

const sessionError =
    document.getElementById("sessionError");


// --------------------------------------------------
// Read session data from URL
// --------------------------------------------------

function getSessionData() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const encodedData =
        params.get("data");


    if (!encodedData) {
        return null;
    }


    try {

        const decodedData =
            decodeURIComponent(
                encodedData
            );


        const jsonData =
            atob(decodedData);


        return JSON.parse(jsonData);


    } catch (error) {

        console.error(
            "Unable to decode session:",
            error
        );

        return null;

    }

}


// --------------------------------------------------
// Format amount
// --------------------------------------------------

function formatAmount(amount) {

    return (
        "₹" +
        new Intl.NumberFormat(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        ).format(amount)
    );

}


// --------------------------------------------------
// Format date
// --------------------------------------------------

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (Number.isNaN(date.getTime())) {
        return "";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// --------------------------------------------------
// Show error
// --------------------------------------------------

function showError(message) {

    sessionError.textContent =
        message;

    sessionError.style.display =
        "block";

    sessionPlayers.style.display =
        "none";

}


// --------------------------------------------------
// Display session
// --------------------------------------------------

function displaySession(session) {

    if (
        !session ||
        !session.name ||
        !Array.isArray(session.players) ||
        session.players.length === 0
    ) {

        showError(
            "This payment session link is invalid."
        );

        return;

    }


    // Session title

    sessionTitle.textContent =
        session.name;


    // Session date

    const formattedDate =
        formatDate(
            session.date
        );


    if (formattedDate) {

        sessionDate.textContent =
            formattedDate;

    } else {

        sessionDate.style.display =
            "none";

    }


    // Clear players

    sessionPlayers.innerHTML =
        "";


    let total = 0;


    // Create player buttons

    session.players.forEach(
        function (player) {

            const amount =
                Number(
                    player.amount
                );


            total += amount;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "session-player";


            button.innerHTML = `

                <span class="session-player-info">

                    <span class="session-player-name">
                        ${escapeHtml(player.name)}
                    </span>

                    <span class="session-player-hint">
                        Tap to continue
                    </span>

                </span>

                <span class="session-player-amount">
                    ${formatAmount(amount)}
                </span>

                <span class="session-player-arrow">
                    →
                </span>

            `;


            button.addEventListener(
                "click",
                function () {

                    openPaymentPage(
                        player.name,
                        amount
                    );

                }
            );


            sessionPlayers.appendChild(
                button
            );

        }
    );


    // Total

    sessionTotal.textContent =
        formatAmount(total);

}


// --------------------------------------------------
// Open payment page
// --------------------------------------------------

function openPaymentPage(
    name,
    amount
) {

    const isProduction =
        window.location.hostname.includes("vercel.app");

    const paymentPath =
        isProduction
            ? "/pay"
            : "/";

    const url =
        new URL(
            paymentPath,
            window.location.origin
        );

    url.searchParams.set(
        "name",
        name
    );

    url.searchParams.set(
        "amount",
        amount
    );

    window.location.href =
        url.toString();
}

// --------------------------------------------------
// Basic HTML escaping
// --------------------------------------------------

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;

}


// --------------------------------------------------
// Initialize
// --------------------------------------------------

const session =
    getSessionData();


displaySession(
    session
);