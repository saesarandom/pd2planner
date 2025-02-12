document.addEventListener("DOMContentLoaded", () => {
  // Define corruption modifiers for each item type
  const helmCorruptions = [
    { mod: "+[20-30]% Faster Hit Recovery", type: "numeric", range: [20, 30] },
    {
      mod: "Indestructible , +[50-80]% Enhanced Defense",
      type: "numeric",
      range: [50, 80],
    },
    { mod: "+1 to All Skills", type: "fixed" },
    { mod: "+[50-80]% Enhanced Defense", type: "numeric", range: [50, 80] },
    {
      mod: "+[150-250] to Attack Rating, +[2-4] to Light Radius",
      type: "double",
      range: [
        [150, 250],
        [2, 4],
      ],
    },
    // ... rest of helmet corruptions remain the same
  ];

  const armorCorruptions = [
    ...helmCorruptions, // Using same corruptions for now, can be customized
    { mod: "+[1-2] to All Skills", type: "numeric", range: [1, 2] },
  ];

  const weaponCorruptions = [
    { mod: "+[20-40]% Enhanced Damage", type: "numeric", range: [20, 40] },
    { mod: "Adds [25-50] Cold Damage", type: "numeric", range: [25, 50] },
    { mod: "Adds [25-75] Lightning Damage", type: "numeric", range: [25, 75] },
    { mod: "Adds [25-50] Fire Damage", type: "numeric", range: [25, 50] },
    { mod: "[5-10]% Life Stolen per Hit", type: "numeric", range: [5, 10] },
    { mod: "[5-10]% Mana Stolen per Hit", type: "numeric", range: [5, 10] },
    { mod: "+[1-2] to All Skills", type: "numeric", range: [1, 2] },
    { mod: "Indestructible", type: "fixed" },
  ];

  const shieldCorruptions = [
    { mod: "+[20-30]% Faster Block Rate", type: "numeric", range: [20, 30] },
    { mod: "+[50-100]% Enhanced Defense", type: "numeric", range: [50, 100] },
    { mod: "All Resistances +[15-20]", type: "numeric", range: [15, 20] },
    { mod: "+[1-2] to All Skills", type: "numeric", range: [1, 2] },
    { mod: "Indestructible", type: "fixed" },
  ];

  // Map item types to their corruption options
  const corruptionsByType = {
    helm: helmCorruptions,
    armor: armorCorruptions,
    weapon: weaponCorruptions,
    shield: shieldCorruptions,
  };

  // Persistent storage for item corruptions
  const itemCorruptions = JSON.parse(
    localStorage.getItem("itemCorruptions") || "{}"
  );

  function generateValue(range) {
    if (Array.isArray(range)) {
      const [min, max] = range;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return range;
  }

  function showModal(type) {
    const modal = document.getElementById("corruptionModal");
    const optionsContainer = document.getElementById("corruptionOptions");
    modal.style.display = "block";
    optionsContainer.innerHTML = "";

    const corruptions = corruptionsByType[type];
    corruptions.forEach((mod) => {
      const modContainer = document.createElement("div");
      modContainer.className = "corruption-option-container";

      const button = document.createElement("button");
      button.className = "corruption-option";

      if (mod.type === "numeric") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = mod.range[0];
        slider.max = mod.range[1];
        slider.value = mod.range[0];
        slider.className = "corruption-slider";

        const value = document.createElement("span");
        value.className = "corruption-slider-value";
        value.textContent = slider.value;

        slider.oninput = () => {
          value.textContent = slider.value;
          button.textContent = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
        };

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(value);

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.onclick = () => {
          const modWithValue = mod.mod.replace(/\[\d+-\d+\]/, slider.value);
          selectMod({ ...mod, mod: modWithValue }, type);
        };
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);
      } else if (mod.type === "double") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "corruption-slider-container";
        sliderContainer.style.display = "none";

        const slider1 = document.createElement("input");
        slider1.type = "range";
        slider1.min = mod.range[0][0];
        slider1.max = mod.range[0][1];
        slider1.value = mod.range[0][0];
        slider1.className = "corruption-slider";

        const slider2 = document.createElement("input");
        slider2.type = "range";
        slider2.min = mod.range[1][0];
        slider2.max = mod.range[1][1];
        slider2.value = mod.range[1][0];
        slider2.className = "corruption-slider";

        const value1 = document.createElement("span");
        const value2 = document.createElement("span");
        value1.className = "corruption-slider-value";
        value2.className = "corruption-slider-value";
        value1.textContent = slider1.value;
        value2.textContent = slider2.value;

        const updateButtonText = () => {
          button.textContent = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
        };

        slider1.oninput = () => {
          value1.textContent = slider1.value;
          updateButtonText();
        };

        slider2.oninput = () => {
          value2.textContent = slider2.value;
          updateButtonText();
        };

        sliderContainer.appendChild(slider1);
        sliderContainer.appendChild(value1);
        sliderContainer.appendChild(slider2);
        sliderContainer.appendChild(value2);

        button.onclick = () => {
          document
            .querySelectorAll(".corruption-slider-container")
            .forEach((container) => {
              container.style.display = "none";
            });
          sliderContainer.style.display = "block";
        };

        const confirm = document.createElement("button");
        confirm.className = "corruption-confirm";
        confirm.textContent = "Confirm";
        confirm.onclick = () => {
          const modWithValues = mod.mod
            .replace(/\[\d+-\d+\]/, slider1.value)
            .replace(/\[\d+-\d+\]/, slider2.value);
          selectMod({ ...mod, mod: modWithValues }, type);
        };
        sliderContainer.appendChild(confirm);

        modContainer.appendChild(button);
        modContainer.appendChild(sliderContainer);
      } else {
        button.onclick = () => selectMod(mod, type);
        modContainer.appendChild(button);
      }

      button.textContent = mod.mod;
      optionsContainer.appendChild(modContainer);
    });
  }

  function selectMod(mod, type) {
    let formattedMod;
    if (mod.type === "numeric") {
      formattedMod = mod.mod;
    } else if (mod.type === "double") {
      const value1 = generateValue(mod.range[0]);
      const value2 = generateValue(mod.range[1]);
      formattedMod = mod.mod
        .replace(/\[\d+-\d+\]/, value1)
        .replace(/\[\d+-\d+\]/, value2);
    } else {
      formattedMod = mod.mod;
    }

    const containerMap = {
      helm: document.getElementById("helm-info"),
      armor: document.getElementById("armor-info"),
      weapon: document.getElementById("weapon-info"),
      shield: document.getElementById("off-info"),
    };

    const container = containerMap[type];
    if (container) {
      const dropdownId = `${type === "shield" ? "offs" : type}s-dropdown`;
      const dropdown = document.getElementById(dropdownId);
      const itemName = dropdown.value;

      // Store the corruption modifier for this specific item
      itemCorruptions[itemName] = formattedMod;
      localStorage.setItem("itemCorruptions", JSON.stringify(itemCorruptions));

      updateCorruptionDisplay(type, formattedMod);
    }

    document.getElementById("corruptionModal").style.display = "none";
  }

  function updateCorruptionDisplay(type, corruptionMod) {
    const container = document.getElementById(`${type}-info`);
    if (!container) return;

    const existingMod = container.querySelector(".corrupted-mod");
    const existingText = container.querySelector(".corrupted-text");
    if (existingMod) existingMod.remove();
    if (existingText) existingText.remove();

    const resultDiv = document.createElement("div");
    resultDiv.className = "corrupted-mod";
    resultDiv.textContent = corruptionMod;

    const corruptedText = document.createElement("div");
    corruptedText.className = "corrupted-text";
    corruptedText.textContent = "Corrupted";

    container.appendChild(resultDiv);
    container.appendChild(corruptedText);
  }

  // Update dropdowns to persist corruption modifiers
  [
    "helms-dropdown",
    "armors-dropdown",
    "weapons-dropdown",
    "offs-dropdown",
  ].forEach((id) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.addEventListener("change", (e) => {
        const type = id.split("-")[0].replace("offs", "shield");
        const itemName = e.target.value;
        const corruption = itemCorruptions[itemName];

        const container = document.getElementById(`${type}-info`);
        const existingMod = container.querySelector(".corrupted-mod");
        const existingText = container.querySelector(".corrupted-text");

        if (existingMod) existingMod.remove();
        if (existingText) existingText.remove();

        if (corruption) {
          updateCorruptionDisplay(type, corruption);
        }
      });
    }
  });

  // Add CSS and modal HTML as in the original script
  const style = document.createElement("style");
  style.textContent = `
      .corruption-slider-container {
        margin-top: 10px;
        padding: 10px;
        background: #2a2a2a;
        border-radius: 4px;
      }
      
      .corruption-slider {
        width: 100%;
        margin: 10px 0;
      }
      
      .corruption-slider-value {
        display: inline-block;
        margin-left: 10px;
        color: #ff4444;
      }
      
      .corruption-confirm {
        display: block;
        margin-top: 10px;
        padding: 5px 10px;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .corruption-confirm:hover {
        background: #ff6666;
      }
      
      .corruption-option-container {
        margin-bottom: 10px;
      }
    `;
  document.head.appendChild(style);

  const modalHTML = `
      <div id="corruptionModal" class="corruption-modal" style="display: none;">
        <div class="corruption-content">
          <h2>Select Corruption Modifier</h2>
          <div id="corruptionOptions" class="corruption-options"></div>
        </div>
      </div>
    `;

  const buttonsHTML = `
      <div class="corruption-buttons">
        <button id="corruptHelm" class="corrupt-button">Corrupt Helm</button>
        <button id="corruptArmor" class="corrupt-button">Corrupt Armor</button>
        <button id="corruptWeapon" class="corrupt-button">Corrupt Weapon</button>
        <button id="corruptShield" class="corrupt-button">Corrupt Shield</button>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.insertAdjacentHTML("beforeend", buttonsHTML);

  document
    .getElementById("corruptHelm")
    .addEventListener("click", () => showModal("helm"));
  document
    .getElementById("corruptArmor")
    .addEventListener("click", () => showModal("armor"));
  document
    .getElementById("corruptWeapon")
    .addEventListener("click", () => showModal("weapon"));
  document
    .getElementById("corruptShield")
    .addEventListener("click", () => showModal("shield"));

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("corruptionModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
