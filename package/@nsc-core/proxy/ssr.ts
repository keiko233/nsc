import { Base64 } from "js-base64";

export class Ssr {
  private link: string;

  constructor(link: string) {
    this.link = link;
  }

  private splitParams(input: string): {
    password: string | null;
    obfsparam: string | null;
    protoparam: string | null;
    remarks: string | null;
    group: string | null;
  } {
    const params = new URLSearchParams(input.split("/")[1]);
    const password = Base64.decode(input.split("/")[0]);
    const obfsparam = Base64.decode(params.get("obfsparam")) || null;
    const protoparam = Base64.decode(params.get("protoparam")) || null;
    const remarks = Base64.decode(params.get("remarks")) || null;
    const group = Base64.decode(params.get("group")) || null;

    return { password, obfsparam, protoparam, remarks, group };
  }

  public toClash() {
    const raw = Base64.decode(this.link.slice(6));
    const decoded = raw.split(":");
    const params = this.splitParams(decoded[5]);

    return {
      type: "ssr",
      name: params.remarks,
      server: decoded[0],
      port: decoded[1],
      protocol: decoded[2],
      cipher: "dummy",
      obfs: decoded[4],
      password: params.password,
      "obfs-param": params.obfsparam,
      "protocol-param": params.protoparam,
      udp: true,
    };
  }
}
