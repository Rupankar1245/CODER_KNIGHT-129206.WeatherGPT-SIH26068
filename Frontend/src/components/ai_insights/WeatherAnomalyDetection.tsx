import React, {
  useEffect,
  useState,
} from 'react';

import {
  Activity,
  TrendingUp,
  History,
  ScanSearch,
  X,
  CalendarRange,
  MapPin,
  BrainCircuit,
  ShieldCheck,
  ThermometerSun,
  BarChart3,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const WeatherAnomalyDetection: React.FC = () => {

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);


  /* =======================================================
     MODAL CONTROLS
  ======================================================= */

  const openModal = () => {

    setIsModalOpen(true);

  };


  const closeModal = () => {

    setIsModalOpen(false);

  };


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape = (
      event:
        KeyboardEvent
    ) => {

      if (
        event.key === 'Escape'
      ) {

        closeModal();

      }

    };


    if (
      isModalOpen
    ) {

      window.addEventListener(
        'keydown',
        handleEscape
      );

    }


    return () => {

      window.removeEventListener(
        'keydown',
        handleEscape
      );

    };

  }, [
    isModalOpen,
  ]);


  /* =======================================================
     KEYBOARD ACCESSIBILITY
  ======================================================= */

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLElement>
  ) => {

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {

      event.preventDefault();

      openModal();

    }

  };


  return (

    <>

      {/* =================================================
          INTEGRATED STYLES
      ================================================= */}

      <style>
        {`

          /* =============================================
             ANIMATIONS
          ============================================= */

          @keyframes anomalyCardEntrance {

            from {

              opacity:
                0;

              transform:
                translateY(14px);

            }

            to {

              opacity:
                1;

              transform:
                translateY(0);

            }

          }


          @keyframes anomalyPulse {

            0%,
            100% {

              opacity:
                0.6;

              transform:
                scale(1);

            }

            50% {

              opacity:
                1;

              transform:
                scale(1.05);

            }

          }


          @keyframes anomalyScan {

            0% {

              transform:
                translateX(-120%);

              opacity:
                0;

            }

            15% {

              opacity:
                1;

            }

            85% {

              opacity:
                1;

            }

            100% {

              transform:
                translateX(120%);

              opacity:
                0;

            }

          }


          @keyframes anomalyModalAppear {

            from {

              opacity:
                0;

              transform:
                translateY(18px)
                scale(0.97);

            }

            to {

              opacity:
                1;

              transform:
                translateY(0)
                scale(1);

            }

          }


          @keyframes anomalyBackdropAppear {

            from {

              opacity:
                0;

            }

            to {

              opacity:
                1;

            }

          }


          /* =============================================
             MAIN CARD
          ============================================= */

          .weather-anomaly-card {

            position:
              relative;

            width:
              100%;

            min-height:
              350px;

            padding:
              24px;

            box-sizing:
              border-box;

            display:
              flex;

            flex-direction:
              column;

            overflow:
              hidden;

            border-radius:
              24px;

            cursor:
              pointer;

            color:
              #ffffff;

            background:
              linear-gradient(
                135deg,
                rgba(
                  52,
                  211,
                  153,
                  0.15
                )
                0%,
                rgba(
                  255,
                  255,
                  255,
                  0.045
                )
                52%,
                rgba(
                  6,
                  78,
                  59,
                  0.14
                )
                100%
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.24
              );

            box-shadow:
              0 12px 38px
              rgba(
                0,
                0,
                0,
                0.18
              ),
              inset
              0 1px 0
              rgba(
                255,
                255,
                255,
                0.07
              );

            backdrop-filter:
              blur(20px);

            -webkit-backdrop-filter:
              blur(20px);

            transition:
              transform
              0.3s
              ease,
              border-color
              0.3s
              ease,
              box-shadow
              0.3s
              ease;

            animation:
              anomalyCardEntrance
              0.6s
              ease
              both;

          }


          .weather-anomaly-card::before {

            content:
              "";

            position:
              absolute;

            width:
              240px;

            height:
              240px;

            top:
              -105px;

            right:
              -90px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  52,
                  211,
                  153,
                  0.16
                )
                0%,
                transparent
                70%
              );

            pointer-events:
              none;

          }


          .weather-anomaly-card:hover {

            transform:
              translateY(-6px);

            border-color:
              rgba(
                52,
                211,
                153,
                0.52
              );

            box-shadow:
              0 20px 46px
              rgba(
                0,
                0,
                0,
                0.25
              ),
              0 0 36px
              rgba(
                52,
                211,
                153,
                0.10
              );

          }


          .weather-anomaly-card:focus-visible {

            outline:
              2px solid
              #34d399;

            outline-offset:
              3px;

          }


          /* =============================================
             TOP
          ============================================= */

          .weather-anomaly-top {

            position:
              relative;

            z-index:
              2;

            display:
              flex;

            align-items:
              flex-start;

            justify-content:
              space-between;

          }


          .weather-anomaly-number {

            display:
              inline-flex;

            align-items:
              center;

            justify-content:
              center;

            min-width:
              30px;

            height:
              23px;

            padding:
              0 7px;

            border-radius:
              7px;

            color:
              #34d399;

            background:
              rgba(
                52,
                211,
                153,
                0.12
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.30
              );

            font-size:
              11px;

            font-weight:
              800;

            font-family:
              ui-monospace,
              SFMono-Regular,
              Consolas,
              monospace;

          }


          .weather-anomaly-icon {

            display:
              grid;

            place-items:
              center;

            width:
              44px;

            height:
              44px;

            border-radius:
              15px;

            color:
              #6ee7b7;

            background:
              rgba(
                52,
                211,
                153,
                0.12
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.22
              );

            box-shadow:
              0 0 22px
              rgba(
                52,
                211,
                153,
                0.12
              );

          }


          /* =============================================
             HEADING
          ============================================= */

          .weather-anomaly-heading {

            position:
              relative;

            z-index:
              2;

            margin-top:
              17px;

          }


          .weather-anomaly-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #34d399;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .weather-anomaly-title {

            margin:
              0;

            color:
              #ffffff;

            font-size:
              22px;

            font-weight:
              700;

            letter-spacing:
              -0.02em;

          }


          .weather-anomaly-description {

            position:
              relative;

            z-index:
              2;

            margin:
              8px 0 14px;

            color:
              #8ca99f;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* =============================================
             COMPARISON PANEL
          ============================================= */

          .weather-anomaly-comparison {

            position:
              relative;

            z-index:
              2;

            display:
              grid;

            grid-template-columns:
              1fr
              1fr;

            gap:
              10px;

          }


          .weather-anomaly-column {

            padding:
              12px;

            border-radius:
              14px;

            background:
              rgba(
                255,
                255,
                255,
                0.045
              );

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .weather-anomaly-column.active {

            background:
              rgba(
                52,
                211,
                153,
                0.08
              );

            border-color:
              rgba(
                52,
                211,
                153,
                0.22
              );

          }


          .weather-anomaly-column-label {

            display:
              flex;

            align-items:
              center;

            gap:
              5px;

            color:
              #78968b;

            font-size:
              9px;

            font-weight:
              700;

            letter-spacing:
              0.07em;

          }


          .weather-anomaly-column-value {

            display:
              block;

            margin-top:
              8px;

            color:
              #ffffff;

            font-size:
              25px;

            font-weight:
              800;

            line-height:
              1;

            letter-spacing:
              -0.03em;

          }


          .weather-anomaly-column-sub {

            display:
              block;

            margin-top:
              5px;

            color:
              #668278;

            font-size:
              9px;

          }


          /* =============================================
             DELTA
          ============================================= */

          .weather-anomaly-delta {

            position:
              relative;

            z-index:
              2;

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              10px;

            margin-top:
              12px;

            padding:
              10px 12px;

            border-radius:
              12px;

            background:
              rgba(
                6,
                78,
                59,
                0.20
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.16
              );

          }


          .weather-anomaly-delta-left {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            min-width:
              0;

          }


          .weather-anomaly-delta-icon {

            display:
              grid;

            place-items:
              center;

            width:
              29px;

            height:
              29px;

            flex-shrink:
              0;

            border-radius:
              9px;

            color:
              #6ee7b7;

            background:
              rgba(
                52,
                211,
                153,
                0.10
              );

          }


          .weather-anomaly-delta-text {

            display:
              flex;

            flex-direction:
              column;

            min-width:
              0;

          }


          .weather-anomaly-delta-label {

            color:
              #6f8c81;

            font-size:
              9px;

          }


          .weather-anomaly-delta-value {

            margin-top:
              2px;

            color:
              #a7f3d0;

            font-size:
              12px;

            font-weight:
              700;

          }


          .weather-anomaly-confidence {

            flex-shrink:
              0;

            padding:
              5px
              8px;

            border-radius:
              999px;

            color:
              #34d399;

            background:
              rgba(
                52,
                211,
                153,
                0.10
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.18
              );

            font-size:
              10px;

            font-weight:
              800;

            animation:
              anomalyPulse
              2.2s
              ease-in-out
              infinite;

          }


          /* =============================================
             SCAN AREA
          ============================================= */

          .weather-anomaly-scan-area {

            position:
              relative;

            z-index:
              2;

            height:
              34px;

            margin-top:
              auto;

            overflow:
              hidden;

            border-radius:
              10px;

            background:
              linear-gradient(
                90deg,
                rgba(
                  52,
                  211,
                  153,
                  0.04
                ),
                rgba(
                  52,
                  211,
                  153,
                  0.12
                ),
                rgba(
                  52,
                  211,
                  153,
                  0.04
                )
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.10
              );

          }


          .weather-anomaly-scan-line {

            position:
              absolute;

            top:
              0;

            bottom:
              0;

            width:
              1px;

            background:
              #34d399;

            box-shadow:
              0 0 12px
              rgba(
                52,
                211,
                153,
                0.9
              );

            animation:
              anomalyScan
              2.6s
              linear
              infinite;

          }


          .weather-anomaly-scan-text {

            position:
              relative;

            z-index:
              2;

            height:
              100%;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            gap:
              6px;

            color:
              #71998a;

            font-size:
              9px;

            font-weight:
              700;

            letter-spacing:
              0.06em;

          }


          /* =============================================
             MODAL BACKDROP
          ============================================= */

          .weather-anomaly-modal-backdrop {

            position:
              fixed;

            inset:
              0;

            z-index:
              9999;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            padding:
              20px;

            box-sizing:
              border-box;

            background:
              rgba(
                3,
                7,
                18,
                0.76
              );

            backdrop-filter:
              blur(12px);

            -webkit-backdrop-filter:
              blur(12px);

            animation:
              anomalyBackdropAppear
              0.25s
              ease;

          }


          /* =============================================
             MODAL
          ============================================= */

          .weather-anomaly-modal {

            position:
              relative;

            width:
              min(
                680px,
                100%
              );

            max-height:
              min(
                760px,
                calc(
                  100vh - 40px
                )
              );

            overflow-y:
              auto;

            border-radius:
              26px;

            color:
              #ffffff;

            background:
              linear-gradient(
                145deg,
                rgba(
                  8,
                  35,
                  29,
                  0.98
                ),
                rgba(
                  10,
                  12,
                  24,
                  0.98
                )
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.28
              );

            box-shadow:
              0 30px 90px
              rgba(
                0,
                0,
                0,
                0.55
              ),
              0 0 60px
              rgba(
                52,
                211,
                153,
                0.08
              );

            animation:
              anomalyModalAppear
              0.3s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );

          }


          .weather-anomaly-modal::-webkit-scrollbar {

            width:
              6px;

          }


          .weather-anomaly-modal::-webkit-scrollbar-thumb {

            border-radius:
              999px;

            background:
              rgba(
                52,
                211,
                153,
                0.3
              );

          }


          /* =============================================
             MODAL HEADER
          ============================================= */

          .weather-anomaly-modal-header {

            position:
              relative;

            padding:
              25px
              25px
              22px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .weather-anomaly-modal-close {

            position:
              absolute;

            top:
              18px;

            right:
              18px;

            display:
              grid;

            place-items:
              center;

            width:
              36px;

            height:
              36px;

            border-radius:
              11px;

            cursor:
              pointer;

            color:
              #6ee7b7;

            background:
              rgba(
                52,
                211,
                153,
                0.09
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.18
              );

            transition:
              transform
              0.2s
              ease,
              background
              0.2s
              ease;

          }


          .weather-anomaly-modal-close:hover {

            transform:
              rotate(90deg);

            background:
              rgba(
                52,
                211,
                153,
                0.18
              );

          }


          .weather-anomaly-modal-badge {

            display:
              inline-flex;

            align-items:
              center;

            gap:
              7px;

            padding:
              6px 10px;

            border-radius:
              999px;

            color:
              #6ee7b7;

            background:
              rgba(
                52,
                211,
                153,
                0.09
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.20
              );

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .weather-anomaly-modal-title {

            margin:
              16px 0 7px;

            font-size:
              26px;

            font-weight:
              750;

            letter-spacing:
              -0.03em;

          }


          .weather-anomaly-modal-subtitle {

            margin:
              0;

            max-width:
              90%;

            color:
              #91ada3;

            font-size:
              13px;

            line-height:
              1.65;

          }


          /* =============================================
             MODAL CONTENT
          ============================================= */

          .weather-anomaly-modal-content {

            padding:
              22px
              25px
              26px;

          }


          /* =============================================
             AI ANALYSIS
          ============================================= */

          .weather-anomaly-analysis {

            padding:
              17px;

            border-radius:
              16px;

            background:
              rgba(
                52,
                211,
                153,
                0.055
              );

            border:
              1px solid
              rgba(
                52,
                211,
                153,
                0.16
              );

          }


          .weather-anomaly-analysis-header {

            display:
              flex;

            align-items:
              center;

            gap:
              10px;

            margin-bottom:
              10px;

            color:
              #6ee7b7;

          }


          .weather-anomaly-analysis-title {

            margin:
              0;

            font-size:
              12px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .weather-anomaly-analysis-text {

            margin:
              0;

            color:
              #bdd3ca;

            font-size:
              13px;

            line-height:
              1.7;

          }


          /* =============================================
             DETAILS GRID
          ============================================= */

          .weather-anomaly-detail-grid {

            display:
              grid;

            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );

            gap:
              11px;

            margin-top:
              18px;

          }


          .weather-anomaly-detail-card {

            padding:
              14px;

            border-radius:
              15px;

            background:
              rgba(
                255,
                255,
                255,
                0.035
              );

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .weather-anomaly-detail-top {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            color:
              #6ee7b7;

          }


          .weather-anomaly-detail-label {

            color:
              #79958b;

            font-size:
              10px;

            font-weight:
              700;

            letter-spacing:
              0.05em;

          }


          .weather-anomaly-detail-value {

            display:
              block;

            margin-top:
              9px;

            color:
              #ffffff;

            font-size:
              18px;

            font-weight:
              800;

          }


          .weather-anomaly-detail-sub {

            display:
              block;

            margin-top:
              3px;

            color:
              #6d887e;

            font-size:
              10px;

          }


          /* =============================================
             CONFIDENCE
          ============================================= */

          .weather-anomaly-confidence-panel {

            margin-top:
              18px;

            padding:
              16px;

            border-radius:
              16px;

            background:
              rgba(
                255,
                255,
                255,
                0.035
              );

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .weather-anomaly-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              10px;

          }


          .weather-anomaly-confidence-label {

            display:
              flex;

            align-items:
              center;

            gap:
              7px;

            color:
              #6ee7b7;

            font-size:
              11px;

            font-weight:
              800;

          }


          .weather-anomaly-confidence-value {

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              800;

          }


          .weather-anomaly-confidence-bar {

            height:
              7px;

            overflow:
              hidden;

            border-radius:
              999px;

            background:
              rgba(
                255,
                255,
                255,
                0.08
              );

          }


          .weather-anomaly-confidence-fill {

            width:
              89%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #059669,
                #34d399
              );

            box-shadow:
              0 0 14px
              rgba(
                52,
                211,
                153,
                0.45
              );

          }


          .weather-anomaly-confidence-note {

            margin:
              9px 0 0;

            color:
              #718d83;

            font-size:
              10px;

            line-height:
              1.5;

          }


          /* =============================================
             INSIGHT
          ============================================= */

          .weather-anomaly-insight {

            display:
              flex;

            align-items:
              flex-start;

            gap:
              12px;

            margin-top:
              18px;

            padding:
              16px;

            border-radius:
              16px;

            background:
              rgba(
                52,
                211,
                153,
                0.06
              );

            border-left:
              3px solid
              #34d399;

          }


          .weather-anomaly-insight-icon {

            flex-shrink:
              0;

            color:
              #6ee7b7;

          }


          .weather-anomaly-insight-content {

            min-width:
              0;

          }


          .weather-anomaly-insight-title {

            margin:
              0 0 5px;

            color:
              #ffffff;

            font-size:
              12px;

            font-weight:
              800;

          }


          .weather-anomaly-insight-text {

            margin:
              0;

            color:
              #a9c1b7;

            font-size:
              11px;

            line-height:
              1.6;

          }


          /* =============================================
             RESPONSIVE
          ============================================= */

          @media (
            max-width:
            700px
          ) {

            .weather-anomaly-card {

              min-height:
                350px;

              padding:
                20px;

            }


            .weather-anomaly-title {

              font-size:
                20px;

            }


            .weather-anomaly-modal-backdrop {

              padding:
                12px;

            }


            .weather-anomaly-modal-header {

              padding:
                22px
                20px
                20px;

            }


            .weather-anomaly-modal-content {

              padding:
                18px
                20px
                22px;

            }


            .weather-anomaly-modal-title {

              font-size:
                22px;

            }


            .weather-anomaly-detail-grid {

              grid-template-columns:
                1fr;

            }

          }

        `}
      </style>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <article
        className="weather-anomaly-card"
        onClick={openModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open Weather Anomaly Detection details"
      >


        {/* ===============================================
            TOP
        =============================================== */}

        <div
          className="weather-anomaly-top"
        >

          <span
            className="weather-anomaly-number"
          >
            05
          </span>


          <div
            className="weather-anomaly-icon"
          >

            <Activity
              size={21}
            />

          </div>

        </div>


        {/* ===============================================
            HEADING
        =============================================== */}

        <div
          className="weather-anomaly-heading"
        >

          <span
            className="weather-anomaly-eyebrow"
          >
            FIND THE UNEXPECTED
          </span>


          <h2
            className="weather-anomaly-title"
          >
            Weather Anomaly Detection
          </h2>

        </div>


        <p
          className="weather-anomaly-description"
        >
          Compares current conditions with historical
          patterns to reveal unusual local behaviour.
        </p>


        {/* ===============================================
            COMPARISON
        =============================================== */}

        <div
          className="weather-anomaly-comparison"
        >


          {/* HISTORICAL */}

          <div
            className="weather-anomaly-column"
          >

            <span
              className="weather-anomaly-column-label"
            >

              <History
                size={12}
              />

              HISTORICAL AVG

            </span>


            <span
              className="weather-anomaly-column-value"
            >
              29.8°
            </span>


            <span
              className="weather-anomaly-column-sub"
            >
              Seasonal baseline
            </span>

          </div>


          {/* CURRENT */}

          <div
            className="weather-anomaly-column active"
          >

            <span
              className="weather-anomaly-column-label"
            >

              <Activity
                size={12}
              />

              CURRENT

            </span>


            <span
              className="weather-anomaly-column-value"
            >
              34.0°
            </span>


            <span
              className="weather-anomaly-column-sub"
            >
              Live observation
            </span>

          </div>

        </div>


        {/* ===============================================
            DELTA
        =============================================== */}

        <div
          className="weather-anomaly-delta"
        >

          <div
            className="weather-anomaly-delta-left"
          >

            <div
              className="weather-anomaly-delta-icon"
            >

              <TrendingUp
                size={15}
              />

            </div>


            <div
              className="weather-anomaly-delta-text"
            >

              <span
                className="weather-anomaly-delta-label"
              >
                DETECTED DEVIATION
              </span>


              <span
                className="weather-anomaly-delta-value"
              >
                +4.2°C above average
              </span>

            </div>

          </div>


          <span
            className="weather-anomaly-confidence"
          >
            89%
          </span>

        </div>


        {/* ===============================================
            AI SCAN
        =============================================== */}

        <div
          className="weather-anomaly-scan-area"
        >

          <div
            className="weather-anomaly-scan-line"
          />


          <div
            className="weather-anomaly-scan-text"
          >

            <ScanSearch
              size={12}
            />

            ANALYSING HISTORICAL PATTERNS

          </div>

        </div>

      </article>


      {/* =================================================
          MODAL
      ================================================= */}

      {
        isModalOpen && (

          <div
            className="weather-anomaly-modal-backdrop"
            onClick={closeModal}
            role="presentation"
          >

            <section
              className="weather-anomaly-modal"
              onClick={
                (
                  event
                ) => {

                  event.stopPropagation();

                }
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="weather-anomaly-modal-title"
            >


              {/* ===========================================
                  MODAL HEADER
              =========================================== */}

              <div
                className="weather-anomaly-modal-header"
              >

                <button
                  type="button"
                  className="weather-anomaly-modal-close"
                  onClick={closeModal}
                  aria-label="Close weather anomaly analysis"
                >

                  <X
                    size={18}
                  />

                </button>


                <span
                  className="weather-anomaly-modal-badge"
                >

                  <ScanSearch
                    size={13}
                  />

                  ANOMALY DETECTED

                </span>


                <h2
                  id="weather-anomaly-modal-title"
                  className="weather-anomaly-modal-title"
                >
                  Weather Pattern Analysis
                </h2>


                <p
                  className="weather-anomaly-modal-subtitle"
                >
                  MeghAI has identified current weather
                  conditions that significantly deviate from
                  the expected historical pattern.
                </p>

              </div>


              {/* ===========================================
                  MODAL CONTENT
              =========================================== */}

              <div
                className="weather-anomaly-modal-content"
              >


                {/* =========================================
                    AI ANALYSIS
                ========================================= */}

                <div
                  className="weather-anomaly-analysis"
                >

                  <div
                    className="weather-anomaly-analysis-header"
                  >

                    <BrainCircuit
                      size={17}
                    />


                    <p
                      className="weather-anomaly-analysis-title"
                    >
                      AI ANOMALY ANALYSIS
                    </p>

                  </div>


                  <p
                    className="weather-anomaly-analysis-text"
                  >
                    Current temperature is tracking near the
                    upper extreme of the historical range.
                    MeghAI detected a significant deviation
                    from the expected seasonal baseline,
                    suggesting unusual local warming for this
                    period.
                  </p>

                </div>


                {/* =========================================
                    DETAILS GRID
                ========================================= */}

                <div
                  className="weather-anomaly-detail-grid"
                >


                  {/* HISTORICAL */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <History
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        HISTORICAL AVERAGE
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      29.8°C
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Seasonal temperature baseline
                    </span>

                  </div>


                  {/* CURRENT */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <ThermometerSun
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        CURRENT CONDITION
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      34.0°C
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Latest local observation
                    </span>

                  </div>


                  {/* DEVIATION */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <TrendingUp
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        DEVIATION
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      +4.2°C
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Above expected average
                    </span>

                  </div>


                  {/* PATTERN RANGE */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <CalendarRange
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        PATTERN WINDOW
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      30 days
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Compared with seasonal history
                    </span>

                  </div>


                  {/* LOCATION */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <MapPin
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        ANALYSIS AREA
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      Local zone
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Location-specific weather pattern
                    </span>

                  </div>


                  {/* MODEL SIGNAL */}

                  <div
                    className="weather-anomaly-detail-card"
                  >

                    <div
                      className="weather-anomaly-detail-top"
                    >

                      <BarChart3
                        size={15}
                      />


                      <span
                        className="weather-anomaly-detail-label"
                      >
                        MODEL SIGNAL
                      </span>

                    </div>


                    <span
                      className="weather-anomaly-detail-value"
                    >
                      Strong
                    </span>


                    <span
                      className="weather-anomaly-detail-sub"
                    >
                      Consistent deviation detected
                    </span>

                  </div>

                </div>


                {/* =========================================
                    AI CONFIDENCE
                ========================================= */}

                <div
                  className="weather-anomaly-confidence-panel"
                >

                  <div
                    className="weather-anomaly-confidence-top"
                  >

                    <span
                      className="weather-anomaly-confidence-label"
                    >

                      <ShieldCheck
                        size={15}
                      />

                      AI CONFIDENCE

                    </span>


                    <span
                      className="weather-anomaly-confidence-value"
                    >
                      89%
                    </span>

                  </div>


                  <div
                    className="weather-anomaly-confidence-bar"
                  >

                    <div
                      className="weather-anomaly-confidence-fill"
                    />

                  </div>


                  <p
                    className="weather-anomaly-confidence-note"
                  >
                    Confidence is calculated from the agreement
                    between current observations, historical
                    weather patterns and anomaly detection
                    signals.
                  </p>

                </div>


                {/* =========================================
                    AI INSIGHT
                ========================================= */}

                <div
                  className="weather-anomaly-insight"
                >

                  <Activity
                    size={19}
                    className="weather-anomaly-insight-icon"
                  />


                  <div
                    className="weather-anomaly-insight-content"
                  >

                    <p
                      className="weather-anomaly-insight-title"
                    >
                      MeghAI Insight
                    </p>


                    <p
                      className="weather-anomaly-insight-text"
                    >
                      This anomaly does not automatically
                      indicate an extreme weather event, but
                      it highlights conditions that are
                      statistically unusual and worth
                      monitoring over the next several hours.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>

        )
      }

    </>

  );

};