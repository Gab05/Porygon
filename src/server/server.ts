import { client as WebSocketClient } from 'websocket'
import { ConsoleHelper } from '../console/console-helper'
import { Commands } from './commands/commands'
import { DataSender } from './data-sender'
import { Queue } from './queue'
import { BaseConfig } from '../config'

export class Server {

  private readonly config: BaseConfig
  private console: ConsoleHelper
  private wsClient: WebSocketClient
  private queue: Queue
  private connection: any = null
  private dataSender: DataSender
  private commands: Commands

  constructor(config: BaseConfig, consoleHelper: ConsoleHelper) {
    this.config = config
    this.console = consoleHelper
    this.wsClient = new WebSocketClient()
    this.queue = new Queue()
    this.dataSender = new DataSender(consoleHelper, this.queue)
    this.commands = new Commands(consoleHelper)
  }

  start = () => {

  }

  private generateConnectionString = () => {
    const id: number = Math.floor(Math.random() * 1000)
    const chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789_';

    let randomString = ''
    for (let i = 0; i < 8; i++) randomString += chars.charAt(Math.floor(Math.random() * chars.length));

    return `ws://${this.config.server}:${this.config.port}/showdown/${id}/${randomString}/websocket`
  }
}
