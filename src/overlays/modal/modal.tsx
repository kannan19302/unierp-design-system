import {
  useState,
  useId,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { X } from "lucide-react";
import { Portal } from "../../primitives/portal";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../overlay-hooks";
import styles from "./modal.module.css";

/**
 * Class variance authority definitions for Modal/Dialog.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const modalVariants = cva(styles.dialog, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      xl: styles.xl,
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ModalProps extends VariantProps<typeof modalVariants> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  children?: ReactNode;
  closeOnOverlay?: boolean;
  className?: string;
  /** Accessible name when no visible title is present */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * `<Modal>` / `<Dialog>` — WAI-ARIA accessible dialog with focus trap, scroll lock, and portal mounting.
 * Follows shadcn/ui and Strata design system standards with full cva, data-slot, and APG compliance.
 * @maturity stable
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      size = "md",
      footer,
      children,
      closeOnOverlay = true,
      className = "",
      "aria-label": ariaLabel,
      "aria-labelledby": customAriaLabelledBy,
      "aria-describedby": customAriaDescribedBy,
    },
    ref,
  ) => {
    const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
    const autoId = useId();
    const titleId = title ? `modal-title-${autoId}` : undefined;
    const descId = description ? `modal-desc-${autoId}` : undefined;

    useEscapeKey(onClose, open);
    useFocusTrap(dialog, open);
    useScrollLock(open);

    if (!open) return null;

    const dialogClass = modalVariants({ size, className });

    const resolvedLabelledBy = customAriaLabelledBy ?? titleId;
    const resolvedDescribedBy = customAriaDescribedBy ?? descId;

    return (
      <Portal>
        <div
          data-slot="modal-backdrop"
          className={styles.backdrop}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={(node) => {
            setDialog(node);
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as any).current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          data-slot="modal"
          data-size={size}
          aria-labelledby={resolvedLabelledBy}
          aria-describedby={resolvedDescribedBy}
          aria-label={
            !resolvedLabelledBy
              ? ariaLabel ?? (typeof title === "string" ? title : undefined)
              : undefined
          }
          className={dialogClass}
          tabIndex={-1}
        >
          {(title || description) && (
            <div data-slot="modal-header" className={styles.header}>
              <div>
                {title && (
                  <h2 id={titleId} data-slot="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} data-slot="modal-description" className={styles.description}>
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                data-slot="modal-close"
                className={styles.closeBtn}
                aria-label="Close"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}
          <div data-slot="modal-body" className={styles.body}>
            {children}
          </div>
          {footer && (
            <div data-slot="modal-footer" className={styles.footer}>
              {footer}
            </div>
          )}
        </div>
      </Portal>
    );
  },
);

Modal.displayName = "Modal";

/** Canonical Dialog alias matching shadcn/ui nomenclature */
export const Dialog = Modal;
export type DialogProps = ModalProps;

/** Sub-components for compound dialog composition */
export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-header" className={cn(styles.header, className)} {...props} />
);

export const DialogTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 data-slot="dialog-title" className={cn(styles.title, className)} {...props} />
);

export const DialogDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p data-slot="dialog-description" className={cn(styles.description, className)} {...props} />
);

export const DialogContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-body" className={cn(styles.body, className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-footer" className={cn(styles.footer, className)} {...props} />
);
