export interface ConfigurableCommandLevels {
  off: boolean
  disable: boolean
  'false': boolean
  on: boolean
  enable: boolean
  'true': boolean
}

export const defaultCommandLevels: () => ConfigurableCommandLevels = () => ({
  off: false,
  disable: false,
  'false': false,
  on: true,
  enable: true,
  'true': true
})
