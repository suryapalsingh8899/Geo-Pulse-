import React, { useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const ProfileModal = ({ showModal, onClose, userStats, reports, events, onDelete, onDeleteEvent, onEdit, onEditEvent, userName, setUserName, profilePic, setProfilePic }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('reports');
  
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const myReports = reports ? reports.filter(r => r.isMine) : [];
  const myEvents = events ? events.filter(e => e.isMine) : [];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    // reset input so the same file can be selected again if cancelled
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProfilePic(croppedImage);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelCrop = () => {
    setImageToCrop(null);
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose} onWheel={(e) => e.stopPropagation()} style={{ zIndex: 4000 }}>
      <div className="modal-card glass-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px', marginTop: '15px' }}>
          {imageToCrop ? (
            <div style={{ position: 'relative', width: '100%', height: '300px', background: '#333', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px' }}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
              <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
                <button className="btn btn-outline" style={{ background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white' }} onClick={cancelCrop}>Cancel</button>
                <button className="btn btn-primary" onClick={saveCrop}>Save Crop</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '3px solid #2dd4bf', cursor: 'pointer', marginBottom: '10px' }} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                {profilePic ? (
                  <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2.5rem' }}>📷</span>
                )}
                <div style={{ position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.6)', width: '100%', textAlign: 'center', fontSize: '0.7rem', padding: '2px 0', color: 'white' }}>Edit</div>
              </div>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                {isEditingName ? (
                  <>
                    <input 
                      type="text" 
                      value={tempName} 
                      onChange={(e) => setTempName(e.target.value)} 
                      style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '5px 10px', color: 'white', fontSize: '1.5rem', width: '200px', outline: 'none' }}
                      autoFocus
                    />
                    <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => { setUserName(tempName); setIsEditingName(false); }}>Save</button>
                    <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => { setTempName(userName); setIsEditingName(false); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#f8fafc' }}>{userName}</h2>
                    <span style={{ cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }} onClick={() => { setTempName(userName); setIsEditingName(true); }}>✏️</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <div style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2dd4bf' }}>{userStats.totalUpvotes}</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Upvotes</div>
          </div>
          <div style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{userStats.totalDownvotes}</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Downvotes</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'reports' ? '#2dd4bf' : '#94a3b8', 
              borderBottom: activeTab === 'reports' ? '2px solid #2dd4bf' : '2px solid transparent',
              padding: '10px 15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('reports')}
          >
            My Reports
          </button>
          <button 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === 'events' ? '#ec4899' : '#94a3b8', 
              borderBottom: activeTab === 'events' ? '2px solid #ec4899' : '2px solid transparent',
              padding: '10px 15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('events')}
          >
            My Events
          </button>
        </div>
        
        {activeTab === 'reports' && (
          myReports.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>You haven't submitted any reports yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myReports.map(report => (
                <div key={report.id} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>{report.title || 'Report'}</h4>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => onEdit(report)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => onDelete(report.id)}>Delete</button>
                    </div>
                  </div>
                  {(report.image || report.media) && (
                    <img src={report.image || report.media} alt="Report Media" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  )}
                  {report.video && (
                    <video src={report.video} controls style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#000' }} />
                  )}
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '10px' }}>{report.description}</p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <span>👍 {report.upvotes || 0}</span>
                    <span>👎 {report.downvotes || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'events' && (
          myEvents.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>You haven't posted any events yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {myEvents.map(event => (
                <div key={event.id} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>{event.title || 'Event'}</h4>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => onEditEvent && onEditEvent(event)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444' }} onClick={() => onDeleteEvent && onDeleteEvent(event.id)}>Delete</button>
                    </div>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {event.startTime && event.endTime 
                      ? `${new Date(event.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} to ${new Date(event.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`
                      : event.timing}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{event.isPublic ? 'Public' : 'Private'} Event</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
