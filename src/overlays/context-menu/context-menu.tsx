"use client";

import {
  useState,
  useCallback,
  useEffect,
  type FC,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Portal } from "../portal";
import { useEscapeKey, useMenuKeyboard, type MenuItem } from "../overlay-hooks";
import styles from "./context-menu.module.css";

export interface ContextMenuProps {
  children: ReactNode;
  items: MenuItem[];
  className?: string;
}

export const ContextMenu: FC<ContextMenuProps> = ({
  children,
  items,
  className = "",
}) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const open = pos !== null;

  const close = useCallback(() => setPos(null), []);
  useEscapeKey(close, open);

  const {
    activeIndex,
    setActiveIndex,
    onKeyDown,
    itemRefs,
    menu,
    setMenu,
  } = useMenuKeyboard({ items, open, onClose: close });

  const onContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menu && !menu.contains(e.target as Node)) close();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open, close, menu]);

  return (
    <div onContextMenu={onContextMenu} className={styles.container}>
      {children}
      {pos && (
        <Portal>
          <div
            ref={setMenu}
            role="menu"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            className={`${styles.menu} ${className}`.trim()}
            style={{
              top: `${pos.y}px`,
              left: `${pos.x}px`,
            }}
          >
            {items.map((item, idx) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                tabIndex={activeIndex === idx ? 0 : -1}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  close();
                }}
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(idx);
                }}
                data-active={activeIndex === idx}
                className={`${styles.item} ${
                  item.danger ? styles.dangerItem : ""
                } ${activeIndex === idx ? styles.activeItem : ""}`}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
};
