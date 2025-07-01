// socket-system.js
const SocketSystem = () => {
  const [sockets, setSockets] = React.useState([null, null, null]);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedSocket, setSelectedSocket] = React.useState(null);
  const [customJewels, setCustomJewels] = React.useState([]);
  const [selectedAffixes, setSelectedAffixes] = React.useState([]);

  // Basic prefix data
  const prefixes = [
    { id: 1, name: "Enhanced Damage", min: 20, max: 40 },
    { id: 2, name: "Life", min: 10, max: 20 },
  ];

  const handleSocketClick = (index) => {
    setSelectedSocket(index);
    setShowModal(true);
  };

  const createCustomJewel = () => {
    if (selectedAffixes.length === 0) return;

    const newJewel = {
      id: Date.now(),
      type: "custom-jewel",
      affixes: selectedAffixes,
      img: "placeholder.png", // Replace with your jewel image
    };

    setCustomJewels([...customJewels, newJewel]);
    setSelectedAffixes([]);
  };

  const addJewelToSocket = (jewel) => {
    if (selectedSocket === null) return;

    const newSockets = [...sockets];
    newSockets[selectedSocket] = jewel;
    setSockets(newSockets);
    setShowModal(false);
    setSelectedSocket(null);
  };

  return React.createElement(
    "div",
    { className: "p-4" },
    // Sockets display
    React.createElement(
      "div",
      { className: "flex gap-4 mb-4" },
      sockets.map((socket, index) =>
        React.createElement(
          "div",
          {
            key: index,
            onClick: () => handleSocketClick(index),
            className: `w-16 h-16 border-2 rounded-full flex items-center justify-center cursor-pointer 
                      ${socket ? "border-blue-500" : "border-gray-300"}`,
          },
          socket &&
            React.createElement("img", {
              src: socket.img,
              className: "w-12 h-12",
            })
        )
      )
    ),

    // Modal
    showModal &&
      React.createElement(
        "div",
        {
          className:
            "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",
        },
        React.createElement(
          "div",
          { className: "bg-white p-4 rounded-lg" },
          React.createElement(
            "h2",
            { className: "text-xl mb-4" },
            "Create Custom Jewel"
          ),
          React.createElement(
            "div",
            { className: "space-y-2" },
            prefixes.map((prefix) =>
              React.createElement(
                "button",
                {
                  key: prefix.id,
                  onClick: () =>
                    setSelectedAffixes([...selectedAffixes, prefix]),
                  className:
                    "block w-full text-left p-2 hover:bg-gray-100 rounded",
                },
                `${prefix.name} (${prefix.min}-${prefix.max})`
              )
            )
          ),
          React.createElement(
            "div",
            { className: "mt-4 flex justify-end gap-2" },
            React.createElement(
              "button",
              {
                onClick: createCustomJewel,
                className: "px-4 py-2 bg-blue-500 text-white rounded",
              },
              "Create Jewel"
            ),
            React.createElement(
              "button",
              {
                onClick: () => setShowModal(false),
                className: "px-4 py-2 bg-gray-500 text-white rounded",
              },
              "Close"
            )
          )
        )
      )
  );
};

// Render the component
ReactDOM.render(
  React.createElement(SocketSystem),
  document.getElementById("root")
);
