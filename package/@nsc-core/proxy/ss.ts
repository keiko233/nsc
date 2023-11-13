import { Base64 } from "js-base64";

export class Ss {
  private link: string;

  constructor(link: string) {
    this.link = link;
  }

  private splitString(str: string) {
    const parts = str.split(/[:@#]/);

    if (parts.length == 4) {
      const decode = Base64.decode(parts[0]).split(":");

      return {
        cipher: decode[0],
        password: decode[1],
        server: parts[1],
        port: parts[2],
        name: decodeURIComponent(parts[3]),
      }
    } else if (parts.length == 5) {
      return {
        cipher: parts[0],
        password: parts[1],
        server: parts[2],
        port: parts[3],
        name: decodeURIComponent(parts[4]),
      }
    }
  }

  public toClash() {
    const raw = this.link.slice(5);
    const decoded = this.splitString(raw);

    return {
      type: "ss",
      name: decoded.name,
      server: decoded.server,
      port: decoded.port,
      cipher: decoded.cipher,
      udp: true,
    };
  }
}