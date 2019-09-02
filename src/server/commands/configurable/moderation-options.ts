export interface ConfigurableModerationOptions {
  flooding: boolean
  caps: boolean
  stretching: boolean
  bannedwords: boolean
}

export const defaultModerationOptions: () => ConfigurableModerationOptions = () => ({
  flooding: true,
  caps: true,
  stretching: true,
  bannedwords: true,
})
