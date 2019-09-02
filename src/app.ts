import { config } from './config'

class App {
  run = () => console.log(config)
}

new App().run()
