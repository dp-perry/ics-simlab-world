const { Engine, Render, Runner, Composite, Events, Bodies, Body } = Matter

const engine = Engine.create();
const world = engine.world;

// World settings
const worldWidth = 800;
const worldHeight = 400;
const useConveyor = false;
let spawningWater = false;
let mouseX = 0;
let mouseY = 0;

// Ground settings
const groundHeight = 20;
const groundLevel = worldHeight - groundHeight / 2;

// Bottle settings
let bottles = []
let totalBottlesCreated = 0;
const spacing = 110; // Would not recommend going below 110

// Conveyor belt settings
let isConveyorOn = false;
const beltSpeed = 2; // How fast the belt moves in pixels per frame
const segmentWidth = 50; // Width of each individual segment
const beltThickness = 10;
const beltY = groundLevel - beltThickness;

// Add a ground component
function createGround() {
  return Bodies.rectangle(worldWidth / 2, groundLevel, worldWidth + (segmentWidth * 4), groundHeight, {
    isStatic: true,
    friction: 0, // Low friction to make sure belt parts can slide
    render: { fillStyle: 'rgb(64,64,64)' },
    label: 'ground'
  });
}

/**
 * Creates a series of bodies to act as a conveyor belt.
 * Using multiple segments allows us to create an infinite "wrapping" effect.
 * @returns {Body[]} An array of bodies representing the belt segments.
 */
function createConveyorBelt() {
  const segments = [];
  const numSegments = Math.ceil(worldWidth / segmentWidth) + 1; // Add a couple extra to hide the wrapping
  for (let i = 0; i < numSegments; i++) {
    const color = i % 2 === 0 ? 'rgb(64,64,64)' : 'rgb(50,50,50)';
    const segment = Bodies.rectangle(i * segmentWidth + 5, beltY, segmentWidth, beltThickness, {
      friction: 1.0,  // High friction to "grab" the bottle
      render: { fillStyle: color },
      label: 'conveyor-segment'
    });
    segments.push(segment);
  }
  return segments;
}

/**
 * Create a bottle component, default to 30 pixel left 345 pixels from top.
 * Default bottle is 50 pixels tall, world is 400 pixels tall.
 * Dropping bottle from 345 leaves 5 pixels of freefall
 * @param x
 * @param y
 * @return {body}
 */
function createBottle(x = 30, y = 390) {
  const thickness = 6;
  const width = 30;
  const height = 50;

  const left = Bodies.rectangle(x - width/2, y, thickness, height);
  const right = Bodies.rectangle(x + width/2, y, thickness, height);
  const bottom = Bodies.rectangle(x, y + height/2, width, 6); // 4 is too thin and can cause clipping

  return Body.create({
    parts: [left, right, bottom],
    friction: useConveyor ? 1 : 0.000468,
    restitution: 0.2,
    label: 'bottle',
    id: 'bottle_' + Math.random().toString(36).slice(2, 6),
    waterInside: 0
  });
}

function spawnBottle() {
  const bottle = createBottle(60, 350);
  Composite.add(world, bottle);
  bottles.push(bottle);
  totalBottlesCreated++;
  document.querySelector('#bottles').innerHTML = bottles.length + ' bottles on belt<br />' + totalBottlesCreated + ' bottles created';
}

function spawnWater(x, y) {
  const drop = Bodies.circle(x, y, 2, {
    frictionAir: 0.02,
    friction: 0.0001,
    restitution: 0.1,
    mass: 0,
    label: 'water',
    render: { fillStyle: "#00aaff" },
    collisionFilter: {
      group: 1
    }
  })
  Composite.add(world, drop)
  // Make water evaporate to prevent it from sticking around too long
  setTimeout(() => Composite.remove(world, drop), 25000);
}

// Create the world
// [0, 0] is top left
function initWorld() {
  engine.enableSleeping = false;
  world.gravity.y = 1;

  const render = Render.create({
    canvas: document.getElementById('world'),
    engine,
    options: {
      width: worldWidth,
      height: worldHeight,
      wireframes: false,
      background: "#c8c8c8",
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // Add basic elements
  const ground = createGround();
  Composite.add(world, [ground]);

  spawnBottle();

  // Optionally add conveyor segments
  // Note: Does not apply a force to the bottle
  let conveyorSegments;
  if (useConveyor) {
    conveyorSegments = createConveyorBelt();
    Composite.add(world, conveyorSegments);
  }

  document.querySelector('#toggleConveyor').addEventListener('click', () => {
    isConveyorOn = !isConveyorOn;
  });

  document.querySelector('#world').addEventListener('mousedown', (event) => {
    spawningWater = true;
  })
  document.querySelector('#world').addEventListener('mouseup', (event) => {
    spawningWater = false;
  })
  document.querySelector('#world').addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  })

  // This event listener runs every frame, before the physics updates
  Events.on(engine, 'beforeUpdate', (event) => {
    // Handle water spawning
    if (spawningWater) {
      let x = mouseX;
      let y = mouseY;
      spawnWater(x, y);
    }

    // Despawn bottles
    bottles = bottles.filter(b => {
      if (b.position.x > 850) {
        Composite.remove(world, b);
        return false;
      }
      return true;
    });

    // No need to do any other calculations if the conveyor belt is off
    if (!isConveyorOn) {
      return; // Do nothing if the belt is off
    }

    // Add a new bottle if there is space
    // Spawn a new bottle if there is enough space
    if (bottles.length === 0 || bottles[bottles.length - 1].position.x > spacing) {
      spawnBottle();
    }

    // Move conveyor belt
    if (useConveyor) {
      // Move each segment and wrap it around if it goes off-screen
      conveyorSegments.forEach(segment => {
        // Set the velocity to move the belt
        Body.setVelocity(segment, {x: beltSpeed, y: 0});

        // Check if the segment has moved off the right edge
        if (segment.position.x > worldWidth + segmentWidth / 2) {
          // Teleport it back to the left side of the belt
          Body.setPosition(segment, {
            x: segment.position.x - (worldWidth + segmentWidth),
            y: segment.position.y
          });
        }
      })
    } else {
      bottles.forEach(b => {
        // applyForce requires a very careful balance between friction and force
        // 0.00045 and 0.00048 seems to be the sweet spot for 0.0002 force
        // Body.applyForce(b, b.position, {x: 0.0002, y: 0});

        // Using velocity seems to be the easier solution and mimics a belt better
        // We apply a slight downward velocity to keep the bottles from tipping over
        Body.setVelocity(b, {x: 0.5, y: 0.1})
      })
    }
  });
}

initWorld()
