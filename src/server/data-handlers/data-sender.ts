import { ConsoleHelper } from '../../console/console-helper'
import { Queue } from '../queue'

const MESSAGE_THROTTLE: number = 650

export class DataSender {

  private console: ConsoleHelper

  private queue: Queue = new Queue()
  private connection: any = null
  private dequeueTimeout: any = null
  private lastSentAt: number = 0

  constructor(consoleHelper: ConsoleHelper) {
    this.console = consoleHelper
  }

  send = (data: any) => {
    if (!data || !this.connection.connected) return

    if (this.tooSoonSinceLastSent()) this.enqueueData(data)
    else {
      this.sendData(data)
      this.handleDequeueTimeout()
    }
  }

  dequeue = () => this.send(this.queue.shift())

  setConnection = (connection: any) => this.connection = connection

  private tooSoonSinceLastSent = (): boolean => Date.now() < this.lastSentAt + MESSAGE_THROTTLE - 5

  private enqueueData = (data: any) => {
    this.queue.push(data);

    if (!this.dequeueTimeout) {
      this.dequeueTimeout = setTimeout(this.dequeue, Date.now() - this.lastSentAt + MESSAGE_THROTTLE);
    }
  }

  private sendData = (data: any) => {
    data = this.formatData(data)

    this.console.dsend(data);
    this.connection.send(data);
    this.lastSentAt = Date.now();
  }

  private formatData = (data: any) => Array.isArray(data)
    ? JSON.stringify(data)
    : JSON.stringify([data.toString()])

  private handleDequeueTimeout = () => {
    if (this.dequeueTimeout) {
      this.dequeueTimeout = this.queue.isEmpty() ? null : setTimeout(this.dequeue, MESSAGE_THROTTLE)
    }
  }
}
