let bottles = [];

// TODO handle this per bottle
// Events.on(engine, 'collisionStart', function(event) {
//   event.pairs.forEach(pair => {
//     const labels = [pair.bodyA.label, pair.bodyB.label];
//     if (labels.includes('bottle') && labels.includes('water')) {
//       waterInside += 1;
//     }
//   });
// });

function spawnWater(x, y) {
  const drop = Bodies.circle(x, y, 2, {
    restitution: 0,
    frictionAir: 0.01,
    friction: 0.0001,
    label: 'water',
    render: { fillStyle: "#00aaff" }
  });
  Composite.add(world, drop);
  // Evaporation? to prevent too many components on screen
  setTimeout(() => Composite.remove(world, drop), 25000);
}

function spawnBottle() {
  const bottle = createBottle();
  Composite.add(world, bottle);
  bottles.push(bottle);
}

function updateOverview(data) {
  document.getElementById('power-status').textContent = data.power ? 'ON' : 'OFF';
  document.getElementById('conveyor-status').textContent = data.conveyor_on ? 'Moving' : 'Stopped';
  document.getElementById('bottle-present-status').textContent = data.bottle_present ? 'Yes' : 'No';
  document.getElementById('filler-status').textContent = data.filler_on ? 'Filling' : 'Idle';
  document.getElementById('water-level-status').textContent = data.water_level ? 'Full' : 'Empty';
  document.getElementById('bottle-count-status').textContent = data.bottle_count;

  const btn = document.getElementById('toggle-power');
  btn.textContent = data.power ? 'Turn Facility Off' : 'Turn Facility On';
}

// Run every time the application receives and update through the websocket
function handleBackendUpdate(state) {
  const spacing = 180;
  const bottleInZone = 0;
  const sensor_border_left = 100 - 30;
  const sensor_border_right = 130;

  updateOverview(state)

  // Conveyor motion
  if (state.conveyor_on) {
    bottles.forEach(b => {
      Body.applyForce(b, b.position, { x: 0.002, y: 0 });
      if (b.position.x > sensor_border_left && b.position.x < sensor_border_right) {
        console.log('Sensor detects a bottle')
      }
    });
  }

  if (state.bottle_present !== bottleInZone) {
    // Example: when a bottle enters the sensor zone
      sendSensorUpdate(1, bottleInZone);  // register 1 = bottle present
  }

  // TODO: Water sensor
  // Do something similar with water detection

  // Spawn a new bottle if there is enough space
  if (bottles.length === 0 || bottles[bottles.length - 1].position.x > spacing) {
    spawnBottle();
  }

  // Despawn bottles that leave screen
  bottles = bottles.filter(b => {
    if (b.position.x > 850) {
      Composite.remove(world, b);
      return false;
    }
    return true;
  });

  // Emit water
  if (state.filler_on) {
    spawnWater(fillerNozzle.position.x, fillerNozzle.position.y + 10);
  }

  // TODO: Handle this per bottle
  // Optionally, detect fill level
  // if (waterInside > 20) {
  //   state.bottle_full = true;
  // }
}