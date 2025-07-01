import React, { useState } from "react";

const SocketSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [showJewelModal, setShowJewelModal] = useState(false);
  const [selectedSocket, setSelectedSocket] = useState(null);
  const [socketContents, setSocketContents] = useState(Array(3).fill(null));

  // Define fixed items
  const fixedItems = {
    "El Rune": {
      name: "El Rune",
      stats: "+50 Attack Rating, +1 Light Radius",
    },
    "Eld Rune": {
      name: "Eld Rune",
      stats: "+75% Damage vs Undead, +50 Attack Rating vs Undead",
    },
    "Chipped Diamond": {
      name: "Chipped Diamond",
      stats: "+28% Damage vs Undead",
    },
  };

  // State for jewel customization
  const [jewelStats, setJewelStats] = useState({
    type: "Life",
    value: 1,
  });

  const handleSocketClick = (index) => {
    setSelectedSocket(index);
    setShowModal(true);
  };

  const handleItemSelect = (item) => {
    if (item === "Jewel") {
      setShowJewelModal(true);
    } else {
      const newContents = [...socketContents];
      newContents[selectedSocket] = fixedItems[item];
      setSocketContents(newContents);
      setShowModal(false);
    }
  };

  const handleJewelConfirm = () => {
    const newContents = [...socketContents];
    newContents[selectedSocket] = {
      name: "Magic Jewel",
      stats: `+${jewelStats.value} to ${jewelStats.type}`,
    };
    setSocketContents(newContents);
    setShowJewelModal(false);
    setShowModal(false);
  };

  const handleClearSocket = (index, e) => {
    e.preventDefault(); // Prevent default right-click menu
    const newContents = [...socketContents];
    newContents[index] = null;
    setSocketContents(newContents);
  };

  return (
    <div className="p-4">
      {/* Socket containers */}
      <div className="flex gap-4 mb-4">
        {socketContents.map((content, index) => (
          <div key={index} className="relative">
            <div
              onClick={() => handleSocketClick(index)}
              onContextMenu={(e) => handleClearSocket(index, e)}
              className={`w-16 h-16 border-2 border-gray-400 rounded-full cursor-pointer flex items-center justify-center
                ${content ? "bg-blue-100" : "bg-gray-100"}`}
            >
              {content ? "💎" : "Empty"}
            </div>
            {content && (
              <div className="mt-2 w-48 text-sm bg-gray-50 p-2 rounded">
                <div className="font-bold">{content.name}</div>
                <div>{content.stats}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Item Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select Item</h2>
            <div className="flex flex-col gap-2">
              {Object.keys(fixedItems).map((item) => (
                <button
                  key={item}
                  onClick={() => handleItemSelect(item)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 rounded"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => handleItemSelect("Jewel")}
                className="p-2 bg-purple-50 hover:bg-purple-100 rounded"
              >
                Jewel
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Jewel Customization Modal */}
      {showJewelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Customize Jewel</h2>
            <div className="flex flex-col gap-4">
              <select
                value={jewelStats.type}
                onChange={(e) =>
                  setJewelStats({ ...jewelStats, type: e.target.value })
                }
                className="p-2 border rounded"
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
                  setJewelStats({
                    ...jewelStats,
                    value: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div>Value: {jewelStats.value}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowJewelModal(false);
                    setShowModal(false);
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJewelConfirm}
                  className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocketSystem;
