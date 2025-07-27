function createBottle(x = 30, y = 340) {
  const thickness = 4;
  const width = 30;
  const height = 50;

  const left = Bodies.rectangle(x - width/2, y, thickness, height);
  const right = Bodies.rectangle(x + width/2, y, thickness, height);
  const bottom = Bodies.rectangle(x, y + height/2, width, thickness);

  const bottle = Body.create({
    parts: [left, right, bottom],
    friction: 0.01,
    restitution: 0.2,
    label: 'bottle',
    id: 'bottle_' + Math.random().toString(36).slice(2, 6),
    waterInside: 0
  });

  return bottle;
}

function createFiller() {
  return Bodies.rectangle(100, 300, 30, 10, {
    isStatic: true,
    render: { fillStyle: "#ccc" },
    label: 'filler'
  });
}

function createBottleSensor() {
  return Bodies.rectangle(100, 340, 30, 60, {
    isStatic: true,
    isSensor: true,
    render: { fillStyle: 'rgba(255,255,0,0.2)' },
    label: 'bottle_sensor'
  });
}

function createGround() {
  return Bodies.rectangle(400, 390, 810, 20, {
    isStatic: true,
    friction: 0.001,
    label: 'ground'
  });
}