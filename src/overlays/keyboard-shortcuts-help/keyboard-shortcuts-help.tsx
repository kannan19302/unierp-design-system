"use client";

import { Modal } from "../modal";
import styles from "./keyboard-shortcuts-help.module.css";

export interface KeyboardShortcutEntry {
  keys: string;
  label: string;
  group: string;
}

export interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: readonly KeyboardShortcutEntry[];
  title?: string;
}

/** Displays consumer-defined keyboard shortcuts in an accessible dialog. */
export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  shortcuts,
  title = "Keyboard shortcuts",
}: KeyboardShortcutsHelpProps) {
  const groups = Array.from(new Set(shortcuts.map((shortcut) => shortcut.group)));

  return (
    <Modal open={isOpen} onClose={onClose} title={title} size="md">
      <div className={styles.content} data-slot="keyboard-shortcuts-help">
        {groups.map((group) => (
          <section className={styles.group} key={group}>
            <h3 className={styles.groupTitle}>{group}</h3>
            <dl className={styles.list}>
              {shortcuts.filter((shortcut) => shortcut.group === group).map((shortcut) => (
                <div className={styles.row} key={`${shortcut.group}:${shortcut.keys}:${shortcut.label}`}>
                  <dt className={styles.label}>{shortcut.label}</dt>
                  <dd className={styles.keys}><kbd>{shortcut.keys}</kbd></dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Modal>
  );
}
