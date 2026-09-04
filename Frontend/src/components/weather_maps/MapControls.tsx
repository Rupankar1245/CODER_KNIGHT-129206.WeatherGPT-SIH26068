
import React from 'react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onFullscreen: () => void;
  isFullscreen?: boolean;
  isLocating?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  onFullscreen,
  isFullscreen = false,
  isLocating = false,
}) => {
  return (
    <>
      <style>{`
        .meghai-map-controls {
          position: absolute;
          right: 20px;
          top: 20px;
          z-index: 1000;

          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .meghai-map-control-button {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;

          background: rgba(15, 23, 42, 0.82);
          color: #ffffff;

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          box-shadow:
            0 8px 24px
            rgba(0, 0, 0, 0.22);

          cursor: pointer;

          font-size: 20px;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .meghai-map-control-button:hover {
          transform: translateY(-2px);

          background: rgba(30, 41, 59, 0.95);

          border-color:
            rgba(56, 189, 248, 0.5);
        }

        .meghai-map-control-button:active {
          transform: scale(0.96);
        }

        .meghai-map-control-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .meghai-map-control-divider {
          width: 30px;
          height: 1px;

          margin: 1px auto;

          background:
            rgba(255, 255, 255, 0.12);
        }

        .meghai-map-control-locate {
          color: #7dd3fc;
        }

        .meghai-map-control-fullscreen {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .meghai-map-controls {
            right: 12px;
            top: 12px;
            gap: 6px;
          }

          .meghai-map-control-button {
            width: 40px;
            height: 40px;

            border-radius: 10px;

            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .meghai-map-controls {
            top: auto;
            bottom: 16px;
          }
        }
      `}</style>

      <div
        className="meghai-map-controls"
        aria-label="Map controls"
      >
        <button
          type="button"
          className="meghai-map-control-button"
          onClick={onZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          type="button"
          className="meghai-map-control-button"
          onClick={onZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>

        <div className="meghai-map-control-divider" />

        <button
          type="button"
          className="meghai-map-control-button meghai-map-control-locate"
          onClick={onLocate}
          disabled={isLocating}
          title="Use my location"
          aria-label="Use my location"
        >
          {isLocating ? '⌛' : '◎'}
        </button>

        <button
          type="button"
          className="meghai-map-control-button meghai-map-control-fullscreen"
          onClick={onFullscreen}
          title={
            isFullscreen
              ? 'Exit fullscreen'
              : 'Fullscreen'
          }
          aria-label={
            isFullscreen
              ? 'Exit fullscreen'
              : 'Fullscreen'
          }
        >
          {isFullscreen ? '⊠' : '⛶'}
        </button>
      </div>
    </>
  );
};
