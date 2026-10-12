import { Collection } from '../helper.svelte'

class Destination {
  id!: string
  name!: string
  icon!: string

  active!: boolean

  constructor(data: ClassProperties<Destination>) {
    Object.assign(this, data)
  }
}

class DestinationCollection extends Collection<ClassProperties<Destination>> {
  constructor() {
    super({
      name: 'destinations',
      transform: (data) => new Destination(data),
    })
  }
}

const Destinations = new DestinationCollection()

export { Destinations }
