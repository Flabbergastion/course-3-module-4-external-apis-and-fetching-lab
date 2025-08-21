// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// Function to display the error message
function displayError(message) {
  const errorContainer = document.getElementById("error-message");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden"); // Remove the 'hidden' class to make it visible
  }
}

// Function to clear the error message
function clearError() {
  const errorContainer = document.getElementById("error-message");
  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("hidden"); // Add the 'hidden' class to hide it
  }
}

async function fetchWeatherAlerts(stateAbbreviation) {
  const url = `${weatherApi}${stateAbbreviation}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    clearError(); // Clear any previous error messages on successful fetch
    return data;
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    displayError(`Failed to fetch weather alerts: ${error.message}`); // Display the error message
    return null;
  }
}

function displayAlerts(data) {
  const alertsContainer = document.getElementById("alerts-display");
  if (!alertsContainer) {
    console.error("Error: alerts-display element not found in the DOM.");
    return;
  }

  alertsContainer.innerHTML = ""; // Clear previous alerts
  clearError(); // Clear any existing error messages before displaying new alerts

  const title = data.title;
  const alertCount = data.features ? data.features.length : 0;

  const summaryMessage = document.createElement("p");
  summaryMessage.textContent = `${title}: ${alertCount}`;
  alertsContainer.appendChild(summaryMessage);

  if (alertCount > 0) {
    const alertList = document.createElement("ul");
    data.features.forEach((alert) => {
      const listItem = document.createElement("li");
      listItem.textContent = alert.properties.headline;
      alertList.appendChild(listItem);
    });
    alertsContainer.appendChild(alertList);
  }

  const stateInput = document.getElementById("state-input"); // Assuming input has this ID
  if (stateInput) {
    stateInput.value = ""; 
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchAlertsButton = document.getElementById("fetch-alerts");
  if (fetchAlertsButton) {
    fetchAlertsButton.addEventListener("click", async () => {
      const stateInput = document.getElementById("state-input");
      if (stateInput) {
        const stateAbbreviation = stateInput.value;
        const alertsData = await fetchWeatherAlerts(stateAbbreviation);
        if (alertsData) {
          displayAlerts(alertsData);
        }
      }
    });
  }
});