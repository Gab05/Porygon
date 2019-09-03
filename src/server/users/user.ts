import { BaseConfig } from '../../config'

export class User {

  private readonly config: BaseConfig

  private name: string
  private id: string
  private rooms: Map<string, string>  // Maps roomId -> this.name.charAt(0) (for some reason)

  constructor (config: BaseConfig, username: string, id: string, roomid: string) {
    this.config = config
    this.name = username.substr(1);
    this.id = id;
    this.rooms = new Map();
    if (roomid) this.rooms.set(roomid, username.charAt(0));
  }

  isExcepted = () => this.config.excepts.includes(this.id)
  isRegexWhitelisted = () => this.config.regexautobanwhitelist.includes(this.id)

  hasRank = (roomid: string, tarGroup: string): boolean => {
    if (this.isExcepted()) return true;
    const group = this.rooms.get(roomid) || roomid; // PM messages use the roomid parameter as the user's group
    return this.config.groups[group] >= this.config.groups[tarGroup];
  }

  canUse (cmd, roomid) {
    if (this.isExcepted()) return true;
    const settings = Parse.settings[cmd];

    if (!settings || !settings[roomid])
      this.hasRank(roomid, (cmd === 'autoban' || cmd === 'blacklist') ? '#' : this.config.defaultrank)

    const setting = settings[roomid];
    if (setting === true) return true;
    return this.hasRank(roomid, setting);
  }
}
