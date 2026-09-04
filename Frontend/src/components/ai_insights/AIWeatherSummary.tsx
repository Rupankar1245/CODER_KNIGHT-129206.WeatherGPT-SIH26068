
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Sparkles,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  X,
  Brain,
  Radar,
  CloudSun,
  Activity,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const AIWeatherSummary: React.FC = () => {

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);


  /* =======================================================
     CLOSE WITH ESCAPE KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape = (
      event: KeyboardEvent
    ) => {

      if (
        event.key === 'Escape'
      ) {

        setIsModalOpen(false);

      }

    };


    window.addEventListener(
      'keydown',
      handleEscape
    );


    return () => {

      window.removeEventListener(
        'keydown',
        handleEscape
      );

    };

  }, []);


  /* =======================================================
     LOCK BODY SCROLL
  ======================================================= */

  useEffect(() => {

    if (
      isModalOpen
    ) {

      document.body.style.overflow =
        'hidden';

    }


    return () => {

      document.body.style.overflow =
        '';

    };

  }, [
    isModalOpen,
  ]);


  /* =======================================================
     OPEN MODAL
  ======================================================= */

  const openModal = () => {

    setIsModalOpen(true);

  };


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {

    setIsModalOpen(false);

  };


  return (

    <>

      {/* ===================================================
          COMPONENT STYLES
      =================================================== */}

      <style>
        {`

          /* ===============================================
             ANIMATIONS
          =============================================== */

          @keyframes aiWeatherSummaryModalIn {

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


          @keyframes aiWeatherSummaryBackdropIn {

            from {

              opacity:
                0;

            }


            to {

              opacity:
                1;

            }

          }


          @keyframes aiWeatherSummaryGlow {

            0%,
            100% {

              opacity:
                0.45;

              transform:
                scale(0.96);

            }


            50% {

              opacity:
                0.9;

              transform:
                scale(1.05);

            }

          }


          @keyframes aiWeatherSummaryPulse {

            0%,
            100% {

              box-shadow:
                0 0 0
                rgba(
                  56,
                  189,
                  248,
                  0
                );

            }


            50% {

              box-shadow:
                0 0 18px
                rgba(
                  56,
                  189,
                  248,
                  0.32
                );

            }

          }


          /* ===============================================
             MAIN CARD
          =============================================== */

          .ai-weather-summary-card {

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

            isolation:
              isolate;

            background:
              linear-gradient(
                135deg,
                rgba(
                  56,
                  189,
                  248,
                  0.17
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
                  2,
                  132,
                  199,
                  0.11
                )
                100%
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
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
                0.08
              );

            backdrop-filter:
              blur(20px);

            -webkit-backdrop-filter:
              blur(20px);

            transition:
              box-shadow
              0.25s
              ease,
              border-color
              0.25s
              ease;

          }


          /* ===============================================
             HOVER GLOW ONLY
          =============================================== */

          .ai-weather-summary-card:hover {

            border-color:
              rgba(
                56,
                189,
                248,
                0.45
              );

            box-shadow:
              0 12px 38px
              rgba(
                0,
                0,
                0,
                0.18
              ),
              0 0 32px
              rgba(
                56,
                189,
                248,
                0.16
              ),
              inset
              0 1px 0
              rgba(
                255,
                255,
                255,
                0.08
              );

          }


          /* ===============================================
             BACKGROUND GLOW
          =============================================== */

          .ai-weather-summary-card::before {

            content:
              "";

            position:
              absolute;

            width:
              230px;

            height:
              230px;

            top:
              -95px;

            right:
              -75px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  56,
                  189,
                  248,
                  0.20
                )
                0%,
                transparent
                70%
              );

            animation:
              aiWeatherSummaryGlow
              5s
              ease-in-out
              infinite;

            pointer-events:
              none;

            z-index:
              -1;

          }


          .ai-weather-summary-card:focus-visible {

            outline:
              2px solid
              #38bdf8;

            outline-offset:
              4px;

          }


          /* ===============================================
             TOP ROW
          =============================================== */

          .ai-weather-summary-top {

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

            gap:
              16px;

          }


          .ai-weather-summary-number {

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
              #38bdf8;

            background:
              rgba(
                56,
                189,
                248,
                0.12
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
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


          .ai-weather-summary-icon {

            display:
              grid;

            place-items:
              center;

            width:
              46px;

            height:
              46px;

            border-radius:
              16px;

            color:
              #7dd3fc;

            background:
              rgba(
                56,
                189,
                248,
                0.12
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.22
              );

            box-shadow:
              0 0 24px
              rgba(
                56,
                189,
                248,
                0.16
              );

            animation:
              aiWeatherSummaryPulse
              3s
              ease-in-out
              infinite;

          }


          /* ===============================================
             HEADING
          =============================================== */

          .ai-weather-summary-heading {

            position:
              relative;

            z-index:
              2;

            margin-top:
              18px;

          }


          .ai-weather-summary-eyebrow {

            display:
              block;

            margin-bottom:
              6px;

            color:
              #38bdf8;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .ai-weather-summary-title {

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


          .ai-weather-summary-description {

            position:
              relative;

            z-index:
              2;

            margin:
              8px 0 18px;

            max-width:
              92%;

            color:
              #9fb3c8;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* ===============================================
             AI INSIGHT BOX
          =============================================== */

          .ai-weather-summary-insight {

            position:
              relative;

            z-index:
              2;

            padding:
              13px 14px;

            border-radius:
              14px;

            background:
              rgba(
                6,
                22,
                44,
                0.62
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.22
              );

            display:
              flex;

            gap:
              10px;

            align-items:
              flex-start;

          }


          .ai-weather-summary-insight-icon {

            flex-shrink:
              0;

            color:
              #38bdf8;

            margin-top:
              1px;

          }


          .ai-weather-summary-insight-text {

            margin:
              0;

            color:
              #dbeafe;

            font-size:
              12px;

            font-weight:
              500;

            line-height:
              1.5;

          }


          /* ===============================================
             METRICS
          =============================================== */

          .ai-weather-summary-metrics {

            position:
              relative;

            z-index:
              2;

            display:
              grid;

            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );

            gap:
              8px;

            margin-top:
              auto;

            padding-top:
              18px;

          }


          .ai-weather-summary-metric {

            padding:
              10px;

            border-radius:
              12px;

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


          .ai-weather-summary-metric-icon {

            margin-bottom:
              7px;

            color:
              #7dd3fc;

          }


          .ai-weather-summary-metric-value {

            display:
              block;

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              700;

          }


          .ai-weather-summary-metric-label {

            display:
              block;

            margin-top:
              2px;

            color:
              #71859a;

            font-size:
              10px;

          }


          /* ===============================================
             MODAL BACKDROP
          =============================================== */

          .ai-weather-summary-modal-backdrop {

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

            background:
              rgba(
                2,
                8,
                23,
                0.72
              );

            backdrop-filter:
              blur(10px);

            -webkit-backdrop-filter:
              blur(10px);

            animation:
              aiWeatherSummaryBackdropIn
              0.22s
              ease;

          }


          /* ===============================================
             MODAL
          =============================================== */

          .ai-weather-summary-modal {

            position:
              relative;

            width:
              min(
                620px,
                100%
              );

            max-height:
              min(
                720px,
                90vh
              );

            overflow-y:
              auto;

            padding:
              28px;

            box-sizing:
              border-box;

            border-radius:
              26px;

            color:
              #ffffff;

            background:
              linear-gradient(
                145deg,
                rgba(
                  9,
                  34,
                  66,
                  0.98
                ),
                rgba(
                  5,
                  20,
                  40,
                  0.98
                )
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.28
              );

            box-shadow:
              0 30px 100px
              rgba(
                0,
                0,
                0,
                0.55
              ),
              0 0 45px
              rgba(
                56,
                189,
                248,
                0.10
              );

            animation:
              aiWeatherSummaryModalIn
              0.3s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );

          }


          .ai-weather-summary-modal::before {

            content:
              "";

            position:
              absolute;

            width:
              280px;

            height:
              280px;

            top:
              -160px;

            right:
              -110px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  56,
                  189,
                  248,
                  0.16
                ),
                transparent
                70%
              );

            pointer-events:
              none;

          }


          /* ===============================================
             MODAL HEADER
          =============================================== */

          .ai-weather-summary-modal-header {

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

            gap:
              20px;

          }


          .ai-weather-summary-modal-title-row {

            display:
              flex;

            align-items:
              center;

            gap:
              12px;

          }


          .ai-weather-summary-modal-icon {

            display:
              grid;

            place-items:
              center;

            width:
              46px;

            height:
              46px;

            flex-shrink:
              0;

            border-radius:
              15px;

            color:
              #7dd3fc;

            background:
              rgba(
                56,
                189,
                248,
                0.12
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.25
              );

          }


          .ai-weather-summary-modal-eyebrow {

            margin:
              0 0 5px;

            color:
              #38bdf8;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.12em;

          }


          .ai-weather-summary-modal-title {

            margin:
              0;

            font-size:
              23px;

            font-weight:
              700;

            letter-spacing:
              -0.02em;

          }


          
.ai-weather-summary-close {

  display:
    grid;

  place-items:
    center;

  width:
    36px;

  height:
    36px;

  flex-shrink:
    0;

  border:
    none;

  border-radius:
    11px;

  cursor:
    pointer;

  color:
    #cbd5e1;

  background:
    rgba(
      255,
      255,
      255,
      0.06
    );

  transition:
    background
    0.22s
    ease,
    color
    0.22s
    ease,
    transform
    0.28s
    cubic-bezier(
      0.16,
      1,
      0.3,
      1
    ),
    box-shadow
    0.22s
    ease;

}


.ai-weather-summary-close:hover {

  color:
    #ffffff;

  background:
    rgba(
      251,
      113,
      133,
      0.16
    );

  transform:
    rotate(
      90deg
    )
    scale(
      1.06
    );

  box-shadow:
    0 0 18px
    rgba(
      251,
      113,
      133,
      0.18
    );

}


.ai-weather-summary-close:active {

  transform:
    rotate(
      90deg
    )
    scale(
      0.94
    );

}


.ai-weather-summary-close:focus-visible {

  outline:
    2px solid
    #fb7185;

  outline-offset:
    3px;

}




          /* ===============================================
             MODAL MAIN INSIGHT
          =============================================== */

          .ai-weather-summary-modal-insight {

            position:
              relative;

            z-index:
              2;

            margin-top:
              25px;

            padding:
              18px;

            border-radius:
              17px;

            background:
              linear-gradient(
                135deg,
                rgba(
                  56,
                  189,
                  248,
                  0.12
                ),
                rgba(
                  56,
                  189,
                  248,
                  0.04
                )
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.20
              );

          }


          .ai-weather-summary-modal-insight-label {

            display:
              flex;

            align-items:
              center;

            gap:
              7px;

            margin-bottom:
              9px;

            color:
              #7dd3fc;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.10em;

          }


          .ai-weather-summary-modal-insight-text {

            margin:
              0;

            color:
              #f1f5f9;

            font-size:
              17px;

            font-weight:
              600;

            line-height:
              1.5;

          }


          /* ===============================================
             DETAILED ANALYSIS
          =============================================== */

          .ai-weather-summary-section {

            position:
              relative;

            z-index:
              2;

            margin-top:
              24px;

          }


          .ai-weather-summary-section-heading {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            margin:
              0 0 11px;

            color:
              #ffffff;

            font-size:
              13px;

            font-weight:
              700;

          }


          .ai-weather-summary-analysis {

            padding:
              16px;

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


          .ai-weather-summary-analysis p {

            margin:
              0;

            color:
              #b8c7d8;

            font-size:
              13px;

            line-height:
              1.65;

          }


          /* ===============================================
             SIGNAL GRID
          =============================================== */

          .ai-weather-summary-signals {

            display:
              grid;

            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );

            gap:
              10px;

          }


          .ai-weather-summary-signal {

            padding:
              13px 10px;

            border-radius:
              13px;

            text-align:
              center;

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


          .ai-weather-summary-signal svg {

            margin-bottom:
              7px;

            color:
              #38bdf8;

          }


          .ai-weather-summary-signal span {

            display:
              block;

            color:
              #94a3b8;

            font-size:
              10px;

            line-height:
              1.35;

          }


          /* ===============================================
             CONFIDENCE
          =============================================== */

          .ai-weather-summary-confidence-card {

            padding:
              16px;

            border-radius:
              16px;

            background:
              rgba(
                56,
                189,
                248,
                0.06
              );

            border:
              1px solid
              rgba(
                56,
                189,
                248,
                0.14
              );

          }


          .ai-weather-summary-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              15px;

          }


          .ai-weather-summary-confidence-label {

            color:
              #94a3b8;

            font-size:
              11px;

          }


          .ai-weather-summary-confidence-value {

            color:
              #38bdf8;

            font-size:
              20px;

            font-weight:
              800;

          }


          .ai-weather-summary-confidence-bar {

            width:
              100%;

            height:
              7px;

            margin-top:
              11px;

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


          .ai-weather-summary-confidence-fill {

            width:
              94%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #0284c7,
                #38bdf8
              );

            box-shadow:
              0 0 14px
              rgba(
                56,
                189,
                248,
                0.45
              );

          }


          /* ===============================================
             MODAL FOOTER
          =============================================== */

          .ai-weather-summary-modal-footer {

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
              15px;

            margin-top:
              25px;

            padding-top:
              18px;

            border-top:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .ai-weather-summary-modal-footer-text {

            margin:
              0;

            color:
              #64748b;

            font-size:
              10px;

          }


          .ai-weather-summary-modal-status {

            display:
              flex;

            align-items:
              center;

            gap:
              6px;

            color:
              #86efac;

            font-size:
              10px;

            font-weight:
              700;

          }


          .ai-weather-summary-modal-status-dot {

            width:
              7px;

            height:
              7px;

            border-radius:
              50%;

            background:
              #22c55e;

            box-shadow:
              0 0 10px
              rgba(
                34,
                197,
                94,
                0.75
              );

          }


          /* ===============================================
             RESPONSIVE
          =============================================== */

          @media (
            max-width:
            700px
          ) {

            .ai-weather-summary-card {

              min-height:
                335px;

              padding:
                20px;

            }


            .ai-weather-summary-modal {

              padding:
                22px;

              border-radius:
                22px;

            }


            .ai-weather-summary-signals {

              grid-template-columns:
                1fr;

            }


            .ai-weather-summary-modal-insight-text {

              font-size:
                15px;

            }

          }

        `}
      </style>


      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <article
        className="ai-weather-summary-card"
        onClick={openModal}
        role="button"
        tabIndex={0}
        aria-label="Open AI Weather Summary details"
        onKeyDown={(event) => {

          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {

            event.preventDefault();

            openModal();

          }

        }}
      >

        {/* =================================================
            TOP
        ================================================= */}

        <div
          className="ai-weather-summary-top"
        >

          <span
            className="ai-weather-summary-number"
          >

            01

          </span>


          <div
            className="ai-weather-summary-icon"
          >

            <Sparkles
              size={21}
            />

          </div>

        </div>


        {/* =================================================
            HEADING
        ================================================= */}

        <div
          className="ai-weather-summary-heading"
        >

          <span
            className="ai-weather-summary-eyebrow"
          >

            WHAT THE SKY IS SAYING

          </span>


          <h2
            className="ai-weather-summary-title"
          >

            AI Weather Summary

          </h2>

        </div>


        <p
          className="ai-weather-summary-description"
        >

          A plain-language read of current
          conditions and the next few hours.

        </p>


        {/* =================================================
            MAIN AI INSIGHT
        ================================================= */}

        <div
          className="ai-weather-summary-insight"
        >

          <CloudRain
            size={17}
            className="ai-weather-summary-insight-icon"
          />


          <p
            className="ai-weather-summary-insight-text"
          >

            Rainfall is likely to increase
            after 4 PM.

          </p>

        </div>


        {/* =================================================
            WEATHER METRICS
        ================================================= */}

        <div
          className="ai-weather-summary-metrics"
        >

          <div
            className="ai-weather-summary-metric"
          >

            <Thermometer
              size={15}
              className="ai-weather-summary-metric-icon"
            />

            <span
              className="ai-weather-summary-metric-value"
            >

              31°

            </span>

            <span
              className="ai-weather-summary-metric-label"
            >

              Current

            </span>

          </div>


          <div
            className="ai-weather-summary-metric"
          >

            <Droplets
              size={15}
              className="ai-weather-summary-metric-icon"
            />

            <span
              className="ai-weather-summary-metric-value"
            >

              78%

            </span>

            <span
              className="ai-weather-summary-metric-label"
            >

              Rain chance

            </span>

          </div>


          <div
            className="ai-weather-summary-metric"
          >

            <Wind
              size={15}
              className="ai-weather-summary-metric-icon"
            />

            <span
              className="ai-weather-summary-metric-value"
            >

              18

            </span>

            <span
              className="ai-weather-summary-metric-label"
            >

              km/h wind

            </span>

          </div>

        </div>

      </article>


      {/* ===================================================
          MODAL
      =================================================== */}

      {isModalOpen && (

        <div
          className="ai-weather-summary-modal-backdrop"
          role="presentation"
          onMouseDown={closeModal}
        >

          <section
            className="ai-weather-summary-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-weather-summary-modal-title"
            onMouseDown={(event) => {

              event.stopPropagation();

            }}
          >

            <div
              className="ai-weather-summary-modal-header"
            >

              <div
                className="ai-weather-summary-modal-title-row"
              >

                <div
                  className="ai-weather-summary-modal-icon"
                >

                  <Sparkles
                    size={21}
                  />

                </div>


                <div>

                  <p
                    className="ai-weather-summary-modal-eyebrow"
                  >

                    LIVE AI ANALYSIS

                  </p>


                  <h2
                    id="ai-weather-summary-modal-title"
                    className="ai-weather-summary-modal-title"
                  >

                    AI Weather Summary

                  </h2>

                </div>

              </div>


              <button
                type="button"
                className="ai-weather-summary-close"
                onClick={closeModal}
                aria-label="Close AI Weather Summary"
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <div
              className="ai-weather-summary-modal-insight"
            >

              <div
                className="ai-weather-summary-modal-insight-label"
              >

                <Sparkles
                  size={14}
                />

                PRIMARY INSIGHT

              </div>


              <p
                className="ai-weather-summary-modal-insight-text"
              >

                Rainfall is likely to increase
                significantly after 4 PM.

              </p>

            </div>


            <div
              className="ai-weather-summary-section"
            >

              <h3
                className="ai-weather-summary-section-heading"
              >

                <Brain
                  size={16}
                  color="#38bdf8"
                />

                Why AI thinks this

              </h3>


              <div
                className="ai-weather-summary-analysis"
              >

                <p>

                  Increasing atmospheric moisture,
                  growing convective cloud activity
                  and strengthening local wind
                  convergence indicate a higher
                  probability of rainfall later
                  this afternoon.

                </p>

              </div>

            </div>


            <div
              className="ai-weather-summary-section"
            >

              <h3
                className="ai-weather-summary-section-heading"
              >

                <Activity
                  size={16}
                  color="#38bdf8"
                />

                Signals analysed

              </h3>


              <div
                className="ai-weather-summary-signals"
              >

                <div
                  className="ai-weather-summary-signal"
                >

                  <Radar
                    size={18}
                  />

                  <span>

                    Radar trends

                  </span>

                </div>


                <div
                  className="ai-weather-summary-signal"
                >

                  <CloudSun
                    size={18}
                  />

                  <span>

                    Cloud movement

                  </span>

                </div>


                <div
                  className="ai-weather-summary-signal"
                >

                  <Droplets
                    size={18}
                  />

                  <span>

                    Moisture levels

                  </span>

                </div>

              </div>

            </div>


            <div
              className="ai-weather-summary-section"
            >

              <div
                className="ai-weather-summary-confidence-card"
              >

                <div
                  className="ai-weather-summary-confidence-top"
                >

                  <span
                    className="ai-weather-summary-confidence-label"
                  >

                    AI confidence

                  </span>


                  <span
                    className="ai-weather-summary-confidence-value"
                  >

                    94%

                  </span>

                </div>


                <div
                  className="ai-weather-summary-confidence-bar"
                >

                  <div
                    className="ai-weather-summary-confidence-fill"
                  />

                </div>

              </div>

            </div>


            <div
              className="ai-weather-summary-modal-footer"
            >

              <p
                className="ai-weather-summary-modal-footer-text"
              >

                Updated using the latest available
                weather signals.

              </p>


              <div
                className="ai-weather-summary-modal-status"
              >

                <span
                  className="ai-weather-summary-modal-status-dot"
                />

                Live analysis

              </div>

            </div>

          </section>

        </div>

      )}

    </>

  );

};
