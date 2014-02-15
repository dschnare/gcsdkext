import node_modules.gcsdkext.deviceExtensions as device;

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