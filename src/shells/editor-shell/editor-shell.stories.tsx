import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Lock,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  EditorialShell,
  EditorialBand,
  Eyebrow,
  HeroTitle,
  Lede,
  BandTitle,
} from "./editor-shell";

const meta: Meta<typeof EditorialShell> = {
  title: "Shells/EditorialShell",
  component: EditorialShell,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
  },
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditorialShell>;

/**
 * 1. Default Flagship Enterprise Editorial Shell (Marketing & Public Portal)
 * The open-source shadcn landing-page template is the structural reference for
 * responsive header, section and footer sequencing. Strata owns the tokens,
 * landmarks and keyboard behavior shown here.
 */
export const Default: Story = {
  name: "V1 enterprise editorial benchmark",
  render: () => (
    <EditorialShell
      brand={
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8, 32px)", flexWrap: "wrap", minInlineSize: 0, maxInlineSize: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div
              style={{
                inlineSize: "32px",
                blockSize: "32px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "var(--text-xs)",
              }}
            >
              UE
            </div>
            <strong style={{ fontSize: "var(--text-sm)", letterSpacing: "-0.01em" }}>UniERP</strong>
          </div>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-6, 24px)",
              flexWrap: "wrap",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
            }}
          >
            <a href="#platform" style={{ color: "var(--color-text)", textDecoration: "none" }}>
              Platform
            </a>
            <a href="#solutions" style={{ color: "inherit", textDecoration: "none" }}>
              Solutions
            </a>
            <a href="#governance" style={{ color: "inherit", textDecoration: "none" }}>
              Governance
            </a>
            <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>
              Pricing
            </a>
            <a href="#docs" style={{ color: "inherit", textDecoration: "none" }}>
              Docs
            </a>
          </nav>
        </div>
      }
      actions={
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap", minInlineSize: 0 }}>
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
              padding: "var(--space-2) var(--space-3)",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              padding: "var(--space-2) var(--space-4)",
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1-5)",
            }}
          >
            <span>Deploy Sovereign Cloud</span>
            <ArrowRight size={13} />
          </button>
        </div>
      }
      footer={
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-8)",
              fontSize: "var(--text-xs)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <div
                  style={{
                    inlineSize: "24px",
                    blockSize: "24px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-primary)",
                    color: "var(--color-primary-text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "10px",
                  }}
                >
                  UE
                </div>
                <strong style={{ fontSize: "var(--text-sm)" }}>UniERP Platform</strong>
              </div>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                Tenant-isolated enterprise resource planning engineered for auditable sovereign cloud operations.
              </p>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: "var(--space-3)" }}>PLATFORM SUITES</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)", color: "var(--color-text-secondary)" }}>
                <li>General Ledger & Books</li>
                <li>Accounts Receivable & AP</li>
                <li>Supply Chain Logistics</li>
                <li>Developer API Extensions</li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: "var(--space-3)" }}>GOVERNANCE & TRUST</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)", color: "var(--color-text-secondary)" }}>
                <li>Security documentation</li>
                <li>Access controls</li>
                <li>Tenant isolation design</li>
                <li>Evidence requests</li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: "var(--space-3)" }}>STATUS & LEGAL</h5>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success-text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
                <span style={{ inlineSize: "8px", blockSize: "8px", borderRadius: "50%", background: "#10b981" }} />
                <span>Example status indicator</span>
              </div>
              <p style={{ color: "var(--color-text-secondary)" }}>Target Release: January 1, 2027</p>
            </div>
          </div>
          <div
            style={{
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "var(--text-2xs, 10px)",
              color: "var(--color-text-secondary)",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            <span>© 2026 UniERP Inc. All rights reserved. Sovereign Cloud Architecture.</span>
            <span>Privacy Policy • Terms of Service • Security Disclosures</span>
          </div>
        </div>
      }
    >
      {/* 1. Hero Horizon Band (Base Ground) */}
      <EditorialBand tone="base">
        <Eyebrow>UNIERP ENTERPRISE ARCHITECTURE V1.0</Eyebrow>
        <HeroTitle>The Autonomous Cloud ERP for Sovereign Enterprises</HeroTitle>
        <Lede>
          An example product narrative for a tenant-aware operations platform. Replace this copy with substantiated product claims before publishing.
        </Lede>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBlockStart: "var(--space-8)", flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              border: "none",
              borderRadius: "var(--radius-lg)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Sparkles size={16} />
            <span>Launch Live Interactive Tour</span>
          </button>
          <button
            type="button"
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--color-bg-elevated)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span>Architecture Whitepaper</span>
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Feature Mockup Card */}
        <div
          style={{
            marginBlockStart: "var(--space-12)",
            padding: "var(--space-6)",
            borderRadius: "var(--radius-2xl-marketing, 16px)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
              Audit workflow
            </span>
            <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 700 }}>Reviewable journal activity</h3>
            <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Present journal history and evidence links supplied by the owning product.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-success-text)", textTransform: "uppercase" }}>
              High-Throughput Runtime
            </span>
            <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 700 }}>Focused transaction workspaces</h3>
            <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Compose task-specific actions, record context, and relevant status in one workspace.
            </p>
          </div>
        </div>
      </EditorialBand>

      {/* 2. Editorial Split Band (Sunken Ground, 7/5 Asymmetric Measure) */}
      <EditorialBand tone="sunken" layout="editorial">
        <div>
          <Eyebrow>COMPLIANCE & GOVERNANCE</Eyebrow>
          <BandTitle>Governance information in context</BandTitle>
          <Lede>
            Show policy, review, and evidence information from the owning system. This Storybook content is illustrative and does not certify platform controls.
          </Lede>
          <div style={{ marginBlockStart: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)" }}>
              <ShieldCheck size={18} style={{ color: "var(--color-success-text)" }} />
              <span>Migration review guidance</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)" }}>
              <Lock size={18} style={{ color: "var(--color-primary)" }} />
              <span>Key-management documentation</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)" }}>
              <Server size={18} style={{ color: "var(--color-primary)" }} />
              <span>Region and residency information</span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "var(--space-6)",
            borderRadius: "var(--radius-xl, 14px)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 700, marginBottom: "var(--space-3)" }}>
            Example evidence checklist
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
              <span>Tenant policy:</span>
              <strong style={{ color: "var(--color-success-text)" }}>Review required</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
              <span>Service role:</span>
              <strong style={{ color: "var(--color-success-text)" }}>Evidence required</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
              <span>Published contract:</span>
              <strong style={{ color: "var(--color-primary)" }}>Review version</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
              <span>Accessibility:</span>
              <strong style={{ color: "var(--color-success-text)" }}>Verify separately</strong>
            </div>
          </div>
        </div>
      </EditorialBand>

      {/* 3. Ink Horizon Band (Dark Inverted Ground) */}
      <EditorialBand tone="ink">
        <Eyebrow style={{ color: "var(--color-primary-light, #93c5fd)" }}>DEVELOPER PLATFORM EXTENSIONS</Eyebrow>
        <HeroTitle style={{ color: "inherit" }}>Extension capabilities with clear scope</HeroTitle>
        <Lede style={{ color: "rgba(255, 255, 255, 0.8)" }}>
          Describe declared capabilities, tenant scope, resource budgets, and revocation using evidence from the owning platform.
        </Lede>

        <div
          style={{
            marginBlockStart: "var(--space-8)",
            padding: "var(--space-6)",
            borderRadius: "var(--radius-xl)",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "var(--text-xs)",
            lineHeight: 1.6,
          }}
        >
          <span>// Define tenant-scoped extension capabilities</span>
          <br />
          <span>export const</span> manifest = defineExtension({"{"}
          <br />
          &nbsp;&nbsp;id: <span>"payments.stripe.global"</span>,
          <br />
          &nbsp;&nbsp;capabilities: [<span>"ledger:read"</span>, <span>"payments:disburse"</span>],
          <br />
          &nbsp;&nbsp;isolation: <span>"wasm-sandbox-v1"</span>,
          <br />
          &nbsp;&nbsp;auditMode: <span>"atomic-outbox"</span>
          <br />
          {"}"});
        </div>
      </EditorialBand>

      {/* 4. Signal Horizon Band (Coral Subtle Ground) */}
      <EditorialBand tone="signal">
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
          <Eyebrow>DEPLOY SOVEREIGN ERP</Eyebrow>
          <BandTitle>Ready to Elevate Your Mission-Critical Enterprise?</BandTitle>
          <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "var(--text-base)", color: "var(--color-text-secondary)" }}>
            Join global enterprises deploying verified, tenant-isolated ERP platforms with deterministic assurance.
          </p>
          <button
            type="button"
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-3) var(--space-8)",
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              border: "none",
              borderRadius: "var(--radius-lg)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--shadow-md)",
            }}
          >
            Schedule Architecture Evaluation
          </button>
        </div>
      </EditorialBand>
    </EditorialShell>
  ),
};

/**
 * 2. Complete State Matrix Story: 4 Horizon Tones & Layouts
 */
export const StateMatrix: Story = {
  name: "State matrix: base, sunken, ink, signal tones",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>1. Base Tone Horizon</h4>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <EditorialBand tone="base">
            <HeroTitle>Base Tone Horizon</HeroTitle>
            <Lede>Clean default ground for primary introductory copy and hero headers.</Lede>
          </EditorialBand>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>2. Sunken Tone Horizon (Asymmetric 7/5 Editorial Layout)</h4>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <EditorialBand tone="sunken" layout="editorial">
            <div>
              <BandTitle>Asymmetric Editorial Layout</BandTitle>
              <Lede>7/5 measure splitting long-form copy from proof widgets.</Lede>
            </div>
            <div style={{ padding: "var(--space-4)", background: "var(--color-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
              Proof Widget
            </div>
          </EditorialBand>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>3. Ink Tone Horizon (Inverted Ground)</h4>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <EditorialBand tone="ink">
            <HeroTitle style={{ color: "inherit" }}>Ink Tone Horizon</HeroTitle>
            <Lede style={{ color: "rgba(255, 255, 255, 0.8)" }}>Deep inverted horizon for high-contrast technical or security callouts.</Lede>
          </EditorialBand>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>4. Signal Tone Horizon (Sanctioned Subtle Coral Ground)</h4>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <EditorialBand tone="signal">
            <BandTitle>Signal Tone Call-To-Action</BandTitle>
            <Lede>A restrained primary-tinted band for an important next step.</Lede>
          </EditorialBand>
        </div>
      </div>
    </div>
  ),
};

/**
 * 3. Right-To-Left (RTL) Layout Preview
 */
export const RtlPreview: Story = {
  name: "RTL bidirectional layout",
  render: () => (
    <div dir="rtl">
      <EditorialShell
        brand={<strong>يوني إي آر بي للمؤسسات السيادية</strong>}
        actions={<button type="button" style={{ padding: "6px 14px", background: "var(--color-primary)", color: "var(--color-primary-text)", border: "none", borderRadius: "var(--radius-md)" }}>تسجيل الدخول</button>}
      >
        <EditorialBand tone="base">
          <Eyebrow>المنصة السحابية الموحدة</Eyebrow>
          <HeroTitle>نظام إدارة الموارد للمؤسسات المستقلة</HeroTitle>
          <Lede>
            منظومة متكاملة لدفاتر الأستاذ والحسابات العامة مع عزل تام للمستأجرين وأعلى معايير الحوكمة المالية.
          </Lede>
        </EditorialBand>
        <EditorialBand tone="sunken" layout="editorial">
          <div>
            <BandTitle>الامتثال والرقابة الدائمة</BandTitle>
            <Lede>حماية فورية على مستوى النواة مع تشفير تام للبيانات الحساسة.</Lede>
          </div>
          <div style={{ padding: "var(--space-4)", background: "var(--color-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
            إثبات العزل السيادي
          </div>
        </EditorialBand>
      </EditorialShell>
    </div>
  ),
};

/**
 * 4. Density Scaling Gallery
 */
export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ padding: "var(--space-2) var(--space-4)", background: "var(--color-bg-sunken)", fontWeight: 600, fontSize: "var(--text-xs)" }}>
            Density: {density}
          </div>
          <EditorialShell
            density={density}
            brand={<strong>UniERP Enterprise</strong>}
            actions={<button type="button" style={{ padding: "4px 8px" }}>Action</button>}
          >
            <EditorialBand density={density} tone="base">
              <BandTitle>{density.toUpperCase()} Horizon</BandTitle>
              <Lede>Content measured and scaled at {density} density.</Lede>
            </EditorialBand>
          </EditorialShell>
        </div>
      ))}
    </div>
  ),
};

