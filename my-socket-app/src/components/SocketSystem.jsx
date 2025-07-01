import React, { useState } from "react";

// Socket Section Component
const SocketSection = ({ title, socketCount, contents, onSocketClick }) => (
  <div className="relative mb-8">
    <div className="text-blue-400 mb-2">{title}</div>
    <div className="flex gap-4">
      {[...Array(socketCount)].map((_, index) => (
        <div
          key={index}
          onClick={() => onSocketClick(index)}
          className="w-12 h-12 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer bg-gray-800 text-white hover:bg-gray-700"
        >
          {contents[index] ? "💎" : ""}
        </div>
      ))}
    </div>
    <div className="mt-2 text-gray-300">
      {contents.some((c) => c) ? (
        contents.map(
          (content, idx) =>
            content &&
            content.stats.split(",").map((stat, statIdx) => (
              <div key={`${idx}-${statIdx}`} className="text-sm">
                {stat.trim()}
              </div>
            ))
        )
      ) : (
        <div className="text-red-500">No sockets</div>
      )}
    </div>
  </div>
);

// Main Socket System Component
const SocketSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [showJewelModal, setShowJewelModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSocketIndex, setSelectedSocketIndex] = useState(null);
  const [jewelStats, setJewelStats] = useState({ type: "Life", value: 1 });

  // States for each section
  const [helmSockets, setHelmSockets] = useState(Array(3).fill(null));
  const [armorSockets, setArmorSockets] = useState(Array(2).fill(null));
  const [weaponSockets, setWeaponSockets] = useState(Array(2).fill(null));
  const [shieldSockets, setShieldSockets] = useState(Array(2).fill(null));

  // Items with different effects per slot
  const items = {
    "El Rune": {
      helm: "+15 Defense, +1 Light Radius",
      armor: "+15 Defense, +1 Light Radius",
      weapon: "+50 Attack Rating, +1 Light Radius",
      shield: "+15 Defense, +1 Light Radius",
    },
    "Eld Rune": {
      helm: "15% Slower Stamina Drain",
      armor: "15% Slower Stamina Drain",
      weapon: "+75% Damage vs Undead, +50 Attack Rating vs Undead",
      shield: "7% Increased Chance of Blocking",
    },
    "Chipped Diamond": {
      helm: "+20 Attack Rating",
      armor: "+20 Attack Rating",
      weapon: "+28% Damage to Undead",
      shield: "All Resistances +6",
    },
  };

  const handleSocketClick = (section, index) => {
    setSelectedSection(section);
    setSelectedSocketIndex(index);
    setShowModal(true);
  };

  const getSetterForSection = (section) => {
    switch (section) {
      case "helm":
        return setHelmSockets;
      case "armor":
        return setArmorSockets;
      case "weapon":
        return setWeaponSockets;
      case "shield":
        return setShieldSockets;
      default:
        return null;
    }
  };

  const getContentsForSection = (section) => {
    switch (section) {
      case "helm":
        return helmSockets;
      case "armor":
        return armorSockets;
      case "weapon":
        return weaponSockets;
      case "shield":
        return shieldSockets;
      default:
        return [];
    }
  };

  const handleItemSelect = (itemName) => {
    const setter = getSetterForSection(selectedSection);
    if (!setter) return;

    if (itemName === "Jewel") {
      setShowJewelModal(true);
    } else {
      setter((prev) => {
        const newContents = [...prev];
        const itemStats = items[itemName][selectedSection];
        newContents[selectedSocketIndex] = { stats: itemStats };
        return newContents;
      });
      setShowModal(false);
    }
  };

  const handleJewelConfirm = () => {
    const setter = getSetterForSection(selectedSection);
    if (!setter) return;

    setter((prev) => {
      const newContents = [...prev];
      newContents[selectedSocketIndex] = {
        stats: `+${jewelStats.value} to ${jewelStats.type}`,
      };
      return newContents;
    });
    setShowJewelModal(false);
    setShowModal(false);
  };

  return (
    <div className="absolute p-4">
      <div className="flex flex-col gap-8">
        <SocketSection
          title="Helm"
          socketCount={3}
          contents={helmSockets}
          onSocketClick={(index) => handleSocketClick("helm", index)}
        />
        <SocketSection
          title="Armor"
          socketCount={2}
          contents={armorSockets}
          onSocketClick={(index) => handleSocketClick("armor", index)}
        />
        <SocketSection
          title="Weapon"
          socketCount={2}
          contents={weaponSockets}
          onSocketClick={(index) => handleSocketClick("weapon", index)}
        />
        <SocketSection
          title="Shield"
          socketCount={2}
          contents={shieldSockets}
          onSocketClick={(index) => handleSocketClick("shield", index)}
        />
      </div>

      {/* Item selection modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-white">Select Item</h2>
            {Object.keys(items).map((item) => (
              <button
                key={item}
                onClick={() => handleItemSelect(item)}
                className="block w-full p-2 text-left text-white hover:bg-gray-700 rounded mb-1"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => handleItemSelect("Jewel")}
              className="block w-full p-2 text-left text-white hover:bg-gray-700 rounded mb-4"
            >
              Jewel
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Jewel customization modal */}
      {showJewelModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-white">
              Customize Jewel
            </h2>
            <select
              value={jewelStats.type}
              onChange={(e) =>
                setJewelStats((prev) => ({ ...prev, type: e.target.value }))
              }
              className="block w-full p-2 mb-4 border rounded bg-gray-700 text-white"
            >
              <option>Life</option>
              <option>Mana</option>
            </select>
            <input
              type="range"
              min="1"
              max="10"
              value={jewelStats.value}
              onChange={(e) =>
                setJewelStats((prev) => ({
                  ...prev,
                  value: parseInt(e.target.value),
                }))
              }
              className="w-full mb-2"
            />
            <div className="mb-4 text-white">Value: {jewelStats.value}</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowJewelModal(false);
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleJewelConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketSystem;
