import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../data-display/card";
import { Button } from "../primitives/button";
import { FormField, Input } from "../inputs/form-control";
import { Search, Plus, Check, DEFAULT_ICON_STROKE_WIDTH } from "../icons";
import styles from "./foundations.module.css";

const meta: Meta<typeof Card> = {
  title: "Foundations/Business foundations",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Workbench: Story = {
  render: () => (
    <main className={styles.workbench} aria-label="Strata business foundations">
      <header className={styles.header}>
        <p className={styles.context}>Acme · Finance · September 2026</p>
        <h1 className={styles.title}>Accounts receivable</h1>
        <p className={styles.description}>Review outstanding invoices and follow up on payments.</p>
      </header>
      <div className={styles.actions}>
        <Button leftIcon={<Plus size={18} strokeWidth={DEFAULT_ICON_STROKE_WIDTH} aria-hidden="true" />}>Create invoice</Button>
        <Button variant="outline">Export</Button>
        <Button variant="ghost" disabled>Send reminders</Button>
      </div>
      <section className={styles.summary} aria-label="Invoice summary">
        <div><p>Outstanding balance</p><strong className={styles.metric}>₹1,24,850.00</strong><p className={styles.description}>Across 24 invoices · INR</p></div>
        <div><p>Collected this month</p><strong className={styles.metric}>₹3,86,420.00</strong><p className={styles.success}><Check size={16} aria-hidden="true" /> Reconciled</p></div>
      </section>
      <section className={styles.surface} aria-labelledby="foundation-invoices">
        <h2 id="foundation-invoices" className={styles.sectionTitle}>Open invoices</h2>
        <FormField label="Search invoices" htmlFor="foundation-search" hint="Search by invoice number or customer.">
          <Input id="foundation-search" placeholder="Invoice number or customer" />
        </FormField>
        <div className={styles.result}><Search size={18} strokeWidth={DEFAULT_ICON_STROKE_WIDTH} aria-hidden="true" /><span>Invoice INV-2026-024</span><span className={styles.numeric}>₹24,600.00</span></div>
        <p className={styles.description}>Synthetic preview data. Actions demonstrate appearance only.</p>
      </section>
      <section className={styles.geometry} aria-label="Default radius scale">
        {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
          <div key={size} className={styles.radius} style={{ borderRadius: `var(--radius-${size})` }}>{size}</div>
        ))}
      </section>
      <footer className={styles.description}>Inter body and headings · Lucide icons · Default radius · Strata colours</footer>
    </main>
  ),
};
