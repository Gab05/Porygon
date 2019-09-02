export class Queue {

  private value: any[]

  constructor() {
    this.value = []
  }

  push = (data: any) => this.value.push(data)

  shift = (): any => this.value.shift()
}
