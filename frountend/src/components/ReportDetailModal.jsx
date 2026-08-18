import React, { useState } from 'react';

const ReportDetailModal = ({ report, onClose, onVote, onAuthorClick }) => {
  const userVote = report.userVote || null;

  const handleUpvote = () => {
    let upDelta = 0;
    let downDelta = 0;
    let newVote = null;

    if (userVote === 'up') {
      upDelta = -1;
    } else {
      upDelta = 1;
      if (userVote === 'down') downDelta = -1;
      newVote = 'up';
    }
    
    if (onVote) onVote(report.id, upDelta, downDelta, newVote);
  };

  const handleDownvote = () => {
    let upDelta = 0;
    let downDelta = 0;
    let newVote = null;

    if (userVote === 'down') {
      downDelta = -1;
    } else {
      downDelta = 1;
      if (userVote === 'up') upDelta = -1;
      newVote = 'down';
    }

    if (onVote) onVote(report.id, upDelta, downDelta, newVote);
  };

  if (!report) return null;

  return (
    <div className="modal-overlay" onClick={onClose} onWheel={(e) => e.stopPropagation()} style={{ zIndex: 3000 }}>
      <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h2 className="modal-title" style={{ fontSize: '1.5rem', margin: 0 }}>{report.title || "Report Details"}</h2>
          {report.author && (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => onAuthorClick && onAuthorClick(report.author)}
              title="View Profile"
            >
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 'bold' }}>{report.author.name}</span>
              <img src={report.author.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(report.author.name)} alt={report.author.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        
        {(report.image || report.media) && (
          <div style={{ marginBottom: '15px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={report.image || report.media} alt="Report Media" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '300px', objectFit: 'cover' }} />
          </div>
        )}

        {report.video && (
          <div style={{ marginBottom: '15px', borderRadius: '12px', overflow: 'hidden' }}>
            <video src={report.video} controls style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '300px' }} />
          </div>
        )}
        
        <div style={{ marginBottom: '20px', color: '#e2e8f0', lineHeight: '1.6' }}>
          <strong>Description:</strong>
          <p>{report.description}</p>
        </div>

        {report.websiteLink && (
          <div style={{ marginBottom: '20px', color: '#e2e8f0', lineHeight: '1.6' }}>
            <strong>Website:</strong>
            <p><a href={report.websiteLink} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>{report.websiteLink}</a></p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className={`btn ${userVote === 'up' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '5px' }}
            onClick={handleUpvote}
          >
            <span>👍</span> {report.upvotes || 0}
          </button>
          
          <button 
            className={`btn ${userVote === 'down' ? 'btn-danger' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '5px' }}
            onClick={handleDownvote}
          >
            <span>👎</span> {report.downvotes || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
