import { z } from "zod";
import { ALL_MODEL_POLICIES } from "@/lib/agents/model-policy";
import { FlowNodeSchema } from "@/lib/agents/flow/flow-definition-zod";

const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const ConditionOperatorEnum = z.enum([
  "eq",
  "neq",
  "contains",
  "gt",
  "lt",
  "gte",
  "lte",
  "exists",
  "not_exists",
]);

const BlockAttachmentSchema = z.object({
  id: z.string(),
  mode: z.enum(["before", "after", "parallel", "override"]),
  label: z.string(),
  primitiveId: z.string().optional(),
  inlinePrimitive: z
    .object({
      kind: z.enum([
        "researcher",
        "actor",
        "rewriter",
        "responder",
        "eval",
        "state_extractor",
      ]),
      instructions: z.string(),
      model: z.string().optional(),
    })
    .optional(),
  varsRead: z.array(z.string()).optional(),
  varsPatch: z.record(z.string(), z.string()).optional(),
  condition: z
    .object({
      field: z.string(),
      operator: ConditionOperatorEnum,
      value: z.unknown().optional(),
    })
    .optional(),
  displayName: z.string().optional(),
  displayColor: z.string().optional(),
  outputSchema: z
    .array(
      z.object({
        key: z.string(),
        type: z.enum(["string", "number", "boolean", "json"]),
        description: z.string(),
        optional: z.boolean().optional(),
        messageRole: z.enum(["primary", "secondary", "none"]).optional(),
      })
    )
    .optional(),
});

const ExtractConfigSchema = z.object({
  instructions: z.string(),
  outputSchema: z.array(
    z.object({
      key: z.string(),
      type: z.string(),
      description: z.string().optional(),
      optional: z.boolean().optional(),
      messageRole: z.enum(["primary", "secondary", "none"]).optional(),
    })
  ),
  model: z.string().optional(),
  varsRead: z.array(z.string()).optional(),
  varsPatch: z.record(z.string(), z.string()).optional(),
});

const MessageBlockSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum([
      "user",
      "assistant",
      "system",
      "context",
      "extract",
      "branch",
      "parallel",
      "goal",
    ]),
    label: z.string(),
    content: z.string().optional(),
    position: z.number(),
    settings: z.object({
      persistOutput: z.boolean().optional(),
      canRewrite: z.boolean().optional(),
      displayName: z.string().optional(),
      displayColor: z.string().optional(),
      displaySide: z.enum(["left", "right"]).optional(),
    }),
    attachments: z.array(BlockAttachmentSchema),
    extractConfig: ExtractConfigSchema.optional(),
    branchConfig: z
      .object({
        condition: z.object({
          field: z.string(),
          operator: ConditionOperatorEnum,
          value: z.unknown().optional(),
        }),
        trueBranch: z.array(MessageBlockSchema),
        falseBranch: z.array(MessageBlockSchema),
      })
      .optional(),
    parallelConfig: z
      .object({
        laneA: z.array(MessageBlockSchema),
        laneB: z.array(MessageBlockSchema),
      })
      .optional(),
    goalConfig: z
      .object({
        goalId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        conditions: z.array(
          z.object({
            field: z.string(),
            operator: ConditionOperatorEnum,
            value: z.unknown().optional(),
          })
        ),
        conditionLogic: z.enum(["all", "any"]),
        onComplete: z.object({
          type: z.enum(["close", "handoff", "message"]),
          message: z.string().optional(),
          handoffAgentSlug: z.string().optional(),
          handoffPayloadMapping: z.record(z.string(), z.string()).optional(),
        }),
      })
      .optional(),
  })
);

export const ChatBuilderSpecSchema = z.object({
  blocks: z.array(MessageBlockSchema),
});

const StateFieldDefinitionSchema = z.object({
  key: z.string(),
  type: z.enum(["string", "number", "boolean", "json"]),
  default: z.unknown().optional(),
  description: z.string().optional(),
});

const GoalConditionSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "eq",
    "neq",
    "exists",
    "not_exists",
    "gt",
    "lt",
    "gte",
    "lte",
    "contains",
  ]),
  value: z.unknown().optional(),
});

const GoalCompletionActionSchema = z.object({
  type: z.enum(["close", "handoff", "message"]),
  message: z.string().optional(),
  handoffAgentSlug: z.string().optional(),
  handoffPayloadMapping: z.record(z.string(), z.string()).optional(),
});

const AgentGoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  conditions: z.array(GoalConditionSchema).optional(),
  conditionLogic: z.enum(["all", "any"]).optional(),
  onComplete: GoalCompletionActionSchema.optional(),
});

const AgentStateConfigSchema = z.object({
  fields: z.array(StateFieldDefinitionSchema),
  goals: z.array(AgentGoalSchema),
  scope: z.enum(["run", "conversation"]),
  extractionModel: z.string().optional(),
});

export const FlowDefinitionSchema = z.object({
  version: z.union([z.literal(1), z.literal(2)]).optional(),
  stateConfig: AgentStateConfigSchema.optional(),
  orchestrator: z
    .object({
      vars: z.array(
        z.object({
          key: z.string(),
          type: z.enum(["string", "number", "boolean", "json"]),
          default: z.unknown().optional(),
          description: z.string().optional(),
        })
      ),
      goals: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          successCriteria: z.string().optional(),
          priority: z.number().optional(),
        })
      ),
      locks: z.array(z.string()),
      scope: z.enum(["run", "conversation"]),
    })
    .optional(),
  chatBuilder: ChatBuilderSpecSchema.optional(),
  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),
  envVars: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        type: z.enum(["string", "number", "boolean", "enum"]),
        default: z.string().optional(),
        description: z.string().optional(),
        required: z.boolean(),
        enumValues: z.array(z.string()).optional(),
        publicEditable: z.boolean(),
      })
    )
    .optional(),
});

export const UpdateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  instructions: z.string().min(1).max(50_000).optional(),
  allowedTools: z.array(z.string()).optional(),
  modelPolicy: z.enum(ALL_MODEL_POLICIES as [string, ...string[]]).optional(),
  mode: z.enum(["stateless", "conversational"]).optional(),
  flowDefinition: FlowDefinitionSchema.nullable().optional(),
  changelog: z.string().min(1).max(500),
});
