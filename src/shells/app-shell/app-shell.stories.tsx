import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Activity, Bell, Boxes, ChartNoAxesCombined, ClipboardList, FileText, House, Search, Settings2 } from "lucide-react";
import { AppShell, type PlatformShellProps } from "./app-shell";
import demo from "./app-shell.demo.module.css";

const meta: Meta<typeof AppShell> = {
  title: "Shells/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AppShell>;

const navItems = [
  { label: "Overview", icon: House },
  { label: "Work orders", icon: ClipboardList },
  { label: "Inventory", icon: Boxes },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Documents", icon: FileText },
];

function SideNavigation() {
  const [active, setActive] = useState("Overview");
  return <nav aria-label="Example workspace navigation" className={demo.sidebar}>
    <div className={demo.sidebarHeading}>Northstar Operations</div>
    <div className={demo.groupLabel}>Workspace</div>
    <ul className={demo.navList}>{navItems.map(({ label, icon: Icon }) => <li key={label}>
      <button type="button" className={demo.navItem} aria-current={active === label ? "page" : undefined} onClick={() => setActive(label)}>
        <Icon size={16} aria-hidden="true" /><span>{label}</span>{label === "Work orders" && <span className={demo.count}>12</span>}
      </button>
    </li>)}</ul>
    <div className={demo.sidebarFooter}><button type="button" className={demo.navItem} aria-current={active === "Settings" ? "page" : undefined} onClick={() => setActive("Settings")}><Settings2 size={16} aria-hidden="true" />Settings</button><p>Example navigation · no live data</p></div>
  </nav>;
}

function TopNavigation() {
  const [active, setActive] = useState("Overview");
  return <nav aria-label="Example application navigation" className={demo.topNav}>{navItems.map(({ label }) =>
    <button key={label} type="button" aria-current={active === label ? "page" : undefined} onClick={() => setActive(label)}>{label}</button>
  )}</nav>;
}

const shellProps: Omit<PlatformShellProps, "children"> = {
  platformName: "Business Suite",
  user: { name: "Avery Stone", email: "avery@example.test" },
  tenant: { id: "northstar", name: "Northstar Operations" },
  environmentLabel: "Demo",
  breadcrumbs: [{ key: "workspace", label: "Workspace", href: "#workspace" }, { key: "overview", label: "Overview" }],
  searchSlot: <label className={demo.search}><Search size={15} aria-hidden="true" /><span className={demo.srOnly}>Search this example workspace</span><input type="search" placeholder="Search workspace" /></label>,
  headerActions: <button type="button" className={demo.iconAction} aria-label="Example notifications" title="Example notifications"><Bell size={17} /></button>,
};

const metrics = [
  { label: "Open work orders", value: "12", note: "4 due this week" },
  { label: "Items to review", value: "8", note: "Across 2 locations" },
  { label: "Active locations", value: "3", note: "Sample organization" },
  { label: "Completed today", value: "6", note: "Example activity" },
];
const activity = [
  { name: "Review receiving checklist", owner: "Maya Chen", state: "In review" },
  { name: "Reconcile stock count", owner: "Jordan Lee", state: "Open" },
  { name: "Prepare service report", owner: "Daniel Ross", state: "Ready" },
];

function DashboardHome({ title }: { title: string }) {
  return <div className={demo.workspace}>
    <div className={demo.intro}><div><p className={demo.eyebrow}>Example workspace · sample data</p><h1>{title}</h1><p>Here is the work that needs attention across Northstar Operations.</p></div><span className={demo.dateTag}>Today’s overview</span></div>
    <div className={demo.metrics} aria-label="Example summary metrics">{metrics.map((item) => <section key={item.label} className={demo.metric}><h2>{item.label}</h2><strong>{item.value}</strong><p>{item.note}</p></section>)}</div>
    <div className={demo.contentGrid}>
      <section className={demo.activityPanel}><div className={demo.sectionHeading}><div><h2>Recent work</h2><p>Illustrative records for the shell preview</p></div><Activity size={18} aria-hidden="true" /></div><ul className={demo.activityList}>{activity.map((item) => <li key={item.name}><div><strong>{item.name}</strong><span>{item.owner}</span></div><span className={demo.status}>{item.state}</span></li>)}</ul></section>
      <section className={demo.chartSlot}><ChartNoAxesCombined size={24} aria-hidden="true" /><h2>Chart area</h2><p>Place a consumer supplied chart here.</p></section>
    </div>
  </div>;
}

function DetailPanel() {
  return <div className={demo.detailPanel}><p className={demo.eyebrow}>Example details</p><h2>Receiving checklist</h2><p>Use this panel for selected record context and actions supplied by the application.</p><dl><dt>Owner</dt><dd>Maya Chen</dd><dt>Location</dt><dd>North warehouse</dd><dt>Status</dt><dd>In review</dd></dl><p className={demo.detailNote}>Illustrative content. No record is loaded or changed.</p></div>;
}

export const AppShell1: Story = { name: "AppShell-1", render: () => <AppShell {...shellProps} variant="standard" sidebar={<SideNavigation />}><DashboardHome title="Good morning, Avery" /></AppShell> };
export const AppShell2: Story = { name: "AppShell-2", render: () => <AppShell {...shellProps} variant="inset" sidebar={<SideNavigation />}><DashboardHome title="Workspace overview" /></AppShell> };
export const AppShell3: Story = { name: "AppShell-3", render: () => <AppShell {...shellProps} variant="floating" sidebar={<SideNavigation />}><DashboardHome title="Operations home" /></AppShell> };
export const AppShell4: Story = { name: "AppShell-4", render: () => <AppShell {...shellProps} variant="topbar" topNavigation={<TopNavigation />}><DashboardHome title="Operations workspace" /></AppShell> };
export const AppShell5: Story = { name: "AppShell-5", render: () => <AppShell {...shellProps} variant="dual" sidebar={<SideNavigation />} inspector={<DetailPanel />} inspectorLabel="Example selected record details"><DashboardHome title="Work order overview" /></AppShell> };
