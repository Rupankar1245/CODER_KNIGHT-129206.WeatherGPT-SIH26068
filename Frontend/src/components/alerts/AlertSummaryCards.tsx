

import {
  AlertTriangle,
  Bell,
  CloudLightning,
  CloudRain,
  Radio,
} from 'lucide-react';


/* =========================================================
   ALERT DATA
========================================================= */

const metricCards = [
  {
    id: 'critical',
    value: '2',
    label: 'Critical Alerts',
    tone: 'red',
    icon: AlertTriangle,
    color: '#ef4444',
  },
  {
    id: 'severe',
    value: '5',
    label: 'Severe Alerts',
    tone: 'orange',
    icon: CloudLightning,
    color: '#f97316',
  },
  {
    id: 'moderate',
    value: '8',
    label: 'Moderate Alerts',
    tone: 'yellow',
    icon: CloudRain,
    color: '#facc15',
  },
  {
    id: 'advisories',
    value: '12',
    label: 'Advisories',
    tone: 'blue',
    icon: Bell,
    color: '#38bdf8',
  },
] as const;


/* =========================================================
   COMPONENT
========================================================= */

export function AlertSummaryCards() {
  return (
    <>
      {/* =====================================================
          COMPONENT CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           SUMMARY GRID
        ===================================================== */

        .metric-cards-grid {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 14px;

          width: 100%;
        }


        /* =====================================================
           BASE CARD
        ===================================================== */

        .metric-card {
          position: relative;

          min-width: 0;
          min-height: 108px;

          padding: 18px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 12px;

          overflow: hidden;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.11) 0%,
              rgba(255, 255, 255, 0.035) 100%
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.13);

          box-shadow:
            0 8px 28px
            rgba(0, 0, 0, 0.16);

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }


        /* =====================================================
           SUBTLE TOP LIGHT
        ===================================================== */

        .metric-card::before {
          content: '';

          position: absolute;

          top: 0;
          left: 12%;
          right: 12%;

          height: 1px;

          background:
            rgba(255, 255, 255, 0.22);

          opacity: 0.65;
        }


        /* =====================================================
           HOVER
        ===================================================== */

        .metric-card:hover {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.05) 100%
            );

          border-color:
            rgba(255, 255, 255, 0.20);

          box-shadow:
            0 12px 32px
            rgba(0, 0, 0, 0.20);
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .metric-content-left {
          position: relative;

          z-index: 2;

          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 5px;
        }


        /* =====================================================
           NUMBER
        ===================================================== */

        .metric-number {
          font-size: 28px;

          font-weight: 700;

          line-height: 1;

          letter-spacing: -0.8px;
        }


        .metric-number.red {
          color: #f87171;
        }


        .metric-number.orange {
          color: #fb923c;
        }


        .metric-number.yellow {
          color: #facc15;
        }


        .metric-number.blue {
          color: #38bdf8;
        }


        /* =====================================================
           LABEL
        ===================================================== */

        .metric-label {
          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

          font-size: 11px;

          font-weight: 500;

          line-height: 1.35;

          color:
            rgba(226, 232, 240, 0.72);
        }


        /* =====================================================
           ICON WRAPPER
        ===================================================== */

        .metric-icon-wrap {
          position: relative;

          z-index: 2;

          width: 42px;
          height: 42px;

          min-width: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.07);

          border:
            1px solid
            rgba(255, 255, 255, 0.10);
        }


        /* =====================================================
           CRITICAL CARD
        ===================================================== */

        .metric-card-red::after {
          content: '';

          position: absolute;

          width: 90px;
          height: 90px;

          right: -35px;
          bottom: -45px;

          border-radius: 50%;

          background:
            rgba(239, 68, 68, 0.10);

          filter:
            blur(18px);

          pointer-events: none;
        }


        .metric-card-red:hover {
          border-color:
            rgba(239, 68, 68, 0.28);
        }


        /* =====================================================
           SEVERE CARD
        ===================================================== */

        .metric-card-orange::after {
          content: '';

          position: absolute;

          width: 90px;
          height: 90px;

          right: -35px;
          bottom: -45px;

          border-radius: 50%;

          background:
            rgba(249, 115, 22, 0.10);

          filter:
            blur(18px);

          pointer-events: none;
        }


        .metric-card-orange:hover {
          border-color:
            rgba(249, 115, 22, 0.30);
        }


        /* =====================================================
           MODERATE CARD
        ===================================================== */

        .metric-card-yellow::after {
          content: '';

          position: absolute;

          width: 90px;
          height: 90px;

          right: -35px;
          bottom: -45px;

          border-radius: 50%;

          background:
            rgba(250, 204, 21, 0.08);

          filter:
            blur(18px);

          pointer-events: none;
        }


        .metric-card-yellow:hover {
          border-color:
            rgba(250, 204, 21, 0.28);
        }


        /* =====================================================
           ADVISORY CARD
        ===================================================== */

        .metric-card-blue::after {
          content: '';

          position: absolute;

          width: 90px;
          height: 90px;

          right: -35px;
          bottom: -45px;

          border-radius: 50%;

          background:
            rgba(56, 189, 248, 0.10);

          filter:
            blur(18px);

          pointer-events: none;
        }


        .metric-card-blue:hover {
          border-color:
            rgba(56, 189, 248, 0.30);
        }


        /* =====================================================
           LIVE MONITORING CARD
        ===================================================== */

        .metric-card-live {
          background:
            linear-gradient(
              135deg,
              rgba(14, 165, 233, 0.12) 0%,
              rgba(255, 255, 255, 0.035) 100%
            );

          border-color:
            rgba(56, 189, 248, 0.18);
        }


        .metric-card-live:hover {
          border-color:
            rgba(56, 189, 248, 0.32);
        }


        .live-monitoring-info {
          position: relative;

          z-index: 2;

          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 9px;
        }


        .live-monitoring-title {
          font-size: 12px;

          font-weight: 600;

          color:
            #e2e8f0;
        }


        .live-status-row {
          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 11px;

          font-weight: 500;

          color:
            #86efac;
        }


        /* =====================================================
           LIVE PULSE
        ===================================================== */

        .green-pulse-dot {
          position: relative;

          width: 7px;
          height: 7px;

          min-width: 7px;

          border-radius: 50%;

          background:
            #22c55e;

          box-shadow:
            0 0 8px
            rgba(34, 197, 94, 0.65);
        }


        .green-pulse-dot::after {
          content: '';

          position: absolute;

          inset: -4px;

          border-radius: inherit;

          border:
            1px solid
            rgba(34, 197, 94, 0.55);

          animation:
            alertLivePulse
            2s
            ease-out
            infinite;
        }


        @keyframes alertLivePulse {

          0% {
            transform: scale(0.7);
            opacity: 0.9;
          }

          70% {
            transform: scale(1.45);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }

        }


        /* =====================================================
           LARGE DESKTOP
        ===================================================== */

        @media (min-width: 1500px) {

          .metric-card {
            min-height: 116px;

            padding: 20px;
          }

        }


        /* =====================================================
           LAPTOP / TABLET
        ===================================================== */

        @media (max-width: 1250px) {

          .metric-cards-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .metric-cards-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 12px;
          }


          .metric-card {
            min-height: 102px;

            padding: 16px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .metric-cards-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 10px;
          }


          .metric-card {
            min-height: 96px;

            padding: 14px;

            border-radius: 16px;
          }


          .metric-number {
            font-size: 24px;
          }


          .metric-label {
            font-size: 10px;
          }


          .metric-icon-wrap {
            width: 38px;
            height: 38px;

            min-width: 38px;

            border-radius: 11px;
          }


          .metric-icon-wrap svg {
            width: 18px;
            height: 18px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 390px) {

          .metric-card {
            padding: 12px;

            gap: 8px;
          }


          .metric-number {
            font-size: 22px;
          }


          .metric-label {
            font-size: 9px;
          }


          .metric-icon-wrap {
            width: 34px;
            height: 34px;

            min-width: 34px;

            border-radius: 10px;
          }


          .live-monitoring-title {
            font-size: 11px;
          }


          .live-status-row {
            font-size: 10px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .metric-card,
          .green-pulse-dot::after {
            transition: none !important;

            animation: none !important;
          }

        }

      `}</style>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="metric-cards-grid">

        {metricCards.map(
          ({
            id,
            value,
            label,
            tone,
            icon: Icon,
            color,
          }) => (

            <div
              key={id}
              className={`metric-card metric-card-${tone}`}
            >

              {/* =============================================
                  LEFT CONTENT
              ============================================= */}

              <div className="metric-content-left">

                <span
                  className={`metric-number ${tone}`}
                >
                  {value}
                </span>

                <span className="metric-label">
                  {label}
                </span>

              </div>


              {/* =============================================
                  ICON
              ============================================= */}

              <div className="metric-icon-wrap">

                <Icon
                  size={20}
                  color={color}
                />

              </div>

            </div>

          )
        )}


        {/* =================================================
            LIVE MONITORING
        ================================================= */}

        <div className="metric-card metric-card-live">

          <div className="live-monitoring-info">

            <span className="live-monitoring-title">
              Live Monitoring
            </span>


            <div className="live-status-row">

              <span className="green-pulse-dot" />

              <span>
                Active
              </span>

            </div>

          </div>


          <div className="metric-icon-wrap">

            <Radio
              size={22}
              color="#38bdf8"
            />

          </div>

        </div>

      </div>
    </>
  );
}