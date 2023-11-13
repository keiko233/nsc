export class Vless {
  private link: string;

  constructor(link: string) {
    this.link = link;
  }

  private parseVlessString(str: string) {
    const parts = str.split(/\?/);

    const params = Object.fromEntries(
      new URLSearchParams(parts[1].split("#")[0])
    );
    const format = parts[0].split(/@|:+/);
    const name = parts[1].split("#")[1] || "";

    if (params.type == "ws") {
      return {
        type: "vless",
        name: name,
        uuid: format[0],
        host: format[1],
        port: format[2],
        network: params.type,
        tls: params.security == "none" ? false : true,
        tfo: false,
        "skip-cert-verify": true,
        "ws-opts": {
          path: params.path,
        },
        udp: true,
      };
    } else if (params.type == "grpc") {
      return {
        type: "vless",
        name: name,
        uuid: format[0],
        host: format[1],
        port: format[2],
        network: params.type,
        tls: params.security == "none" ? false : true,
        tfo: false,
        "skip-cert-verify": true,
        "grpc-opts": {
          "grpc-mode": "gun",
          "grpc-service-name": params.serviceName,
        },
        udp: true,
      };
    }
  }

  public toClash() {
    const params = this.link.slice(8);
    return this.parseVlessString(params);
  }
}
