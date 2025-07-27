// Initialize Matter.js world
initWorld();

// Start WebSocket connection
setupWebSocket(handleBackendUpdate);
