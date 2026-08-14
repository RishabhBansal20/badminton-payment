const sessionNameInput =
    document.getElementById("sessionName");

const sessionDateInput =
    document.getElementById("sessionDate");

const playersList =
    document.getElementById("playersList");

const addPlayerButton =
    document.getElementById("addPlayerButton");

const playerCount =
    document.getElementById("playerCount");

const totalAmount =
    document.getElementById("totalAmount");

const generateSessionButton =
    document.getElementById("generateSessionButton");

const sessionResult =
    document.getElementById("sessionResult");

const sessionLink =
    document.getElementById("sessionLink");

const copySessionLinkButton =
    document.getElementById("copySessionLinkButton");

const openSessionButton =
    document.getElementById("openSessionButton");

const sessionMessage =
    document.getElementById("sessionMessage");


// --------------------------------------------------
// Add player
// --------------------------------------------------

function addPlayer() {

    const row =
        document.createElement("div");

    row.className = "player-row";


    const uniqueId =
        Date.now() +
        Math.random()
            .toString(36)
            .substring(2, 8);


    row.innerHTML = `

        <input
            type="text"
            class="player-name"
            id="player-name-${uniqueId}"
            name="player-name-${uniqueId}"
            placeholder="Player name"
            autocomplete="new-password"
            autocorrect="off"
            autocapitalize="words"
            spellcheck="false"
        >

        <input
            type="number"
            class="player-amount"
            id="player-amount-${uniqueId}"
            name="player-amount-${uniqueId}"
            placeholder="Amount"
            min="1"
            step="1"
            inputmode="numeric"
            autocomplete="new-password"
        >

        <button
            type="button"
            class="remove-player"
            aria-label="Remove player"
        >
            ×
        </button>

    `;


    playersList.appendChild(row);


    // Get the newly created inputs

    const nameInput =
        row.querySelector(".player-name");

    const amountInput =
        row.querySelector(".player-amount");


    // Explicitly clear them

    nameInput.value = "";
    amountInput.value = "";


    // Prevent browser autofill/restoration

    nameInput.setAttribute(
        "autocomplete",
        "new-password"
    );

    amountInput.setAttribute(
        "autocomplete",
        "new-password"
    );


    // Listen for changes

    nameInput.addEventListener(
        "input",
        updateSummary
    );

    amountInput.addEventListener(
        "input",
        updateSummary
    );


    // Remove player

    row.querySelector(".remove-player")
        .addEventListener(
            "click",
            function () {

                row.remove();

                updateSummary();

            }
        );


    updateSummary();
}


// --------------------------------------------------
// Update player count + total
// --------------------------------------------------

function updateSummary() {

    const rows =
        document.querySelectorAll(
            ".player-row"
        );


    let total = 0;


    rows.forEach(
        function (row) {

            const amount =
                Number(
                    row.querySelector(
                        ".player-amount"
                    ).value
                );


            if (
                Number.isFinite(amount) &&
                amount > 0
            ) {

                total += amount;

            }

        }
    );


    playerCount.textContent =
        `${rows.length} ${
            rows.length === 1
                ? "player"
                : "players"
        }`;


    totalAmount.textContent =
        formatAmount(total);
}


// --------------------------------------------------
// Format currency
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
// Generate session
// --------------------------------------------------

generateSessionButton.addEventListener(
    "click",
    function () {

        const sessionName =
            sessionNameInput.value.trim();

        const sessionDate =
            sessionDateInput.value;


        const rows =
            document.querySelectorAll(
                ".player-row"
            );


        const players = [];


        // Validate session name

        if (!sessionName) {

            showMessage(
                "Please enter a session name.",
                true
            );

            return;

        }


        // Validate players

        for (
            const row of rows
        ) {

            const name =
                row.querySelector(
                    ".player-name"
                ).value.trim();

            const amount =
                Number(
                    row.querySelector(
                        ".player-amount"
                    ).value
                );


            if (!name) {

                showMessage(
                    "Please enter a name for every player.",
                    true
                );

                return;

            }


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showMessage(
                    "Please enter a valid amount for every player.",
                    true
                );

                return;

            }


            players.push({
                name: name,
                amount: amount
            });

        }


        if (players.length === 0) {

            showMessage(
                "Please add at least one player.",
                true
            );

            return;

        }


        // Create session data

        const sessionData = {

            name: sessionName,

            date: sessionDate,

            players: players

        };


        // Encode session data

        const encodedData =
            encodeURIComponent(
                btoa(
                    JSON.stringify(
                        sessionData
                    )
                )
            );


        // Create session URL

        const isProduction =
            window.location.hostname.includes(
                "vercel.app"
            );


        const sessionPath =
            isProduction
                ? "/session-view"
                : "/session-view.html";


        const url =
            new URL(
                sessionPath,
                window.location.origin
            );


        url.searchParams.set(
            "data",
            encodedData
        );


        const link =
            url.toString();


        // Display result

        sessionLink.textContent =
            link;

        openSessionButton.href =
            link;

        sessionResult.style.display =
            "block";


        showMessage(
            "Session link created!",
            false
        );

    }
);


// --------------------------------------------------
// Copy session link
// --------------------------------------------------

copySessionLinkButton.addEventListener(
    "click",
    async function () {

        const link =
            sessionLink.textContent;


        if (!link) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                link
            );


            showMessage(
                "Session link copied!",
                false
            );


        } catch (error) {

            showMessage(
                "Could not copy the session link.",
                true
            );

        }

    }
);


// --------------------------------------------------
// Add first player automatically
// --------------------------------------------------

addPlayer();


// --------------------------------------------------
// Add player button
// --------------------------------------------------

addPlayerButton.addEventListener(
    "click",
    addPlayer
);


// --------------------------------------------------
// Message
// --------------------------------------------------

function showMessage(
    text,
    isError
) {

    sessionMessage.textContent =
        text;

    sessionMessage.style.color =
        isError
            ? "#dc2626"
            : "#16a36a";

}