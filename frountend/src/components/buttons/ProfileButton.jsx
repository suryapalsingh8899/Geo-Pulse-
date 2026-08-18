import React from 'react';

const ProfileButton = ({ onClick }) => {
  return (
    <button 
      className="btn btn-outline" 
      style={{ background: 'rgba(15, 23, 42, 0.7)', border: 'none', color: '#fff' }} 
      onClick={onClick}
    >
      Profile
    </button>
  );
};

export default ProfileButton;
