import type { Modifier, Selector } from '@signaldb/core'

import { Collection } from '../helper.svelte'

import { Log } from './log'

type StudentType = ClassProperties<Student>

class Student {
  id!: string
  name!: string
  pin!: string

  constructor(data: StudentType) {
    Object.assign(this, data)
  }

  logEntries() {
    return Log.find({ studentId: this.id })
  }
}

class StudentCollection extends Collection<StudentType> {
  constructor() {
    super({
      name: 'students',
      transform: (data) => new Student(data),
    })
  }

  insert(data: Omit<StudentType, 'id'>) {
    if (this.findOne({ pin: data.pin })) {
      throw new Error('PIN must be unique')
    }
    return super.insert(data)
  }

  updateOne(
    selector: Selector<StudentType>,
    modifier: Modifier<StudentType>,
    options?: { upsert?: boolean }
  ): 0 | 1 {
    const studentToUpdate = this.findOne(selector)
    if (studentToUpdate === undefined) {
      throw new Error('Student not found')
    }
    if (modifier.$set?.pin) {
      const existingStudent = this.findOne({ pin: modifier.$set.pin })
      const studentToUpdate = this.findOne(selector)
      if (existingStudent && studentToUpdate?.id !== existingStudent.id) {
        throw new Error('PIN must be unique')
      }
    }

    return super.updateOne(selector, modifier, options)
  }
}

const Students = new StudentCollection()

export { Students }
