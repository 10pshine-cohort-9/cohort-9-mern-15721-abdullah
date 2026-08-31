import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2" id="modal-headline">
            Delete Note
          </h3>
          <p className="text-sm text-center text-gray-500">
            Are you sure you want to delete <span className="font-medium text-gray-900">"{title || 'this note'}"</span>? This action cannot be undone.
          </p>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 rounded-b-xl gap-3 sm:gap-0">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
            onClick={onConfirm}
            data-testid="confirm-delete-button"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
