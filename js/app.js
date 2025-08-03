// Initialize Matter.js world
initWorld();

// Start WebSocket connection
setupWebSocket(handleBackendUpdate);

document.getElementById('toggle-power').addEventListener('click', () => {
  // Flip current power value
  const newPowerState = document.getElementById('power-status').textContent === 'OFF' ? 1 : 0;

  // Send to backend
  socket.send(JSON.stringify({
    type: 'write',
    register: 0,
    value: newPowerState
  }));
});