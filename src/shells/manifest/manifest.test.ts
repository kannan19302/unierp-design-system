import { describe, expect, it } from "vitest";
import { resolveManifestNav, type PlatformManifest } from "../manifest";

const manifest: PlatformManifest = {
  platformCode: "P3",
  platformName: "Tenant Applications",
  routePermissions: {
    "/settings": ["tenant.settings.manage"],
  },
  nav: [
    { key: "dashboard", label: "Dashboard", href: "/" },
    {
      key: "finance",
      label: "Finance",
      href: "/finance",
      requiredPermissions: ["finance.invoice.read"],
      children: [
        { key: "invoices", label: "Invoices", href: "/finance/invoices" },
        {
          key: "approvals",
          label: "Approvals",
          href: "/finance/approvals",
          requiredPermissions: ["finance.invoice.approve"],
        },
      ],
    },
    {
      key: "admin",
      label: "Admin",
      href: "/admin",
      requiredPermissions: ["system.tenant.read"],
    },
  ],
};

describe("resolveManifestNav", () => {
  it("keeps an item with no permission requirement for anyone", () => {
    const result = resolveManifestNav(manifest, []);
    expect(result.map((i) => i.key)).toContain("dashboard");
  });

  it("hides an item whose required permission is missing", () => {
    const result = resolveManifestNav(manifest, []);
    expect(result.map((i) => i.key)).not.toContain("admin");
  });

  it("shows an item once its required permission is held", () => {
    const result = resolveManifestNav(manifest, ["system.tenant.read"]);
    expect(result.map((i) => i.key)).toContain("admin");
  });

  it("filters children independently of the parent's own requirement", () => {
    const result = resolveManifestNav(manifest, ["finance.invoice.read"]);
    const finance = result.find((i) => i.key === "finance");
    expect(finance?.children?.map((c) => c.key)).toEqual(["invoices"]);
  });

  it("shows a permitted child once its own permission is added", () => {
    const result = resolveManifestNav(manifest, [
      "finance.invoice.read",
      "finance.invoice.approve",
    ]);
    const finance = result.find((i) => i.key === "finance");
    expect(finance?.children?.map((c) => c.key)).toEqual(["invoices", "approvals"]);
  });

  it("drops a parent entirely once every one of its children is filtered out", () => {
    // A parent left visible with zero visible children is a dead-end menu
    // item — hiding the whole group is the correct behaviour, not a bug.
    const parentOnlyChildren: PlatformManifest = {
      ...manifest,
      nav: [
        {
          key: "reports",
          label: "Reports",
          href: "/reports",
          children: [
            {
              key: "secret-report",
              label: "Secret Report",
              href: "/reports/secret",
              requiredPermissions: ["reports.secret.read"],
            },
          ],
        },
      ],
    };
    const result = resolveManifestNav(parentOnlyChildren, []);
    expect(result).toEqual([]);
  });

  it("keeps a parent whose children need no permissions", () => {
    const openChildren: PlatformManifest = {
      ...manifest,
      nav: [
        {
          key: "help",
          label: "Help",
          href: "/help",
          children: [{ key: "docs", label: "Docs", href: "/help/docs" }],
        },
      ],
    };
    const result = resolveManifestNav(openChildren, []);
    expect(result[0]?.children?.map((c) => c.key)).toEqual(["docs"]);
  });

  it("requires ALL listed permissions, not just one", () => {
    const strict: PlatformManifest = {
      ...manifest,
      nav: [
        {
          key: "dual",
          label: "Dual",
          href: "/dual",
          requiredPermissions: ["a.read", "b.read"],
        },
      ],
    };
    expect(resolveManifestNav(strict, ["a.read"])).toEqual([]);
    expect(resolveManifestNav(strict, ["a.read", "b.read"]).map((i) => i.key)).toEqual([
      "dual",
    ]);
  });

  it("does not mutate the original manifest", () => {
    const before = JSON.stringify(manifest);
    resolveManifestNav(manifest, ["system.tenant.read"]);
    expect(JSON.stringify(manifest)).toBe(before);
  });
});
