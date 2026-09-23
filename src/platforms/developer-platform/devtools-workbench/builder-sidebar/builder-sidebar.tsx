import React, { useState } from 'react';
import {
  LayoutTemplate,
  MousePointerClick,
  Type,
  List,
  CheckSquare,
  Calendar,
  Hash,
  Upload,
  AlignLeft,
  Key,
} from 'lucide-react';
import styles from './builder-sidebar.module.css';

export interface BuilderPaletteItem {
  type: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface BuilderGroup {
  name: string;
  items: BuilderPaletteItem[];
}

export const DEFAULT_BUILDER_GROUPS: BuilderGroup[] = [
  {
    name: 'Layout & Actions',
    items: [
      { type: 'Section', label: 'Section Break', icon: LayoutTemplate },
      { type: 'Column', label: 'Column Break', icon: LayoutTemplate },
      { type: 'Button', label: 'Action Button', icon: MousePointerClick },
    ],
  },
  {
    name: 'Inputs & Controls',
    items: [
      { type: 'Data', label: 'Short Text', icon: Type },
      { type: 'Text Editor', label: 'Rich Text', icon: AlignLeft },
      { type: 'Select', label: 'Dropdown', icon: List },
      { type: 'Check', label: 'Checkbox', icon: CheckSquare },
      { type: 'Date', label: 'Date Picker', icon: Calendar },
      { type: 'Number', label: 'Numeric', icon: Hash },
      { type: 'File', label: 'File Upload', icon: Upload },
      { type: 'Password', label: 'Password', icon: Key },
    ],
  },
];

export interface BuilderSidebarProps {
  groups?: BuilderGroup[];
  activeTab?: 'palette' | 'tree';
  onTabChange?: (tab: 'palette' | 'tree') => void;
  onSelectItem?: (item: BuilderPaletteItem) => void;
  treeContent?: React.ReactNode;
  className?: string;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  groups = DEFAULT_BUILDER_GROUPS,
  activeTab = 'palette',
  onTabChange,
  onSelectItem,
  treeContent,
  className = '',
}) => {
  const [tab, setTab] = useState<'palette' | 'tree'>(activeTab);
  const [search, setSearch] = useState('');

  const currentTab = onTabChange ? activeTab : tab;
  const handleTabChange = (nextTab: 'palette' | 'tree') => {
    setTab(nextTab);
    onTabChange?.(nextTab);
  };

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className={`${styles.sidebar} ${className}`.trim()} aria-label="Component Studio Palette">
      <div className={styles.tabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'palette'}
          className={`${styles.tabButton} ${currentTab === 'palette' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('palette')}
        >
          Components
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'tree'}
          className={`${styles.tabButton} ${currentTab === 'tree' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('tree')}
        >
          Tree View
        </button>
      </div>

      {currentTab === 'palette' ? (
        <>
          <div className={styles.searchSection}>
            <input
              type="search"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Filter component palette"
            />
          </div>

          <div className={styles.scrollArea}>
            {filteredGroups.map((group) => (
              <div key={group.name} className={styles.group}>
                <h4 className={styles.groupTitle}>{group.name}</h4>
                <div className={styles.grid}>
                  {group.items.map((item) => {
                    const Icon = item.icon || Type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        className={styles.itemBtn}
                        onClick={() => onSelectItem?.(item)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify(item));
                        }}
                      >
                        <Icon size={14} className={styles.itemIcon} />
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.scrollArea}>
          {treeContent || (
            <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
              No document tree nodes selected.
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
