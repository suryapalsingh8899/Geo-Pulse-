import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Viewer, Color, UrlTemplateImageryProvider, Cartesian3, createOsmBuildingsAsync, Cesium3DTileStyle, CameraEventType, ImageMaterialProperty, ScreenSpaceEventHandler, ScreenSpaceEventType, Math as CesiumMath } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import ReportsButton from './buttons/ReportsButton';
import ReportDetailModal from './ReportDetailModal';
import AddReportModal from './AddReportModal';
import EventDetailModal from './EventDetailModal';
import AddEventModal from './AddEventModal';
import SettingsModal from './SettingsModal';
import { useTranslation } from 'react-i18next';

const mockEvents = [
  {
    id: 201, lat: 28.62, lng: 77.20, title: "Delhi Music Festival", description: "Annual music festival at Connaught Place featuring local bands and food stalls. Come enjoy the evening!",
    poster: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    timing: "6:00 PM - 11:00 PM, Oct 25", isPublic: true,
    photos: ["https://images.unsplash.com/photo-1540039155732-684736dd6330?w=400&q=80", "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?w=400&q=80"],
    videos: []
  },
  {
    id: 202, lat: 19.07, lng: 72.87, title: "Tech Innovators Conference", description: "A premier tech conference in Mumbai focusing on AI and Web3.",
    poster: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    timing: "9:00 AM - 5:00 PM, Nov 2-3", isPublic: false,
    photos: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80"],
    videos: []
  },
  {
    id: 203, lat: 12.97, lng: 77.59, title: "Bangalore Food Carnival", description: "Taste the best street food and cuisines from all over India.",
    poster: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    timing: "11:00 AM - 10:00 PM, Dec 15", isPublic: true,
    photos: ["https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"],
    videos: []
  }
];

function Map({
  isLoggedIn = false,
  onRequireLogin,
  reports = [],
  setReports,
  events = [],
  setEvents,
  onVote,
  onEventVote,
  onReportOpened,
  onEventOpened,
  onAuthorClick,
  userName,
  setUserName
}) {
  const { t } = useTranslation();
  const cesiumContainer = useRef(null);
  const viewerInstance = useRef(null);
  const zoomVelocityRef = useRef(0);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isEventMode, setIsEventMode] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const selectedReport = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;
  const [selectedEventId, setSelectedEventId] = useState(null);
  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isSelectingEventLocation, setIsSelectingEventLocation] = useState(false);
  const [newReportLocation, setNewReportLocation] = useState(null);
  const [newEventLocation, setNewEventLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let watchId;
    if (locationEnabled && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error watching location:", error);
          if (error.code === 1) { // PERMISSION_DENIED
            setLocationEnabled(false);
            setUserLocation(null);
            alert("Location permission denied. Please enable it in your browser settings.");
          }
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      setUserLocation(null);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locationEnabled]);

  useEffect(() => {
    if (viewerInstance.current && userLocation && locationEnabled) {
      const viewer = viewerInstance.current;
      let locationEntity = viewer.entities.getById('user-location-dot');
      if (!locationEntity) {
        viewer.entities.add({
          id: 'user-location-dot',
          position: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat),
          point: {
            pixelSize: 10,
            color: Color.DODGERBLUE,
            outlineColor: Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY // Always render on top
          }
        });
      } else {
        locationEntity.position = Cartesian3.fromDegrees(userLocation.lng, userLocation.lat);
      }
      viewer.scene.requestRender();
    } else if (viewerInstance.current && (!locationEnabled || !userLocation)) {
      const viewer = viewerInstance.current;
      const locationEntity = viewer.entities.getById('user-location-dot');
      if (locationEntity) {
        viewer.entities.remove(locationEntity);
        viewer.scene.requestRender();
      }
    }
  }, [userLocation, locationEnabled]);

  useEffect(() => {
    if (cesiumContainer.current && !viewerInstance.current) {
      // Initialize the Cesium Viewer directly
      viewerInstance.current = new Viewer(cesiumContainer.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        selectionIndicator: false,
        baseLayer: false, // Do not load default imagery (Bing Maps)
        requestRenderMode: true, // Renders only on changes (improves time complexity/CPU usage)
        maximumRenderTimeChange: Infinity,
        // Default skyBox and skyAtmosphere are enabled to show the beautiful starry space background
      });

      const viewer = viewerInstance.current;
      viewer.scene.fog.enabled = false; // Disable fog calculation to drastically save GPU fragment shader processing

      // Prevent 3D buildings from rendering through the globe and floating in the sky
      viewer.scene.globe.depthTestAgainstTerrain = true;

      // Snapchat Earth has a beautiful glowing blue/cyan atmosphere around the dark globe
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.hueShift = -0.1; // Shift towards blue/cyan
        viewer.scene.skyAtmosphere.saturationShift = 0.5; // Make the glow more vibrant
        viewer.scene.skyAtmosphere.brightnessShift = 0.5; // Make it glow brighter
      }

      // Snapchat Dark Mode: Background is totally black void
      viewer.scene.backgroundColor = Color.BLACK;
      if (viewer.scene.sun) viewer.scene.sun.show = false; // Saves render time
      if (viewer.scene.moon) viewer.scene.moon.show = false; // Saves render time

      // Use Google Maps raster tiles to provide Snapchat/Google Maps level label density, forced strictly to English (hl=en)
      const osmProvider = new UrlTemplateImageryProvider({
        url: 'https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
        credit: '© Google Maps',
        maximumLevel: 19,
        enablePickFeatures: false
      });
      const baseLayer = viewer.imageryLayers.addImageryProvider(osmProvider);

      // Match exact Snapchat Dark Mode (dark slate land, black water)
      baseLayer.brightness = 0.25;
      baseLayer.contrast = 1.35;
      baseLayer.saturation = 0.1;
      baseLayer.gamma = 0.8;



      // Set view directly to India to massively speed up initial load (avoids loading tiles along a flight path)
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(78.9629, 20.5937, 5000000.0) // Center of India at ~5000km height
      });
      // Limit zoom out
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000.0;
      // Lower the basemap detail threshold slightly to download fewer tiles over the network
      viewer.scene.globe.maximumScreenSpaceError = 3;

      // Remove Cesium logo/credits overlay for clean UI
      viewer.cesiumWidget.creditContainer.style.display = 'none';

      // Disable default double-click zooming on entities (prevents camera clipping/blanking)
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      // Optimize native camera controls for smooth interaction
      const controller = viewer.scene.screenSpaceCameraController;
      controller.inertiaSpin = 0.9;
      controller.inertiaTranslate = 0.9;
      // Enforce pitch limit when zoomed in
      viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        { eventType: CameraEventType.LEFT_DRAG, modifier: 1 }, // KeyboardEventModifier.CTRL is 1
        { eventType: CameraEventType.RIGHT_DRAG, modifier: 1 }
      ];

      const enforcePitch = () => {
        if (viewer.camera.pitch > CesiumMath.toRadians(-20)) {
          viewer.camera.setView({
            orientation: {
              heading: viewer.camera.heading,
              pitch: CesiumMath.toRadians(-20),
              roll: 0.0
            }
          });
        }
      };
      viewer.camera.changed.addEventListener(enforcePitch);

      // Custom smooth inertia zoom for trackpads
      const handleTick = () => {
        if (Math.abs(zoomVelocityRef.current) > 0.01) {
          if (zoomVelocityRef.current > 0) {
            if (viewer.camera.positionCartographic.height >= 10000000) {
              zoomVelocityRef.current = 0;
            } else {
              viewer.camera.zoomOut(zoomVelocityRef.current * 0.15);
            }
          } else {
            viewer.camera.zoomIn(-zoomVelocityRef.current * 0.15);
          }
          zoomVelocityRef.current *= 0.85; // Apply friction

          // Request render since we disabled continuous rendering
          viewer.scene.requestRender();
        }
      };

      viewer.clock.onTick.addEventListener(handleTick);
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []); // Empty dependency array ensures viewer is created only once

  // Force Cesium to re-render when UI overlays open/close since requestRenderMode is true
  useEffect(() => {
    if (viewerInstance.current && !viewerInstance.current.isDestroyed()) {
      viewerInstance.current.scene.requestRender();
      setTimeout(() => { if (viewerInstance.current && !viewerInstance.current.isDestroyed()) viewerInstance.current.scene.requestRender(); }, 50);
    }
  }, [selectedReportId, selectedEventId, isSelectingLocation, isSelectingEventLocation, isReportMode, isEventMode]);

  useEffect(() => {
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;

    // Remove all entities except the live location dot
    viewer.entities.values.slice().forEach(entity => {
      if (entity.id !== 'user-location-dot') {
        viewer.entities.remove(entity);
      }
    });

    if (isReportMode || isEventMode) {
      viewer.scene.postProcessStages.bloom.enabled = true;
      viewer.scene.postProcessStages.bloom.uniforms.contrast = 128;
      viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.3;
      viewer.scene.postProcessStages.bloom.uniforms.delta = 1.0;
      viewer.scene.postProcessStages.bloom.uniforms.sigma = 1.5;
      viewer.scene.postProcessStages.bloom.uniforms.stepSize = 2.0;

      const createHeatmapImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

        // Red core, yellow outer, fading to transparent
        // When these stack, the red cores will multiply and become highly visible
        if (isEventMode) {
          gradient.addColorStop(0, 'rgba(255, 20, 147, 0.4)'); // Pink core
          gradient.addColorStop(0.3, 'rgba(255, 105, 180, 0.2)');
          gradient.addColorStop(0.6, 'rgba(255, 182, 193, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 192, 203, 0.0)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
          gradient.addColorStop(0.3, 'rgba(255, 165, 0, 0.2)');
          gradient.addColorStop(0.6, 'rgba(255, 255, 0, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 0, 0.0)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return canvas;
      };

      const createSeenHeatmapImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

        gradient.addColorStop(0, 'rgba(128, 128, 128, 0.4)');
        gradient.addColorStop(0.3, 'rgba(128, 128, 128, 0.2)');
        gradient.addColorStop(0.6, 'rgba(128, 128, 128, 0.1)');
        gradient.addColorStop(1, 'rgba(128, 128, 128, 0.0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return canvas;
      };

      const heatmapImage = createHeatmapImage();
      const seenHeatmapImage = createSeenHeatmapImage();

      if (isReportMode) {
        reports.forEach((report) => {
          viewer.entities.add({
            id: `report-${report.id}`,
            position: Cartesian3.fromDegrees(report.lng, report.lat),
            billboard: {
              image: report.seen ? seenHeatmapImage : heatmapImage,
              width: 45,
              height: 45,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            description: report.description
          });
        });
      } else if (isEventMode) {
        events.forEach((event) => {
          viewer.entities.add({
            id: `event-${event.id}`,
            position: Cartesian3.fromDegrees(event.lng, event.lat),
            billboard: {
              image: event.seen ? seenHeatmapImage : heatmapImage,
              width: 55,
              height: 55,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            description: event.description
          });
        });
      }
      viewer.scene.requestRender();
      // Cesium's texture atlas takes a moment to process the dynamic canvas images. 
      // Since requestRenderMode is true, we must manually request renders shortly after.
      setTimeout(() => { if (viewerInstance.current && !viewerInstance.current.isDestroyed()) viewerInstance.current.scene.requestRender(); }, 100);
      setTimeout(() => { if (viewerInstance.current && !viewerInstance.current.isDestroyed()) viewerInstance.current.scene.requestRender(); }, 400);
    } else {
      viewer.scene.postProcessStages.bloom.enabled = false;
      viewer.scene.requestRender();
      setTimeout(() => { if (viewerInstance.current && !viewerInstance.current.isDestroyed()) viewerInstance.current.scene.requestRender(); }, 100);
    }
  }, [isReportMode, isEventMode, reports, events]);

  useEffect(() => {
    if (!viewerInstance.current) return;
    const viewer = viewerInstance.current;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    if (isReportMode || isEventMode) {
      if (isSelectingLocation || isSelectingEventLocation) {
        const cursorSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23ef4444" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
        viewer.canvas.style.cursor = `url('${cursorSvg}') 18 36, crosshair`;
        handler.setInputAction((click) => {
          const cartesian = viewer.scene.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
          if (cartesian) {
            const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            const lon = CesiumMath.toDegrees(cartographic.longitude);
            const lat = CesiumMath.toDegrees(cartographic.latitude);

            if (isSelectingLocation) {
              setNewReportLocation({ lat, lng: lon });
              setIsSelectingLocation(false);
            } else if (isSelectingEventLocation) {
              setNewEventLocation({ lat, lng: lon });
              setIsSelectingEventLocation(false);
            }
            viewer.canvas.style.cursor = 'default';
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      } else {
        viewer.canvas.style.cursor = 'default';
        handler.setInputAction((click) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (pickedObject && pickedObject.id && typeof pickedObject.id.id === 'string') {
            if (pickedObject.id.id.startsWith('report-')) {
              if (!isLoggedIn) {
                if (onRequireLogin) onRequireLogin();
                return;
              }
              const reportId = parseInt(pickedObject.id.id.replace('report-', ''), 10);
              const report = reports.find(r => r.id === reportId);
              if (report) {
                setSelectedReportId(reportId);
                if (onReportOpened && !report.seen) {
                  onReportOpened(reportId);
                }
              }
            } else if (pickedObject.id.id.startsWith('event-')) {
              if (!isLoggedIn) {
                if (onRequireLogin) onRequireLogin();
                return;
              }
              const eventId = parseInt(pickedObject.id.id.replace('event-', ''), 10);
              const event = events.find(e => e.id === eventId);
              if (event) {
                setSelectedEventId(eventId);
                if (onEventOpened && !event.seen) {
                  onEventOpened(eventId);
                }
              }
            } else if (pickedObject.id.id === 'user-location-dot') {
              if (userLocation) {
                const currentHeight = viewer.camera.positionCartographic.height;
                if (currentHeight < 5000) {
                  viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat, 10000000.0),
                    duration: 1.5
                  });
                } else {
                  viewer.camera.flyTo({
                    destination: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat, 2000.0),
                    duration: 1.5
                  });
                }
              }
            }
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      }
    } else {
      viewer.canvas.style.cursor = 'default';
      handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (pickedObject && pickedObject.id && typeof pickedObject.id.id === 'string') {
          if (pickedObject.id.id === 'user-location-dot') {
            if (userLocation) {
              const currentHeight = viewer.camera.positionCartographic.height;
              if (currentHeight < 5000) {
                viewer.camera.flyTo({
                  destination: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat, 10000000.0),
                  duration: 1.5
                });
              } else {
                viewer.camera.flyTo({
                  destination: Cartesian3.fromDegrees(userLocation.lng, userLocation.lat, 2000.0),
                  duration: 1.5
                });
              }
            }
          }
        }
      }, ScreenSpaceEventType.LEFT_CLICK);
    }

    return () => {
      handler.destroy();
    };
  }, [isReportMode, isEventMode, isLoggedIn, onRequireLogin, isSelectingLocation, isSelectingEventLocation, reports, events, userLocation, onEventOpened]);

  const handleWheel = (e) => {
    if (viewerInstance.current) {
      const camera = viewerInstance.current.camera;
      const height = camera.positionCartographic.height;
      if (e.deltaY > 0 && height >= 10000000) {
        zoomVelocityRef.current = 0;
        return;
      }
      const sensitivity = height * 0.0050;
      zoomVelocityRef.current += e.deltaY * sensitivity;
      viewerInstance.current.scene.requestRender();
    }
  };

  const handleAddReportSubmit = (reportData) => {
    const newReport = {
      ...reportData,
      id: Date.now(), // Generate a unique ID
      upvotes: 0,
      downvotes: 0,
      isMine: true
    };
    setReports([...reports, newReport]);
    setNewReportLocation(null);
  };

  const handleAddEventSubmit = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(), // Generate a unique ID
      isMine: true
    };
    setEvents([...events, newEvent]);
    setNewEventLocation(null);
  };

  return (
    <div className="map-wrapper" onWheel={handleWheel}>
      <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
      {selectedReport && createPortal(
        <ReportDetailModal report={selectedReport} onClose={() => setSelectedReportId(null)} onVote={onVote} onAuthorClick={onAuthorClick} userLocation={userLocation} />,
        document.body
      )}
      {selectedEvent && createPortal(
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEventId(null)} onVote={onEventVote} onAuthorClick={onAuthorClick} userLocation={userLocation} />,
        document.body
      )}

      {isSelectingLocation && (
        <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '15px 30px', borderRadius: '30px', color: 'white', zIndex: 100, border: '1px solid #2dd4bf', boxShadow: '0 0 20px rgba(45, 212, 191, 0.5)' }}>
          Click anywhere on the map to pin the report location!
          <button style={{ marginLeft: '15px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsSelectingLocation(false)}>Cancel</button>
        </div>
      )}

      {isSelectingEventLocation && (
        <div style={{ position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '15px 30px', borderRadius: '30px', color: 'white', zIndex: 100, border: '1px solid #ec4899', boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>
          Choose the location on the map to pin the event!
          <button style={{ marginLeft: '15px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsSelectingEventLocation(false)}>Cancel</button>
        </div>
      )}

      {newReportLocation && createPortal(
        <AddReportModal
          location={newReportLocation}
          onSubmit={handleAddReportSubmit}
          onClose={() => setNewReportLocation(null)}
        />,
        document.body
      )}

      {newEventLocation && createPortal(
        <AddEventModal
          location={newEventLocation}
          onSubmit={handleAddEventSubmit}
          onClose={() => setNewEventLocation(null)}
        />,
        document.body
      )}

      {isSettingsOpen && createPortal(
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          locationEnabled={locationEnabled}
          setLocationEnabled={setLocationEnabled}
          alertsEnabled={alertsEnabled}
          setAlertsEnabled={setAlertsEnabled}
          userName={userName}
          setUserName={setUserName}
        />,
        document.body
      )}

      <div className="map-footer">
        <div className="map-footer-content">
          {isReportMode ? (
            <>
              <button className="btn btn-yellow footer-btn" onClick={() => {
                if (!isLoggedIn && onRequireLogin) return onRequireLogin();
                setIsSelectingLocation(true);
              }}>{t('addReport')}</button>
              <button className="btn btn-outline footer-btn" onClick={() => {
                setIsReportMode(false);
                setIsSelectingLocation(false);
              }}>{t('goBack')}</button>
            </>
          ) : isEventMode ? (
            <>
              <button className="btn btn-pink footer-btn" onClick={() => {
                if (!isLoggedIn && onRequireLogin) return onRequireLogin();
                setIsSelectingEventLocation(true);
              }}>{t('addEvent')}</button>
              <button className="btn btn-outline footer-btn" onClick={() => {
                setIsEventMode(false);
                setIsSelectingEventLocation(false);
              }}>{t('goBack')}</button>
            </>
          ) : (
            <>
              <ReportsButton onClick={() => setIsReportMode(true)} label={t('reports')} />
              <button className="btn btn-outline footer-btn" onClick={() => {
                setIsSettingsOpen(true);
              }}>{t('settings')}</button>
              <button className="btn btn-pink footer-btn" onClick={() => {
                setIsEventMode(true);
              }}>{t('events')}</button>
              <button className="btn btn-danger footer-btn" onClick={() => {
                alert("Coming soon!");
              }}>Alerts</button>
              <button className="btn btn-outline footer-btn" onClick={() => {
                alert("Coming soon!");
              }}>Info</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
