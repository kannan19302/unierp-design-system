import type { Meta, StoryObj } from "@storybook/react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Boxes, CalendarDays,
  ChartNoAxesCombined, ClipboardList, PackageCheck, Truck, Users,
} from "lucide-react";
import { SidebarReference } from "../../../storybook/fixtures/sidebar-reference";
import { TopNavReference } from "../../../storybook/fixtures/topnav-reference";
import { DashboardShell, type DashboardShellProps } from "./dashboard-shell";
import demo from "./dashboard-shell.demo.module.css";

const meta: Meta<typeof DashboardShell> = {
  title: "Shells/DashboardShell",
  component: DashboardShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DashboardShell>;

const common: Omit<DashboardShellProps, "variant"> = {
  platformName: "UniERP",
  title: "Dashboard",
  headerPlacement: "workspace",
  user: { name: "John Doe", email: "john@unierp.example" },
  tenant: { id: "unierp", name: "UniERP" },
  environmentLabel: "Enterprise",
  topNav: <TopNavReference />,
  sidebar: <SidebarReference navigationOnly />,
};

function Intro({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className={demo.intro}>
    <div><p className={demo.eyebrow}>Business overview <span aria-hidden="true">/</span> Sample data</p><h1>{title}</h1><p className={demo.subtle}>{subtitle}</p></div>
    <span className={demo.period}><CalendarDays size={15} aria-hidden="true" /> September 2026</span>
  </div>;
}

const metricData = [
  { label: "Shipped orders", value: "1,248", change: "+18.2%", direction: "up", note: "versus last month", icon: PackageCheck },
  { label: "Damaged returns", value: "28", change: "−8.7%", direction: "down", note: "versus last month", icon: ArrowDownRight },
  { label: "Missed delivery slots", value: "7", change: "+4.3%", direction: "up", note: "versus last month", icon: Truck },
  { label: "Active customers", value: "864", change: "+6.4%", direction: "up", note: "versus last month", icon: Users },
] as const;

function Metrics({ count = 3 }: { count?: 3 | 4 }) {
  return <>{metricData.slice(0, count).map(({ label, value, change, direction, note, icon: Icon }) =>
    <section key={label} className={demo.metric} aria-label={`${label}: ${value}, ${change} ${note}`}>
      <div className={demo.metricTop}><span>{label}</span><Icon size={17} aria-hidden="true" /></div>
      <div className={demo.metricValue}>{value}</div>
      <div className={demo.metricBottom}><span className={direction === "down" ? demo.positive : demo.neutral}>{direction === "down" ? <ArrowDownRight size={13} aria-hidden="true" /> : <ArrowUpRight size={13} aria-hidden="true" />}{change}</span><span>{note}</span></div>
    </section>)}</>;
}

function PanelTitle({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: typeof Activity }) {
  return <div className={demo.panelTitle}><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{Icon && <Icon size={18} aria-hidden="true" />}</div>;
}

function ProductInsight() {
  return <section className={demo.panel}><PanelTitle title="Product insight" subtitle="Orders and reach this month" icon={Boxes} />
    <div className={demo.insightStats}><div><strong>21,153</strong><span>Products reached</span></div><div><strong>2,123</strong><span>Orders placed</span></div></div>
    <div className={demo.miniBars} aria-hidden="true">{[32,48,40,56,69,52,75,62,81,72,88,100].map((height, index) => <span key={index} style={{blockSize:`${height}%`}} />)}</div>
    <p className={demo.chartAlternative}>Illustrative monthly order activity rises across twelve periods.</p>
  </section>;
}

function Earnings() {
  return <section className={demo.panel}><PanelTitle title="Total earnings" subtitle="Illustrative financial snapshot" icon={Activity} />
    <div className={demo.earningValue}>$48,295 <span className={demo.positive}>+12.6% this month</span></div>
    <svg className={demo.lineChart} viewBox="0 0 480 118" preserveAspectRatio="none" role="img" aria-label="Example earnings trend rises overall with a mid-period dip">
      <defs><linearGradient id="dashboardEarningsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity=".2"/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/></linearGradient></defs>
      <path d="M0 96 C35 89 45 70 78 74 S135 96 168 65 S225 54 253 69 S310 54 342 42 S402 58 480 12 L480 118 L0 118 Z" fill="url(#dashboardEarningsFill)" />
      <path d="M0 96 C35 89 45 70 78 74 S135 96 168 65 S225 54 253 69 S310 54 342 42 S402 58 480 12" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
    </svg>
    <div className={demo.months} aria-hidden="true"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div>
  </section>;
}

function SalesMetrics() {
  return <section className={demo.panel}><PanelTitle title="Sales metrics" subtitle="A summary of sample commercial activity" icon={ChartNoAxesCombined} />
    <div className={demo.salesGrid}>{[
      ["Gross sales", "$11,548", "+12.4%"], ["Orders", "2,123", "+8.8%"],
      ["Average order", "$54.39", "+3.1%"], ["New buyers", "243", "+6.2%"],
    ].map(([label, value, trend]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{trend} versus prior period</small></div>)}</div>
  </section>;
}

function RevenueGoal() {
  return <section className={demo.panel}><PanelTitle title="Revenue goal" subtitle="Current month progress" />
    <div className={demo.goalBody}><div className={demo.donut} role="img" aria-label="Example revenue goal 72 percent complete"><div><strong>72%</strong><span>achieved</span></div></div><div className={demo.goalText}><strong>$72,000</strong><span>of $100,000 sample goal</span><p>On pace for this month</p></div></div>
  </section>;
}

function CohortAnalysis() {
  return <section className={demo.panel}><PanelTitle title="Cohort analysis" subtitle="Sample customer activity" icon={Users} />
    <div className={demo.cohortRows}>{[["New", "78%", 78], ["Returning", "62%", 62], ["Loyal", "89%", 89]].map(([label, value, width]) => <div key={label}><span>{label}</span><div className={demo.track}><span style={{inlineSize:`${width}%`}} /></div><strong>{value}</strong></div>)}</div>
  </section>;
}

const transactions = [
  ["ORD-1042", "Harbor Supply", "Sep 24, 2026", "$1,248.00", "Completed"],
  ["ORD-1041", "Willow & Co.", "Sep 23, 2026", "$860.50", "Processing"],
  ["ORD-1040", "Summit Retail", "Sep 22, 2026", "$2,134.00", "Completed"],
  ["ORD-1039", "Lakeside Goods", "Sep 21, 2026", "$375.25", "Pending"],
] as const;

function Transactions() {
  return <section className={demo.panel}><PanelTitle title="Recent transactions" subtitle="Illustrative orders for the dashboard preview" icon={ClipboardList} />
    <div className={demo.tableScroll} tabIndex={0} role="region" aria-label="Recent transactions table"><table><thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Date</th><th scope="col">Amount</th><th scope="col">Status</th></tr></thead><tbody>{transactions.map(([order, customer, date, amount, status]) => <tr key={order}><th scope="row">{order}</th><td>{customer}</td><td>{date}</td><td>{amount}</td><td><span className={status === "Completed" ? demo.statusDone : demo.statusOpen}>{status}</span></td></tr>)}</tbody></table></div>
    <p className={demo.tableFoot}>Showing 4 sample transactions</p>
  </section>;
}

function Example({ variant, title, subtitle }: { variant: NonNullable<DashboardShellProps["variant"]>; title: string; subtitle: string }) {
  const fourMetrics = variant === "analytics" || variant === "operations";
  const analytics = variant === "analytics";
  return <DashboardShell {...common} variant={variant}
    intro={<Intro title={title} subtitle={subtitle} />}
    metrics={<Metrics count={fourMetrics ? 4 : 3} />}
    primary={analytics ? <><SalesMetrics /><Earnings /></> : <><ProductInsight /><Earnings /></>}
    secondary={analytics ? <><RevenueGoal /><CohortAnalysis /></> : <><SalesMetrics /><RevenueGoal /><CohortAnalysis /></>}
    records={<Transactions />}
    footer={<p className={demo.footer}>UniERP · Storybook sample data · No live records</p>}
  />;
}

export const DashboardShell1: Story = { name: "DashboardShell-1", render: () => <Example variant="standard" title="Dashboard overview" subtitle="A clear view of orders, revenue, and customer activity." /> };
export const Default: Story = { ...DashboardShell1, name: "Default" };
export const DashboardShell2: Story = { name: "DashboardShell-2", render: () => <Example variant="inset" title="Executive overview" subtitle="A calm, inset workspace for business performance." /> };
export const DashboardShell3: Story = { name: "DashboardShell-3", render: () => <Example variant="floating" title="Commerce insights" subtitle="A floating workspace for cross-team reporting." /> };
export const DashboardShell4: Story = { name: "DashboardShell-4", render: () => <Example variant="analytics" title="Analytics center" subtitle="A chart-led view with room for four headline metrics." /> };
export const DashboardShell5: Story = { name: "DashboardShell-5", render: () => <Example variant="operations" title="Operations dashboard" subtitle="Recent transactions first, with supporting metrics and analysis." /> };
