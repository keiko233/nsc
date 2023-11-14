import { IniParser } from "./parser";

export interface RuleObject {
  custom: {
    ruleset: string[];
    custom_proxy_group: string[];
  };
}

export class Rule {
  private iniContent: string;
  private ruleObject: RuleObject;

  constructor(iniContent: string) {
    this.iniContent = iniContent;
    this.ruleObject = new IniParser(iniContent).toObject();
  }

  private mergeListUrls(
    arr: {
      name: string;
      listUrl: string;
    }[]
  ): {
    name: string;
    listUrls: string[];
  }[] {
    const mergedObj: { [key: string]: string[] } = {};

    arr.forEach((item) => {
      if (mergedObj[item.name]) {
        mergedObj[item.name].push(item.listUrl);
      } else {
        mergedObj[item.name] = [item.listUrl];
      }
    });

    const result = Object.keys(mergedObj).map((key) => {
      return {
        name: key,
        listUrls: mergedObj[key],
      };
    });

    return result;
  }

  private removeBrackets(str: string): string {
    return str.replace(/\[\]/g, "");
  }

  public getProxyGroup() {
    const clash = {
      "proxy-groups": [],
    };

    this.ruleObject.custom.custom_proxy_group.forEach((group) => {
      const split = group.split("`");

      if (split[1] == "url-test") {
        const time = split[split.length - 1].split(",,");

        const result = {
          name: split[0],
          type: "url-test",
          url: split[3],
          interval: time[0],
          tolerance: time[1],
          proxies: [],
        };

        split.forEach((item, index) => {
          if (index >= 2 && index < split.length - 2) {
            result.proxies.push(this.removeBrackets(item));
          }
        });

        clash["proxy-groups"].push(result);
      } else if (split[1] == "select") {
        const result = {
          name: split[0],
          type: "select",
          proxies: [],
        };

        split.forEach((item, index) => {
          if (index >= 2) {
            result.proxies.push(this.removeBrackets(item));
          }
        });

        clash["proxy-groups"].push(result);
      }
    });

    return clash;
  }


  public getRules() {
    const rules = [];

    this.ruleObject.custom.ruleset.forEach((rule) => {
      const split = rule.split(",");

      rules.push({
        name: split[0],
        listUrl: split[1],
      });
    });

    return this.mergeListUrls(rules);
  }
}
