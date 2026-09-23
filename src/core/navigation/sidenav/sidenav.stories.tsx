import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SideNav, type SideNavItem, type SideNavSection } from "./sidenav";
import { Building2, ChevronsUpDown, CreditCard, PanelLeft, Plus, Sparkles, BadgeCheck, Bell, LogOut, Bot, BookOpen, SquareTerminal, Frame, PieChart, Map, Settings2, MoreHorizontal, Clock3, ListChecks, Bookmark, Check, SlidersHorizontal, ArrowUp, ArrowDown, Trash2, Star } from "lucide-react";
import { Modal } from "../../overlays/modal";
import styles from "./sidenav.module.css";

const meta: Meta<typeof SideNav> = {
  title: "Core/Navigation/Sidenav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
  },
};

export default meta;
type Story = StoryObj<typeof SideNav>;

type PreviewMenu = "team" | "account" | "variant" | "more" | null;
type PreviewVariant = "sidebar" | "icon" | "inset" | "floating";
type PreviewSection = "quick-views" | "platform" | "projects";
type PreviewNavigationSection = "platform" | "projects";
type PreviewQuickView = { key: string; label: string };
type SidebarPreferences = {
  variant: PreviewVariant;
  sectionOrder: PreviewSection[];
  visible: Record<PreviewSection | "starred", boolean>;
  favorites: string[];
  quickViews: PreviewQuickView[];
  itemOrder: Record<PreviewNavigationSection, string[]>;
  hiddenItems: string[];
};

const defaultQuickViews: PreviewQuickView[] = [
  { key: "approvals", label: "My approvals" },
  { key: "recent", label: "Recently viewed" },
];
const sectionLabels: Record<PreviewSection, string> = {
  "quick-views": "Quick Views",
  platform: "Platform",
  projects: "Projects",
};
const navigationChoices: Record<PreviewNavigationSection, { key: string; label: string }[]> = {
  platform: [
    { key: "playground", label: "Playground" },
    { key: "models", label: "Models" },
    { key: "documentation", label: "Documentation" },
    { key: "settings", label: "Settings" },
  ],
  projects: [
    { key: "design", label: "Design Engineering" },
    { key: "sales", label: "Sales & Marketing" },
    { key: "travel", label: "Travel" },
  ],
};
const favoriteChoices = [
  { key: "approvals", label: "My approvals" },
  { key: "recent", label: "Recently viewed" },
  { key: "playground", label: "Playground" },
  { key: "models", label: "Models" },
  { key: "documentation", label: "Documentation" },
  { key: "design", label: "Design Engineering" },
  { key: "sales", label: "Sales & Marketing" },
  { key: "travel", label: "Travel" },
];
const storageKey = "strata-sidebar-v1-preferences";

function defaultPreferences(variant: PreviewVariant): SidebarPreferences {
  return {
    variant,
    sectionOrder: ["quick-views", "platform", "projects"],
    visible: { starred: true, "quick-views": true, platform: true, projects: true },
    favorites: ["approvals", "design"],
    quickViews: defaultQuickViews,
    itemOrder: {
      platform: navigationChoices.platform.map((item) => item.key),
      projects: navigationChoices.projects.map((item) => item.key),
    },
    hiddenItems: [],
  };
}

function readPreferences(variant: PreviewVariant, persist: boolean): SidebarPreferences {
  const defaults = defaultPreferences(variant);
  if (!persist || typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return defaults;
    const value = JSON.parse(saved) as Partial<SidebarPreferences>;
    const sectionOrder = Array.isArray(value.sectionOrder)
      ? [...new Set(value.sectionOrder.filter((key): key is PreviewSection => key === "quick-views" || key === "platform" || key === "projects")),
        ...defaults.sectionOrder.filter((key) => !value.sectionOrder?.includes(key))]
      : defaults.sectionOrder;
    return {
      variant: value.variant === "icon" || value.variant === "inset" || value.variant === "floating" ? value.variant : "sidebar",
      sectionOrder,
      visible: { ...defaults.visible, ...value.visible },
      favorites: Array.isArray(value.favorites) ? value.favorites.filter((key): key is string => typeof key === "string") : defaults.favorites,
      quickViews: Array.isArray(value.quickViews)
        ? value.quickViews.filter((view): view is PreviewQuickView => typeof view?.key === "string" && typeof view?.label === "string").slice(0, 12)
        : defaults.quickViews,
      itemOrder: {
        platform: Array.isArray(value.itemOrder?.platform)
          ? [...new Set(value.itemOrder.platform.filter((key) => navigationChoices.platform.some((item) => item.key === key))),
            ...defaults.itemOrder.platform.filter((key) => !value.itemOrder?.platform?.includes(key))]
          : defaults.itemOrder.platform,
        projects: Array.isArray(value.itemOrder?.projects)
          ? [...new Set(value.itemOrder.projects.filter((key) => navigationChoices.projects.some((item) => item.key === key))),
            ...defaults.itemOrder.projects.filter((key) => !value.itemOrder?.projects?.includes(key))]
          : defaults.itemOrder.projects,
      },
      hiddenItems: Array.isArray(value.hiddenItems)
        ? value.hiddenItems.filter((key): key is string => typeof key === "string" && Object.values(navigationChoices).flat().some((item) => item.key === key))
        : defaults.hiddenItems,
    };
  } catch {
    return defaults;
  }
}

function moveEntry<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const destination = index + direction;
  if (destination < 0 || destination >= next.length) return next;
  [next[index], next[destination]] = [next[destination], next[index]];
  return next;
}

function SidebarReference({
  initialMenu = null,
  initialVariant = "sidebar",
  initialCustomize = false,
  showSkeleton = false,
  showVariants = false,
  embedded = false,
  landmarkLabel,
}: {
  initialMenu?: PreviewMenu;
  initialVariant?: PreviewVariant;
  initialCustomize?: boolean;
  showSkeleton?: boolean;
  showVariants?: boolean;
  embedded?: boolean;
  landmarkLabel?: string;
}) {
  const InsetTag: "div" | "main" = embedded ? "div" : "main";
  const persistPreferences = initialVariant === "sidebar" && !showVariants;
  const [preferences, setPreferences] = React.useState<SidebarPreferences>(() => readPreferences(initialVariant, persistPreferences));
  const [draft, setDraft] = React.useState<SidebarPreferences>(preferences);
  const [customizing, setCustomizing] = React.useState(initialCustomize);
  const [newViewName, setNewViewName] = React.useState("");
  const [menu, setMenu] = React.useState<PreviewMenu>(initialMenu);
  const [team, setTeam] = React.useState("Acme Inc");
  const [active, setActive] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState("");
  const [query, setQuery] = React.useState("");
  const { variant, favorites } = preferences;
  const showQuickViews = preferences.visible["quick-views"];
  const showProjects = preferences.visible.projects;
  const isCollapsed = variant === "icon";

  React.useEffect(() => {
    if (!persistPreferences) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch { /* Session preview still works without storage. */ }
  }, [preferences, persistPreferences]);

  React.useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const select = (key: string, label: string) => {
    setActive(key);
    setNotice(label + " selected");
    setMenu(null);
  };
  const openCustomize = () => {
    setDraft({
      ...preferences,
      sectionOrder: [...preferences.sectionOrder],
      visible: { ...preferences.visible },
      favorites: [...preferences.favorites],
      quickViews: preferences.quickViews.map((view) => ({ ...view })),
      itemOrder: { platform: [...preferences.itemOrder.platform], projects: [...preferences.itemOrder.projects] },
      hiddenItems: [...preferences.hiddenItems],
    });
    setNewViewName("");
    setMenu(null);
    setCustomizing(true);
  };
  const resetPreferences = () => {
    const defaults = defaultPreferences(initialVariant);
    setPreferences(defaults);
    setDraft(defaults);
    setQuery("");
    setActive(null);
    setMenu(null);
    setCustomizing(false);
    setNotice("Sidebar restored to defaults");
  };
  const savePreferences = () => {
    setPreferences(draft);
    setCustomizing(false);
    setNotice("Sidebar preferences saved");
  };
  const addQuickView = () => {
    const label = newViewName.trim();
    if (!label || draft.quickViews.length >= 12) return;
    const key = `custom-${Date.now()}`;
    setDraft((current) => ({ ...current, quickViews: [...current.quickViews, { key, label }] }));
    setNewViewName("");
  };
  const navItem = (key: string, label: string, icon?: React.ReactNode, children?: { key: string; label: string }[]) => ({
    key,
    label,
    icon,
    active: active === key,
    onClick: () => select(key, label),
    defaultExpanded: key === "playground",
    items: children?.map((child) => ({
      key: child.key,
      label: child.label,
      active: active === child.key,
      onClick: () => select(child.key, child.label),
    })),
  });

  const teamButton = (
    <div className={styles.storyHeaderLine}>
    <div className={styles.storyMenuAnchor}>
      <button type="button" className={styles.storyIdentityButton}
        aria-label={"Switch team, current team " + team}
        aria-expanded={menu === "team"}
        aria-controls="sidebar-team-menu"
        onClick={() => setMenu((current) => current === "team" ? null : "team")}>
        <span className={styles.storyTeamGlyph} aria-hidden="true"><Building2 size={18} /></span>
        {!isCollapsed && <span className={styles.storyIdentityText}><strong>{team}</strong><span>Enterprise</span></span>}
        {!isCollapsed && <ChevronsUpDown size={16} className={styles.storyTrailingIcon} aria-hidden="true" />}
      </button>
      {menu === "team" && !isCollapsed && (
        <div id="sidebar-team-menu" className={styles.storyPopup} aria-label="Teams">
          <div className={styles.storyPopupLabel}>Teams</div>
          {["Acme Inc", "Acme Corp.", "Northstar Group"].map((name, index) => (
            <button key={name} type="button" className={styles.storyPopupItem}
              onClick={() => { setTeam(name); setMenu(null); setNotice(name + " selected"); }}>
              <span className={styles.storyPopupGlyph}><Building2 size={15} /></span>
              <span>{name}</span><span className={styles.storyShortcut}>⌘ {index + 1}</span>
            </button>
          ))}
          <div className={styles.storyPopupDivider} />
          <button type="button" className={styles.storyPopupItem}
            onClick={() => { setMenu(null); setNotice("Add team selected"); }}>
            <span className={styles.storyPopupGlyph}><Plus size={16} /></span>Add team
          </button>
        </div>
      )}
    </div>
    {!isCollapsed && <div className={styles.storyMoreAnchor}>
      <button type="button" className={styles.storyMoreButton} aria-label="More sidebar options"
        aria-expanded={menu === "more"} aria-controls="sidebar-more-menu"
        onClick={() => setMenu((current) => current === "more" ? null : "more")}>
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      {menu === "more" && <div id="sidebar-more-menu" className={styles.storyMorePopup} aria-label="Sidebar options">
        <div className={styles.storyPopupLabel}>Sidebar options</div>
        <button type="button" className={styles.storyPopupItem} onClick={openCustomize}>
          <SlidersHorizontal size={16} aria-hidden="true" />Customize sidebar
        </button>
        <div className={styles.storyPopupDivider} />
        <button type="button" className={styles.storyPopupItem} aria-pressed={showQuickViews}
          onClick={() => { setPreferences((current) => ({ ...current, visible: { ...current.visible, "quick-views": !current.visible["quick-views"] } })); setNotice(showQuickViews ? "Quick views hidden" : "Quick views shown"); setMenu(null); }}>
          <ListChecks size={16} aria-hidden="true" />Quick Views
          {showQuickViews && <Check size={15} className={styles.storyOptionCheck} aria-hidden="true" />}
        </button>
        <button type="button" className={styles.storyPopupItem} aria-pressed={showProjects}
          onClick={() => { setPreferences((current) => ({ ...current, visible: { ...current.visible, projects: !current.visible.projects } })); setNotice(showProjects ? "Projects hidden" : "Projects shown"); setMenu(null); }}>
          <Frame size={16} aria-hidden="true" />Projects
          {showProjects && <Check size={15} className={styles.storyOptionCheck} aria-hidden="true" />}
        </button>
        <div className={styles.storyPopupDivider} />
        <button type="button" className={styles.storyPopupItem}
          onClick={resetPreferences}>
          <Bookmark size={16} aria-hidden="true" />Restore defaults
        </button>
      </div>}
    </div>}
    </div>
  );

  const accountButton = (
    <div className={styles.storyMenuAnchor}>
      <button type="button" className={styles.storyIdentityButton}
        aria-label="Open account menu for Alex Chen"
        aria-expanded={menu === "account"}
        aria-controls="sidebar-account-menu"
        onClick={() => setMenu((current) => current === "account" ? null : "account")}>
        <span className={styles.storyAvatar} aria-hidden="true">AC</span>
        {!isCollapsed && <span className={styles.storyIdentityText}><strong>Alex Chen</strong><span>alex@acme.example</span></span>}
        {!isCollapsed && <ChevronsUpDown size={16} className={styles.storyTrailingIcon} aria-hidden="true" />}
      </button>
      {menu === "account" && !isCollapsed && (
        <div id="sidebar-account-menu" className={styles.storyPopup + " " + styles.storyAccountPopup} aria-label="Account menu">
          <div className={styles.storyPopupProfile}>
            <span className={styles.storyAvatar} aria-hidden="true">AC</span>
            <span className={styles.storyIdentityText}><strong>Alex Chen</strong><span>alex@acme.example</span></span>
          </div>
          <div className={styles.storyPopupDivider} />
          {[
            ["Upgrade plan", <Sparkles size={16} />],
            ["Account", <BadgeCheck size={16} />],
            ["Billing", <CreditCard size={16} />],
            ["Notifications", <Bell size={16} />],
          ].map(([label, icon]) => (
            <button key={label as string} type="button" className={styles.storyPopupItem}
              onClick={() => { setMenu(null); setNotice(String(label) + " selected"); }}>
              {icon}{label}
            </button>
          ))}
          <div className={styles.storyPopupDivider} />
          <button type="button" className={styles.storyPopupItem}
            onClick={() => { setMenu(null); setNotice("Log out selected"); }}>
            <LogOut size={16} />Log out
          </button>
        </div>
      )}
    </div>
  );

  const quickViewItems = preferences.quickViews.map((view) =>
    navItem(view.key, view.label, view.key === "approvals" ? <ListChecks size={18} /> : view.key === "recent" ? <Clock3 size={18} /> : <Bookmark size={18} />)
  );
  const platformItems: SideNavItem[] = [
      navItem("playground", "Playground", <SquareTerminal size={18} />, [
        { key: "history", label: "History" },
        { key: "starred", label: "Starred" },
        { key: "playground-settings", label: "Settings" },
      ]),
      navItem("models", "Models", <Bot size={18} />, [
        { key: "catalog", label: "Model catalog" },
        { key: "deployments", label: "Deployments" },
      ]),
      navItem("documentation", "Documentation", <BookOpen size={18} />, [
        { key: "guides", label: "Guides" },
      ]),
      navItem("settings", "Settings", <Settings2 size={18} />, [
        { key: "preferences", label: "Preferences" },
      ]),
  ];
  const projectItems: SideNavItem[] = [
      navItem("design", "Design Engineering", <Frame size={18} />),
      navItem("sales", "Sales & Marketing", <PieChart size={18} />),
      navItem("travel", "Travel", <Map size={18} />),
  ];
  const orderedItems = (section: PreviewNavigationSection, items: SideNavItem[]) =>
    preferences.itemOrder[section]
      .filter((key) => !preferences.hiddenItems.includes(key))
      .map((key) => items.find((item) => item.key === key))
      .filter((item): item is SideNavItem => Boolean(item));
  const sectionMap: Record<PreviewSection, SideNavSection> = {
    "quick-views": { key: "quick-views", title: "Quick Views", collapsible: false, items: quickViewItems },
    platform: { key: "platform", title: "Platform", collapsible: false, items: orderedItems("platform", platformItems) },
    projects: { key: "projects", title: "Projects", collapsible: false, items: orderedItems("projects", projectItems) },
  };
  const favoriteCatalog = [...quickViewItems, ...platformItems, ...projectItems];
  const orderedSections = preferences.sectionOrder
    .filter((key) => preferences.visible[key])
    .map((key) => sectionMap[key]);
  const availableFavorites = [
    ...favoriteChoices.filter((item) => !["approvals", "recent"].includes(item.key) || draft.quickViews.some((view) => view.key === item.key)),
    ...draft.quickViews.filter((view) => view.key.startsWith("custom-")),
  ];

  return (
    <div className={styles.storyShell} data-variant={variant}>
      <SideNav className={styles.storyNav} data-starred-visible={preferences.visible.starred} collapsed={isCollapsed}
        aria-label={landmarkLabel ?? "Side Navigation"}
        navigationLabel={landmarkLabel ? `${landmarkLabel} items` : undefined}
        header={teamButton}
        footer={accountButton}
        searchable searchPlaceholder="Search workspace…" searchQuery={query} onSearchChange={setQuery}
        onToggleCollapse={(next) => { setPreferences((current) => ({ ...current, variant: (next ?? !isCollapsed) ? "icon" : "sidebar" })); setMenu(null); }}
        allowFavorites favorites={favorites} favoriteItems={favoriteCatalog}
        onToggleFavorite={(key) => setPreferences((current) => ({ ...current, favorites: current.favorites.includes(key) ? current.favorites.filter((item) => item !== key) : [...current.favorites, key] }))}
        sections={orderedSections}
      />
      <InsetTag className={styles.storyInset}>
        <div className={styles.storyTopbar}>
          <button type="button" className={styles.storyToolbarButton}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => { setPreferences((current) => ({ ...current, variant: isCollapsed ? "sidebar" : "icon" })); setMenu(null); }}>
            <PanelLeft size={18} aria-hidden="true" />
          </button>
          {showVariants && (
            <div className={styles.storyVariantAnchor}>
              <button type="button" className={styles.storyVariantTrigger}
                aria-label="Choose sidebar variant"
                aria-expanded={menu === "variant"}
                onClick={() => setMenu((current) => current === "variant" ? null : "variant")}>
                {variant === "icon" ? "Sidebar (Icon)" : variant === "inset" ? "Sidebar (Inset)" : variant === "floating" ? "Sidebar (Floating)" : "Sidebar"}
                <ChevronsUpDown size={14} aria-hidden="true" />
              </button>
              {menu === "variant" && (
                <div className={styles.storyVariantMenu} aria-label="Sidebar variants">
                  {(["sidebar", "icon", "inset", "floating"] as const).map((option) => (
                    <button key={option} type="button" className={styles.storyPopupItem}
                      onClick={() => { setPreferences((current) => ({ ...current, variant: option })); setMenu(null); }}>
                      {option === "sidebar" ? "Sidebar" : option === "icon" ? "Sidebar (Icon)" : option === "inset" ? "Sidebar (Inset)" : "Sidebar (Floating)"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {showSkeleton && (
          <div className={styles.storySkeletonContent} aria-hidden="true">
            <div className={styles.storySkeletonRow}><span /><span /><span /></div>
            <div className={styles.storySkeletonPanel} />
          </div>
        )}
        <span className={styles.storyVisuallyHidden} role="status">{notice}</span>
      </InsetTag>
      <Modal open={customizing} onClose={() => setCustomizing(false)}
        title="Customize sidebar" description="Choose what appears in your workspace navigation."
        size="lg" className={styles.storyCustomizeDialog}
        footer={<>
          <button type="button" className={styles.storySecondaryButton} onClick={() => setCustomizing(false)}>Cancel</button>
          <button type="button" className={styles.storyPrimaryButton} onClick={savePreferences}>Save changes</button>
        </>}>
        <div className={styles.storyCustomizeGrid}>
          <section className={styles.storyCustomizeSection} aria-labelledby="sidebar-sections-heading">
            <h3 id="sidebar-sections-heading">Sections</h3>
            <p>Show the areas you use and set their order.</p>
            <div className={styles.storyPreferenceList}>
              <label className={styles.storyPreferenceRow}>
                <input type="checkbox" checked={draft.visible.starred}
                  onChange={(event) => setDraft((current) => ({ ...current, visible: { ...current.visible, starred: event.target.checked } }))} />
                <Star size={16} aria-hidden="true" /><span>Starred</span>
                <span className={styles.storyPreferenceHint}>Pinned at top</span>
              </label>
              {draft.sectionOrder.map((key, index) => (
                <div className={styles.storyPreferenceRow} key={key}>
                  <label className={styles.storyPreferenceLabel}>
                    <input type="checkbox" checked={draft.visible[key]}
                      onChange={(event) => setDraft((current) => ({ ...current, visible: { ...current.visible, [key]: event.target.checked } }))} />
                    <span>{sectionLabels[key]}</span>
                  </label>
                  <button type="button" className={styles.storyReorderButton} disabled={index === 0}
                    aria-label={`Move ${sectionLabels[key]} up`}
                    onClick={() => setDraft((current) => ({ ...current, sectionOrder: moveEntry(current.sectionOrder, index, -1) }))}>
                    <ArrowUp size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.storyReorderButton} disabled={index === draft.sectionOrder.length - 1}
                    aria-label={`Move ${sectionLabels[key]} down`}
                    onClick={() => setDraft((current) => ({ ...current, sectionOrder: moveEntry(current.sectionOrder, index, 1) }))}>
                    <ArrowDown size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.storyCustomizeSection} aria-labelledby="sidebar-quick-views-heading">
            <h3 id="sidebar-quick-views-heading">Quick Views</h3>
            <p>Keep saved destinations close to hand.</p>
            <div className={styles.storyPreferenceList}>
              {draft.quickViews.map((view, index) => (
                <div className={styles.storyPreferenceRow} key={view.key}>
                  <Bookmark size={16} aria-hidden="true" /><span>{view.label}</span>
                  <button type="button" className={styles.storyReorderButton} disabled={index === 0}
                    aria-label={`Move ${view.label} up`}
                    onClick={() => setDraft((current) => ({ ...current, quickViews: moveEntry(current.quickViews, index, -1) }))}>
                    <ArrowUp size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.storyReorderButton} disabled={index === draft.quickViews.length - 1}
                    aria-label={`Move ${view.label} down`}
                    onClick={() => setDraft((current) => ({ ...current, quickViews: moveEntry(current.quickViews, index, 1) }))}>
                    <ArrowDown size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.storyReorderButton} aria-label={`Remove ${view.label}`}
                    onClick={() => setDraft((current) => ({ ...current,
                      quickViews: current.quickViews.filter((item) => item.key !== view.key),
                      favorites: current.favorites.filter((key) => key !== view.key),
                    }))}>
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
              {draft.quickViews.length === 0 && <span className={styles.storyEmptyHint}>Add a view to start this section.</span>}
            </div>
            <div className={styles.storyAddViewRow}>
              <input aria-label="New quick view name" value={newViewName} maxLength={40} placeholder="Name a quick view"
                onChange={(event) => setNewViewName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addQuickView(); } }} />
              <button type="button" className={styles.storySecondaryButton} disabled={!newViewName.trim() || draft.quickViews.length >= 12}
                onClick={addQuickView}><Plus size={15} aria-hidden="true" />Add</button>
            </div>
          </section>
          <section className={styles.storyCustomizeSection} aria-labelledby="sidebar-navigation-items-heading">
            <h3 id="sidebar-navigation-items-heading">Navigation items</h3>
            <p>Choose and arrange destinations within each section.</p>
            {(["platform", "projects"] as const).map((section) => (
              <div key={section}>
                <div className={styles.storyOrderLabel}>{sectionLabels[section]}</div>
                <div className={styles.storyPreferenceList}>
                  {draft.itemOrder[section].map((key, index) => {
                    const choice = navigationChoices[section].find((item) => item.key === key);
                    if (!choice) return null;
                    return (
                      <div className={styles.storyPreferenceRow} key={key}>
                        <label className={styles.storyPreferenceLabel}>
                          <input type="checkbox" checked={!draft.hiddenItems.includes(key)}
                            aria-label={`Show ${choice.label}`}
                            onChange={(event) => setDraft((current) => ({
                              ...current,
                              hiddenItems: event.target.checked
                                ? current.hiddenItems.filter((item) => item !== key)
                                : [...current.hiddenItems, key],
                            }))} />
                          <span>{choice.label}</span>
                        </label>
                        <button type="button" className={styles.storyReorderButton} disabled={index === 0}
                          aria-label={`Move ${choice.label} up`}
                          onClick={() => setDraft((current) => ({ ...current, itemOrder: {
                            ...current.itemOrder, [section]: moveEntry(current.itemOrder[section], index, -1),
                          } }))}>
                          <ArrowUp size={15} aria-hidden="true" />
                        </button>
                        <button type="button" className={styles.storyReorderButton} disabled={index === draft.itemOrder[section].length - 1}
                          aria-label={`Move ${choice.label} down`}
                          onClick={() => setDraft((current) => ({ ...current, itemOrder: {
                            ...current.itemOrder, [section]: moveEntry(current.itemOrder[section], index, 1),
                          } }))}>
                          <ArrowDown size={15} aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
          <section className={styles.storyCustomizeSection} aria-labelledby="sidebar-favorites-heading">
            <h3 id="sidebar-favorites-heading">Favorites</h3>
            <p>Pin destinations to the Starred section.</p>
            <div className={styles.storyFavoriteGrid}>
              {availableFavorites.map((item) => (
                <label className={styles.storyFavoriteChoice} key={item.key}>
                  <input type="checkbox" checked={draft.favorites.includes(item.key)}
                    onChange={() => setDraft((current) => ({ ...current,
                      favorites: current.favorites.includes(item.key)
                        ? current.favorites.filter((key) => key !== item.key)
                        : [...current.favorites, item.key],
                    }))} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            {draft.favorites.length > 1 && <>
              <div className={styles.storyOrderLabel}>Starred order</div>
              <div className={styles.storyPreferenceList}>
                {draft.favorites.map((key, index) => (
                  <div className={styles.storyPreferenceRow} key={key}>
                    <Star size={15} aria-hidden="true" />
                    <span>{availableFavorites.find((item) => item.key === key)?.label ?? key}</span>
                    <button type="button" className={styles.storyReorderButton} disabled={index === 0}
                      aria-label={`Move ${availableFavorites.find((item) => item.key === key)?.label ?? key} up in Starred`}
                      onClick={() => setDraft((current) => ({ ...current, favorites: moveEntry(current.favorites, index, -1) }))}>
                      <ArrowUp size={15} aria-hidden="true" />
                    </button>
                    <button type="button" className={styles.storyReorderButton} disabled={index === draft.favorites.length - 1}
                      aria-label={`Move ${availableFavorites.find((item) => item.key === key)?.label ?? key} down in Starred`}
                      onClick={() => setDraft((current) => ({ ...current, favorites: moveEntry(current.favorites, index, 1) }))}>
                      <ArrowDown size={15} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </>}
          </section>
          <section className={styles.storyCustomizeSection} aria-labelledby="sidebar-appearance-heading">
            <h3 id="sidebar-appearance-heading">Appearance</h3>
            <p>Choose how the navigation sits beside your work.</p>
            <div className={styles.storyAppearanceChoices}>
              {(["sidebar", "icon", "inset", "floating"] as const).map((option) => (
                <label className={styles.storyAppearanceChoice} key={option}>
                  <input type="radio" name="sidebar-appearance" checked={draft.variant === option}
                    onChange={() => setDraft((current) => ({ ...current, variant: option }))} />
                  <span>{option === "sidebar" ? "Default" : option === "icon" ? "Icon rail" : option === "inset" ? "Inset" : "Floating"}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 sidebar reference",
  render: () => <SidebarReference />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1TeamMenu: Story = {
  name: "V1 team switcher",
  render: () => <SidebarReference initialMenu="team" />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1AccountMenu: Story = {
  name: "V1 account menu",
  render: () => <SidebarReference initialMenu="account" />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1InsetAndVariants: Story = {
  name: "V1 inset and variants",
  render: () => <SidebarReference initialVariant="inset" showSkeleton showVariants />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1CustomizeSidebar: Story = {
  name: "V1 customize sidebar",
  render: () => <SidebarReference initialCustomize />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <main className={styles.storyStateMatrix}>
      {(["sidebar", "icon", "inset", "floating"] as const).map((variant) => (
        <section key={variant}>
          <h2>{variant === "sidebar" ? "Default" : variant === "icon" ? "Icon rail" : variant === "inset" ? "Inset" : "Floating"}</h2>
          <SidebarReference initialVariant={variant} showVariants showSkeleton embedded landmarkLabel={`${variant} side navigation`} />
        </section>
      ))}
    </main>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};
