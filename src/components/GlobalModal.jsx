import React from 'react';
import ReactDOM from 'react-dom';
import './GlobalModal.css';

const GlobalModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="global-modal-overlay" onClick={onClose}>
      <div className="global-modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default GlobalModal;
