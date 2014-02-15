// deviceExtensions.js

// This module extends the built-in GC SDK device module
// as well as resolving the issue of the device rotation handler
// not firing when running the game in the simulator.
//
// The following extensions are applied:
// - device.addRotationHandler/removeRotationHandler are added to support multiple rotation handlers
// - device.addBackButtonHandler/removeBackButtonHandler are added to support multiple back button handlers
//
// The following issues are resolved:
// - rotation handlers set via device.setRotationHandler (or the new methods mentioned above) now get
//   triggered when running the game in the simulator.
//
// Usage:
// import deviceExtensions.js as device;


import device;
import ui.Engine;

// Augment device.setRotationHandler API.
// Includes fix for rotation handlers not triggering in simulator.
(function () {
  var handlers;

  // List of rotation handlers.
  handlers = [];
  handlers.remove = function (o) {
    var i = this.indexOf(o);
    if (i >= 0) {
      this.splice(i, 1);
      return o;
    }
    return undefined;
  };

  // Set a rotation handler that will call our list of handlers.
  // It's important that this is only set once.
  device.setRotationHandler(function () {
    var args, i, len;

    args = [].slice.call(arguments);
    len = handlers.length;

    for (i = 0; i < len; i += 1) {
      handlers[i].apply(undefined, args);
    }
  });

  // Keep the original setRotationHandler() API unmodified.

  // Implement new methods to add and remove rotation handlers.
  device.addRotationHandler = function (fn) {
    handlers.push(fn);
  };
  device.removeRotationHandler = function (handler) {
    handlers.remove(handler) === handler;
  };

  // FIX: SIMULATOR ROTATION HANDLER
  // This fix resolves the issue of rotation handlers not being
  // triggered in the simulator when the "Rotate" button is clicked.
  (function () {
    var poll;

    // If not the simulator then don't perform the fix.
    if (!device.isSimulator) {
      return;
    }

    // Override the setRotationHandler() method so we can keep track
    // of ALL rotation handlers so we can call them when we fake a rotation event.
    device.setRotationHandler = (function (base) {
      return function (fn) {
        handlers.push(fn);
        return base.apply(this, fn);
      };
    }(device.setRotationHandler));

    // Poll for the ui.Engine singleton instance.
    // The ui.Engine instance is only available after
    // a ui.Application has been instantiated.
    poll = function () {
      var engine, oldWidth, oldHeight;

      engine = ui.Engine.get();
      oldWidth = device.width;
      oldHeight = device.height;

      // The ui.Engine is ready, so now we subscribe to the 'Tick'
      // event and monitor the device dimensions for a change.
      if (engine) {
        engine.on('Tick', function () {
          var newWidth, newHeight;

          newWidth = device.width;
          newHeight = device.height;

          if (newWidth === oldHeight) {
            oldWidth = newWidth;
            oldHeight = newHeight;

            handlers.forEach(function (handler) {
              handler.call(undefined, {
                // Only support two orientation values.
                orientation: newWidth > newHeight ? 'landscapeRight' : 'portrait'
              });
            });
          }
        });
      // Otherwise we perform another poll.
      } else {
        setTimeout(poll, 5);
      }
    };

    // Perform the first poll.
    setTimeout(poll, 5);
  }());
}());

// Augment device.setBackButtonHandler API.
(function () {
  var handlers;

  // List of back button handlers.
  handlers = [];
  handlers.remove = function (o) {
    var i = this.indexOf(o);
    if (i >= 0) {
      this.splice(i, 1);
      return o;
    }
    return undefined;
  };

  // Set a back button handler that will call our list of handlers.
  // It's important that this is only set once.
  device.setBackButtonHandler(function () {
    var args, i, len;

    args = [].slice.call(arguments);
    len = handlers.length;

    for (i = 0; i < len; i += 1) {
      handlers[i].apply(undefined, args);
    }
  });

  // Keep the original setBackButtonHandler() API unmodified.

  // Implement new methods to add and remove back button handlers.
  device.addBackButtonHandler = function (fn) {
    handlers.push(fn);
  };
  device.removeBackButtonHandler = function (handler) {
    handlers.remove(handler) === handler;
  };
}());

// Export the device module.
exports = device;