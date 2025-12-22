import React from 'react';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl shadow-black/40 border border-border/60 bg-card/80 backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-background/40 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;