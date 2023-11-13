import { Base64 } from "js-base64";

export class Vmess {
  private link: string;

  constructor(link: string) {
    this.link = link;
  }

  private splitParams(input: string): {
    base64: string;
    remarks: string;
    obfs: string;
    alterId: number;
  } {
    const params = new URLSearchParams(input.split("?")[1]);
    const base64 = input.split("?")[0];
    const remarks = decodeURIComponent(params.get("remarks") || "");
    const obfs = params.get("obfs") || "";
    const alterId = parseInt(params.get("alterId") || "0");

    return { base64, remarks, obfs, alterId };
  }

  private splitInput(input: string): {
    protocol: string;
    uuid: string;
    domain: string;
    port: number;
  } {
    const arr = Base64.decode(input).split(":");
    const protocol = arr[0];
    const uuid = arr[1].split("@")[0];
    const domain = arr[1].split("@")[1];
    const port = parseInt(arr[2]);

    return { protocol, uuid, domain, port };
  }

  public toClash() {
    const params = this.splitParams(this.link.slice(8));
    const decode = this.splitInput(params.base64);

    return {
      type: "vmess",
      name: params.remarks,
      alterId: params.alterId,
      cipher: decode.protocol,
      server: decode.domain,
      port: decode.port,
      uuid: decode.uuid,
      tls: false,
      "skip-cert-verify": true,
      udp: true,
    };
  }
}
