import { describe, expect, it } from "vitest";
import {
  MODEL_POLICIES,
  policyFromModel,
  resolveModel,
} from "@/lib/agents/model-policy";

describe("model-policy", () => {
  it("resolves default and premium to GPT-5.4 family", () => {
    expect(resolveModel("default")).toBe("gpt-5.4-mini");
    expect(resolveModel("premium")).toBe("gpt-5.4");
  });

  it("keeps economy tier on nano", () => {
    expect(resolveModel("cheap")).toBe(MODEL_POLICIES.cheap.model);
  });

  it("maps legacy stored model ids to policies", () => {
    expect(policyFromModel("gpt-4.1")).toBe("default");
    expect(policyFromModel("gpt-4o")).toBe("premium");
    expect(policyFromModel("gpt-5.4-mini")).toBe("default");
    expect(policyFromModel("gpt-5.4")).toBe("premium");
  });

  it("falls back unknown models to default policy", () => {
    expect(policyFromModel("unknown-model-xyz")).toBe("default");
  });
});
