// FIXED Character Save System

// Configuration
const MAX_SAVE_SLOTS = 10; // Maximum number of character save slots per user
const API_BASE_URL = "http://localhost:3001"; // Same as in your CustomCraftItems.js

// Add a debug log function to track execution
function logDebug(message) {
  console.log(`[CharSave] ${message}`);
}

// Main function to save the current character state
function saveCharacter() {
  logDebug("saveCharacter function called");

  // Check if the user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to save a character.");
    return;
  }

  // Prompt user for a character name
  let characterName = prompt(
    "Enter a name for this character (2-13 letters only):",
    ""
  );

  // Validate character name
  if (!characterName) {
    return; // User cancelled
  }

  // Validate name format (letters only, 2-13 characters)
  const nameRegex = /^[A-Za-z]{2,13}$/;

  if (!nameRegex.test(characterName)) {
    alert(
      "Character name must be 2-13 letters only. No numbers, spaces, or special characters."
    );
    return;
  }

  logDebug("Character name validated: " + characterName);

  // Get the current character state
  const characterState = captureCharacterState();
  logDebug("Character state captured");

  // Create save data object
  const saveData = {
    userId: currentUser,
    name: characterName,
    state: characterState,
    createdAt: new Date().toISOString(),
  };

  // Save to server
  saveCharacterToServer(saveData);
}

// Capture the current state of the character
function captureCharacterState() {
  const characterState = {};

  // Capture selected dropdowns
  const dropdowns = document.querySelectorAll("select");
  dropdowns.forEach((dropdown) => {
    if (dropdown.id && dropdown.value) {
      characterState[dropdown.id] = dropdown.value;
    }
  });

  // Capture character stats and relevant input values
  const statElements = document.querySelectorAll(".stat-value");
  statElements.forEach((statElement) => {
    if (statElement.id) {
      characterState[statElement.id] =
        statElement.textContent || statElement.innerText;
    }
  });

  // Capture any other relevant inputs
  const textInputs = document.querySelectorAll(
    'input[type="text"], input[type="number"]'
  );
  textInputs.forEach((input) => {
    if (input.id && input.value) {
      characterState[input.id] = input.value;
    }
  });

  // Capture character level if available
  if (typeof characterLevel !== "undefined") {
    characterState.characterLevel = characterLevel;
  }

  logDebug(
    "Character state object: " +
      Object.keys(characterState).length +
      " properties"
  );
  return characterState;
}

// Save character data to the server
function saveCharacterToServer(saveData) {
  logDebug("Saving character to server: " + saveData.name);

  fetch(`${API_BASE_URL}/api/characters`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saveData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Server error: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert(`Character "${saveData.name}" saved successfully!`);
        // Refresh the character list
        loadSavedCharacters();
      } else {
        alert(`Error saving character: ${data.message || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("Error saving character:", error);
      alert(`Error saving character: ${error.message}`);
    });
}

// Load the list of saved characters
function loadSavedCharacters() {
  const token = localStorage.getItem("token");
  if (!token) return;

  logDebug("Loading saved characters");

  fetch(`${API_BASE_URL}/api/characters`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displaySavedCharacters(data.characters);
      } else {
        console.error("Failed to load characters:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error loading saved characters:", error);
    });
}

// Display the list of saved characters
function displaySavedCharacters(characters) {
  const charactersContainer = document.getElementById("savedCharactersList");
  if (!charactersContainer) return;

  // Clear existing content
  charactersContainer.innerHTML = "";

  if (!characters || characters.length === 0) {
    charactersContainer.innerHTML =
      "<p>No saved characters found. Save your current character to see it here.</p>";
    return;
  }

  // Create character list
  const characterList = document.createElement("ul");
  characterList.className = "saved-characters-list";

  characters.forEach((character) => {
    const listItem = document.createElement("li");
    listItem.className = "saved-character-item";

    // Format date
    const savedDate = new Date(character.createdAt).toLocaleDateString();

    // Create character entry
    listItem.innerHTML = `
      <div class="character-info">
          <span class="character-name">${character.name}</span>
          <span class="character-date">Saved on: ${savedDate}</span>
      </div>
      <div class="character-actions">
          <button class="load-character-btn" data-id="${character._id}">Load</button>
          <button class="delete-character-btn" data-id="${character._id}">Delete</button>
      </div>
    `;

    characterList.appendChild(listItem);
  });

  // Add the list to the container
  charactersContainer.appendChild(characterList);

  // Add event listeners for load and delete buttons
  document.querySelectorAll(".load-character-btn").forEach((button) => {
    button.addEventListener("click", () => {
      loadCharacter(button.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".delete-character-btn").forEach((button) => {
    button.addEventListener("click", () => {
      deleteCharacter(button.getAttribute("data-id"));
    });
  });

  logDebug("Displayed " + characters.length + " characters");
}

// Load a specific character
function loadCharacter(characterId) {
  if (
    !confirm(
      "Loading this character will replace your current character. Continue?"
    )
  ) {
    return;
  }

  logDebug("Loading character: " + characterId);

  fetch(`${API_BASE_URL}/api/characters/${characterId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        applyCharacterState(data.character.state);
        alert(`Character "${data.character.name}" loaded successfully!`);
      } else {
        alert(`Error loading character: ${data.message || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("Error loading character:", error);
      alert(`Error loading character: ${error.message}`);
    });
}

// Delete a saved character
function deleteCharacter(characterId) {
  if (
    !confirm(
      "Are you sure you want to delete this character? This action cannot be undone."
    )
  ) {
    return;
  }

  logDebug("Deleting character: " + characterId);

  fetch(`${API_BASE_URL}/api/characters/${characterId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Character deleted successfully!");
        loadSavedCharacters(); // Refresh the list
      } else {
        alert(`Error deleting character: ${data.message || "Unknown error"}`);
      }
    })
    .catch((error) => {
      console.error("Error deleting character:", error);
      alert(`Error deleting character: ${error.message}`);
    });
}

// Apply saved character state
function applyCharacterState(state) {
  logDebug("Applying character state");

  // Apply to dropdowns
  Object.keys(state).forEach((key) => {
    const element = document.getElementById(key);
    if (element) {
      if (element.tagName === "SELECT") {
        element.value = state[key];
        // Trigger change event to update character
        const event = new Event("change");
        element.dispatchEvent(event);
      } else if (element.tagName === "INPUT") {
        element.value = state[key];
        // Trigger input event
        const event = new Event("input");
        element.dispatchEvent(event);
      } else {
        // For non-input elements (like stats)
        element.textContent = state[key];
      }
    }
  });

  // Set character level if available
  if (state.characterLevel && typeof characterLevel !== "undefined") {
    characterLevel = state.characterLevel;
  }

  // Refresh character display
  if (typeof updateCharacter === "function") {
    updateCharacter();
  }

  logDebug("Character state applied");
}

// Initialize the character save system
function initCharacterSaveSystem() {
  logDebug("Initializing character save system");

  // Add the saved characters list to the characters tab
  const charactersTab = document.getElementById("charactersTab");
  if (charactersTab) {
    // Check if the list container already exists
    if (!document.getElementById("savedCharactersList")) {
      const listContainer = document.createElement("div");
      listContainer.id = "savedCharactersList";
      listContainer.className = "saved-characters-container";
      charactersTab.appendChild(listContainer);
    }

    // Load saved characters
    loadSavedCharacters();
  }

  // Add event listener to the save button
  const saveButton = document.getElementById("saveCharacterButton");
  if (saveButton) {
    logDebug("Found save button, adding event listener");

    // Remove existing event listeners
    const newSaveButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newSaveButton, saveButton);

    // Add new event listener
    newSaveButton.addEventListener("click", function (event) {
      event.preventDefault();
      logDebug("Save button clicked");
      saveCharacter();
    });
  } else {
    logDebug("Save button not found!");
  }
}

// Add styles for the saved characters list
function addCharacterSaveStyles() {
  if (document.getElementById("character-save-styles")) {
    return; // Styles already added
  }

  const style = document.createElement("style");
  style.id = "character-save-styles";
  style.textContent = `
    .saved-characters-container {
        margin-top: 20px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .saved-characters-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .saved-character-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background-color: #333;
        border-radius: 4px;
        border-left: 3px solid #e74c3c;
    }
    
    .character-info {
        display: flex;
        flex-direction: column;
    }
    
    .character-name {
        font-weight: bold;
        color: #eee;
        margin-bottom: 4px;
    }
    
    .character-date {
        font-size: 0.8em;
        color: #aaa;
    }
    
    .character-actions {
        display: flex;
        gap: 8px;
    }
    
    .load-character-btn {
        padding: 5px 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    
    .delete-character-btn {
        padding: 5px 10px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    
    #saveCharacterButton {
        padding: 10px 15px;
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    #saveCharacterButton:hover {
        background-color: #27ae60;
    }
  `;
  document.head.appendChild(style);
  logDebug("Character save styles added");
}

// IMPORTANT: This is the main initialization that will run on page load
document.addEventListener("DOMContentLoaded", () => {
  logDebug("DOM loaded - adding character save styles");
  addCharacterSaveStyles();

  // Try to directly attach listener to save button on page load
  const saveButton = document.getElementById("saveCharacterButton");
  if (saveButton) {
    logDebug("Found save button on page load");
    saveButton.addEventListener("click", function (event) {
      event.preventDefault();
      logDebug("Save button clicked from direct binding");
      saveCharacter();
    });
  }
});

// Also initialize when the user logs in
document.addEventListener("userLoggedIn", () => {
  logDebug("User logged in - initializing character save system");
  initCharacterSaveSystem();
});

// Update the showTab function to refresh the saved characters list when the tab is shown
const originalShowTab = window.showTab || function () {};
window.showTab = function (tabName) {
  logDebug("showTab called for: " + tabName);
  originalShowTab(tabName);

  if (tabName === "characters") {
    // Ensure button has event listener
    const saveButton = document.getElementById("saveCharacterButton");
    if (saveButton && !saveButton._hasCharacterSaveListener) {
      logDebug("Re-attaching event listener to save button when tab shown");
      saveButton.addEventListener("click", function (event) {
        event.preventDefault();
        logDebug("Save button clicked from tab shown");
        saveCharacter();
      });
      saveButton._hasCharacterSaveListener = true;
    }

    // Load characters
    loadSavedCharacters();
  }
};
