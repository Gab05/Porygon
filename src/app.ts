import { config } from './config'
import { ConsoleHelper } from './console/console-helper'
import { Server } from './server/server'

class App {
  private consoleHelper = new ConsoleHelper(config)
  private server = new Server(config, this.consoleHelper)

  run = () => {
    this.consoleHelper.init()
    this.server.start()
  }
}

new App().run()
