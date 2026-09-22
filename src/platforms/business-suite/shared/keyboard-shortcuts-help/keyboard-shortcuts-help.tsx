import React, { useEffect, useRef } from 'react';
import { X, Keyboard } from 'lucide-react';
import styles from './keyboard-shortcuts-help.module.css';

export interface ShortcutItem {
  key?: string;
  keys?: string;
  description?: string;
  label?: string;
  group: string;
}

export interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: ShortcutItem[];
  title?: string;
  className?: string;
}

export const DEFAULT_BUSINESS_SHORTCUTS: ShortcutItem[] = [
  { key: 'Ctrl+K', description: 'Open command palette', group: 'Navigation' },
  { key: 'Ctrl+B', description: 'Toggle navigation sidebar', group: 'Navigation' },
  { key: 'Ctrl+/', description: 'Show keyboard shortcuts', group: 'General' },
  { key: 'Escape', description: 'Close modals and drawers', group: 'General' },
  { key: 'Ctrl+S', description: 'Save current form or draft', group: 'Actions' },
  { key: 'Ctrl+Enter', description: 'Submit document for approval', group: 'Actions' },
];

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts = DEFAULT_BUSINESS_SHORTCUTS,
  title = 'Keyboard Shortcuts',
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => closeRef.current?.focus(), 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groups = shortcuts.reduce<Record<string, ShortcutItem[]>>((acc, s) => {
    const list = acc[s.group] || [];
    list.push(s);
    acc[s.group] = list;
    return acc;
  }, {});

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
        className={`${styles.dialog} ${className}`.trim()}
      >
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Keyboard size={18} className={styles.titleIcon} aria-hidden="true" />
            <h2 id="shortcuts-dialog-title" className={styles.title}>
              {title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close shortcuts dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          {Object.entries(groups).map(([groupName, groupShortcuts]) => (
            <div key={groupName} className={styles.group}>
              <h3 className={styles.groupTitle}>{groupName}</h3>
              <table className={styles.table}>
                <tbody>
                  {groupShortcuts.map((s, idx) => {
                    const keyString = s.key || s.keys || '';
                    const descString = s.description || s.label || '';
                    const keys = keyString.split('+');
                    return (
                      <tr key={keyString || idx} className={styles.row}>
                        <td className={styles.keysCell}>
                          {keys.map((k, i) => (
                            <React.Fragment key={k}>
                              <kbd className={styles.kbd}>{k.trim()}</kbd>
                              {i < keys.length - 1 && (
                                <span className={styles.keySep}>+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </td>
                        <td className={styles.labelCell}>{descString}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          Press <kbd className={styles.kbd}>Esc</kbd> anytime to close this help window.
        </div>
      </div>
    </div>
  );
};
