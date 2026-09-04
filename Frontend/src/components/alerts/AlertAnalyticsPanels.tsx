import {
  Activity,
  AlertTriangle,
  Car,
  Check,
  CloudRain,
  Clock,
  School,
  Sprout,
  Train,
  TrendingDown,
  Umbrella,
  Wind,
  Zap,
} from 'lucide-react';


/* =========================================================
   DATA
========================================================= */

const riskScores = [
  {
    label: 'Rainfall Risk',
    score: 92,
    max: 100,
    color: '#ef4444',
    icon: CloudRain,
    iconColor: '#38bdf8',
  },
  {
    label: 'Flood Risk',
    score: 87,
    max: 100,
    color: '#f97316',
    icon: Umbrella,
    iconColor: '#38bdf8',
  },
  {
    label: 'Wind Risk',
    score: 45,
    max: 100,
    color: '#eab308',
    icon: Wind,
    iconColor: '#818cf8',
  },
  {
    label: 'Lightning Risk',
    score: 71,
    max: 100,
    color: '#a855f7',
    icon: Zap,
    iconColor: '#facc15',
  },
] as const;


const timelineSteps = [
  {
    time: '08:00 AM',
    label: 'Rainfall begins',
    icon: CloudRain,
    statusColor: '#10b981',
    borderGlow: '#10b981',
    isPeak: false,
  },
  {
    time: '10:00 AM',
    label: 'Intensity increases',
    icon: Activity,
    statusColor: '#eab308',
    borderGlow: '#eab308',
    isPeak: false,
  },
  {
    time: '12:00 PM',
    label: 'Peak risk',
    icon: AlertTriangle,
    statusColor: '#ef4444',
    borderGlow: '#ef4444',
    isPeak: true,
  },
  {
    time: '02:00 PM',
    label: 'Risk decreases',
    icon: TrendingDown,
    statusColor: '#f97316',
    borderGlow: '#f97316',
    isPeak: false,
  },
  {
    time: '04:00 PM',
    label: 'Alert ends',
    icon: Check,
    statusColor: '#10b981',
    borderGlow: '#10b981',
    isPeak: false,
  },
] as const;


const impactPredictions = [
  {
    label: 'Traffic',
    level: 'High',
    color: '#f87171',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.24)',
    icon: Car,
    iconColor: '#38bdf8',
  },
  {
    label: 'Transport',
    level: 'Medium',
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.24)',
    icon: Train,
    iconColor: '#38bdf8',
  },
  {
    label: 'Schools',
    level: 'Medium',
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.24)',
    icon: School,
    iconColor: '#38bdf8',
  },
  {
    label: 'Agriculture',
    level: 'High',
    color: '#f87171',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.24)',
    icon: Sprout,
    iconColor: '#22c55e',
  },
  {
    label: 'Electricity',
    level: 'Low',
    color: '#6ee7b7',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.24)',
    icon: Zap,
    iconColor: '#facc15',
  },
] as const;


/* =========================================================
   MAIN COMPONENT
========================================================= */

export function AlertAnalyticsPanels() {
  return (
    <>
      {/* =====================================================
          COMPONENT CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           MAIN GRID
        ===================================================== */

        .alert-analytics-grid {
          width: 100%;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 16px;
        }


        /* =====================================================
           BASE PANEL
        ===================================================== */

        .alert-analytics-panel {
          position: relative;

          min-width: 0;
          min-height: 270px;

          padding: 18px;

          overflow: hidden;

          border-radius: 20px;

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
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }


        /* =====================================================
           TOP HIGHLIGHT
        ===================================================== */

        .alert-analytics-panel::before {
          content: '';

          position: absolute;

          top: 0;
          left: 12%;
          right: 12%;

          height: 1px;

          background:
            rgba(255, 255, 255, 0.20);

          opacity: 0.7;
        }


        .alert-analytics-panel:hover {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.05) 100%
            );

          border-color:
            rgba(255, 255, 255, 0.20);

          box-shadow:
            0 12px 34px
            rgba(0, 0, 0, 0.20);
        }


        /* =====================================================
           PANEL HEADER
        ===================================================== */

        .alert-panel-header {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 20px;

          color:
            #f8fafc;

          font-size: 13px;

          font-weight: 600;

          letter-spacing: -0.1px;
        }


        .alert-panel-header svg {
          flex-shrink: 0;
        }


        .alert-panel-header-date {
          margin-left: 2px;

          color:
            rgba(148, 163, 184, 0.9);

          font-size: 10px;

          font-weight: 400;
        }


        /* =====================================================
           RISK SCORE
        ===================================================== */

        .risk-bars-container {
          position: relative;

          z-index: 2;

          display: flex;

          flex-direction: column;

          gap: 17px;
        }


        .risk-bar-row {
          display: grid;

          grid-template-columns:
            minmax(90px, 1fr)
            minmax(65px, 1.4fr)
            auto;

          align-items: center;

          gap: 10px;
        }


        .risk-label-group {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 7px;

          color:
            rgba(226, 232, 240, 0.84);

          font-size: 10.5px;

          font-weight: 500;

          white-space: nowrap;
        }


        .risk-label-group svg {
          flex-shrink: 0;
        }


        .progress-track {
          width: 100%;

          height: 6px;

          overflow: hidden;

          border-radius: 999px;

          background:
            rgba(15, 23, 42, 0.34);

          border:
            1px solid
            rgba(255, 255, 255, 0.06);
        }


        .progress-fill {
          height: 100%;

          border-radius: inherit;

          transition:
            width 0.7s
            cubic-bezier(0.22, 1, 0.36, 1);
        }


        .risk-score-value {
          min-width: 38px;

          text-align: right;

          color:
            rgba(226, 232, 240, 0.72);

          font-size: 9.5px;

          font-weight: 600;
        }


        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline-container {
          position: relative;

          z-index: 2;

          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 4px;

          padding-top: 13px;
        }


        .timeline-track-line {
          position: absolute;

          top: 40px;

          left: 8%;

          right: 8%;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              rgba(16, 185, 129, 0.45),
              rgba(234, 179, 8, 0.45),
              rgba(239, 68, 68, 0.55),
              rgba(249, 115, 22, 0.45),
              rgba(16, 185, 129, 0.45)
            );

          opacity: 0.8;
        }


        .timeline-node {
          position: relative;

          z-index: 2;

          min-width: 0;

          display: flex;

          flex-direction: column;

          align-items: center;

          text-align: center;
        }


        .timeline-time {
          min-height: 18px;

          color:
            rgba(148, 163, 184, 0.88);

          font-size: 8.5px;

          font-weight: 500;

          white-space: nowrap;
        }


        .timeline-circle {
          position: relative;

          z-index: 3;

          width: 28px;
          height: 28px;

          margin: 7px 0 9px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(15, 23, 42, 0.45);

          border:
            1px solid;

          backdrop-filter:
            blur(8px);

          -webkit-backdrop-filter:
            blur(8px);
        }


        .timeline-label {
          min-height: 30px;

          color:
            rgba(226, 232, 240, 0.76);

          font-size: 8.5px;

          line-height: 1.4;
        }


        .peak-indicator {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 3px;

          padding: 3px 5px;

          border-radius: 999px;

          background:
            rgba(239, 68, 68, 0.12);

          border:
            1px solid
            rgba(239, 68, 68, 0.20);

          color:
            #f87171;

          font-size: 8px;

          white-space: nowrap;
        }


        /* =====================================================
           IMPACT PREDICTION
        ===================================================== */

        .impact-list-container {
          position: relative;

          z-index: 2;

          display: flex;

          flex-direction: column;

          gap: 9px;
        }


        .impact-row {
          min-height: 34px;

          padding: 7px 9px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border-radius: 10px;

          background:
            rgba(255, 255, 255, 0.035);

          border:
            1px solid
            rgba(255, 255, 255, 0.055);

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }


        .impact-row:hover {
          background:
            rgba(255, 255, 255, 0.065);

          border-color:
            rgba(255, 255, 255, 0.11);
        }


        .impact-left {
          min-width: 0;

          display: flex;

          align-items: center;

          gap: 8px;

          color:
            rgba(226, 232, 240, 0.84);

          font-size: 10.5px;

          font-weight: 500;
        }


        .impact-left svg {
          flex-shrink: 0;
        }


        .impact-pill {
          flex-shrink: 0;

          min-width: 54px;

          padding: 4px 8px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 600;
        }


        /* =====================================================
           LAPTOP
        ===================================================== */

        @media (max-width: 1250px) {

          .alert-analytics-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .alert-analytics-grid {
            grid-template-columns:
              1fr;
          }


          .alert-analytics-panel {
            min-height: auto;
          }


          .timeline-container {
            padding-bottom: 4px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .alert-analytics-grid {
            gap: 12px;
          }


          .alert-analytics-panel {
            padding: 15px;

            border-radius: 17px;
          }


          .alert-panel-header {
            margin-bottom: 17px;

            font-size: 12px;
          }


          /* RISK */

          .risk-bar-row {
            grid-template-columns:
              1fr
              72px
              auto;

            gap: 8px;
          }


          .risk-label-group {
            font-size: 9.5px;
          }


          /* TIMELINE */

          .timeline-container {
            grid-template-columns:
              repeat(5, minmax(58px, 1fr));

            overflow-x: auto;

            padding-bottom: 8px;

            scrollbar-width: none;
          }


          .timeline-container::-webkit-scrollbar {
            display: none;
          }


          .timeline-track-line {
            left: 28px;

            right: 28px;

            min-width: 250px;
          }


          .timeline-node {
            min-width: 58px;
          }


          /* IMPACT */

          .impact-row {
            min-height: 33px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 390px) {

          .alert-analytics-panel {
            padding: 13px;
          }


          .risk-bar-row {
            grid-template-columns:
              minmax(75px, 1fr)
              minmax(50px, 1fr)
              auto;
          }


          .risk-label-group {
            gap: 5px;

            font-size: 8.5px;
          }


          .risk-label-group svg {
            width: 11px;
            height: 11px;
          }


          .risk-score-value {
            min-width: 34px;

            font-size: 8.5px;
          }


          .impact-left {
            font-size: 9.5px;
          }


          .impact-pill {
            min-width: 50px;

            font-size: 8.5px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .alert-analytics-panel,
          .impact-row,
          .progress-fill {
            transition: none !important;
          }

        }

      `}</style>


      <div className="alert-analytics-grid">

        <RiskScorePanel />

        <TimelinePanel />

        <ImpactPanel />

      </div>
    </>
  );
}


/* =========================================================
   RISK SCORE PANEL
========================================================= */

function RiskScorePanel() {
  return (
    <div className="alert-analytics-panel">

      <div className="alert-panel-header">

        <Zap
          size={15}
          color="#facc15"
        />

        <span>
          Risk Score
        </span>

      </div>


      <div className="risk-bars-container">

        {riskScores.map(
          ({
            label,
            score,
            max,
            color,
            icon: Icon,
            iconColor,
          }) => (

            <div
              key={label}
              className="risk-bar-row"
            >

              <div className="risk-label-group">

                <Icon
                  size={13}
                  color={iconColor}
                />

                <span>
                  {label}
                </span>

              </div>


              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${score}%`,
                    backgroundColor: color,
                    boxShadow:
                      `0 0 10px ${color}66`,
                  }}
                />

              </div>


              <span className="risk-score-value">
                {score}/{max}
              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   TIMELINE PANEL
========================================================= */

function TimelinePanel() {
  return (
    <div className="alert-analytics-panel">

      <div className="alert-panel-header">

        <Clock
          size={15}
          color="#38bdf8"
        />

        <span>
          Alert Timeline

          <span className="alert-panel-header-date">
            (23 Aug 2025)
          </span>
        </span>

      </div>


      <div className="timeline-container">

        <div className="timeline-track-line" />


        {timelineSteps.map(
          ({
            time,
            label,
            icon: Icon,
            statusColor,
            borderGlow,
            isPeak,
          }) => (

            <div
              key={time}
              className="timeline-node"
            >

              <span className="timeline-time">
                {time}
              </span>


              <div
                className="timeline-circle"
                style={{
                  borderColor: statusColor,
                  boxShadow:
                    `0 0 12px ${borderGlow}40`,
                }}
              >

                <Icon
                  size={11}
                  color={statusColor}
                />

              </div>


              <span className="timeline-label">

                {isPeak ? (

                  <span className="peak-indicator">

                    <AlertTriangle size={8} />

                    Peak risk

                  </span>

                ) : (

                  label

                )}

              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   IMPACT PANEL
========================================================= */

function ImpactPanel() {
  return (
    <div className="alert-analytics-panel">

      <div className="alert-panel-header">

        <Activity
          size={15}
          color="#facc15"
        />

        <span>
          Impact Prediction
        </span>

      </div>


      <div className="impact-list-container">

        {impactPredictions.map(
          ({
            label,
            level,
            color,
            bg,
            border,
            icon: Icon,
            iconColor,
          }) => (

            <div
              key={label}
              className="impact-row"
            >

              <div className="impact-left">

                <Icon
                  size={13}
                  color={iconColor}
                />

                <span>
                  {label}
                </span>

              </div>


              <span
                className="impact-pill"
                style={{
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  color,
                }}
              >
                {level}
              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
}