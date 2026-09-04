
import React from 'react';

export type WeatherLayer =
  | 'wind'
  | 'temp'
  | 'rain'
  | 'clouds'
  | 'pressure';

interface LayerSelectorProps {
  activeLayer: WeatherLayer;
  onLayerChange: (layer: WeatherLayer) => void;
}

interface LayerItem {
  id: WeatherLayer;
  label: string;
  icon: string;
  description: string;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({
  activeLayer,
  onLayerChange,
}) => {
  const layers: LayerItem[] = [
    {
      id: 'wind',
      label: 'Wind',
      icon: '↝',
      description: 'Wind speed & direction',
    },
    {
      id: 'temp',
      label: 'Temperature',
      icon: '°',
      description: 'Temperature',
    },
    {
      id: 'rain',
      label: 'Rain',
      icon: '☂',
      description: 'Precipitation',
    },
    {
      id: 'clouds',
      label: 'Clouds',
      icon: '☁',
      description: 'Cloud coverage',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      icon: '◉',
      description: 'Atmospheric pressure',
    },
  ];

  return (
    <>
      <style>{`
        .meghai-layer-selector {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1000;

          display: flex;
          flex-direction: column;
          gap: 6px;

          padding: 8px;

          width: 180px;

          background: rgba(15, 23, 42, 0.82);

          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          border: 1px solid
            rgba(255, 255, 255, 0.12);

          border-radius: 16px;

          box-shadow:
            0 12px 32px
            rgba(0, 0, 0, 0.28);
        }

        .meghai-layer-title {
          padding:
            6px 8px 10px;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 0.08em;
          text-transform: uppercase;

          color:
            rgba(255, 255, 255, 0.5);
        }

        .meghai-layer-button {
          width: 100%;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 10px;

          border: none;
          border-radius: 10px;

          background: transparent;

          color:
            rgba(255, 255, 255, 0.72);

          cursor: pointer;

          text-align: left;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .meghai-layer-button:hover {
          background:
            rgba(255, 255, 255, 0.08);

          color: #ffffff;
        }

        .meghai-layer-button:active {
          transform: scale(0.98);
        }

        .meghai-layer-button.active {
          background:
            rgba(56, 189, 248, 0.16);

          color: #ffffff;
        }

        .meghai-layer-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 9px;

          background:
            rgba(255, 255, 255, 0.07);

          font-size: 18px;

          color: #7dd3fc;
        }

        .meghai-layer-button.active
        .meghai-layer-icon {
          background:
            rgba(56, 189, 248, 0.2);

          color: #38bdf8;
        }

        .meghai-layer-content {
          min-width: 0;
        }

        .meghai-layer-name {
          display: block;

          font-size: 13px;
          font-weight: 600;

          line-height: 1.2;
        }

        .meghai-layer-description {
          display: block;

          margin-top: 2px;

          font-size: 10px;

          color:
            rgba(255, 255, 255, 0.42);

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .meghai-layer-selector {
            top: 12px;
            left: 12px;

            width: auto;
          }

          .meghai-layer-title,
          .meghai-layer-content {
            display: none;
          }

          .meghai-layer-button {
            width: 42px;
            height: 42px;

            padding: 5px;

            justify-content: center;
          }

          .meghai-layer-icon {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>

      <div className="meghai-layer-selector">
        <div className="meghai-layer-title">
          Weather Layers
        </div>

        {layers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            className={`meghai-layer-button ${
              activeLayer === layer.id ? 'active' : ''
            }`}
            onClick={() => onLayerChange(layer.id)}
            title={layer.description}
          >
            <span className="meghai-layer-icon">
              {layer.icon}
            </span>

            <span className="meghai-layer-content">
              <span className="meghai-layer-name">
                {layer.label}
              </span>

              <span className="meghai-layer-description">
                {layer.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
