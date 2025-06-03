import React, { useEffect, useRef } from 'react';
import './errorDialog.css';

type ErrorDialogProps = {
  errorMessage: string;
  onClose: () => void;
};

const ErrorDialog: React.FC<ErrorDialogProps> = ({ errorMessage, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    dialog.showModal();
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }

      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [errorMessage]);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
    previouslyFocusedElement.current?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      className="error-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
    >
      <div className="modal-content">
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="close-button"
          aria-label="Close dialog"
        >
          ×
        </button>
        <h2 id="dialog-title">Error</h2>
        <p id="dialog-desc">{errorMessage}</p>
      </div>
    </dialog>
  );
};

export default ErrorDialog;
