// ===================================================================
// ENHANCED RUNEWORD SYSTEM - SIMPLIFIED
// Prevents socket additions + preserves runeword displays
// ===================================================================

let currentSteelDisplay = null;
let currentNadirDisplay = null;

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    addRunewordStyling();
    hookAddSocket();
    styleRunewordOptions();
    watchForRunewordRestoration();
  }, 100);
});

function addRunewordStyling() {
  if (document.getElementById('runeword-styles')) return;

  const style = document.createElement('style');
  style.id = 'runeword-styles';
  style.textContent = `
    .runeword-item {
      color: #b8b8b8 !important;
      font-weight: bold !important;
      text-shadow: 0 0 2px #9e1515 !important;
      background: linear-gradient(90deg, rgba(184, 184, 184, 0.1), rgba(184, 184, 184, 0.05)) !important;
    }
    .runeword-item:hover {
      background: linear-gradient(90deg, rgba(184, 184, 184, 0.2), rgba(184, 184, 184, 0.1)) !important;
      color: #d42e00 !important;
    }
  `;
  document.head.appendChild(style);
}

function hookAddSocket() {
  if (!window.addSocket) return;

  const originalAddSocket = window.addSocket;
  window.addSocket = function(section) {
    if (section === 'weapon') {
      const weaponDropdown = document.getElementById('weapons-dropdown');
      if (weaponDropdown && weaponDropdown.value === 'Steel') {
        showSteelBaseSelector();
        return;
      }
    }
    if (section === 'helm') {
      const helmDropdown = document.getElementById('helms-dropdown');
      if (helmDropdown && helmDropdown.value === 'Nadir') {
        showNadirBaseSelector();
        return;
      }
    }
    originalAddSocket(section);
  };
}

function styleRunewordOptions() {
  const weaponDropdown = document.getElementById('weapons-dropdown');
  const helmDropdown = document.getElementById('helms-dropdown');

  if (weaponDropdown) {
    const steelOption = Array.from(weaponDropdown.options).find(o => o.value === 'Steel');
    if (steelOption) {
      steelOption.className = 'runeword-item';
      steelOption.setAttribute('data-quality', 'runeword');
    }
  }

  if (helmDropdown) {
    const nadirOption = Array.from(helmDropdown.options).find(o => o.value === 'Nadir');
    if (nadirOption) {
      nadirOption.className = 'runeword-item';
      nadirOption.setAttribute('data-quality', 'runeword');
    }
  }
}

function watchForRunewordRestoration() {
  // Watch weapon-info div for changes
  const weaponInfo = document.getElementById('weapon-info');
  if (weaponInfo) {
    const observer = new MutationObserver(() => {
      const weaponDropdown = document.getElementById('weapons-dropdown');
      if (weaponDropdown && weaponDropdown.value === 'Steel' && currentSteelDisplay) {
        if (!weaponInfo.innerHTML.includes(currentSteelDisplay.base)) {
          weaponInfo.innerHTML = currentSteelDisplay.html;
        }
      }
    });
    observer.observe(weaponInfo, { childList: true, subtree: true, characterData: true });
  }

  // Watch helm-info div for changes
  const helmInfo = document.getElementById('helm-info');
  if (helmInfo) {
    const observer = new MutationObserver(() => {
      const helmDropdown = document.getElementById('helms-dropdown');
      if (helmDropdown && helmDropdown.value === 'Nadir' && currentNadirDisplay) {
        if (!helmInfo.innerHTML.includes(currentNadirDisplay.base)) {
          helmInfo.innerHTML = currentNadirDisplay.html;
        }
      }
    });
    observer.observe(helmInfo, { childList: true, subtree: true, characterData: true });
  }
}

function showSteelBaseSelector() {
  const existingModal = document.querySelector('.steel-base-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'steel-base-modal';
  modal.style.cssText = `
    position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; color: white; width: 300px; border: 2px solid #b8b8b8;">
      <h3 style="color: #b8b8b8; text-shadow: 0 0 3px #b8b8b8;">Steel Runeword Base</h3>
      <select id="steelBase" style="width: 100%; padding: 5px; margin: 10px 0; background: #444; color: white; border: 1px solid #b8b8b8;">
        <option value="Short Sword">Short Sword (2-7 dmg)</option>
        <option value="Club">Club (1-6 dmg)</option>
        <option value="Spiked Club">Spiked Club (3-6 dmg)</option>
        <option value="Mace">Mace (3-10 dmg)</option>
        <option value="Flail">Flail (1-15 dmg)</option>
      </select>
      <div style="margin: 10px 0;">
        <label style="color: #646464ff;"><input type="checkbox" id="steelSup"> Superior (0-15% ED)</label>
        <input type="range" id="steelED" min="0" max="15" value="0" style="width: 100%; margin-top: 5px;" disabled>
        <span id="steelEDValue" style="color: #646464ff;">0%</span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="applySteelBtn" style="flex: 1; padding: 10px; background: #b8b8b8; color: #2a2a2a; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
        <button id="cancelSteelBtn" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;

  const supCheckbox = modal.querySelector('#steelSup');
  const edSlider = modal.querySelector('#steelED');
  const edValue = modal.querySelector('#steelEDValue');

  supCheckbox.onchange = function() {
    edSlider.disabled = !this.checked;
    if (!this.checked) {
      edSlider.value = 0;
      edValue.textContent = '0%';
    }
  };

  edSlider.oninput = function() {
    edValue.textContent = this.value + '%';
  };

  modal.querySelector('#applySteelBtn').onclick = () => applySteelBase();
  modal.querySelector('#cancelSteelBtn').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  document.body.appendChild(modal);
}

function applySteelBase() {
  const modal = document.querySelector('.steel-base-modal');
  if (!modal) return;

  const base = modal.querySelector('#steelBase').value;
  const isSup = modal.querySelector('#steelSup').checked;
  const ed = parseInt(modal.querySelector('#steelED').value);

  const stats = {
    'Short Sword': {min: 2, max: 7, str: 27, dex: 28},
    'Club': {min: 1, max: 6, str: 35, dex: 0},
    'Spiked Club': {min: 3, max: 6, str: 38, dex: 0},
    'Mace': {min: 3, max: 10, str: 40, dex: 0},
    'Flail': {min: 1, max: 15, str: 30, dex: 35}
  }[base];

  const totalED = 20 + (isSup ? ed : 0);
  const minDmg = Math.floor(stats.min * (1 + totalED/100)) + 3;
  const maxDmg = Math.floor(stats.max * (1 + totalED/100)) + 3;

  const steelHTML = `<span style="color: #646464ff; font-weight: bold; text-shadow: 0 0 3px #646464ff;">Steel</span><br>${base}${isSup ? ' (Superior)' : ''}<br>` +
    `One-Hand Damage: ${minDmg} to ${maxDmg}<br>` +
    `Required Strength: ${stats.str}<br>` +
    (stats.dex > 0 ? `Required Dexterity: ${stats.dex}<br>` : '') +
    `Required Level: 13<br>` +
    `+25% Increased Attack Speed<br>` +
    `+${totalED}% Enhanced Damage<br>` +
    `+3 to Minimum Damage<br>` +
    `+3 to Maximum Damage<br>` +
    `+50% Chance of Open Wounds<br>` +
    `<span style="color: #646464ff;">+2 to Mana after each Kill</span><br>` +
    `<span style="color: #646464ff;">+50 Attack Rating</span><br>` +
    `<span style="color: #646464ff;">+1 to Light Radius</span><br>`;

  currentSteelDisplay = { base: base, html: steelHTML };

  const weaponInfo = document.getElementById('weapon-info');
  if (weaponInfo) weaponInfo.innerHTML = steelHTML;

  modal.remove();
  alert(`Steel runeword updated to ${base}!`);
}

function showNadirBaseSelector() {
  const existingModal = document.querySelector('.nadir-base-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.className = 'nadir-base-modal';
  modal.style.cssText = `
    position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; color: white; width: 300px; border: 2px solid #b8b8b8;">
      <h3 style="color: #646464ff;; text-shadow: 0 0 3px #b8b8b8;">Nadir Runeword Base</h3>
      <select id="nadirBase" style="width: 100%; padding: 5px; margin: 10px 0; background: #444; color: white; border: 1px solid #b8b8b8;">
        <option value="Cap">Cap (5 def, 0 str)</option>
        <option value="Skull Cap">Skull Cap (11 def, 15 str)</option>
        <option value="Helm">Helm (18 def, 26 str)</option>
        <option value="Full Helm">Full Helm (26 def, 41 str)</option>
        <option value="Great Helm">Great Helm (35 def, 63 str)</option>
        <option value="Crown">Crown (45 def, 55 str)</option>
        <option value="Mask">Mask (27 def, 23 str)</option>
      </select>
      <div style="margin: 10px 0;">
        <label style="color: #646464ff;"><input type="checkbox" id="nadirSup"> Superior (0-15% ED)</label>
        <input type="range" id="nadirED" min="0" max="15" value="0" style="width: 100%; margin-top: 5px;" disabled>
        <span id="nadirEDValue" style="color: #646464ff;">0%</span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="applyNadirBtn" style="flex: 1; padding: 10px; background: #b8b8b8; color: #2a2a2a; border: none; border-radius: 4px; cursor: pointer;">Apply</button>
        <button id="cancelNadirBtn" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;

  const supCheckbox = modal.querySelector('#nadirSup');
  const edSlider = modal.querySelector('#nadirED');
  const edValue = modal.querySelector('#nadirEDValue');

  supCheckbox.onchange = function() {
    edSlider.disabled = !this.checked;
    if (!this.checked) {
      edSlider.value = 0;
      edValue.textContent = '0%';
    }
  };

  edSlider.oninput = function() {
    edValue.textContent = this.value + '%';
  };

  modal.querySelector('#applyNadirBtn').onclick = () => applyNadirBase();
  modal.querySelector('#cancelNadirBtn').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  document.body.appendChild(modal);
}

function applyNadirBase() {
  const modal = document.querySelector('.nadir-base-modal');
  if (!modal) return;

  const base = modal.querySelector('#nadirBase').value;
  const isSup = modal.querySelector('#nadirSup').checked;
  const ed = parseInt(modal.querySelector('#nadirED').value);

  const stats = {
    'Cap': {def: 5, str: 0},
    'Skull Cap': {def: 11, str: 15},
    'Helm': {def: 18, str: 26},
    'Full Helm': {def: 26, str: 41},
    'Great Helm': {def: 35, str: 63},
    'Crown': {def: 45, str: 55},
    'Mask': {def: 27, str: 23}
  }[base];

  const baseDefWithSup = isSup ? Math.floor(stats.def * (1 + ed/100)) : stats.def;
  const finalDef = Math.floor(baseDefWithSup * 1.5) + 10;

  const nadirHTML = `<span style="color: #646464ff; font-weight: bold; text-shadow: 0 0 3px #646464ff;">Nadir</span><br>${base}${isSup ? ' (Superior)' : ''}<br>` +
    `Defense: ${finalDef}<br>` +
    `Required Strength: ${stats.str}<br>` +
    `Required Level: 13<br>` +
    `+50% Enhanced Defense<br>` +
    `+10 Defense<br>` +
    `-33% Extra Gold from Monsters<br>` +
    `+5 to Strength<br>` +
    `-3 to Light Radius<br>` +
    `Level 13 Cloak of Shadows (9 charges)<br>` +
    `<span style="color: #646464ff;">+30 Defense vs Missile</span><br>` +
    `<span style="color: #646464ff;">+6 to Mana after each Kill<br></span><br>`;

  currentNadirDisplay = { base: base, html: nadirHTML };

  const helmInfo = document.getElementById('helm-info');
  if (helmInfo) helmInfo.innerHTML = nadirHTML;

  modal.remove();
  alert(`Nadir runeword updated to ${base}!`);
}
