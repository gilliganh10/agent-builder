import type { Tool } from "@openai/agents";

// ---------------------------------------------------------------------------
// Literal unions
// ---------------------------------------------------------------------------

export type AgentKind = "built_in" | "user_created";

export type AgentMode = "stateless" | "conversational";

export type SessionStatus = "active" | "closed";

export type RunStatus = "pending" | "running" | "completed" | "failed";

export type StepKind = "llm_call" | "tool_call" | "output" | "flow_node";

export type StepStatus = "completed" | "failed" | "skipped";

export type ArtifactKind = "patch_applied" | "resource_created" | "output" | "proposal";

export type PrimitiveKind = "researcher" | "actor" | "rewriter" | "responder" | "eval" | "state_extractor";

export const PRIMITIVE_KINDS: PrimitiveKind[] = ["researcher", "actor", "rewriter", "responder", "eval", "state_extractor"];

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export interface AgentMessageAction {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  payload?: Record<string, JSONValue>;
  analytics?: {
    eventName: string;
    properties?: Record<string, JSONValue>;
  };
}

export interface AgentCtaMessageContent {
  type: "cta";
  title: string;
  body: string;
  /** Legacy: interactive actions were removed from this build. */
  primaryAction?: AgentMessageAction;
  secondaryAction?: AgentMessageAction;
}

export interface AgentCarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  metadata?: Record<string, JSONValue>;
  imageUrl?: string | null;
  /** Legacy: interactive actions were removed from this build. */
  primaryAction?: AgentMessageAction;
  secondaryAction?: AgentMessageAction;
}

export interface AgentCarouselMessageContent {
  type: "carousel";
  title: string;
  body?: string;
  items: AgentCarouselItem[];
}

export type AgentStructuredMessageContent =
  | AgentCtaMessageContent
  | AgentCarouselMessageContent;

export interface AgentPublicChatSettings {
  showStateSidebar?: boolean;
}

export interface AgentConversationGoalState {
  id: string;
  description: string;
  status: string;
}

export interface AgentConversationStatePayload {
  state?: Record<string, JSONValue>;
  goals?: AgentConversationGoalState[];
  locks?: string[];
}

// ---------------------------------------------------------------------------
// Shared execution contracts
// ---------------------------------------------------------------------------

export interface AgentTaskEnvelope {
  intent: string;
  surface: string;
  risk: "low" | "medium" | "high";
  editScope: "none" | "single_target" | "multi_target";
  latencyBudgetMs?: number;
  costBudgetUsd?: number;
  requiresUserConfirmation?: boolean;
  successCriteria?: string[];
}

export interface BudgetPolicy {
  profile: "speed" | "balanced" | "deep";
  maxLlmCalls?: number;
  maxToolCalls?: number;
  maxBudgetUsd?: number;
  maxLatencyMs?: number;
  escalationPolicy?: "never" | "when_needed" | "always";
  verificationPolicy?: "never" | "selective" | "always";
}

export interface ExecutionStep {
  id: string;
  owner: string;
  goal: string;
  allowedTools: string[];
  modelPolicy: "cheap" | "default" | "premium";
  expectedOutputSchema?: Record<string, unknown> | null;
  stopConditions?: string[];
}

export interface ExecutionPlan {
  task: AgentTaskEnvelope;
  budgetPolicy: BudgetPolicy;
  steps: ExecutionStep[];
}

export interface HandoffContract {
  target: string;
  instruction: string;
  payloadSchema?: Record<string, unknown> | null;
  outputSchema?: Record<string, unknown> | null;
}

export interface SpecialistResult {
  status: "completed" | "partial" | "blocked" | "failed";
  confidence?: number;
  artifacts?: Array<Record<string, unknown>>;
  nextRecommendedAction?: string;
  budgetUsed?: {
    llmCalls?: number;
    toolCalls?: number;
    costUsd?: number;
    latencyMs?: number;
  };
}

export interface RouteTelemetry {
  routeType: string;
  plannerUsed: boolean;
  handoffCount: number;
  specialistChain: string[];
  budgetPolicy: BudgetPolicy["profile"];
  exitReason?: string;
  resolvedMode?: string;
}

// ---------------------------------------------------------------------------
// Domain interfaces (mirror Prisma rows) — single-scope, no tenantId
// ---------------------------------------------------------------------------

export interface AgentDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  kind: AgentKind;
  instructions: string;
  allowedTools: string[];
  defaultModel: string;
  outputSchema?: Record<string, unknown> | null;
  flowDefinition?: FlowDefinition | null;
  mode: AgentMode;
  publishToken?: string | null;
  publishedAt?: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EnvVarDefinition {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "enum";
  default?: string;
  description?: string;
  required: boolean;
  enumValues?: string[];
  publicEditable: boolean;
}

export interface FlowDefinition {
  version?: 1 | 2;
  orchestrator?: OrchestratorConfig;
  stateConfig?: AgentStateConfig;
  /**
   * Legacy Plan/Chat block tree. Present for agents authored before the
   * simplified studio; new saves write `simplifiedBuilder` instead.
   */
  chatBuilder?: ChatBuilderSpec;
  /**
   * Canonical, user-facing builder spec (seven step kinds). When present
   * this is the source of truth for Plan and Graph; `nodes`/`edges` are
   * its compiled projection.
   */
  simplifiedBuilder?: import("@/lib/agents/studio/simplified-types").SimplifiedBuilderSpec;
  nodes: FlowNode[];
  edges: FlowEdge[];
  envVars?: EnvVarDefinition[];
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: FlowNodeData;
}

export type FlowNodeType =
  | "input" | "agent" | "condition" | "fork" | "join" | "output" | "terminus"
  | "researcher" | "actor" | "rewriter" | "responder" | "eval" | "state_extractor"
  | "tool";

export const V2_NODE_TYPES: FlowNodeType[] = ["researcher", "actor", "rewriter", "responder", "eval", "state_extractor"];

export interface FlowNodeData {
  label?: string;
  agentSlug?: string;
  inlineInstructions?: string;
  inlineModel?: string;
  condition?: ConditionConfig;
  inputMapping?: Record<string, string>;
  outputSchema?: Record<string, unknown>;
  extractOutputSchema?: ExtractFieldSchema[];
  /** Responder JSON field schema (from attachment outputSchema); used to map primary/secondary chat text. */
  responderOutputSchema?: ExtractFieldSchema[];
  timeout?: number;
  retries?: number;
  persistOutput?: boolean;
  canRewrite?: boolean;
  displayColor?: string;
  displaySide?: "left" | "right";
  displayName?: string;
  primitiveKind?: PrimitiveKind;
  varsRead?: string[];
  varsPatch?: Record<string, string>;
  toolName?: string;
  toolOutputShape?: "wrap" | "passthrough";
  structuredOutputSchemaKey?: string;
  streamOutput?: boolean;
  [key: string]: unknown;
}

export interface ConditionConfig {
  field: string;
  operator: "eq" | "neq" | "contains" | "gt" | "lt" | "gte" | "lte" | "exists" | "not_exists";
  value?: unknown;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  data?: { branch?: string };
}

export interface AgentVersion {
  id: string;
  agentDefinitionId: string;
  version: number;
  instructions: string;
  allowedTools: string[];
  defaultModel: string;
  outputSchema?: Record<string, unknown> | null;
  flowDefinition?: FlowDefinition | null;
  changelog: string;
  createdAt: string;
}

export interface ConversationSession {
  id: string;
  agentDefinitionId: string;
  status: SessionStatus;
  participantId?: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentRun {
  id: string;
  agentDefinitionId: string;
  agentVersionId?: string | null;
  sessionId?: string | null;
  status: RunStatus;
  input: string;
  finalOutput?: string | null;
  tokenUsage?: TokenUsage | null;
  costEstimate?: number | null;
  durationMs?: number | null;
  error?: string | null;
  triggeredBy: string;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  steps?: RunStep[];
  artifacts?: RunArtifact[];
  evals?: RunEval[];
}

export interface AgentRunListRow {
  id: string;
  agentDefinitionId: string;
  agentSlug: string;
  agentName: string;
  status: RunStatus;
  triggeredBy: string;
  inputPreview: string;
  durationMs: number | null;
  costEstimate: number | null;
  tokenUsage: TokenUsage | null;
  meta: Record<string, unknown>;
  surface: string | null;
  createdAt: string;
}

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
  cachedPrompt?: number;
}

export interface RunStep {
  id: string;
  runId: string;
  stepIndex: number;
  kind: StepKind;
  status: StepStatus;
  toolName?: string | null;
  nodeId?: string | null;
  input: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  tokenUsage?: TokenUsage | null;
  durationMs?: number | null;
  error?: string | null;
  validationPassed?: boolean | null;
  createdAt: string;
}

export interface RunArtifact {
  id: string;
  runId: string;
  kind: ArtifactKind;
  targetType?: string | null;
  targetId?: string | null;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown> | null;
  appliedAt?: string | null;
  appliedBy?: string | null;
  rejected: boolean;
  rejectedReason?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  proposalOutcome?: Record<string, unknown> | null;
  ignoredAt?: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Agent reporting
// ---------------------------------------------------------------------------

export type AgentReportingDataset = "runs" | "sessions" | "agents" | "models";

export interface AgentUsageSummary {
  agentCount: number;
  runCount: number;
  completedRunCount: number;
  failedRunCount: number;
  sessionCount: number;
  userCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  totalMessageCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalCostEstimate: number;
  avgCostEstimate: number;
  avgDurationMs: number;
}

export interface AgentModelResolutionStats {
  fromRunMeta: number;
  fromAgentVersion: number;
  fromAgentDefinition: number;
  unknown: number;
}

// ---------------------------------------------------------------------------
// Primitive definitions
// ---------------------------------------------------------------------------

export interface PrimitiveDefinition {
  id: string;
  name: string;
  slug: string;
  kind: PrimitiveKind;
  description: string;
  instructions: string;
  config: Record<string, unknown>;
  allowedTools: string[];
  defaultModel: string;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Orchestrator state model
// ---------------------------------------------------------------------------

export interface VarDefinition {
  key: string;
  type: "string" | "number" | "boolean" | "json";
  default?: JSONValue;
  description?: string;
}

export interface GoalDefinition {
  id: string;
  description: string;
  successCriteria?: string;
  priority?: number;
}

export type GoalStatus = "active" | "achieved" | "failed" | "deferred";

export interface GoalState extends GoalDefinition {
  status: GoalStatus;
}

export interface OrchestratorConfig {
  vars: VarDefinition[];
  goals: GoalDefinition[];
  locks: string[];
  scope: "run" | "conversation";
  resetVarsAtRunStart?: string[];
}

export interface OrchestratorState {
  vars: Record<string, JSONValue>;
  goals: GoalState[];
  locks: string[];
}

// ---------------------------------------------------------------------------
// Agent State & Goals
// ---------------------------------------------------------------------------

export interface StateFieldDefinition {
  key: string;
  type: "string" | "number" | "boolean" | "json";
  default?: JSONValue;
  description: string;
}

export interface GoalCondition {
  field: string;
  operator: "eq" | "neq" | "exists" | "not_exists" | "gt" | "lt" | "gte" | "lte" | "contains";
  value?: JSONValue;
}

export interface GoalCompletionAction {
  type: "close" | "handoff" | "message";
  message?: string;
  handoffAgentSlug?: string;
  handoffPayloadMapping?: Record<string, string>;
}

export interface AgentGoal {
  id: string;
  name: string;
  description: string;
  conditions: GoalCondition[];
  conditionLogic: "all" | "any";
  onComplete: GoalCompletionAction;
}

export interface AgentStateConfig {
  fields: StateFieldDefinition[];
  goals: AgentGoal[];
  scope: "run" | "conversation";
  extractionModel?: string;
}

// ---------------------------------------------------------------------------
// Chat Builder
// ---------------------------------------------------------------------------

export type MessageBlockType =
  | "user"
  | "assistant"
  | "system"
  | "context"
  | "extract"
  | "branch"
  | "parallel"
  | "goal";

export type AttachmentMode = "before" | "after" | "parallel" | "override";

export interface MessageBlockSettings {
  persistOutput?: boolean;
  canRewrite?: boolean;
  displayName?: string;
  displayColor?: string;
  displaySide?: "left" | "right";
}

export interface BlockAttachment {
  id: string;
  mode: AttachmentMode;
  label: string;
  inlinePrimitive?: {
    kind: PrimitiveKind;
    instructions: string;
    model?: string;
  };
  varsRead?: string[];
  varsPatch?: Record<string, string>;
  condition?: ConditionConfig;
  displayName?: string;
  displayColor?: string;
  /**
   * Optional structured output for this attachment. Compiler synthesizes a
   * JSON contract into `inlineInstructions` at build time.
   */
  outputSchema?: ExtractFieldSchema[];
}

export interface ExtractFieldSchema {
  key: string;
  type: "string" | "number" | "boolean" | "json";
  description: string;
  optional?: boolean;
  /** Maps this JSON field to the main chat bubble, a second line, or neither. */
  messageRole?: "primary" | "secondary" | "none";
}

export interface ExtractBlockConfig {
  instructions: string;
  outputSchema: ExtractFieldSchema[];
  model?: string;
  varsRead?: string[];
  varsPatch?: Record<string, string>;
}

export interface BranchBlockConfig {
  condition: ConditionConfig;
  trueBranch: MessageBlock[];
  falseBranch: MessageBlock[];
}

/** Two parallel lanes (fork/join at compile time). */
export interface ParallelBlockConfig {
  laneA: MessageBlock[];
  laneB: MessageBlock[];
}

export interface GoalBlockConfig {
  goalId: string;
  name: string;
  description?: string;
  conditions: GoalCondition[];
  conditionLogic: "all" | "any";
  onComplete: GoalCompletionAction;
}

export interface MessageBlock {
  id: string;
  type: MessageBlockType;
  label: string;
  content?: string;
  position: number;
  settings: MessageBlockSettings;
  attachments: BlockAttachment[];
  extractConfig?: ExtractBlockConfig;
  branchConfig?: BranchBlockConfig;
  parallelConfig?: ParallelBlockConfig;
  goalConfig?: GoalBlockConfig;
}

export interface ChatBuilderSpec {
  blocks: MessageBlock[];
}

// ---------------------------------------------------------------------------
// Run eval
// ---------------------------------------------------------------------------

export interface RunEval {
  id: string;
  runId: string;
  evalName: string;
  score?: number | null;
  pass?: boolean | null;
  reasoning?: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Runtime events
// ---------------------------------------------------------------------------

export type RuntimeEvent =
  | {
      type: "message";
      nodeId: string;
      content: string;
      secondaryContent?: string;
      structuredContent?: AgentStructuredMessageContent;
      display: DisplayMeta;
    }
  | { type: "rewrite_user_message"; nodeId: string; original: string; rewritten: string; explanation?: string }
  | { type: "node_completed"; nodeId: string; durationMs: number }
  | { type: "node_skipped"; nodeId: string }
  | { type: "error"; nodeId?: string; message: string }
  | { type: "state_updated"; fields: Record<string, JSONValue>; previous: Record<string, JSONValue> }
  | { type: "goal_achieved"; goalId: string; goalName: string; action?: GoalCompletionAction }
  | { type: "conversation_closed"; reason: string; message?: string; goalId?: string }
  | { type: "handoff"; targetAgentSlug: string; payload: Record<string, unknown> };

export interface FlowRunOutput {
  events: RuntimeEvent[];
  effectiveUserMessage?: string;
  orchestratorState?: OrchestratorState;
  evals?: RunEval[];
  userFacingMessage?: string;
}

// ---------------------------------------------------------------------------
// AgentSpec — in-memory representation used by the runtime
// ---------------------------------------------------------------------------

export interface AgentSpec {
  definitionId: string;
  name: string;
  slug: string;
  instructions: string;
  tools: Tool<AgentRunContext>[];
  model: string;
  modelSettings?: import("@openai/agents-core/model").ModelSettings;
  outputSchema?: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// AgentRunContext — passed to @openai/agents tools and the LLM runner.
// ---------------------------------------------------------------------------

export interface AgentRunContext {
  runId: string;
  triggeredBy: string;
  guardrailLlm?: import("openai").OpenAI;
}

// ---------------------------------------------------------------------------
// Display metadata
// ---------------------------------------------------------------------------

export interface DisplayMeta {
  nodeId: string;
  name: string;
  color: string | null;
  side: "left" | "right";
}

export interface AgentChatMessage {
  content: string;
  /** Optional second line (e.g. translation) when structured output uses message roles. */
  secondaryContent?: string;
  structuredContent?: AgentStructuredMessageContent;
  nodeId?: string;
  displayName?: string;
  displayColor?: string;
  displaySide?: "left" | "right";
}

export type ConversationMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; meta?: { nodeId: string; label?: string } };
