"use client";

import { useEffect, useRef } from "react";
import Icon from "./Icon";

export default function ReadingDialog({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    const focusTarget = window.matchMedia("(min-width: 801px)").matches
      ? dialog?.querySelector<HTMLInputElement>("input")
      : dialog?.querySelector<HTMLButtonElement>("[data-dialog-close]");
    focusTarget?.focus({ preventScroll: true });
    const updateHeight = () =>
      dialog?.style.setProperty(
        "--dialog-available-height",
        `${window.visualViewport?.height ?? window.innerHeight}px`,
      );
    updateHeight();
    window.visualViewport?.addEventListener("resize", updateHeight);
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      window.visualViewport?.removeEventListener("resize", updateHeight);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="reading-dialog"
      aria-labelledby="reading-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-heading">
          <div>
            <div className="eyebrow">留一刻，專注在神的話語裡</div>
            <h2 id="reading-dialog-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            data-dialog-close
            type="button"
            onClick={onClose}
            className="icon-button"
            aria-label="關閉視窗"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="dialog-content">{children}</div>
        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </dialog>
  );
}
