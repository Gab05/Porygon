import { ConsoleHelper } from '../console/console-helper'
import { Queue } from './queue'

export class DataSender {

  private console: ConsoleHelper
  private queue: Queue

  constructor(consoleHelper: ConsoleHelper, queue: Queue) {
    this.console = consoleHelper
    this.queue = queue
  }

  send = (data: any) => {
    if (!data || !Connection.connected) return false;

    var now = Date.now();
    if (now < lastSentAt + MESSAGE_THROTTLE - 5) {
      this.queue.push(data);
      if (!dequeueTimeout) {
        dequeueTimeout = setTimeout(this.dequeue, now - lastSentAt + MESSAGE_THROTTLE);
      }
      return false;
    }

    if (!Array.isArray(data)) data = [data.toString()];
    data = JSON.stringify(data);
    dsend(data);
    Connection.send(data);

    lastSentAt = now;
    if (dequeueTimeout) {
      if (queue.length) {
        dequeueTimeout = setTimeout(dequeue, MESSAGE_THROTTLE);
      } else {
        dequeueTimeout = null;
      }
    }
  }

  dequeue = () => this.send(this.queue.shift())
}
