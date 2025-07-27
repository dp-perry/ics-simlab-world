_This project is inspired by VirtuaPlant, which is no longer maintained._

Find the original VirtuaPlant here [https://github.com/jseidl/virtuaplant](https://github.com/jseidl/virtuaplant)


**-- This is currently a work in progress --** 

# ICS Simlab Worldview
Find the pymodbus server and ICS simulator here: [https://github.com/dp-perry/ics-simlab-core](https://github.com/dp-perry/ics-simlab-core)

This repository contains the *Worldview* component for the ICS Simlab environment. It connects to the core simulation server via WebSocket, visualizing the state of various industrial processes. It also allows for bidirectional communication: sensors can send information back to the server based on visual context (e.g., whether a bottle is present).

The simulation is designed to mimic real ICS behavior: components operate independently and are unaware of each other. For example, the filler doesn’t know whether a bottle is present, it simply turns on based on PLC logic.

## Tech stack
Currently, this project is a simple vanilla.js project and uses [Matter.js](https://brm.io/matter-js/) for physics but 
other alternatives may be tested at a later stage. Feel free to use this project as a guide to create your own worldview.
This is the entire reason that the core and worldview are split into two separate repositories.

## Features
- Visually simulates parts of the facility
- Sensor can send information back to the facility server
- Visually show any effects an attack has

## Current facilities
### Bottling plant
- Spawns and moves bottles
- WIP: Sensor detects when a bottle is underneath the filler
- WIP: Filler activates when a bottle is present
- WIP: Sensor detects water level in the bottle

## Future

### Future facilities
- Oil Refinery Boiler
- Nuclear Power Plant Reactor
- Steel Plant Furnace

### Future features
- HMI to control plant devices
- See sensor states