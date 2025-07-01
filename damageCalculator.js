class DamageCalculator {
  constructor() {
    this.init();
  }

  init() {
    // Watch inventory changes
    const inventoryObserver = new MutationObserver(() => this.updateDamage());
    const inventory = document.querySelector(".inventorycontainer");
    if (inventory) {
      inventoryObserver.observe(inventory, { childList: true, subtree: true });
    }

    // Watch damage containers
    const damageContainers = [
      "onehandmindmgcontainer",
      "onehandmaxdmgcontainer",
      "flatfirecontainer",
      "flatcoldcontainer",
      "flatlightcontainer",
      "flatpoisoncontainer",
      "flatmagiccontainer",
    ];

    damageContainers.forEach((id) => {
      const container = document.getElementById(id);
      if (container) {
        const observer = new MutationObserver(() => this.updateDamage());
        observer.observe(container, { childList: true, characterData: true });
      }
    });
  }

  updateDamage() {
    const damageOutput = document.getElementById("damageOutput");
    if (!damageOutput) return;

    const minDmg =
      parseFloat(
        document.getElementById("onehandmindmgcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatfirecontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatcoldcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatlightcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatpoisoncontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatmagiccontainer")?.textContent || 0
      );

    const maxDmg =
      parseFloat(
        document.getElementById("onehandmaxdmgcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatfirecontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatcoldcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatlightcontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatpoisoncontainer")?.textContent || 0
      ) +
      parseFloat(
        document.getElementById("flatmagiccontainer")?.textContent || 0
      );

    damageOutput.textContent = `${Math.floor(minDmg)}-${Math.floor(maxDmg)}`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.damageCalculator = new DamageCalculator();
});
