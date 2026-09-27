import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CreditCard,
  BarChart3,
  MessageSquare,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Lock,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  CatalogShell,
  CatalogGallery,
  CatalogListing,
  type CatalogTile,
  type CatalogFacet,
  type ActiveCatalogFilter,
} from "./catalog-shell";

/**
 * ## Strata V1 CatalogShell Benchmark
 *
 * Backstage Catalog is the enterprise benchmark for a bounded facet rail beside results.
 * ShadcnBlocks Integration 32 supplies a responsive catalog composition reference;
 * its paid source is not treated as verified keyboard or accessibility behavior.
 * The page owner supplies the search, sort, result data, and permission outcome.
 * This story demonstrates grid/list views, active filters, loading, empty state,
 * and the separate destination link and action button in each tile.
 */
const meta: Meta<typeof CatalogShell> = {
  title: "Shells/CatalogShell",
  component: CatalogShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      test: "error",
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
    docs: {
      description: {
        component:
          "Enterprise extension catalog and marketplace storefront floorplan supporting facets, active filter management, grid/list view toggles, and verified app manifests.",
      },
    },
  },
  argTypes: {
    hero: {
      control: "object",
      description: "Storefront hero banner with title, subtitle, and badge.",
    },
    searchSlot: {
      control: false,
      description: "Search bar input slot with keyboard shortcut affordance.",
    },
    facets: {
      control: "object",
      description: "Structured facet groups with options and item counts.",
    },
    facetsCollapsed: {
      control: "boolean",
      description: "Collapses the facet sidebar to maximize catalog canvas width.",
    },
    resultSummary: {
      control: "text",
      description: "Live result counter announced to assistive technology.",
    },
    viewMode: {
      control: "select",
      options: ["grid", "list"],
      description: "Active presentation mode for catalog gallery items.",
    },
    loading: {
      control: "boolean",
      description: "Renders animated skeleton cards while queries resolve.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CatalogShell>;

const RAW_FACETS: CatalogFacet[] = [
  {
    id: "category",
    legend: "Categories",
    options: [
      { id: "fin", label: "Finance & Accounting", count: 24 },
      { id: "crm", label: "CRM & Customer Success", count: 18 },
      { id: "hr", label: "HR & Payroll", count: 12 },
      { id: "scm", label: "Supply Chain & Logistics", count: 15 },
    ],
  },
  {
    id: "pricing",
    legend: "Pricing Model",
    options: [
      { id: "free", label: "Free & Open Source", count: 32 },
      { id: "paid", label: "Paid Subscription", count: 48 },
    ],
  },
  {
    id: "compliance",
    legend: "Security & Compliance",
    options: [
      { id: "soc2", label: "Security review available", count: 42 },
      { id: "gdpr", label: "EU GDPR Compliant", count: 56 },
      { id: "hipaa", label: "HIPAA Compliant", count: 19 },
    ],
  },
];

const RAW_TILES: CatalogTile[] = [
  {
    id: "stripe",
    name: "Stripe Global Payments",
    publisher: "Stripe Inc.",
    publisherVerified: true,
    description: "Accept multi-currency payments, credit cards, automated subscription billing, and tax calculations.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
          color: "white",
        }}
      >
        <CreditCard size={22} />
      </div>
    ),
    status: "Verified Integration",
    badge: "Featured",
    badgeVariant: "featured",
    rating: { score: 4.9, reviewsCount: 342 },
    pricing: "Free to Install",
    tags: ["Finance", "Payments", "SOC2"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-primary)",
          color: "var(--color-primary-text)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        Install
      </button>
    ),
  },
  {
    id: "quickbooks",
    name: "QuickBooks Sync",
    publisher: "Intuit",
    publisherVerified: true,
    description: "Synchronize general ledger transactions, accounts payable, accounts receivable, and invoice reconciliations in real-time.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
          color: "white",
        }}
      >
        <BarChart3 size={22} />
      </div>
    ),
    badge: "Popular",
    badgeVariant: "popular",
    rating: { score: 4.7, reviewsCount: 198 },
    pricing: "$29/mo",
    tags: ["Accounting", "GL Sync"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-primary)",
          color: "var(--color-primary-text)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        Install
      </button>
    ),
  },
  {
    id: "slack",
    name: "Slack Notifications",
    publisher: "Salesforce",
    publisherVerified: true,
    description: "Deliver instant alert notifications, purchase order approvals, and exception escalation directly to Slack channels.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
          color: "white",
        }}
      >
        <MessageSquare size={22} />
      </div>
    ),
    rating: { score: 4.8, reviewsCount: 512 },
    pricing: "Free",
    tags: ["Communication", "Workflows"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-bg-sunken)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Configure
      </button>
    ),
  },
  {
    id: "docusign",
    name: "DocuSign eSignature",
    publisher: "DocuSign Inc.",
    publisherVerified: true,
    description: "Automate contract signing, NDA execution, and vendor agreement signatures directly from purchase orders.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: "white",
        }}
      >
        <ShieldCheck size={22} />
      </div>
    ),
    badge: "Verified",
    badgeVariant: "verified",
    rating: { score: 4.9, reviewsCount: 410 },
    pricing: "From $15/user",
    tags: ["Legal", "E-Sign", "Audit"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-primary)",
          color: "var(--color-primary-text)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        Install
      </button>
    ),
  },
  {
    id: "snowflake",
    name: "Snowflake Data Warehouse",
    publisher: "Snowflake Computing",
    publisherVerified: true,
    description: "Real-time streaming of UniERP general ledger journals, audit trails, and inventory metrics into Snowflake lakes.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
          color: "white",
        }}
      >
        <Sparkles size={22} />
      </div>
    ),
    badge: "Enterprise",
    badgeVariant: "enterprise",
    rating: { score: 5.0, reviewsCount: 154 },
    pricing: "Usage Based",
    tags: ["Data Lake", "BI", "Analytics"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-primary)",
          color: "var(--color-primary-text)",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        Install
      </button>
    ),
  },
  {
    id: "zapier",
    name: "Zapier Automated Workflows",
    publisher: "Zapier",
    publisherVerified: true,
    description: "Trigger cross-system workflows with 5,000+ business applications when invoices, leads, or purchase orders update.",
    href: "#",
    icon: (
      <div
        style={{
          inlineSize: "100%",
          blockSize: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
          color: "white",
        }}
      >
        <Zap size={22} />
      </div>
    ),
    rating: { score: 4.8, reviewsCount: 680 },
    pricing: "Freemium",
    tags: ["Automation", "Webhooks", "iPaaS"],
    actionSlot: (
      <button
        type="button"
        style={{
          padding: "var(--space-1-5, 6px) var(--space-3)",
          background: "var(--color-bg-sunken)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Configure
      </button>
    ),
  },
];

/**
 * 1. Primary Interactive Storefront Reference (Golden Standard)
 */
function InteractiveStorefront() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "alpha">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [facetsCollapsed, setFacetsCollapsed] = useState(false);
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleInstall = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInstalledAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Build active filters array
  const activeFilters = useMemo<ActiveCatalogFilter[]>(() => {
    const filters: ActiveCatalogFilter[] = [];
    selectedCategories.forEach((catId) => {
      const match = RAW_FACETS[0]?.options.find((o) => o.id === catId);
      if (match) {
        filters.push({
          id: `cat-${catId}`,
          label: match.label,
          onRemove: () => setSelectedCategories((prev) => prev.filter((id) => id !== catId)),
        });
      }
    });
    selectedPricing.forEach((priceId) => {
      const match = RAW_FACETS[1]?.options.find((o) => o.id === priceId);
      if (match) {
        filters.push({
          id: `price-${priceId}`,
          label: match.label,
          onRemove: () => setSelectedPricing((prev) => prev.filter((id) => id !== priceId)),
        });
      }
    });
    selectedCompliance.forEach((compId) => {
      const match = RAW_FACETS[2]?.options.find((o) => o.id === compId);
      if (match) {
        filters.push({
          id: `comp-${compId}`,
          label: match.label,
          onRemove: () => setSelectedCompliance((prev) => prev.filter((id) => id !== compId)),
        });
      }
    });
    return filters;
  }, [selectedCategories, selectedPricing, selectedCompliance]);

  // Compute dynamic facets with live checked state and counts
  const facetsWithState = useMemo<CatalogFacet[]>(
    () => [
      {
        ...RAW_FACETS[0]!,
        options: RAW_FACETS[0]!.options.map((opt) => ({
          ...opt,
          checked: selectedCategories.includes(opt.id),
          onChange: (checked) => {
            setSelectedCategories((prev) =>
              checked ? [...prev, opt.id] : prev.filter((id) => id !== opt.id)
            );
          },
        })),
      },
      {
        ...RAW_FACETS[1]!,
        options: RAW_FACETS[1]!.options.map((opt) => ({
          ...opt,
          checked: selectedPricing.includes(opt.id),
          onChange: (checked) => {
            setSelectedPricing((prev) =>
              checked ? [...prev, opt.id] : prev.filter((id) => id !== opt.id)
            );
          },
        })),
      },
      {
        ...RAW_FACETS[2]!,
        options: RAW_FACETS[2]!.options.map((opt) => ({
          ...opt,
          checked: selectedCompliance.includes(opt.id),
          onChange: (checked) => {
            setSelectedCompliance((prev) =>
              checked ? [...prev, opt.id] : prev.filter((id) => id !== opt.id)
            );
          },
        })),
      },
    ],
    [selectedCategories, selectedPricing, selectedCompliance]
  );

  // Filter and sort tiles
  const filteredTiles = useMemo(() => {
    let result = RAW_TILES.filter((tile) => {
      // Search query filtering
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = tile.name.toLowerCase().includes(q);
        const matchesPub = tile.publisher?.toLowerCase().includes(q);
        const matchesDesc = tile.description?.toLowerCase().includes(q);
        const matchesTag = tile.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesPub && !matchesDesc && !matchesTag) return false;
      }

      // Category filtering
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some((cat) => {
          if (cat === "fin") return tile.tags?.some((t) => ["Finance", "Accounting", "Payments", "GL Sync"].includes(t));
          if (cat === "crm") return tile.tags?.some((t) => ["CRM", "Communication", "Workflows", "Automation"].includes(t));
          if (cat === "hr") return tile.tags?.some((t) => ["HR", "Payroll"].includes(t));
          if (cat === "scm") return tile.tags?.some((t) => ["Supply Chain", "Logistics", "iPaaS"].includes(t));
          return false;
        });
        if (!matchesCategory) return false;
      }

      // Pricing filtering
      if (selectedPricing.length > 0) {
        const matchesPricing = selectedPricing.some((price) => {
          if (price === "free") return tile.pricing?.toLowerCase().includes("free");
          if (price === "paid") return tile.pricing?.includes("$") || tile.pricing?.toLowerCase().includes("usage");
          return false;
        });
        if (!matchesPricing) return false;
      }

      // Compliance filtering
      if (selectedCompliance.length > 0) {
        const matchesCompliance = selectedCompliance.some((comp) => {
          if (comp === "soc2") return tile.tags?.some((t) => t.toLowerCase().includes("soc2"));
          if (comp === "gdpr") return tile.tags?.some((t) => t.toLowerCase().includes("gdpr"));
          if (comp === "hipaa") return tile.tags?.some((t) => t.toLowerCase().includes("hipaa"));
          return false;
        });
        if (!matchesCompliance) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.rating?.reviewsCount ?? 0) - (a.rating?.reviewsCount ?? 0);
      }
      if (sortBy === "rating") {
        return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
      }
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    // Decorate with live install state and action button
    return result.map((tile) => {
      const isInstalled = installedAppIds.has(tile.id);
      return {
        ...tile,
        installed: isInstalled,
        status: isInstalled ? "Active & Verified" : tile.status,
        actionSlot: (
          <button
            type="button"
            onClick={(e) => toggleInstall(tile.id, e)}
            style={{
              padding: "var(--space-1-5, 6px) var(--space-3)",
              background: isInstalled ? "var(--color-bg-sunken)" : "var(--color-primary)",
              color: isInstalled ? "var(--color-text)" : "var(--color-primary-text)",
              border: isInstalled ? "1px solid var(--color-border)" : "none",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-xs)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              transition: "all var(--duration-fast)",
            }}
          >
            {isInstalled ? (
              <>
                <CheckCircle2 size={13} style={{ color: "var(--color-primary)" }} />
                <span>Installed</span>
              </>
            ) : (
              "Install"
            )}
          </button>
        ),
      };
    });
  }, [searchQuery, selectedCategories, selectedPricing, selectedCompliance, sortBy, installedAppIds]);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedPricing([]);
    setSelectedCompliance([]);
    setSearchQuery("");
  };

  return (
    <CatalogShell
      hero={{
        badge: "UniERP App Marketplace",
        title: "Enterprise Extensions & Connected Apps",
        subtitle: "Extend your ERP business suite with pre-built connectors, workflow automation, and verified banking integrations.",
      }}
      searchSlot={
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            inlineSize: "100%",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              insetInlineStart: "var(--space-4)",
              color: "var(--color-text-secondary)",
              pointerEvents: "none",
            }}
          />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps, connectors, plugins, publishers... (Press / to search)"
            aria-label="Search marketplace"
            style={{
              inlineSize: "100%",
              paddingBlock: "var(--space-3)",
              paddingInlineStart: "var(--space-11, 44px)",
              paddingInlineEnd: searchQuery ? "var(--space-20, 80px)" : "var(--space-16, 64px)",
              borderRadius: "var(--radius-xl, 12px)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-elevated)",
              fontSize: "var(--text-sm)",
              boxShadow: "var(--shadow-sm)",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              aria-label="Clear search query"
              style={{
                position: "absolute",
                insetInlineEnd: "var(--space-12, 48px)",
                background: "transparent",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                borderRadius: "var(--radius-full)",
              }}
            >
              <X size={15} />
            </button>
          )}
          <kbd
            style={{
              position: "absolute",
              insetInlineEnd: "var(--space-3)",
              paddingBlock: "2px",
              paddingInline: "var(--space-2)",
              background: "var(--color-bg-sunken)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-2xs, 10px)",
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      }
      facets={facetsWithState}
      facetsCollapsed={facetsCollapsed}
      resultSummary={`Showing ${filteredTiles.length} of ${RAW_TILES.length} example integrations`}
      activeFilters={activeFilters}
      onClearAllFilters={activeFilters.length > 0 ? handleClearAll : undefined}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      toolbar={
        <button
          type="button"
          onClick={() => setFacetsCollapsed(!facetsCollapsed)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-1-5)",
            paddingBlock: "var(--space-1-5, 6px)",
            paddingInline: "var(--space-3)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-elevated)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            cursor: "pointer",
          }}
          aria-label={facetsCollapsed ? "Expand filters sidebar" : "Hide filters sidebar"}
        >
          <SlidersHorizontal size={14} />
          <span>{facetsCollapsed ? "Show Filters" : "Hide Filters"}</span>
        </button>
      }
      sortSlot={
        <select
          className="sort_select"
          aria-label="Sort options"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "popular" | "rating" | "alpha")}
          style={{
            paddingBlock: "var(--space-1-5, 6px)",
            paddingInline: "var(--space-3) var(--space-7, 28px)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-elevated)",
            fontSize: "var(--text-xs)",
          }}
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="alpha">Name (A-Z)</option>
        </select>
      }
      emptySlot={
        filteredTiles.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--space-12) var(--space-4)",
              background: "var(--color-bg-sunken)",
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-xl)",
              gap: "var(--space-3)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "var(--text-3xl)" }}>🔍</span>
            <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 700 }}>No integrations match your criteria</h3>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              Try adjusting your search terms or clearing one or more active filters.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                marginTop: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                background: "var(--color-primary)",
                color: "var(--color-primary-text)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : undefined
      }
      paginationSlot={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            inlineSize: "100%",
            paddingBlock: "var(--space-3)",
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-xs)",
          }}
        >
          <span>Showing 1–{filteredTiles.length} of {RAW_TILES.length} example integrations</span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <button
              type="button"
              disabled
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "var(--space-1-5) var(--space-2-5)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-sunken)",
                color: "var(--color-text-disabled, #94a3b8)",
                cursor: "not-allowed",
                fontSize: "var(--text-xs)",
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ fontWeight: 600, color: "var(--color-text)", paddingInline: "var(--space-2)" }}>Page 1 of 1</span>
            <button
              type="button"
              disabled
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "var(--space-1-5) var(--space-2-5)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-sunken)",
                color: "var(--color-text-disabled, #94a3b8)",
                cursor: "not-allowed",
                fontSize: "var(--text-xs)",
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      }
    >
      <CatalogGallery tiles={filteredTiles} viewMode={viewMode} />
    </CatalogShell>
  );
}

/**
 * 1. Default Interactive Storefront Story (Flagship Benchmark)
 */
export const Default: Story = {
  name: "V1 storefront reference",
  render: () => <InteractiveStorefront />,
};

export const V1WorkspacePreview: Story = {
  name: "V1 storefront reference (preview)",
  render: () => <InteractiveStorefront />,
  parameters: { controls: { disable: true } },
};

/**
 * 3. State Matrix Story (Comprehensive 6-State Grid)
 */
export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
      }}
    >
      {/* State 1: Populated Grid View */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          1. POPULATED GRID STOREFRONT
        </div>
        <CatalogShell resultSummary="Showing 2 apps">
          <CatalogGallery tiles={RAW_TILES.slice(0, 2)} />
        </CatalogShell>
      </div>

      {/* State 2: List View Mode */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          2. COMPACT LIST VIEW LAYOUT
        </div>
        <CatalogShell resultSummary="Showing 2 apps" viewMode="list">
          <CatalogGallery tiles={RAW_TILES.slice(0, 2)} viewMode="list" />
        </CatalogShell>
      </div>

      {/* State 3: Filtered with Active Chips */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          3. ACTIVE FILTERS STRIP & DISMISS
        </div>
        <CatalogShell
          resultSummary="Showing 1 app"
          activeFilters={[
            { id: "1", label: "Finance & Accounting", onRemove: () => {} },
            { id: "2", label: "Security review", onRemove: () => {} },
          ]}
          onClearAllFilters={() => {}}
        >
          <CatalogGallery tiles={RAW_TILES.slice(0, 1)} />
        </CatalogShell>
      </div>

      {/* State 4: Loading Skeletons */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          4. LOADING SHIMMER SKELETON STATE
        </div>
        <CatalogShell loading resultSummary="Loading marketplace extensions..." />
      </div>

      {/* State 5: Empty Search Results */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          5. ZERO MATCHES EMPTY STATE
        </div>
        <CatalogShell
          resultSummary="0 apps found"
          emptySlot={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-12) var(--space-4)",
                background: "var(--color-bg-sunken)",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius-xl)",
                gap: "var(--space-2)",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "var(--text-3xl)" }}>🔍</span>
              <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 700 }}>No applications found</h3>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                No extensions match your active filters. Try clearing filters or searching with a different term.
              </p>
            </div>
          }
        />
      </div>

      {/* State 6: Full Canvas Mode (Facets Collapsed) */}
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          6. FULL CANVAS MODE (FACETS COLLAPSED)
        </div>
        <CatalogShell facetsCollapsed resultSummary="Showing 3 apps in expanded grid">
          <CatalogGallery tiles={RAW_TILES.slice(0, 3)} />
        </CatalogShell>
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * 4. Product Detail Listing Floorplan
 */
export const ProductDetailListing: Story = {
  name: "V1 product listing detail",
  render: () => (
    <CatalogListing
      permissions={[
        {
          scope: "connectors.write",
          description: "Create and update connector credentials for banking networks",
        },
        {
          scope: "invoices.read",
          description: "Read customer invoices, line items, payment schedules, and taxes",
        },
        {
          scope: "ledger.post",
          description: "Post automated journal adjustments into General Ledger",
        },
      ]}
      changelog={
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--text-sm)" }}>
          <div>
            <strong>v3.4.1 (Current)</strong> — Enhanced webhook retry backoff and SEPA instant credit transfer support.
          </div>
          <div style={{ color: "var(--color-text-secondary)" }}>
            <strong>v3.4.0</strong> — Multi-entity currency reconciliation across EU and US holding groups.
          </div>
        </div>
      }
      aside={
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <button
            type="button"
            style={{
              padding: "var(--space-2-5, 10px) var(--space-4)",
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              cursor: "pointer",
            }}
          >
            Install to Active Tenant
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Publisher:</span>
              <span style={{ fontWeight: 600 }}>Stripe Inc.</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Version:</span>
              <span style={{ fontWeight: 600 }}>v3.4.1</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>License:</span>
              <span style={{ fontWeight: 600 }}>Commercial</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Compatibility:</span>
              <span style={{ fontWeight: 600 }}>UniERP v1.1.0+</span>
            </div>
          </div>
        </div>
      }
    >
      <div>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: 0 }}>
          Stripe Global Payments & Automated Subscription Reconciliation
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginBlock: "var(--space-2) var(--space-4)", lineHeight: 1.6 }}>
          Direct connector integrating Stripe Checkout, Billing, and Treasury with UniERP general ledger.
          Enables automated invoice matching, multi-currency processing across 135+ currencies, and 
          instant settlement reporting.
        </p>
      </div>
    </CatalogListing>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * 5. RTL Layout Localization Preview
 */
export const RtlPreview: Story = {
  name: "V1 RTL layout",
  render: () => (
    <div dir="rtl" style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <CatalogShell
        hero={{
          badge: "متجر التطبيقات",
          title: "ملحقات المؤسسة والتطبيقات المتصلة",
          subtitle: "قم بتوسيع مجموعة أعمال UniERP الخاصة بك باستخدام موصلات مدمجة مسبقًا وأتمتة سير العمل.",
        }}
        facets={[
          {
            id: "cat",
            legend: "الفئات",
            options: [
              { id: "fin", label: "المالية والمحاسبة", count: 24, checked: true },
              { id: "crm", label: "إدارة علاقات العملاء", count: 18 },
            ],
          },
        ]}
        resultSummary="عرض 2 من التطبيقات المعتمدة"
      >
        <CatalogGallery
          tiles={[
            {
              id: "stripe-ar",
              name: "مدفوعات Stripe العالمية",
              publisher: "Stripe Inc.",
              publisherVerified: true,
              description: "قبول المدفوعات متعددة العملات وبطاقات الائتمان والفواتير الآلية المتكررة.",
              href: "#",
              icon: (
                <div
                  style={{
                    inlineSize: "100%",
                    blockSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                    color: "white",
                  }}
                >
                  <CreditCard size={22} />
                </div>
              ),
              badge: "مميز",
              rating: { score: 4.9, reviewsCount: 342 },
              pricing: "مجاني للتثبيت",
              tags: ["المالية", "المدفوعات"],
              actionSlot: (
                <button
                  type="button"
                  style={{
                    padding: "var(--space-1-5, 6px) var(--space-3)",
                    background: "var(--color-primary)",
                    color: "var(--color-primary-text)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  تثبيت
                </button>
              ),
            },
          ]}
        />
      </CatalogShell>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
