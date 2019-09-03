import { client as WebSocketClient } from 'websocket'
import { ConsoleHelper } from '../console/console-helper'
import { Commands } from './commands/commands'
import { DataSender } from './data-sender'
import { Queue } from './queue'
import { UserManager } from './users/user-manager'
import { BaseConfig } from '../config'

export class Server {

  private readonly config: BaseConfig

  private console: ConsoleHelper
  private wsClient: WebSocketClient
  private queue: Queue
  private dataSender: DataSender
  private commands: Commands
  private userManager: UserManager

  private connection: any = null
  private connectionRetries: number = 0

  constructor(config: BaseConfig, consoleHelper: ConsoleHelper) {
    this.config = config
    this.console = consoleHelper
    this.queue = new Queue()
    this.dataSender = new DataSender(consoleHelper, this.queue, this.connection)
    this.commands = new Commands(consoleHelper)
    this.userManager = new UserManager()
  }

  start = () => {
    this.console.info('Starting server...')
    this.connect()
  }

  private connect = () => {
    if (this.connectionRetries > 0) this.console.info('Retrying...')

    this.wsClient = new WebSocketClient();

    this.wsClient.on('connectFailed', (err: any) => {
      this.console.error(`Could not connect to server ${this.config.server}: ${err.stack}`);
      this.console.info('Retrying in one minute.');

      setTimeout(() => this.connect(), 60000);
    });

    this.wsClient.on('connect', (connection: any) => {
      this.connection = connection;
      this.console.ok('connected to server ' + this.config.server);

      this.connection.on('error', (err: any) => {
        this.console.error('connection error: ' + err.stack);
      });

      this.connection.on('close', function (code, reason) {
        // Is this always error or can this be intended...?
        this.console.error('connection closed: ' + reason + ' (' + code + ')');
        this.console.info('retrying in one minute');

        for (var i in UserManager.users) {
          delete UserManager.users[i];
        }
        Rooms.rooms.clear();
        setTimeout(function () {
          connect(true);
        }, 60000);
      });

      this.connection.on('message', function (response) {
        if (response.type !== 'utf8') return false;
        var message = response.utf8Data;
        recv(message);

        // SockJS messages sent from the server begin with 'a'
        // this filters out other SockJS response types (heartbeats in particular)
        if (message.charAt(0) !== 'a') return false;
        Parse.data(message);
      });
    });

    // The connection itself
    var id = ~~(Math.random() * 1000);
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    var str = '';
    for (var i = 0, l = chars.length; i < 8; i++) {
      str += chars.charAt(~~(Math.random() * l));
    }

    var conStr = 'ws://' + Config.server + ':' + Config.port + '/showdown/' + id + '/' + str + '/websocket';
    info('connecting to ' + conStr + ' - secondary protocols: ' + (Config.secprotocols.join(', ') || 'none'));
    ws.connect(conStr, Config.secprotocols);
  }

  private generateConnectionString = () => {
    const id: number = Math.floor(Math.random() * 1000)
    const chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789_';

    let randomString = ''
    for (let i = 0; i < 8; i++) randomString += chars.charAt(Math.floor(Math.random() * chars.length));

    return `ws://${this.config.server}:${this.config.port}/showdown/${id}/${randomString}/websocket`
  }
}
