# Conveyor
A demo to test with a conveyor belt that is multiple segments moving at the same speed with high
friction. This would be the preferred method to moving objects while the conveyor belt remains static.

## Issues
### Problems with friction
Friction seems to have a limited implementation, a conveyor belt will not move a bottle. Alternatives are to
either use a static floor and apply a velocity to the bottles or created an implementation to check if a bottle
is touching a conveyor belt segment and copy the velocity.

https://github.com/liabru/matter-js/issues/613

### Problems with mass
Even when the water is massless, it will push the bottles into the ground slowing them down and crashing the 
entire belt. 


### Bottles leak
When the bottles are filled to ~80% they will leak through the corners.