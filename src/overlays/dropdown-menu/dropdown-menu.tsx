"use client";

import {
  useState,
  useRef,
  useCallback,
  useId,
  useEffect,
  isValidElement,
  type FC,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Portal } from "../portal";
import { useEscapeKey, useMenuKeyboard, type MenuItem } from "../overlay-hooks";
import styles from "./dropdown-menu.module.css";

export type { MenuItem };

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  id?: string;
  className?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  trigger,
  items,
  id,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const menuId = id ?? generatedId;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const {
    activeIndex,
    setActiveIndex,
    onKeyDown,
    itemRefs,
    menu,
    setMenu,
    enabledIdx,
  } = useMenuKeyboard({ items, open, onClose: close });

  useEscapeKey(close, open);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, close, menu]);

  const openWith = (idx: number) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
    setActiveIndex(idx);
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openWith(enabledIdx[0] ?? -1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openWith(enabledIdx[enabledIdx.length - 1] ?? -1);
    }
  };

  const TriggerTag = isValidElement(trigger) ? Slot : "button";

  return (
    <div className={styles.container}>
      <TriggerTag
        ref={triggerRef as never}
        {...(TriggerTag === "button" ? { type: "button" as const } : {})}
        onClick={() => (open ? close() : openWith(-1))}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        {trigger}
      </TriggerTag>
      {open && coords && (
        <Portal>
          <div
            ref={setMenu}
            id={menuId}
            role="menu"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            className={`${styles.menu} ${className}`.trim()}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
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
