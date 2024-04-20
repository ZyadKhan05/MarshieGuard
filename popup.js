// popup.js

document.addEventListener("DOMContentLoaded", function() {
  const urlInput = document.getElementById("urlInput");
  const urlForm = document.getElementById("urlForm");
  const urlResult = document.getElementById("urlResult");
  const linkResult = document.getElementById("linkResult");
  const urlLoader = document.getElementById("urlLoader");
  const linkLoader = document.getElementById("linkLoader");

  // Form submission for URL scanning
  urlForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const url = urlInput.value.trim();
    if (url !== '') {
      scanURL(url);
    }
  });

  // Message listener for receiving scan results
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "scanResults") {
      const results = request.results;

      if (results.type === "url") {
        displayURLResults(results);
      } else if (results.type === "link") {
        displayLinkResults(results);
      }
    }
  });

  // Hovered link scanning
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "hoverLink" });
  });

  function scanURL(url) {
    const api_key = 'de6e6f384c68c49d2b1ad391b0c0fb177cd0a36a1b3a6defa0e7bdea1c338fb5'; // Replace with your VirusTotal API key
    const submit_url = 'https://www.virustotal.com/vtapi/v2/url/scan';
    const report_url = 'https://www.virustotal.com/vtapi/v2/url/report';

    const params = {
      apikey: api_key,
      url: url,
      type: "url" // Indicates this is a URL scan
    };

    // Show loader
    urlLoader.classList.remove("hide");

    // Submit URL for scanning
    fetch(submit_url, {
      method: 'POST',
      body: new URLSearchParams(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(response => response.json())
    .then(data => {
      // Wait for a few seconds before checking the report
      setTimeout(() => {
        fetch(`${report_url}?apikey=${api_key}&resource=${data.scan_id}`)
        .then(response => response.json())
        .then(data => {
          // Send response with scan results to popup script
          chrome.runtime.sendMessage({ action: "scanResults", results: { type: "url", ...data } });
        })
        .catch(error => {
          console.error('Error getting URL report:', error);
        });
      }, 15000); // Adjust timing as needed
    })
    .catch(error => {
      console.error('Error submitting URL:', error);
    });
  }

  function displayURLResults(results) {
    // Hide loader
    urlLoader.classList.add("hide");

    // Show URL scan results
    urlResult.classList.remove("hide");

    // Display scan results
    document.getElementById("urlLink").textContent = `Link: ${results.url}`;
    document.getElementById("urlPositives").textContent = `Positives: ${results.positives}`;
    document.getElementById("urlTotal").textContent = `Total: ${results.total}`;

    // Update health progress bar
    const health = (results.positives / results.total) * 100;
    document.getElementById("urlHealth").value = health;
  }

  function displayLinkResults(results) {
    // Hide loader
    linkLoader.classList.add("hide");

    // Show link scan results
    linkResult.classList.remove("hide");

    // Display scan results
    document.getElementById("linkUrl").textContent = `Link: ${results.url}`;
    document.getElementById("linkPositives").textContent = `Positives: ${results.positives}`;
    document.getElementById("linkTotal").textContent = `Total: ${results.total}`;

    // Update health progress bar
    const health = (results.positives / results.total) * 100;
    document.getElementById("linkHealth").value = health;
  }
});
