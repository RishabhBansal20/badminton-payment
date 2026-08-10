const generateButton =
    document.getElementById("generateButton");

const copyLinkButton =
    document.getElementById("copyLinkButton");

const playerNameInput =
    document.getElementById("playerName");

const amountInput =
    document.getElementById("amount");

const result =
    document.getElementById("result");

const generatedLink =
    document.getElementById("generatedLink");

const openLinkButton =
    document.getElementById("openLinkButton");

const message =
    document.getElementById("message");


// Generate payment link
generateButton.addEventListener(
    "click",
    function () {

        const name =
            playerNameInput.value.trim();

        const amount =
            Number(amountInput.value);


        // Validate name
        if (!name) {

            showMessage(
                "Please enter the player's name.",
                true
            );

            return;
        }


        // Validate amount
        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            showMessage(
                "Please enter a valid amount.",
                true
            );

            return;
        }


        // Create payment URL

        const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const paymentPath =
    isLocal
        ? "/"
        : "/pay";

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


        const paymentLink =
            url.toString();


        // Display result

        generatedLink.textContent =
            paymentLink;

        openLinkButton.href =
            paymentLink;

        result.style.display =
            "block";

        showMessage(
            "Payment link generated!",
            false
        );

    }
);


// Copy generated link

copyLinkButton.addEventListener(
    "click",
    async function () {

        const link =
            generatedLink.textContent;

        if (!link) {
            return;
        }

        try {

            await navigator.clipboard.writeText(link);

            showMessage(
                "Payment link copied!",
                false
            );

        } catch (error) {

            showMessage(
                "Could not copy the link.",
                true
            );

        }

    }
);


// Show message

function showMessage(
    text,
    isError
) {

    message.textContent =
        text;

    message.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";

}