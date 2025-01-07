class SkillUpdates {
  constructor() {
    this.skillHandler = new SkillHandler();
    this.init();
  }

  init() {
    this.setupJavelinMastery();
    this.setupLevelHandling();
    this.setupStatListeners();
    this.convertStatsToNumbers();
  }

  convertStatsToNumbers() {
    const statContainers = [
      "criticalhitcontainer",
      "deadlystrikecontainer",
      "weaponmasterycontainer",
      "onehandmindmgcontainer",
      "onehandmaxdmgcontainer",
      "twohandmindmgcontainer",
      "twohandmaxdmgcontainer",
      "flatfirecontainer",
      "flatcoldcontainer",
      "flatlightcontainer",
      "flatmagiccontainer",
      "flatpoisoncontainer",
    ];

    const stats = {};
    statContainers.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        stats[id] = parseFloat(el.textContent) || 0;
      }
    });

    return stats;
  }

  setupStatListeners() {
    const statContainers = document.querySelectorAll('[id$="container"]');
    statContainers.forEach((container) => {
      container.addEventListener("DOMSubtreeModified", () => {
        this.updateCritMultiplier();
      });
    });
  }

  setupJavelinMastery() {
    const javelinMasteryInput = document.getElementById(
      "javelinandspearmasterycontainer"
    );
    if (javelinMasteryInput) {
      javelinMasteryInput.addEventListener(
        "input",
        this.handleJavelinMasteryChange.bind(this)
      );
    }
  }

  setupLevelHandling() {
    const levelInput = document.getElementById("lvlValue");
    if (levelInput) {
      levelInput.addEventListener("input", this.handleLevelChange.bind(this));
    }
  }

  updateCritMultiplier() {
    const stats = this.convertStatsToNumbers();

    stats.criticalhitcontainer = Math.min(stats.criticalhitcontainer, 75);
    stats.deadlystrikecontainer = Math.min(stats.deadlystrikecontainer, 0.75);

    const critMultiplier =
      0.5 *
        (1 -
          (1 - stats.deadlystrikecontainer) *
            (1 - stats.criticalhitcontainer / 100) *
            (1 - stats.weaponmasterycontainer / 100)) +
      1;

    const multiplierContainer = document.getElementById(
      "crithitmultipliercontainer"
    );
    if (multiplierContainer) {
      multiplierContainer.textContent = critMultiplier.toFixed(3);
    }
  }

  handleJavelinMasteryChange(event) {
    const newValue = parseInt(event.target.value) || 0;
    event.target.value = newValue;

    const masteryInfo = this.skillHandler.getSkillInfo(
      "javelinAndSpearMastery",
      newValue
    );
    if (masteryInfo) {
      const criticalStrikeLevel = parseInt(
        document.getElementById("criticalstrikecontainer")?.value || 0
      );
      const criticalStrikeInfo = this.skillHandler.getSkillInfo(
        "criticalStrike",
        criticalStrikeLevel
      );

      const totalCritical =
        ((masteryInfo.criticalChance || 0) +
          (criticalStrikeInfo?.criticalChance || 0)) /
        100;
      document.getElementById("criticalhitcontainer").textContent = Math.min(
        totalCritical,
        0.75
      ).toFixed(2);

      this.updateCritMultiplier();
    }
  }

  handleLevelChange(event) {
    const currentLevel = parseInt(event.target.value) || 1;
    const javelinMasteryInput = document.getElementById(
      "javelinandspearmasterycontainer"
    );
    const criticalHitInput = document.getElementById("criticalhitcontainer");
    const currentCritValue = criticalHitInput?.value || 0;

    if (javelinMasteryInput) {
      const maxPoints = getMaxAllowedPoints(currentLevel, 6);
      const currentValue = parseInt(javelinMasteryInput.value) || 0;

      if (currentValue > maxPoints) {
        javelinMasteryInput.value = maxPoints;
        // Don't trigger input event that would reset critical hit
        this.updateCritMultiplier();
      }
    }

    // Preserve critical hit value
    if (criticalHitInput) {
      criticalHitInput.value = currentCritValue;
    }

    updateVisibility();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.skillUpdates = new SkillUpdates();
});
