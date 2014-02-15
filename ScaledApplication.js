// ScaledApplication.js

import node_modules.gcsdkext.deviceExtensions as device;

/*
  Base class for a scalable application. A scalable application is an
  application that follows the "Scaling the Game to Fit the Device"
  article (http://docs.gameclosure.com/guide/scaling.html).

  ScaledApplication instances expose the following properties:

  - displayWidth = The width of the maximum displayable region
  - displayHeight = The height of the maximum displayable region
  - worldWidth = (Only available after initUI() has been called) The logical width of the game world
  - worldHeight = (Only available after initUI() has been called) The logical height of the game world

  The properties displyWidth and displayHeight are only set once, but are read each time the device is rotated.
  Despite thier read-only nature it is not recommended that they be modified during the execution of tha app.
  The properties worldWidth and worldHeight are calculated each time the device is rotated (and when the app's UI is initialized).

  The following methods are available for convenience:

  - centerX() = Returns the horizontal center of the game world (calculates worldWidth / 2)
  - centerY() = Returns the vertical center of the game world (calculates worldHeight / 2)
  - center() = Returns the center point of the game world as an object of the form {x:, y:}


  Usage:

    import node_modules.gcsdkext.ScaledApplication;
    import node_modules.gcsdkext.deviceExtensions as device;

    exports = Class(ScaledApplication, function (supr) {
      // Override init() if you want to set different display dimensions
      // than wat are recommended in the article.
      //this.init = function () {
      //  super(this, 'init', [{
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
*/

exports = Class(GC.Application, function (supr) {
  this.init = function (opts) {
    opts = merge(opts || {}, {
      displayWidth: 576,
      displayHeight: 1024
    });

    supr(this, 'init', []);

    this.displayWidth = opts.displayWidth;
    this.displayHeight = opts.displayHeight;
  };

  this.centerX = function () {
    return this.worldWidth / 2;
  };
  this.centerY = function () {
    return this.worldHeight / 2;
  };
  this.center = function () {
    return {
      x: this.centerX(),
      y: this.centerY()
    };
  };

  this.initUI = function () {
    this.view.style.layout = false;
    // Perform the initial scaling calculation.
    updateWorldDimensions();
  };
});

// Perform the scaling calculation whenever the device is rotated.
function updateWorldDimensions() {
  var screen, app;

  screen = device.screen;
  app = GC.app;

  if (screen.isLandscape) {
    app.worldWidth = screen.width * (app.displayWidth / screen.height);
    app.worldHeight = app.dipslayWidth;
    app.view.style.scale = screen.height / app.displayWidth;
  } else {
    app.worldWidth = app.displayWidth;
    app.worldHeight = screen.height * (app.displayWidth / screen.width);
    app.view.style.scale = screen.width / app.displayWidth;
  }
}

device.addRotationHandler(updateWorldDimensions);