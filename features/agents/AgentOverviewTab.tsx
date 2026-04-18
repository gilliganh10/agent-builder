"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Pencil, Trash2, Globe, Link2, Copy, Check, CheckCircle2, CircleDashed, GitBranch, PlayCircle, Database, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAgentWorkspace } from "./workspace/AgentWorkspaceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewerMode } from "@/lib/viewer-mode-context";
import { hasPermission } from "@/lib/permissions";
import { policyFromModel, MODEL_POLICIES } from "@/lib/agents/model-policy";
import type { AgentDefinition, AgentVersion, AgentMode } from "@/db/agents/schema";
import { AgentFormDialog } from "./AgentFormDialog";
import { AgentDeleteDialog } from "./AgentDeleteDialog";
import { useTenant } from "@/lib/tenant-context";
import { getPublicChatSettings } from "@/lib/agents/public-chat";
import { canEditAgentDefinition, isEditableBuiltInAgent } from "@/lib/agents/agent-visibility";

interface AgentOverviewTabProps {
  agent: AgentDefinition;
  latestVersion?: AgentVersion;
}

export function AgentOverviewTab({ agent, latestVersion }: AgentOverviewTabProps) {
  const { permissions } = useViewerMode();
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const { switchTab } = useAgentWorkspace();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savingPublicChatSettings, setSavingPublicChatSettings] = useState(false);
  const [showStateSidebar, setShowStateSidebar] = useState(
    getPublicChatSettings(agent.meta).showStateSidebar
  );

  const isBuiltIn = agent.kind === "built_in";
  const canEdit = canEditAgentDefinition(agent) && hasPermission(permissions, "agents.create");
  const canDelete = !isBuiltIn && hasPermission(permissions, "agents.manage");
  const canPublish = hasPermission(permissions, "agents.manage");

  const policy = policyFromModel(agent.defaultModel);
  const policyConfig = MODEL_POLICIES[policy];

  async function handlePublicChatSidebarToggle(checked: boolean) {
    const previous = showStateSidebar;
    setShowStateSidebar(checked);
    setSavingPublicChatSettings(true);

    try {
      const res = await fetch(`/api/agents/${agent.slug}/publish/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showStateSidebar: checked }),
      });

      if (!res.ok) {
        setShowStateSidebar(previous);
      } else {
        router.refresh();
      }
    } catch {
      setShowStateSidebar(previous);
    } finally {
      setSavingPublicChatSettings(false);
    }
  }

  const hasInstructions = !!agent.instructions?.trim();
  const hasFlow = !!agent.flowDefinition?.nodes?.length;
  const isPublished = !!agent.publishToken;

  const readinessItems = [
    { label: "Instructions configured", done: hasInstructions },
    { label: "Plan or graph builder defined", done: hasFlow },
    { label: "Published for external access", done: isPublished },
  ];

  return (
    <div className="space-y-6">
      {/* Readiness banner */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Readiness</p>
              <div className="flex flex-wrap gap-3">
                {readinessItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs">
                    {item.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <CircleDashed className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => switchTab("builder")}>
                <GitBranch className="mr-1.5 h-3.5 w-3.5" />
                Builder
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => switchTab("runs")}>
                <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                Runs
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => switchTab("dataset")}>
                <Database className="mr-1.5 h-3.5 w-3.5" />
                Dataset
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => switchTab("triggers")}>
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Triggers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isBuiltIn && !isEditableBuiltInAgent(agent) && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" />
          This is a built-in agent and cannot be edited or deleted.
        </div>
      )}

      {isEditableBuiltInAgent(agent) && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" />
          This is a seeded built-in agent. You can edit it, but product reseeds may update its defaults later.
        </div>
      )}

      <div className="flex items-center gap-2">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Slug" value={agent.slug} />
            <Row label="Kind">
              <Badge variant={isBuiltIn ? "secondary" : "default"}>
                {isBuiltIn ? "Built-in" : "Custom"}
              </Badge>
            </Row>
            <Row label="Model">
              <span>
                {policyConfig.label}{" "}
                <span className="text-muted-foreground">
                  ({agent.defaultModel})
                </span>
              </span>
            </Row>
            <Row label="Mode">
              <Badge variant={agent.mode === "conversational" ? "default" : "secondary"}>
                {agent.mode === "conversational" ? "Conversational" : "Stateless"}
              </Badge>
            </Row>
            {latestVersion && (
              <Row label="Version" value={`v${latestVersion.version}`} />
            )}
            <Row
              label="Created"
              value={new Date(agent.createdAt).toLocaleDateString()}
            />
            <Row
              label="Updated"
              value={new Date(agent.updatedAt).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Allowed Tools ({agent.allowedTools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agent.allowedTools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tools configured.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {agent.allowedTools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs font-mono">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Runtime Mode + Publishing */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Runtime Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={agent.mode}
              onValueChange={async (value: AgentMode) => {
                await fetch(`/api/agents/${agent.slug}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mode: value, changelog: `Changed mode to ${value}` }),
                });
                router.refresh();
              }}
              disabled={!canEdit}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stateless">Stateless</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {agent.mode === "conversational"
                ? "Multi-turn conversation with persisted context. Configure per-node persistence in the Flow tab."
                : "Single-shot execution. Each run is independent."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Publishing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agent.publishToken ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 text-white text-[10px]">Published</Badge>
                  {agent.publishedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(agent.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded border bg-muted px-2 py-1 text-xs font-mono truncate">
                    /chat/{agent.publishToken}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                    onClick={async () => {
                      const url = `${window.location.origin}/chat/${agent.publishToken}`;
                      await navigator.clipboard.writeText(url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                {canPublish && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={publishing}
                    onClick={async () => {
                      setPublishing(true);
                      await fetch(`/api/agents/${agent.slug}/publish`, { method: "DELETE" });
                      setPublishing(false);
                      router.refresh();
                    }}
                  >
                    Unpublish
                  </Button>
                )}
                <Separator />
                <div className="flex items-start justify-between gap-4 rounded-md border border-border/70 bg-muted/30 px-3 py-3">
                  <div className="space-y-1">
                    <Label htmlFor="public-state-sidebar" className="text-sm font-medium text-[#222E50]">
                      Show state sidebar in public chat
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show live variables and goals in the published chat experience.
                    </p>
                  </div>
                  <Switch
                    id="public-state-sidebar"
                    checked={showStateSidebar}
                    onCheckedChange={handlePublicChatSidebarToggle}
                    disabled={!canPublish || savingPublicChatSettings}
                    className="data-[state=checked]:bg-[#222E50]"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Publish this agent to get a public chat URL anyone can use.
                </p>
                <div className="flex items-start justify-between gap-4 rounded-md border border-border/70 bg-muted/30 px-3 py-3">
                  <div className="space-y-1">
                    <Label htmlFor="draft-public-state-sidebar" className="text-sm font-medium text-[#222E50]">
                      Show state sidebar in public chat
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Configure the sidebar now. The setting will apply as soon as the agent is published.
                    </p>
                  </div>
                  <Switch
                    id="draft-public-state-sidebar"
                    checked={showStateSidebar}
                    onCheckedChange={handlePublicChatSidebarToggle}
                    disabled={!canPublish || savingPublicChatSettings}
                    className="data-[state=checked]:bg-[#222E50]"
                  />
                </div>
                {canPublish && (
                  <Button
                    size="sm"
                    disabled={publishing}
                    className="bg-[#222E50] hover:bg-[#222E50]/90"
                    onClick={async () => {
                      setPublishing(true);
                      await fetch(`/api/agents/${agent.slug}/publish`, { method: "POST" });
                      setPublishing(false);
                      router.refresh();
                    }}
                  >
                    <Link2 className="mr-1.5 h-3.5 w-3.5" />
                    Publish
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            System Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs font-mono leading-relaxed max-h-96 overflow-y-auto">
            {agent.instructions}
          </pre>
        </CardContent>
      </Card>

      {canEdit && (
        <AgentFormDialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) router.refresh();
          }}
          agent={agent}
        />
      )}

      {canDelete && (
        <AgentDeleteDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) router.refresh();
          }}
          agent={agent}
        />
      )}
    </div>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {children ?? <span>{value}</span>}
    </div>
  );
}
