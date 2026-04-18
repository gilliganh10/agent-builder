import { describe, it, expect } from "vitest";
import { interpolateTemplate } from "@/lib/agents/flow/env";

describe("interpolateTemplate", () => {
  it("replaces {{env.KEY}}", () => {
    expect(
      interpolateTemplate("Hello {{env.lang}}", { lang: "de" })
    ).toBe("Hello de");
  });

  it("replaces {{vars.KEY}} when vars provided", () => {
    expect(
      interpolateTemplate("x={{vars.count}}", {}, { count: 3 })
    ).toBe("x=3");
  });

  it("replaces bare {{KEY}} using merged env and vars (env wins on collision)", () => {
    expect(
      interpolateTemplate("a={{foo}}", { foo: "fromEnv" }, { foo: "fromVars" })
    ).toBe("a=fromEnv");
  });

  it("replaces bare {{KEY}} from vars when not in env", () => {
    expect(
      interpolateTemplate("Reply in {{targetLanguage}}", {}, { targetLanguage: "German" })
    ).toBe("Reply in German");
  });

  it("applies explicit forms before bare; bare uses merged map (env over vars)", () => {
    expect(
      interpolateTemplate("{{env.x}} {{vars.y}} {{z}}", { x: "1", z: "3" }, { y: "2", z: "fromVars" })
    ).toBe("1 2 3");
  });
});
