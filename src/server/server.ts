import { client as WebSocketClient } from 'websocket'
import { ConsoleHelper } from '../console/console-helper'
import { Commands } from './commands/commands'
import { DataSender } from './data-handlers/data-sender'
import { UserManager } from './users/user-manager'
import { BaseConfig } from '../config'

export class Server {

  private readonly config: BaseConfig

  private console: ConsoleHelper
  private wsClient: WebSocketClient
  private dataSender: DataSender
  private commands: Commands
  private userManager: UserManager

  private connection: any = null
  private connectionRetries: number = 0

  constructor(config: BaseConfig, consoleHelper: ConsoleHelper) {
    this.config = config
    this.console = consoleHelper
    this.dataSender = new DataSender(consoleHelper)
    this.commands = new Commands(consoleHelper)
    this.userManager = new UserManager()
  }

  start = () => {
    this.console.info('Starting server...')
    this.connect()
  }

  private connect = () => {
    if (this.connectionRetries > 0) this.console.info('Retrying...')

    this.setupClient()
    this.openConnection()
  }

  private setupClient = () => {
    this.wsClient = new WebSocketClient();

    this.wsClient.on('connectFailed', this.onConnectionFailed)
    this.wsClient.on('connect', this.handleSuccessfulConnection);
  }

  private openConnection = () => {
    const connectionString = this.generateConnectionString();
    this.console.info(
      `connecting to ${connectionString} - secondary protocols: ${this.config.secprotocols.join(', ') || 'none'}`
    )
    this.wsClient.connect(connectionString, this.config.secprotocols);
  }

  private onConnectionFailed = (err: any) => {
    this.console.error(`Could not connect to server ${this.config.server}: ${err.stack}`);
    this.console.info('Retrying in one minute...');

    this.connectionRetries++
    setTimeout(() => this.connect(), 60000);
  }

  private handleSuccessfulConnection = (connection: any) => {
    this.connection = connection;
    this.dataSender.setConnection(this.connection)
    this.console.ok('Connected to server ' + this.config.server);

    this.connection.on('error', this.printConnectionError);
    this.connection.on('close', this.onConnectionClosed);
    this.connection.on('message', this.onConnectionMessage);
  }

  private printConnectionError = (err: any) => this.console.error('connection error: ' + err.stack)

  private onConnectionClosed = (code: number, reason: string) => {
    // Is this always error or can this be intended...?
    this.console.error(`Connection closed: ${reason} (${code})`)
    this.console.info('Retrying in one minute...');

    this.userManager.deleteAll()
    this.roomManager.deleteAll()

    this.connectionRetries = 0
    setTimeout( () => this.connect(), 60000);
  }

  private onConnectionMessage = (response: any) => {
    if (response.type !== 'utf8') return

    const message = response.utf8Data;
    this.console.recv(message);

    // SockJS messages sent from the server begin with 'a'
    // this filters out other SockJS response types (heartbeats in particular)
    if (message.charAt(0) !== 'a') return
    Parse.data(message);
  }

  private generateConnectionString = () => {
    const id: number = Math.floor(Math.random() * 1000)
    const chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789_';

    let randomString = ''
    for (let i = 0; i < 8; i++) randomString += chars.charAt(Math.floor(Math.random() * chars.length));

    return `ws://${this.config.server}:${this.config.port}/showdown/${id}/${randomString}/websocket`
  }
}
