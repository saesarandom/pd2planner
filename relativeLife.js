function updatePolyLife() {
  const totalLifeSpan = document.getElementById("totalLifeValue");
  if (!totalLifeSpan) return;
  const totalLife =
    parseInt(totalLifeSpan.textContent.replace("Total Life: ", "")) || 0;

  const blockContainer = document.getElementById("realblockcontainer");
  const blockChance = parseInt(blockContainer?.textContent || 0);
  const blockMultiplier = 1 / (1 - blockChance / 100);

  const plrContainer = document.getElementById("plrcontainer");
  const plrChance = parseInt(plrContainer?.textContent || 0);
  const plrMultiplier = 1 / (1 - plrChance / 100);

  const drContainer = document.getElementById("drcontainer");
  const drChance = parseInt(drContainer?.textContent || 0);
  const drMultiplier = 1 / (1 - drChance / 100);

  const getResistValue = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return 0;

    const spans = container.getElementsByTagName("span");
    if (spans.length < 2) return 0;

    const current = parseInt(spans[0].textContent) || 0;
    const max = parseInt(spans[1].textContent) || 0;

    return current > 75 ? max : current;
  };

  const fireRes = getResistValue("fireresistcontainer");
  const coldRes = getResistValue("coldresistcontainer");
  const lightRes = getResistValue("lightresistcontainer");
  const poisonRes = getResistValue("poisonresistcontainer");
  const curseRes = parseInt(
    document.getElementById("curseresistcontainer")?.textContent || 0
  );
  const drRes = parseInt(
    document.getElementById("drcontainer")?.textContent || 0
  );
  const plrRes = parseInt(
    document.getElementById("plrcontainer")?.textContent || 0
  );

  const avgResistance =
    (fireRes + coldRes + lightRes + poisonRes + curseRes + plrRes) / 6;
  const resistMultiplier = 1 / (1 - avgResistance / 100);

  const polyLife =
    totalLife * resistMultiplier * blockMultiplier * drMultiplier;

  document.getElementById("polyrellife").textContent =
    Math.round(polyLife) || 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const config = { childList: true, subtree: true, characterData: true };
  const observer = new MutationObserver(updatePolyLife);

  [
    "fireresistcontainer",
    "coldresistcontainer",
    "lightresistcontainer",
    "poisonresistcontainer",
    "curseresistcontainer",
    "realblockcontainer",
    "plrcontainer",
    "drcontainer",
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (element) observer.observe(element, config);
  });

  const totalLife = document.getElementById("totalLifeValue");
  if (totalLife) observer.observe(totalLife, config);

  updatePolyLife();
});
