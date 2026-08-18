import React from 'react';

const LogoutButton = ({ onClick }) => {
  return (
    <button 
      className="btn btn-danger" 
      style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: '#fff', marginLeft: '10px', padding: '0.6rem 1.2rem', borderRadius: '10px' }} 
      onClick={onClick}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
