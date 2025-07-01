const ACHIEVEMENTS = {
  FLYING_START: {
    id: "flying-start",
    name: "Off to a flying start",
    description: "Set your level to 99",
    check: (value) => value === 99,
  },
  MAX_STATS: {
    id: "max-stats",
    name: "Peak performance",
    description: "Reach 400 in any stat",
    check: (value) => Number(value) >= 400,
  },
  PERFECT_RES: {
    id: "perfect-res",
    name: "Elemental master",
    description: "Achieve 75% or higher in all resistances",
    check: (fireRes, coldRes, lightRes, poisonRes) =>
      fireRes >= 75 && coldRes >= 75 && lightRes >= 75 && poisonRes >= 75,
  },
  CHARM_COLLECTOR: {
    id: "charm-master",
    name: "Charm collector",
    description: "Fill your inventory with charms",
    check: (charmCount) => charmCount >= 20,
  },
};

function setupAchievementListeners() {
  // Level achievement listener
  const lvlSpan = document.getElementById("lvlValue");
  if (lvlSpan) {
    lvlSpan.addEventListener("input", (event) => {
      const value = parseInt(event.target.value, 10);
      checkAchievement("FLYING_START", value);
    });
  }

  // Stats achievements listeners
  ["str", "dex", "vit", "enr"].forEach((stat) => {
    const statInput = document.getElementById(stat);
    if (statInput) {
      statInput.addEventListener("input", (event) => {
        const value = parseInt(event.target.value, 10);
        checkAchievement("MAX_STATS", value);
      });
    }
  });

  // Resistance achievement check
  const resistanceObserver = new MutationObserver(() => {
    const fireRes =
      parseInt(
        document.getElementById("fireresistcontainer").textContent,
        10
      ) || 0;
    const coldRes =
      parseInt(
        document.getElementById("coldresistcontainer").textContent,
        10
      ) || 0;
    const lightRes =
      parseInt(
        document.getElementById("lightresistcontainer").textContent,
        10
      ) || 0;
    const poisonRes =
      parseInt(
        document.getElementById("poisonresistcontainer").textContent,
        10
      ) || 0;

    checkAchievement("PERFECT_RES", fireRes, coldRes, lightRes, poisonRes);
  });

  const resContainers = [
    "fireresistcontainer",
    "coldresistcontainer",
    "lightresistcontainer",
    "poisonresistcontainer",
  ]
    .map((id) => document.getElementById(id))
    .filter((el) => el);

  resContainers.forEach((container) => {
    resistanceObserver.observe(container, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });

  // Charm achievement check
  const inventory = document.querySelector(".inventorycontainer");
  if (inventory) {
    const charmObserver = new MutationObserver(() => {
      const charmCount = Array.from(inventory.children).filter(
        (slot) => slot.textContent && slot.textContent !== "X"
      ).length;
      checkAchievement("CHARM_COLLECTOR", charmCount);
    });

    charmObserver.observe(inventory, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}

async function checkAchievement(achievementId, ...values) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found, skipping achievement check");
    return;
  }

  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) {
    console.log("Achievement not found:", achievementId);
    return;
  }

  if (!achievement.check(...values)) {
    console.log("Achievement condition not met:", achievementId, values);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/achievement/${achievement.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          value: values[0],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.message === "Achievement unlocked!") {
      alert(
        `Achievement Unlocked: ${achievement.name}!\n${achievement.description}`
      );
      if (typeof loadProfileData === "function") {
        loadProfileData();
      }
    }
  } catch (error) {
    console.error("Error checking achievement:", error);
  }
}

// Initialize achievements when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupAchievementListeners();
});
