import { useEffect, type RefObject } from "react";

/**
 * Lightweight popover behaviour: close on outside pointer-down, on Escape
 * (returning focus to the trigger), or when focus leaves the container.
 */
export function usePopover(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onClose();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
      triggerRef.current?.focus();
    };

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (!next) return;
      if (containerRef.current?.contains(next) || triggerRef.current?.contains(next)) return;
      onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    const container = containerRef.current;
    container?.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      container?.removeEventListener("focusout", onFocusOut);
    };
  }, [open, onClose, containerRef, triggerRef]);
}
