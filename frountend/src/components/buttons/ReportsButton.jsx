import React from "react";

const ReportsButton = ({ onClick, label = "Reports" }) => {
  return (
    <button className="btn btn-yellow footer-btn" onClick={onClick}>
      {label}
    </button>
  );
};

export default ReportsButton;
