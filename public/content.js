function scrapeEmails() {
    if (!window.location.href.includes("mailbox")) {
        return { error: "Not inside a mailbox. Open your inbox first." };
    }

    const emails = [];
    document.querySelectorAll(".vpRowHoriz").forEach((row) => {
        const from = row.querySelector(".msgFrom")?.title || "Unknown";
        const subject = row.querySelector(".msgSubject")?.title || "No Subject";
        const date = row.querySelector(".msgDate")?.textContent.trim() || "Unknown Date";
        const size = row.querySelector(".msgSize")?.textContent.trim() || "Unknown Size";

        emails.push({ from, subject, date, size });
    });

    return { emails };
}

function scrapeOpenedEmail() {
    const previewDiv = document.getElementById("previewMsg");
    if (!previewDiv) return { error: "No email is currently open." };

    const subject = previewDiv.querySelector(".subject")?.textContent.trim() || "No Subject";
    const from = previewDiv.querySelector(".from a")?.title || "Unknown Sender";
    const date = previewDiv.querySelector(".date")?.textContent.trim() || "Unknown Date";

    return { subject, from, date };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeEmails") {
        sendResponse(scrapeEmails());
    } else if (request.action === "scrapeOpenedEmail") {
        sendResponse(scrapeOpenedEmail());
    }
});
