import { BaseConfig } from '../config'

export class ConsoleHelper {

  private readonly config: BaseConfig
  private readonly colors = {
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
  }

  constructor(config: BaseConfig) {
    this.config = config
  }

  info = (text: string) => {
    if (this.config.debuglevel > 3) return;
    console.log(this.applyColor(this.colors.cyan), `INFO -- ${text}`);
  }

  debug = (text: string) => {
    if (this.config.debuglevel > 2) return;
    console.log(this.applyColor(this.colors.blue), `DEBUG -- ${text}`);
  };

  recv = (text: string) => {
    if (this.config.debuglevel > 0) return;
    console.log(this.applyColor(this.colors.white), `RECV -- ${text}`);
  };

  cmdr = (text: string) => { // receiving commands
    if (this.config.debuglevel !== 1) return;
    console.log(this.applyColor(this.colors.white), `CMDR -- ${text}`);
  };

  dsend = (text: string) => {
    if (this.config.debuglevel > 1) return;
    console.log(this.applyColor(this.colors.white), `SEND -- ${text}`);
  };

  error = (text: string) => console.log(this.applyColor(this.colors.red), `ERROR -- ${text}`)

  ok = (text: string) => {
    if (this.config.debuglevel > 4) return;
    console.log(this.applyColor(this.colors.green), `OK -- ${text}`);
  }

  printWelcomeMessage = () => {
    console.log(this.applyColor(this.colors.yellow), '------------------------------------');
    console.log(this.applyColor(this.colors.yellow), '|   Welcome to Porygon, a PS Bot!  |');
    console.log(this.applyColor(this.colors.yellow), '------------------------------------');
    console.log('');
  }

  toId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '')

  stripCommands = (text: string) => {
    text = text.trim();
    if (text.charAt(0) === '/') return `/${text}`;
    if (text.charAt(0) === '!' || /^>>>? /.test(text)) return ` ${text}`;
    return text;
  }

  checkCommandCharacter = () => {
    if (!/[^a-z0-9 ]/i.test(this.config.commandcharacter)) {
      this.error('invalid command character; should at least contain one non-alphanumeric character');
      process.exit(-1);
    }
  }

  init = () => {
    this.printWelcomeMessage()
    this.checkCommandCharacter()
  }

  private applyColor = (color: string) => color + '%s\x1b[0m'
}


