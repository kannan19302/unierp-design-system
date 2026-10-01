import { useEffect, useId, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Activity, ChartNoAxesCombined } from "lucide-react";
import { AppShell, type PlatformShellProps } from "./app-shell";
import { SidebarReference } from "../../../storybook/fixtures/sidebar-reference";
import { TopNavReference } from "../../../storybook/fixtures/topnav-reference";
import demo from "./app-shell.demo.module.css";

const meta: Meta<typeof AppShell> = {
  title: "Shells/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AppShell>;

const shellProps: Omit<PlatformShellProps, "children"> = {
  platformName: "UniERP",
  title: "Dashboard",
  headerPlacement: "workspace",
  user: { name: "John Doe", email: "john@unierp.example" },
  tenant: { id: "unierp", name: "UniERP" },
  environmentLabel: "Enterprise",
  topNav: <TopNavReference />,
};

const metrics = [
  { label: "Open work orders", value: "12", note: "4 due this week" },
  { label: "Items to review", value: "8", note: "Across 2 locations" },
  { label: "Active locations", value: "3", note: "Sample organization" },
  { label: "Completed today", value: "6", note: "Example activity" },
];
const activity = [
  { name: "Review receiving checklist", owner: "Maya Chen", location: "North warehouse", state: "In review" },
  { name: "Reconcile stock count", owner: "Jordan Lee", location: "Central warehouse", state: "Open" },
  { name: "Prepare service report", owner: "Daniel Ross", location: "Service operations", state: "Ready" },
];

type WorkItem = (typeof activity)[number];

function DashboardHome({ title, selectedWorkItem, onSelectWorkItem, firstWorkItemRef, inspectorId }: {
  title: string;
  selectedWorkItem?: WorkItem;
  onSelectWorkItem?: (item: WorkItem, trigger: HTMLButtonElement) => void;
  firstWorkItemRef?: (element: HTMLButtonElement | null) => void;
  inspectorId?: string;
}) {
  return <div id="overview" className={demo.workspace}>
    <div className={demo.intro}><div><p className={demo.eyebrow}>Example workspace · sample data</p><h1>{title}</h1><p>Here is the work that needs attention across UniERP.</p></div><span className={demo.dateTag}>Today’s overview</span></div>
    <div className={demo.metrics} aria-label="Example summary metrics">{metrics.map((item) => <section key={item.label} className={demo.metric}><h2>{item.label}</h2><strong>{item.value}</strong><p>{item.note}</p></section>)}</div>
    <div className={demo.contentGrid}>
      <section id="recent-work" className={demo.activityPanel}><div className={demo.sectionHeading}><div><h2>Recent work</h2><p>Illustrative records for the shell preview</p></div><Activity size={18} aria-hidden="true" /></div><ul className={demo.activityList} aria-label="Illustrative work items">{activity.map((item, index) => <li key={item.name}>{onSelectWorkItem ? <button ref={index === 0 ? firstWorkItemRef : undefined} type="button" className={demo.activityButton} aria-expanded={selectedWorkItem?.name === item.name} aria-controls={inspectorId} onClick={(event) => onSelectWorkItem(item, event.currentTarget)}><span><strong>{item.name}</strong><span>{item.owner}</span></span><span className={demo.status}>{item.state}</span></button> : <div className={demo.activityButton}><span><strong>{item.name}</strong><span>{item.owner}</span></span><span className={demo.status}>{item.state}</span></div>}</li>)}</ul></section>
      <section id="reports" className={demo.chartSlot}><ChartNoAxesCombined size={24} aria-hidden="true" /><h2>Chart area</h2><p>Place a consumer supplied chart here.</p></section>
    </div>
  </div>;
}

function DetailPanel({ id, item, onClose }: { id: string; item: WorkItem; onClose: () => void }) {
  return <div id={id} className={demo.detailPanel}>
    <div className={demo.detailPanelHeader}><h2>Selected work item</h2><button type="button" className={demo.detailClose} onClick={onClose}>Close details</button></div>
    <p className={demo.eyebrow}>Illustrative record</p><h3>{item.name}</h3><p>Context supplied by the application for the selected work item.</p>
    <dl><dt>Owner</dt><dd>{item.owner}</dd><dt>Location</dt><dd>{item.location}</dd><dt>Status</dt><dd>{item.state}</dd></dl>
    <p className={demo.detailNote}>Illustrative content. No record is loaded or changed.</p>
  </div>;
}

function AppShell5Story() {
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | undefined>(activity[0]);
  const selectionTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstWorkItemRef = useRef<HTMLButtonElement | null>(null);
  const inspectorId = useId();

  useEffect(() => {
    if (!selectionTriggerRef.current) selectionTriggerRef.current = firstWorkItemRef.current;
  }, []);

  const selectWorkItem = (item: WorkItem, trigger: HTMLButtonElement) => {
    selectionTriggerRef.current = trigger;
    setSelectedWorkItem(item);
  };
  const closeDetails = () => {
    setSelectedWorkItem(undefined);
    window.requestAnimationFrame(() => selectionTriggerRef.current?.focus());
  };

  return <AppShell
    {...shellProps}
    variant="dual"
    sidebar={<SidebarReference navigationOnly />}
    inspector={selectedWorkItem ? <DetailPanel id={inspectorId} item={selectedWorkItem} onClose={closeDetails} /> : undefined}
    inspectorLabel="Selected work item details"
  >
    <DashboardHome title="Work order overview" selectedWorkItem={selectedWorkItem} onSelectWorkItem={selectWorkItem} firstWorkItemRef={(element) => { firstWorkItemRef.current = element; }} inspectorId={inspectorId} />
  </AppShell>;
}

export const AppShell1: Story = { name: "AppShell-1", render: () => <AppShell {...shellProps} variant="standard" sidebar={<SidebarReference navigationOnly />}><DashboardHome title="Good morning, Alex" /></AppShell> };
export const Default: Story = { ...AppShell1, name: "Default" };
export const AppShell2: Story = { name: "AppShell-2", render: () => <AppShell {...shellProps} variant="inset" sidebar={<SidebarReference navigationOnly />}><DashboardHome title="Workspace overview" /></AppShell> };
export const AppShell3: Story = { name: "AppShell-3", render: () => <AppShell {...shellProps} variant="floating" sidebar={<SidebarReference navigationOnly />} topNav={<TopNavReference withItems />}><DashboardHome title="Operations home" /></AppShell> };
export const AppShell4: Story = { name: "AppShell-4", render: () => <AppShell {...shellProps} variant="topbar" topNav={<TopNavReference title="UniERP" breadcrumbs={[{ key: "business-suite", label: "Business Suite", href: "#overview" }, { key: "operations", label: "Operations" }]} withItems />} topNavigation={<nav aria-label="Workspace views" className={demo.workspaceNav}><a href="#overview" aria-current="page">Overview</a><a href="#recent-work">Recent work</a><a href="#reports">Reports</a></nav>}><DashboardHome title="Operations workspace" /></AppShell> };
export const AppShell5: Story = { name: "AppShell-5", render: () => <AppShell5Story /> };
