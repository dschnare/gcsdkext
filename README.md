gcsdkext
========

Extensions, bug fixes and useful classes for the Game Closure SDK.

Installation
-------------

Create a package.json file in your project directory.

````json
{
  "name": "myproject",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "gcsdk": "git://github.com/dschnare/gcsdkext.git"
  }
}
````

Then install:

````shell
cd devkit/projects/myproject
npm install
````

Modules
-----------

### deviceExtensions

This module extends the built-in GC SDK device module as well as resolving the issue of the device rotation handler not firing when running the game in the simulator.

The following extensions are applied:

- `device.addRotationHandler`/`removeRotationHandler` are added to support multiple rotation handlers
- `device.addBackButtonHandler`/`removeBackButtonHandler` are added to support multiple back button handlers

The following issues are resolved:

- rotation handlers set via `device.setRotationHandler` (or the new methods mentioned above) do not get triggered when running the game in the simulator.

**Usage:**

````javascript
import node_modules.gcsdkext.deviceExtensions as device;
````


## Classes

### ScaledApplication

Base class for a scalable application. A scalable application is an application that follows the [Scaling the Game to Fit the Device](http://docs.gameclosure.com/guide/scaling.html) article.

ScaledApplication instances expose the following properties:

- `displayWidth` = The width of the maximum displayable region (defaults to 576)
- `displayHeight` = The height of the maximum displayable region (defaults to 1024)
- `worldWidth` = (Only available after initUI() has been called) The logical width of the game world
- `worldHeight` = (Only available after initUI() has been called) The logical height of the game world

The properties `displyWidth` and `displayHeight` are only set once, but are read each time the device is rotated.
Despite thier read-only nature it is not recommended that they be modified during the execution of your game.
The properties `worldWidth` and `worldHeight` are calculated each time the device is rotated (and when the game's UI is initialized).

The following methods are available for convenience:

- `centerX()` = Returns the horizontal center of the game world (calculates `worldWidth / 2`)
- `centerY()` = Returns the vertical center of the game world (calculates `worldHeight / 2`)
- `center()` = Returns the center point of the game world as an object of the form `{x:, y:}`


**Usage:**

````javascript
// src/Application.js

import node_modules.gcsdkext.ScaledApplication as ScaledApplication;
import node_modules.gcsdkext.deviceExtensions as device;

exports = Class(ScaledApplication, function (supr) {
  // Override init() if you want to set different display dimensions
  // than wat are recommended in the article.
  //this.init = function () {
  //  supr(this, 'init', [{
  //    displayWidth: 576,
  //    displayHeight: 1024
  //  }]);
  //};

  this.initUI = function () {
    var textview, self;

    self = this;
    supr(self, 'initUI');

    // Create a TextView that has its width set to
    // half of the game world and position to be centered
    // in the game world.
    textview = new TextView({
      superview: self.view,
      text: "Hello, world!",
      color: "white",
      autoFontSize: true,
      width: self.centerX(),
      height: 60,
      x: self.centerX() / 2,
      y: self.centerY() - 30
    });

    // To keep the textview always half the width of our game world
    // and centered we will have to listen for rotation events.
    device.addRotationHandler(function () {
      textview.style.update({
        width: self.centerX(),
        x: self.centerX() / 2,
        y: self.centerY() - textview.style.height / 2
      });
    });
  };
});
````