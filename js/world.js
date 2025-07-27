const { Engine, Render, Runner, Composite, Events, Bodies, Body } = Matter

const engine = Engine.create();
const world = engine.world;

let fillerNozzle;
let bottleSensor;

function initWorld() {
  const render = Render.create({
    canvas: document.getElementById('world'),
    engine,
    options: {
      width: 800,
      height: 400,
      wireframes: false,
      background: "#222",
    }
  });

  Render.run(render);
  Runner.run(Runner.create(), engine);

  // Add static elements
  const ground = createGround();
  fillerNozzle = createFiller();
  bottleSensor = createBottleSensor();

  Composite.add(world, [ground, fillerNozzle, bottleSensor]);
}