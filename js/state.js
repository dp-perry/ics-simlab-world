let socket;

function setupWebSocket(onUpdate) {
  socket = new WebSocket("ws://localhost:8765");

  socket.onmessage = (event) => {
    const state = JSON.parse(event.data);
    onUpdate(state);
  };

  socket.onopen = () => console.log("🔌 Connected to Modbus bridge");
  socket.onerror = err => console.error("WebSocket error:", err);
}

function sendSensorUpdate(register, value) {
  const update = JSON.stringify({
    type: 'write',
    register: register,
    value: value
  });
  socket.send(update);
}