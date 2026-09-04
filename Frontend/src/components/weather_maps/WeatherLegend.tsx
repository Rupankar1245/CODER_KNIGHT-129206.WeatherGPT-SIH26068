
import React from 'react';
import type { WeatherLayer } from './LayerSelector';

interface WeatherLegendProps {
  activeLayer: WeatherLayer;
}

interface LegendConfig {
  title: string;
  unit: string;
  gradient: string;
  values: string[];
}

export const WeatherLegend: React.FC<WeatherLegendProps> = ({
  activeLayer,
}) => {
  const legends: Record<
    WeatherLayer,
    LegendConfig
  > = {
    wind: {
      title: 'Wind Speed',
      unit: 'km/h',
      gradient: `
        linear-gradient(
          90deg,
          #4c1d95 0%,
          #2563eb 20%,
          #06b6d4 40%,
          #22c55e 60%,
          #eab308 75%,
          #f97316 88%,
          #dc2626 100%
        )
      `,
      values: ['0', '10', '25', '40', '60+'],
    },

    temp: {
      title: 'Temperature',
      unit: '°C',
      gradient: `
        linear-gradient(
          90deg,
          #312e81 0%,
          #2563eb 20%,
          #06b6d4 35%,
          #22c55e 50%,
          #eab308 65%,
          #f97316 80%,
          #dc2626 100%
        )
      `,
      values: ['-10', '0', '15', '30', '45+'],
    },

    rain: {
      title: 'Rainfall',
      unit: 'mm',
      gradient: `
        linear-gradient(
          90deg,
          #f8fafc 0%,
          #bfdbfe 20%,
          #60a5fa 40%,
          #2563eb 60%,
          #7c3aed 80%,
          #4c1d95 100%
        )
      `,
      values: ['0', '1', '5', '15', '30+'],
    },

    clouds: {
      title: 'Cloud Coverage',
      unit: '%',
      gradient: `
        linear-gradient(
          90deg,
          #dbeafe 0%,
          #94a3b8 25%,
          #64748b 50%,
          #475569 75%,
          #1e293b 100%
        )
      `,
      values: ['0', '25', '50', '75', '100'],
    },

    pressure: {
      title: 'Pressure',
      unit: 'hPa',
      gradient: `
        linear-gradient(
          90deg,
          #4c1d95 0%,
          #7c3aed 20%,
          #2563eb 40%,
          #06b6d4 60%,
          #22c55e 80%,
          #eab308 100%
        )
      `,
      values: ['980', '1000', '1015', '1030', '1045+'],
    },
  };

  const legend = legends[activeLayer];

  return (
    <>
      <style>{`
        .meghai-weather-legend {
          position: absolute;
          left: 20px;
          bottom: 20px;
          z-index: 1000;

          width: 300px;

          padding: 14px 16px;

          border-radius: 14px;

          background:
            rgba(15, 23, 42, 0.88);

          border:
            1px solid
            rgba(255, 255, 255, 0.12);

          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);

          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.25);

          color: #ffffff;
        }

        .meghai-legend-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 10px;
        }

        .meghai-legend-title {
          margin: 0;

          font-size: 12px;
          font-weight: 700;

          color:
            rgba(255, 255, 255, 0.9);
        }

        .meghai-legend-unit {
          font-size: 10px;
          font-weight: 600;

          color:
            rgba(255, 255, 255, 0.45);
        }

        .meghai-legend-gradient {
          width: 100%;
          height: 8px;

          border-radius: 999px;

          background: var(--legend-gradient);

          box-shadow:
            inset 0 1px 1px
            rgba(255, 255, 255, 0.2);
        }

        .meghai-legend-values {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 6px;
        }

        .meghai-legend-value {
          font-size: 9px;

          color:
            rgba(255, 255, 255, 0.52);
        }

        @media (max-width: 768px) {
          .meghai-weather-legend {
            left: 12px;
            bottom: 12px;

            width: 220px;

            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .meghai-weather-legend {
            display: none;
          }
        }
      `}</style>

      <div className="meghai-weather-legend">
        <div className="meghai-legend-header">
          <h4 className="meghai-legend-title">
            {legend.title}
          </h4>

          <span className="meghai-legend-unit">
            {legend.unit}
          </span>
        </div>

        <div
          className="meghai-legend-gradient"
          style={
            {
              '--legend-gradient':
                legend.gradient,
            } as React.CSSProperties
          }
        />

        <div className="meghai-legend-values">
          {legend.values.map((value) => (
            <span
              key={value}
              className="meghai-legend-value"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
