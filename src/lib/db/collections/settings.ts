import { Collection } from '../helper.svelte'

type SettingType = ClassProperties<Setting>

class Setting {
  id!: string
  value!: string

  constructor(data: SettingType) {
    Object.assign(this, data)
  }
}

interface AvailableSetting<T extends readonly string[]> {
  id: string
  options: T
  default: T[number]
}
const defineSetting = <T extends readonly string[]>(
  setting: AvailableSetting<T>,
) => setting

class SettingCollection extends Collection<SettingType> {
  readonly availableSettings: AvailableSetting<readonly string[]>[] = [
    defineSetting({
      id: 'pinType',
      default: '4-digit',
      options: ['4-digit', '6-digit', 'alpha', 'digit'] as const,
    }),
    defineSetting({
      id: 'trackReturn',
      default: 'true',
      options: ['true', 'false'] as const,
    }),
  ]

  constructor() {
    super({
      name: 'settings',
      transform: (data) => new Setting(data),
    })

    this.isReady().then(() => {
      this.populateSettings()
    }).catch(e => console.error('db failed to initialize', e))
  }

  private populateSettings() {

    this.availableSettings.forEach((setting) => {
      const existing = this.findOne({ id: setting.id })
      if (existing === undefined) {
        this.insert({
          id: setting.id,
          value: setting.default,
        })
      } else if (setting.options && !setting.options.includes(existing.value)) {
        this.updateOne(
          { id: existing.id },
          { $set: { value: setting.default } },
        )
      }
    })
  }

  insert(setting: SettingType) {
    super.insert(setting)
  }
}

const Settings = new SettingCollection()

export { Settings }