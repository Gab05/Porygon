"use strict";

var _config = require("./config");

class App {
  run = () => console.log(_config.config);
}

new App().run();