import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createRoot } from 'react-dom/client';

let root = null;
let container = null;

const createContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    root = createRoot(container);
  }
  return root;
};

const ToastComponent = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const CustomToast = ({ type, message }) => {
  const severity = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
  
  const root = createContainer();
  root.render(
    <ToastComponent
      open={true}
      message={message}
      severity={severity}
      onClose={() => {
        root.render(null);
      }}
    />
  );
};
