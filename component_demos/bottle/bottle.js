const { Engine, Render, Runner, Composite, Events, Bodies, Body } = Matter

const engine = Engine.create();
const world = engine.world;

// Add a ground component
function createGround() {
  return Bodies.rectangle(400, 390, 810, 20, {
    isStatic: true,
    friction: 0.001,
    render: { fillStyle: 'rgb(64,64,64)' },
    label: 'ground'
  });
}

/**
 * Create a bottle component, default to 30 pixel left 345 pixels from top.
 * Default bottle is 50 pixels tall, world is 400 pixels tall.
 * Dropping bottle from 345 leaves 5 pixels of freefall
 * @param x
 * @param y
 * @return {body}
 */
function createBottle(x = 30, y = 345) {
  const thickness = 4;
  const width = 30;
  const height = 50;

  const left = Bodies.rectangle(x - width/2, y, thickness, height);
  const right = Bodies.rectangle(x + width/2, y, thickness, height);
  const bottom = Bodies.rectangle(x, y + height/2, width, 6); // 4 is too thin and can cause clipping

  const bottle = Body.create({
    parts: [left, right, bottom],
    friction: 0.01,
    restitution: 0.2,
    label: 'bottle',
    id: 'bottle_' + Math.random().toString(36).slice(2, 6),
    waterInside: 0
  });
  Composite.add(world, [bottle]);
}

function spawnWater(x, y) {
  const drop = Bodies.circle(x, y, 2, {
    restitution: 0.5,
    frictionAir: 0.02,
    friction: 0.01,
    label: 'water',
    render: { fillStyle: "#00aaff" },
    collisionFilter: {
      group: 1
    }
  })
  Composite.add(world, drop)
}

// Create the world
// [0, 0] is top left
function initWorld() {
  const render = Render.create({
    canvas: document.getElementById('world'),
    engine,
    options: {
      width: 800,
      height: 400,
      wireframes: false,
      background: "#c8c8c8",
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // Add basic elements
  const ground = createGround();
  Composite.add(world, [ground]);

  createBottle(400, 349);

  document.querySelector('#world').addEventListener('click', (event) => {
    event.preventDefault();
    let x = event.clientX;
    let y = event.clientY;
    spawnWater(x, y);
  })
}

initWorld()
