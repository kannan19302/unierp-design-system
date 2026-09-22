import React, { useEffect, useRef } from 'react';
import {
  X,
  PlusSquare,
  Copy,
  ExternalLink,
  RefreshCw,
  Pin,
  PinOff,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import styles from './tab-context-menu.module.css';

export type ContextMenuTarget =
  | {
      type: 'tab';
      tabId: string;
      tabTitle: string;
      tabHref: string;
      pinned?: boolean;
      closable?: boolean;
      index?: number;
      totalTabs?: number;
    }
  | {
      type: 'tabstrip';
      canReopen?: boolean;
      reopenTitle?: string;
    }
  | {
      type: 'nav';
      href: string;
      label: string;
    };

export interface TabContextMenuProps {
  target: ContextMenuTarget | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onCloseTab?: (tabId: string) => void;
  onCloseOtherTabs?: (tabId: string) => void;
  onCloseTabsToRight?: (tabId: string) => void;
  onCloseTabsToLeft?: (tabId: string) => void;
  onCloseAllTabs?: () => void;
  onDuplicateTab?: (tabId: string) => void;
  onTogglePinTab?: (tabId: string) => void;
  onMoveTab?: (tabId: string, direction: 'left' | 'right') => void;
  onReloadTab?: (tabId: string) => void;
  onReopenClosedTab?: () => void;
  onNewTab?: () => void;
}

export const TabContextMenu: React.FC<TabContextMenuProps> = ({
  target,
  position,
  onClose,
  onCloseTab,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onCloseTabsToLeft,
  onCloseAllTabs,
  onDuplicateTab,
  onTogglePinTab,
  onMoveTab,
  onReloadTab,
  onReopenClosedTab,
  onNewTab,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!target || !position) return;

    function handlePointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, position, onClose]);

  useEffect(() => {
    if (target && position) {
      const first = menuRef.current?.querySelector<HTMLButtonElement>('button, a');
      first?.focus();
    }
  }, [target, position]);

  if (!target || !position) return null;

  const menuWidth = 240;
  const menuHeight = target.type === 'tab' ? 400 : 180;
  const x = typeof window !== 'undefined' ? Math.max(8, Math.min(position.x, window.innerWidth - menuWidth - 8)) : position.x;
  const y = typeof window !== 'undefined' ? Math.max(8, Math.min(position.y, window.innerHeight - menuHeight - 8)) : position.y;

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    onClose();
  };

  const openInNewBrowserTab = (href: string) => {
    if (typeof window !== 'undefined') {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={
        target.type === 'tab'
          ? `Tab options for ${target.tabTitle}`
          : target.type === 'tabstrip'
            ? 'Tab strip options'
            : `Options for ${target.label}`
      }
      className={styles.menu}
      style={{ left: `${x}px`, top: `${y}px` }}
      tabIndex={-1}
    >
      {target.type === 'tab' && (
        <>
          <div className={styles.menuHeader}>
            <span className={styles.menuLabel}>{target.tabTitle}</span>
            {target.pinned && <span className={styles.badgePinned}>Pinned</span>}
          </div>
          <div className={styles.divider} role="separator" />

          {onReloadTab && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onReloadTab(target.tabId);
                onClose();
              }}
            >
              <RefreshCw className={styles.menuItemIcon} size={14} />
              <span>Reload Tab</span>
            </button>
          )}

          {onTogglePinTab && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onTogglePinTab(target.tabId);
                onClose();
              }}
            >
              {target.pinned ? (
                <>
                  <PinOff className={styles.menuItemIcon} size={14} />
                  <span>Unpin Tab</span>
                </>
              ) : (
                <>
                  <Pin className={styles.menuItemIcon} size={14} />
                  <span>Pin Tab</span>
                </>
              )}
            </button>
          )}

          {onDuplicateTab && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onDuplicateTab(target.tabId);
                onClose();
              }}
            >
              <Copy className={styles.menuItemIcon} size={14} />
              <span>Duplicate Tab</span>
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => copyToClipboard(target.tabHref)}
          >
            <Copy className={styles.menuItemIcon} size={14} />
            <span>Copy Link</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => openInNewBrowserTab(target.tabHref)}
          >
            <ExternalLink className={styles.menuItemIcon} size={14} />
            <span>Open in New Browser Tab</span>
          </button>

          <div className={styles.divider} role="separator" />

          {onMoveTab && target.index !== undefined && target.totalTabs !== undefined && (
            <>
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${target.index === 0 ? styles.menuItemDisabled : ''}`}
                disabled={target.index === 0}
                onClick={() => {
                  onMoveTab(target.tabId, 'left');
                  onClose();
                }}
              >
                <ArrowLeft className={styles.menuItemIcon} size={14} />
                <span>Move Left</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${target.index >= target.totalTabs - 1 ? styles.menuItemDisabled : ''}`}
                disabled={target.index >= target.totalTabs - 1}
                onClick={() => {
                  onMoveTab(target.tabId, 'right');
                  onClose();
                }}
              >
                <ArrowRight className={styles.menuItemIcon} size={14} />
                <span>Move Right</span>
              </button>
              <div className={styles.divider} role="separator" />
            </>
          )}

          {onCloseTab && target.closable !== false && (
            <button
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => {
                onCloseTab(target.tabId);
                onClose();
              }}
            >
              <X className={styles.menuItemIcon} size={14} />
              <span>Close Tab</span>
              <span className={styles.shortcut}>Ctrl+W</span>
            </button>
          )}

          {onCloseOtherTabs && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onCloseOtherTabs(target.tabId);
                onClose();
              }}
            >
              <Trash2 className={styles.menuItemIcon} size={14} />
              <span>Close Other Tabs</span>
            </button>
          )}

          {onCloseTabsToRight && target.index !== undefined && target.totalTabs !== undefined && (
            <button
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${target.index >= target.totalTabs - 1 ? styles.menuItemDisabled : ''}`}
              disabled={target.index >= target.totalTabs - 1}
              onClick={() => {
                onCloseTabsToRight(target.tabId);
                onClose();
              }}
            >
              <span>Close Tabs to the Right</span>
            </button>
          )}

          {onCloseTabsToLeft && target.index !== undefined && (
            <button
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${target.index === 0 ? styles.menuItemDisabled : ''}`}
              disabled={target.index === 0}
              onClick={() => {
                onCloseTabsToLeft(target.tabId);
                onClose();
              }}
            >
              <span>Close Tabs to the Left</span>
            </button>
          )}

          {onCloseAllTabs && (
            <button
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => {
                onCloseAllTabs();
                onClose();
              }}
            >
              <span>Close All Tabs</span>
            </button>
          )}
        </>
      )}

      {target.type === 'tabstrip' && (
        <>
          {onNewTab && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onNewTab();
                onClose();
              }}
            >
              <PlusSquare className={styles.menuItemIcon} size={14} />
              <span>New Tab</span>
              <span className={styles.shortcut}>Ctrl+T</span>
            </button>
          )}
          {onReopenClosedTab && target.canReopen && (
            <button
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => {
                onReopenClosedTab();
                onClose();
              }}
            >
              <RefreshCw className={styles.menuItemIcon} size={14} />
              <span>Reopen Closed Tab</span>
              <span className={styles.shortcut}>Ctrl+Shift+T</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};
