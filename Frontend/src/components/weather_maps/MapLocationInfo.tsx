
import React from 'react';

interface LocationWeatherData {
  name?: string;
  lat: number;
  lon: number;
  temperature?: number;
  windSpeed?: number;
  windDirection?: number;
  rain?: number;
  pressure?: number;
}

interface MapLocationInfoProps {
  data: LocationWeatherData | null;
  onClose?: () => void;
}

export const MapLocationInfo: React.FC<MapLocationInfoProps> = ({
  data,
  onClose,
}) => {
  if (!data) {
    return null;
  }

  const formatCoordinate = (value: number) =>
    `${value.toFixed(3)}°`;

  return (
    <>
      <style>{`
        .meghai-location-info {
          position: absolute;
          left: auto;
          right: 20px;
          bottom: 20px;
          z-index: 1000;

          width: 260px;
          padding: 16px;

          border-radius: 16px;

          background: rgba(15, 23, 42, 0.88);

          border: 1px solid
            rgba(255, 255, 255, 0.12);

          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          box-shadow:
            0 14px 35px
            rgba(0, 0, 0, 0.28);

          color: #ffffff;
        }

        .meghai-location-info-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 12px;
          margin-bottom: 14px;
        }

        .meghai-location-info-title {
          min-width: 0;
        }

        .meghai-location-info-title h3 {
          margin: 0;

          font-size: 15px;
          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meghai-location-coordinates {
          display: block;

          margin-top: 4px;

          font-size: 10px;

          color:
            rgba(255, 255, 255, 0.48);
        }

        .meghai-location-close {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border: none;
          border-radius: 8px;

          background:
            rgba(255, 255, 255, 0.08);

          color:
            rgba(255, 255, 255, 0.7);

          cursor: pointer;
          font-size: 18px;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .meghai-location-close:hover {
          background:
            rgba(239, 68, 68, 0.18);

          color: #ffffff;
        }

        .meghai-location-weather-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;

          gap: 8px;
        }

        .meghai-location-weather-item {
          padding: 10px;

          border-radius: 11px;

          background:
            rgba(255, 255, 255, 0.05);

          border:
            1px solid
            rgba(255, 255, 255, 0.05);
        }

        .meghai-location-weather-label {
          display: block;

          margin-bottom: 5px;

          font-size: 9px;
          font-weight: 600;

          letter-spacing: 0.05em;
          text-transform: uppercase;

          color:
            rgba(255, 255, 255, 0.45);
        }

        .meghai-location-weather-value {
          display: flex;
          align-items: baseline;

          gap: 4px;

          font-size: 16px;
          font-weight: 700;

          color: #ffffff;
        }

        .meghai-location-weather-unit {
          font-size: 10px;
          font-weight: 500;

          color:
            rgba(255, 255, 255, 0.5);
        }

        .meghai-location-empty-value {
          color:
            rgba(255, 255, 255, 0.35);

          font-size: 14px;
        }

        @media (max-width: 768px) {
          .meghai-location-info {
            left: auto;
            right: 12px;
            bottom: 16px;

            width: min(
              260px,
              calc(100% - 80px)
            );

            padding: 14px;
          }
        }

        @media (max-width: 480px) {
          .meghai-location-info {
            left: 12px;
            right: 12px;
            bottom: 12px;

            width: auto;
          }
        }
      `}</style>

      <div className="meghai-location-info">
        <div className="meghai-location-info-header">
          <div className="meghai-location-info-title">
            <h3>
              📍 {data.name || 'Selected Location'}
            </h3>

            <span className="meghai-location-coordinates">
              {formatCoordinate(data.lat)} ·{' '}
              {formatCoordinate(data.lon)}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              className="meghai-location-close"
              onClick={onClose}
              aria-label="Close location information"
            >
              ×
            </button>
          )}
        </div>

        <div className="meghai-location-weather-grid">
          <div className="meghai-location-weather-item">
            <span className="meghai-location-weather-label">
              Temperature
            </span>

            <div className="meghai-location-weather-value">
              {data.temperature !== undefined ? (
                <>
                  {Math.round(data.temperature)}
                  <span className="meghai-location-weather-unit">
                    °C
                  </span>
                </>
              ) : (
                <span className="meghai-location-empty-value">
                  —
                </span>
              )}
            </div>
          </div>

          <div className="meghai-location-weather-item">
            <span className="meghai-location-weather-label">
              Wind
            </span>

            <div className="meghai-location-weather-value">
              {data.windSpeed !== undefined ? (
                <>
                  {Math.round(data.windSpeed)}
                  <span className="meghai-location-weather-unit">
                    km/h
                  </span>
                </>
              ) : (
                <span className="meghai-location-empty-value">
                  —
                </span>
              )}
            </div>
          </div>

          <div className="meghai-location-weather-item">
            <span className="meghai-location-weather-label">
              Rain
            </span>

            <div className="meghai-location-weather-value">
              {data.rain !== undefined ? (
                <>
                  {data.rain.toFixed(1)}
                  <span className="meghai-location-weather-unit">
                    mm
                  </span>
                </>
              ) : (
                <span className="meghai-location-empty-value">
                  —
                </span>
              )}
            </div>
          </div>

          <div className="meghai-location-weather-item">
            <span className="meghai-location-weather-label">
              Pressure
            </span>

            <div className="meghai-location-weather-value">
              {data.pressure !== undefined ? (
                <>
                  {Math.round(data.pressure)}
                  <span className="meghai-location-weather-unit">
                    hPa
                  </span>
                </>
              ) : (
                <span className="meghai-location-empty-value">
                  —
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
