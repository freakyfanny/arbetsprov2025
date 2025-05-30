import React, { useEffect, useRef } from 'react';

type ErrorDialogProps = {
  errorMessage: string;
  onClose: () => void;
};

const ErrorDialog: React.FC<ErrorDialogProps> = ({ errorMessage, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Show the dialog when the error happens
    }
  }, [errorMessage]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close(); // Close the dialog
    }
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="error-dialog">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button onClick={handleClose} className="close-button">
          Close
        </button>
      </div>
    </dialog>
  );
};

export default ErrorDialog;
