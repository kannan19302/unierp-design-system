"use client";

import {
  useState,
  useRef,
  useCallback,
  useId,
  useEffect,
  isValidElement,
  forwardRef,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Portal } from "../../primitives/portal";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { useEscapeKey, useMenuKeyboard, type MenuItem } from "../overlay-hooks";
import styles from "./dropdown-menu.module.css";

export type { MenuItem };

export const dropdownMenuVariants = cva(styles.menu, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface DropdownMenuProps extends VariantProps<typeof dropdownMenuVariants> {
  trigger: ReactNode;
  items: MenuItem[];
  id?: string;
  className?: string;
}

/**
 * `<DropdownMenu>` — Accessible action dropdown menu anchored to trigger with full WAI-ARIA keyboard navigation.
 * Benchmarked against shadcn DropdownMenu, Radix Menu, and SLDS Action Dropdown.
 *
 * @maturity stable
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      trigger,
      items,
      id,
      density = "standard",
      className = "",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{ blockStart: number; inlineStart: number } | null>(null);
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
        setCoords({ blockStart: rect.bottom + 4, inlineStart: rect.left });
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
      <div ref={ref} data-slot="dropdown-menu-container" className={styles.container}>
        <TriggerTag
          ref={triggerRef as never}
          data-slot="dropdown-menu-trigger"
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
              data-slot="dropdown-menu"
              data-density={density}
              onKeyDown={onKeyDown}
              tabIndex={-1}
              className={dropdownMenuVariants({ density, className })}
              style={{
                insetBlockStart: `${coords.blockStart}px`,
                insetInlineStart: `${coords.inlineStart}px`,
              }}
            >
              {items.map((item, idx) => (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  data-slot="dropdown-menu-item"
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
                  {item.icon && (
                    <span data-slot="dropdown-menu-item-icon" className={styles.icon}>
                      {item.icon}
                    </span>
                  )}
                  <span data-slot="dropdown-menu-item-label" className={styles.label}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </Portal>
        )}
      </div>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";
