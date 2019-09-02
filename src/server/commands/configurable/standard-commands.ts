export interface ConfigurableCommands {
  autoban: boolean
  banword: boolean
  say: boolean
  joke: boolean
  usagestats: boolean
  '8ball': boolean
  guia: boolean
  studio: boolean
  wifi: boolean
  monotype: boolean
  survivor: boolean
  happy: boolean
  buzz: boolean
}

export const defaultCommands: () => ConfigurableCommands = () => ({
  autoban: true,
  banword: true,
  say: true,
  joke: true,
  usagestats: true,
  '8ball': true,
  guia: true,
  studio: true,
  wifi: true,
  monotype: true,
  survivor: true,
  happy: true,
  buzz: true,
})
