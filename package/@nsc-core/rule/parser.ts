import { RuleObject } from "./rule";

export class IniParser {
  private iniContent: string;

  constructor(iniContent: string) {
    this.iniContent = iniContent;
  }

  private parseIni(iniString: string): RuleObject {
    const result: RuleObject = {
      custom: {
        ruleset: [],
        custom_proxy_group: [],
      },
    };

    let currentSection: string | null = null;

    const lines = iniString.split("\n");
    for (let line of lines) {
      line = line.trim();

      if (!line || line.startsWith(";")) {
        continue;
      }

      if (line.startsWith("[") && line.endsWith("]")) {
        currentSection = line.substring(1, line.length - 1);
        result[currentSection] = {};
      } else {
        const [key, value] = line.split("=").map((str) => str.trim());
        if (currentSection) {
          if (result[currentSection][key]) {
            if (Array.isArray(result[currentSection][key])) {
              result[currentSection][key].push(value);
            } else {
              result[currentSection][key] = [
                result[currentSection][key],
                value,
              ];
            }
          } else {
            result[currentSection][key] = value;
          }
        }
      }
    }

    return result;
  }

  public content() {
    return this.iniContent;
  }

  public toObject(): RuleObject {
    return this.parseIni(this.iniContent);
  }
}
