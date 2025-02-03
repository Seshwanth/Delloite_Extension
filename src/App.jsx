import { useState } from "react";
import settingsIcon from "./assets/settings.svg";
import "./App.css";

function App() {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");

  const handleScrape = () => {
    if (!chrome || !chrome.tabs) {
      setError("This extension only works in a Chrome browser.");
      return;
    }
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "scrapeEmails" },
        (response) => {
          if (response?.error) {
            setError(response.error);
            setEmails([]);
          } else {
            setError("");
            setEmails(response?.emails || []);
          }
        }
      );
    });
  };

  const downloadJSON = () => {
    if (emails.length === 0) {
      setError("No data to download. Scrape emails first!");
      return;
    }

    const jsonData = JSON.stringify(emails, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "emails.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-between w-[360px] h-[240px] bg-[#242424] p-4 shadow-lg">
      <header className="w-full flex justify-end">
        <button className="w-8 h-8 p-2 bg-[#2c2c2c] rounded-md hover:bg-[#1d1d1d]">
          <img src={settingsIcon} alt="Settings" />
        </button>
      </header>
      <img 
        src="./Logz.png"
        alt="EScraper Logo" 
        className="w-16 h-16 mb-2"
      />
      <h1 className="text-[#dcd8d8] text-xl font-semibold text-center">
        EScraper
      </h1>

      <button
        onClick={handleScrape}
        className="w-[60%] h-96 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 my-2"
      >
        Scrape Emails
      </button>

      <button
        onClick={downloadJSON}
        className="w-[60%] h-96 bg-green-500 text-white font-bold rounded-md hover:bg-green-700"
      >
        Download JSON
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <ul className="mt-4 w-full overflow-y-auto h-64">
        {emails.map((email, index) => (
          <li key={index} className="bg-gray-800 p-2 rounded-md my-2">
            <p>
              <strong>From:</strong> {email.from}
            </p>
            <p>
              <strong>Subject:</strong> {email.subject}
            </p>
            <p>
              <strong>Date:</strong> {email.date}
            </p>
            <p>
              <strong>Size:</strong> {email.size}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
