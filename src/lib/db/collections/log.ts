import { Collection } from '../helper.svelte'

import { Destinations } from './destinations'
import { Students } from './student'

class LogEntry {
  id!: string
  destinationId!: string
  studentId!: string
  leftTimestamp!: number
  returnTimestamp!: number

  constructor(data: ClassProperties<LogEntry>) {
    Object.assign(this, data)
  }

  get student() {
    return Students.findOne({ id: this.studentId })
  }

  get destination() {
    return Destinations.findOne({ id: this.destinationId })
  }
}

class LogCollection extends Collection<ClassProperties<LogEntry>> {
  constructor() {
    super({
      name: 'log',
      transform: (data) => new LogEntry(data),
    })
  }
}

const Log = new LogCollection()

export { Log }
