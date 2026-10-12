import { Collection } from '../helper.svelte'

type SettingType = ClassProperties<Setting>

class Setting {
  id!: string
  value!: string

  constructor(data: SettingType) {
    Object.assign(this, data)
  }
}

interface AvailableSetting<K extends string, T extends readonly string[]> {
  id: K
  options: T
  default: T[number]
}
const defineSetting = <const K extends string, const T extends readonly string[]>(
  setting: AvailableSetting<K, T>
) => setting

type AvailableSettings = SettingCollection['availableSettings'][number]
type SettingKey = AvailableSettings['id']
type SettingValue<K extends SettingKey> = Extract<AvailableSettings, { id: K }>['options'][number]

export type PinTypeOptions = SettingValue<'pinType'>

class SettingCollection extends Collection<SettingType> {
  private ready = false

  readonly availableSettings = [
    defineSetting({
      id: 'pinType',
      default: '4-digit',
      options: ['4-digit', '6-digit', 'alpha', 'digit'],
    }),
    defineSetting({
      id: 'trackReturn',
      default: 'true',
      options: ['true', 'false'],
    }),
  ] as const

  constructor() {
    super({
      name: 'settings',
      transform: (data) => new Setting(data),
    })

    this.isReady()
      .then(() => {
        this.populateSettings()
        this.ready = true
      })
      .catch((e) => console.error('db failed to initialize', e))
  }

  private populateSettings() {
    this.availableSettings.forEach((setting) => {
      const existing = this.findOne({ id: setting.id })
      if (existing === undefined) {
        this.insert({
          id: setting.id,
          value: setting.default,
        })
      } else if (!(setting.options as readonly string[]).includes(existing.value)) {
        this.updateOne({ id: existing.id }, { $set: { value: setting.default } })
      }
    })
  }

  insert(setting: SettingType) {
    super.insert(setting)
  }

  async getSetting<K extends SettingKey>(key: K) {
    await this.isReady()
    const found = super.findOne({ id: key })

    if (!found) throw new Error('setting not found')

    return found.value as SettingValue<K>
  }
}

const Settings = new SettingCollection()

export { Settings }
