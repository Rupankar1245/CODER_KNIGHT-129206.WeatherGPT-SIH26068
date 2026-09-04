
import React, {
  useEffect,
  useState,
} from 'react';

import {
  TrendingDown,
  Clock3,
  CloudSun,
  Sparkles,
  X,
  BrainCircuit,
  Thermometer,
  Cloud,
  Gauge,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const AIForecastInsight: React.FC = () => {

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);


  /* =======================================================
     OPEN / CLOSE
  ======================================================= */

  const openModal = () => {

    setIsModalOpen(true);

  };


  const closeModal = () => {

    setIsModalOpen(false);

  };


  /* =======================================================
     ESC KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape = (
      event: KeyboardEvent,
    ) => {

      if (
        event.key === 'Escape'
      ) {

        closeModal();

      }

    };


    window.addEventListener(
      'keydown',
      handleEscape,
    );


    return () => {

      window.removeEventListener(
        'keydown',
        handleEscape,
      );

    };

  }, []);


  /* =======================================================
     CARD KEYBOARD
  ======================================================= */

  const handleCardKeyDown = (
    event:
      React.KeyboardEvent<HTMLElement>,
  ) => {

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {

      event.preventDefault();

      openModal();

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <>

      {/* ===================================================
          INTEGRATED STYLES
      =================================================== */}

      <style>
        {`

          /* =============================================
             CARD
          ============================================= */

          .ai-forecast-insight-card {

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
                  192,
                  132,
                  252,
                  0.16
                )
                0%,
                rgba(
                  255,
                  255,
                  255,
                  0.045
                )
                54%,
                rgba(
                  88,
                  28,
                  135,
                  0.13
                )
                100%
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.25
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
              border-color
              0.3s
              ease,
              box-shadow
              0.3s
              ease;

          }


          .ai-forecast-insight-card::before {

            content:
              "";

            position:
              absolute;

            width:
              230px;

            height:
              230px;

            top:
              -100px;

            right:
              -80px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  192,
                  132,
                  252,
                  0.17
                )
                0%,
                transparent
                70%
              );

            pointer-events:
              none;

            transition:
              opacity
              0.3s
              ease;

          }


          /* =============================================
             HOVER — GLOW ONLY
          ============================================= */

          .ai-forecast-insight-card:hover {

            border-color:
              rgba(
                192,
                132,
                252,
                0.52
              );

            box-shadow:
              0 12px 38px
              rgba(
                0,
                0,
                0,
                0.20
              ),
              0 0 42px
              rgba(
                192,
                132,
                252,
                0.18
              ),
              0 0 80px
              rgba(
                168,
                85,
                247,
                0.07
              );

          }


          .ai-forecast-insight-card:hover::before {

            opacity:
              1.45;

          }


          .ai-forecast-insight-card:focus-visible {

            outline:
              2px solid
              #c084fc;

            outline-offset:
              3px;

          }


          /* =============================================
             TOP
          ============================================= */

          .ai-forecast-insight-top {

            position:
              relative;

            z-index:
              3;

            display:
              flex;

            align-items:
              flex-start;

            justify-content:
              space-between;

          }


          .ai-forecast-insight-number {

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
              #c084fc;

            background:
              rgba(
                192,
                132,
                252,
                0.12
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
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


          .ai-forecast-insight-icon {

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
              #d8b4fe;

            background:
              rgba(
                192,
                132,
                252,
                0.12
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.22
              );

            box-shadow:
              0 0 22px
              rgba(
                192,
                132,
                252,
                0.14
              );

          }


          /* =============================================
             HEADING
          ============================================= */

          .ai-forecast-insight-heading {

            position:
              relative;

            z-index:
              3;

            margin-top:
              16px;

          }


          .ai-forecast-insight-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #c084fc;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .ai-forecast-insight-title {

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


          .ai-forecast-insight-description {

            position:
              relative;

            z-index:
              3;

            margin:
              8px 0 14px;

            color:
              #a99ab7;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* =============================================
             TREND
          ============================================= */

          .ai-forecast-trend {

            position:
              relative;

            z-index:
              3;

            margin:
              2px 0 12px;

            padding:
              10px 12px 8px;

            border-radius:
              14px;

            background:
              rgba(
                28,
                14,
                46,
                0.55
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.18
              );

          }


          .ai-forecast-trend-header {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              6px;

          }


          .ai-forecast-trend-label {

            display:
              inline-flex;

            align-items:
              center;

            gap:
              5px;

            color:
              #a78bfa;

            font-size:
              10px;

            font-weight:
              700;

            letter-spacing:
              0.05em;

          }


          .ai-forecast-trend-change {

            color:
              #d8b4fe;

            font-size:
              11px;

            font-weight:
              700;

          }


          .ai-forecast-chart {

            width:
              100%;

            height:
              58px;

            overflow:
              visible;

          }


          .ai-forecast-chart-line {

            fill:
              none;

            stroke:
              #c084fc;

            stroke-width:
              2.5;

            stroke-linecap:
              round;

            stroke-linejoin:
              round;

          }


          .ai-forecast-chart-area {

            opacity:
              0.16;

          }


          .ai-forecast-point {

            fill:
              #c084fc;

          }


          .ai-forecast-times {

            display:
              flex;

            justify-content:
              space-between;

            margin-top:
              2px;

            color:
              #756783;

            font-size:
              9px;

          }


          /* =============================================
             MAIN STAT
          ============================================= */

          .ai-forecast-main-stat {

            position:
              relative;

            z-index:
              3;

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              12px;

            padding:
              10px 12px;

            border-radius:
              12px;

            background:
              rgba(
                255,
                255,
                255,
                0.04
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


          .ai-forecast-stat-left {

            display:
              flex;

            align-items:
              center;

            gap:
              9px;

          }


          .ai-forecast-stat-icon {

            color:
              #d8b4fe;

          }


          .ai-forecast-stat-content {

            display:
              flex;

            flex-direction:
              column;

          }


          .ai-forecast-stat-value {

            color:
              #ffffff;

            font-size:
              18px;

            font-weight:
              800;

            line-height:
              1.1;

          }


          .ai-forecast-stat-label {

            margin-top:
              2px;

            color:
              #756783;

            font-size:
              10px;

          }


          .ai-forecast-outlook {

            padding:
              5px 8px;

            border-radius:
              999px;

            color:
              #d8b4fe;

            background:
              rgba(
                192,
                132,
                252,
                0.10
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.22
              );

            font-size:
              9px;

            font-weight:
              700;

          }


          /* =============================================
             MODAL OVERLAY
          ============================================= */

          .ai-forecast-modal-overlay {

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
                6,
                23,
                0.78
              );

            backdrop-filter:
              blur(10px);

            -webkit-backdrop-filter:
              blur(10px);

            animation:
              aiForecastFadeIn
              0.22s
              ease;

          }


          @keyframes aiForecastFadeIn {

            from {

              opacity:
                0;

            }

            to {

              opacity:
                1;

            }

          }


          @keyframes aiForecastModalIn {

            from {

              opacity:
                0;

              transform:
                translateY(18px)
                scale(0.98);

            }

            to {

              opacity:
                1;

              transform:
                translateY(0)
                scale(1);

            }

          }


          .ai-forecast-modal {

            position:
              relative;

            width:
              min(
                620px,
                100%
              );

            max-height:
              min(
                760px,
                90vh
              );

            overflow-y:
              auto;

            padding:
              28px;

            border-radius:
              24px;

            color:
              #ffffff;

            background:
              linear-gradient(
                145deg,
                rgba(
                  25,
                  12,
                  45,
                  0.98
                ),
                rgba(
                  10,
                  8,
                  25,
                  0.98
                )
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.28
              );

            box-shadow:
              0 30px 80px
              rgba(
                0,
                0,
                0,
                0.45
              ),
              0 0 55px
              rgba(
                192,
                132,
                252,
                0.08
              );

            animation:
              aiForecastModalIn
              0.28s
              ease;

          }


          /* =============================================
             ANIMATED CLOSE BUTTON
          ============================================= */

          .ai-forecast-modal-close {

  position:
    absolute;

  top:
    16px;

  right:
    16px;

  display:
    grid;

  place-items:
    center;

  width:
    38px;

  height:
    38px;

  padding:
    0;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.10
    );

  border-radius:
    12px;

  cursor:
    pointer;

  color:
    #d8b4fe;

  background:
    rgba(
      255,
      255,
      255,
      0.06
    );

  box-shadow:
    0 0 0
    rgba(
      192,
      132,
      252,
      0
    );

  transition:
    transform
    0.28s
    cubic-bezier(
      0.34,
      1.56,
      0.64,
      1
    ),
    background
    0.25s
    ease,
    border-color
    0.25s
    ease,
    box-shadow
    0.25s
    ease,
    color
    0.25s
    ease;

}


.ai-forecast-modal-close svg {

  transition:
    transform
    0.32s
    cubic-bezier(
      0.34,
      1.56,
      0.64,
      1
    );

}


.ai-forecast-modal-close:hover {

  transform:
    scale(1.08);

  color:
    #ffffff;

  border-color:
    rgba(
      192,
      132,
      252,
      0.55
    );

  background:
    rgba(
      192,
      132,
      252,
      0.16
    );

  box-shadow:
    0 0 22px
    rgba(
      192,
      132,
      252,
      0.24
    );

}


.ai-forecast-modal-close:hover svg {

  transform:
    rotate(90deg)
    scale(1.12);

}


.ai-forecast-modal-close:active {

  transform:
    scale(0.90);

}


.ai-forecast-modal-close:active svg {

  transform:
    rotate(180deg)
    scale(0.92);

}


.ai-forecast-modal-close:focus-visible {

  outline:
    2px solid
    #c084fc;

  outline-offset:
    3px;

}


          /* =============================================
             MODAL HEADER
          ============================================= */

          .ai-forecast-modal-header {

            display:
              flex;

            align-items:
              flex-start;

            gap:
              14px;

            padding-right:
              44px;

            margin-bottom:
              24px;

          }


          .ai-forecast-modal-icon {

            display:
              grid;

            place-items:
              center;

            width:
              52px;

            height:
              52px;

            flex-shrink:
              0;

            border-radius:
              17px;

            color:
              #d8b4fe;

            background:
              rgba(
                192,
                132,
                252,
                0.12
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.24
              );

          }


          .ai-forecast-modal-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #c084fc;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.12em;

          }


          .ai-forecast-modal-title {

            margin:
              0;

            font-size:
              24px;

            font-weight:
              750;

          }


          /* =============================================
             AI CONFIDENCE
          ============================================= */

          .ai-forecast-confidence {

            padding:
              16px;

            margin-bottom:
              18px;

            border-radius:
              16px;

            background:
              rgba(
                192,
                132,
                252,
                0.07
              );

            border:
              1px solid
              rgba(
                192,
                132,
                252,
                0.18
              );

          }


          .ai-forecast-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              10px;

          }


          .ai-forecast-confidence-label {

            display:
              inline-flex;

            align-items:
              center;

            gap:
              7px;

            color:
              #d8b4fe;

            font-size:
              12px;

            font-weight:
              700;

          }


          .ai-forecast-confidence-value {

            color:
              #ffffff;

            font-size:
              13px;

            font-weight:
              800;

          }


          .ai-forecast-confidence-track {

            width:
              100%;

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


          .ai-forecast-confidence-bar {

            width:
              87%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #a855f7,
                #d8b4fe
              );

            box-shadow:
              0 0 16px
              rgba(
                192,
                132,
                252,
                0.45
              );

          }


          /* =============================================
             MODAL INSIGHT
          ============================================= */

          .ai-forecast-modal-insight {

            padding:
              18px;

            margin-bottom:
              18px;

            border-radius:
              16px;

            background:
              rgba(
                255,
                255,
                255,
                0.04
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


          .ai-forecast-modal-section-title {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            margin:
              0 0 10px;

            color:
              #d8b4fe;

            font-size:
              12px;

            font-weight:
              800;

          }


          .ai-forecast-modal-text {

            margin:
              0;

            color:
              #b9a9c7;

            font-size:
              13px;

            line-height:
              1.7;

          }


          /* =============================================
             SIGNALS
          ============================================= */

          .ai-forecast-signals {

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

            margin-bottom:
              18px;

          }


          .ai-forecast-signal {

            padding:
              14px;

            border-radius:
              14px;

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


          .ai-forecast-signal-icon {

            margin-bottom:
              9px;

            color:
              #c084fc;

          }


          .ai-forecast-signal-value {

            display:
              block;

            color:
              #ffffff;

            font-size:
              16px;

            font-weight:
              800;

          }


          .ai-forecast-signal-label {

            display:
              block;

            margin-top:
              3px;

            color:
              #887995;

            font-size:
              10px;

          }


          /* =============================================
             REASONING
          ============================================= */

          .ai-forecast-reasoning {

            padding:
              18px;

            border-radius:
              16px;

            background:
              rgba(
                192,
                132,
                252,
                0.06
              );

            border-left:
              3px solid
              #c084fc;

          }


          .ai-forecast-reasoning-title {

            margin:
              0 0 8px;

            color:
              #d8b4fe;

            font-size:
              11px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .ai-forecast-reasoning-text {

            margin:
              0;

            color:
              #b9a9c7;

            font-size:
              12px;

            line-height:
              1.65;

          }


          /* =============================================
             RESPONSIVE
          ============================================= */

          @media (
            max-width:
            700px
          ) {

            .ai-forecast-insight-card {

              min-height:
                350px;

              padding:
                20px;

            }


            .ai-forecast-insight-title {

              font-size:
                20px;

            }


            .ai-forecast-modal {

              padding:
                22px;

            }


            .ai-forecast-signals {

              grid-template-columns:
                1fr;

            }

          }

        `}
      </style>


      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <article
        className="ai-forecast-insight-card"
        onClick={openModal}
        onKeyDown={handleCardKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open AI Forecast Insight details"
      >


        {/* =================================================
            TOP
        ================================================= */}

        <div
          className="ai-forecast-insight-top"
        >

          <span
            className="ai-forecast-insight-number"
          >
            03
          </span>


          <div
            className="ai-forecast-insight-icon"
          >

            <TrendingDown
              size={21}
            />

          </div>

        </div>


        {/* =================================================
            HEADING
        ================================================= */}

        <div
          className="ai-forecast-insight-heading"
        >

          <span
            className="ai-forecast-insight-eyebrow"
          >
            BEYOND THE NUMBERS
          </span>


          <h2
            className="ai-forecast-insight-title"
          >
            AI Forecast Insight
          </h2>

        </div>


        <p
          className="ai-forecast-insight-description"
        >
          Turns the forecast curve into a clear story
          about what changes next.
        </p>


        {/* =================================================
            TREND CHART
        ================================================= */}

        <div
          className="ai-forecast-trend"
        >

          <div
            className="ai-forecast-trend-header"
          >

            <span
              className="ai-forecast-trend-label"
            >

              <Clock3
                size={12}
              />

              TEMPERATURE TREND

            </span>


            <span
              className="ai-forecast-trend-change"
            >
              −5°C / 24h
            </span>

          </div>


          <svg
            className="ai-forecast-chart"
            viewBox="0 0 260 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >

            <defs>

              <linearGradient
                id="forecastAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#c084fc"
                  stopOpacity="0.5"
                />


                <stop
                  offset="100%"
                  stopColor="#c084fc"
                  stopOpacity="0"
                />

              </linearGradient>

            </defs>


            <path
              d="
                M 0 14
                C 30 16, 42 18, 60 22
                S 98 30, 118 35
                S 156 43, 180 48
                S 220 55, 260 60
                L 260 70
                L 0 70
                Z
              "
              fill="url(#forecastAreaGradient)"
              className="ai-forecast-chart-area"
            />


            <path
              d="
                M 0 14
                C 30 16, 42 18, 60 22
                S 98 30, 118 35
                S 156 43, 180 48
                S 220 55, 260 60
              "
              className="ai-forecast-chart-line"
            />


            <circle
              cx="0"
              cy="14"
              r="3.5"
              className="ai-forecast-point"
            />


            <circle
              cx="260"
              cy="60"
              r="3.5"
              className="ai-forecast-point"
            />

          </svg>


          <div
            className="ai-forecast-times"
          >

            <span>Now</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>

          </div>

        </div>


        {/* =================================================
            MAIN STAT
        ================================================= */}

        <div
          className="ai-forecast-main-stat"
        >

          <div
            className="ai-forecast-stat-left"
          >

            <CloudSun
              size={19}
              className="ai-forecast-stat-icon"
            />


            <div
              className="ai-forecast-stat-content"
            >

              <span
                className="ai-forecast-stat-value"
              >
                26°
              </span>


              <span
                className="ai-forecast-stat-label"
              >
                Expected by tomorrow
              </span>

            </div>

          </div>


          <span
            className="ai-forecast-outlook"
          >
            24H OUTLOOK
          </span>

        </div>

      </article>


      {/* ===================================================
          MODAL
      =================================================== */}

      {
        isModalOpen && (

          <div
            className="ai-forecast-modal-overlay"
            onClick={closeModal}
            role="presentation"
          >

            <section
              className="ai-forecast-modal"
              onClick={
                (event) =>
                  event.stopPropagation()
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-forecast-modal-title"
            >


              {/* CLOSE */}

              <button
                type="button"
                className="ai-forecast-modal-close"
                onClick={closeModal}
                aria-label="Close AI Forecast Insight"
              >

                <X
                  size={19}
                />

              </button>


              {/* HEADER */}

              <div
                className="ai-forecast-modal-header"
              >

                <div
                  className="ai-forecast-modal-icon"
                >

                  <BrainCircuit
                    size={25}
                  />

                </div>


                <div>

                  <span
                    className="ai-forecast-modal-eyebrow"
                  >
                    AI FORECAST ANALYSIS
                  </span>


                  <h2
                    id="ai-forecast-modal-title"
                    className="ai-forecast-modal-title"
                  >
                    What changes next?
                  </h2>

                </div>

              </div>


              {/* AI CONFIDENCE */}

              <div
                className="ai-forecast-confidence"
              >

                <div
                  className="ai-forecast-confidence-top"
                >

                  <span
                    className="ai-forecast-confidence-label"
                  >

                    <Sparkles
                      size={15}
                    />

                    AI CONFIDENCE

                  </span>


                  <span
                    className="ai-forecast-confidence-value"
                  >
                    87%
                  </span>

                </div>


                <div
                  className="ai-forecast-confidence-track"
                >

                  <div
                    className="ai-forecast-confidence-bar"
                  />

                </div>

              </div>


              {/* FORECAST SUMMARY */}

              <div
                className="ai-forecast-modal-insight"
              >

                <h3
                  className="ai-forecast-modal-section-title"
                >

                  <Sparkles
                    size={16}
                  />

                  FORECAST SUMMARY

                </h3>


                <p
                  className="ai-forecast-modal-text"
                >
                  Temperatures are expected to gradually
                  fall over the next 24 hours as cloud
                  cover increases and daytime heating
                  weakens.
                </p>

              </div>


              {/* KEY SIGNALS */}

              <div
                className="ai-forecast-signals"
              >

                <div
                  className="ai-forecast-signal"
                >

                  <Thermometer
                    size={18}
                    className="ai-forecast-signal-icon"
                  />


                  <span
                    className="ai-forecast-signal-value"
                  >
                    −5°C
                  </span>


                  <span
                    className="ai-forecast-signal-label"
                  >
                    Temperature trend
                  </span>

                </div>


                <div
                  className="ai-forecast-signal"
                >

                  <Cloud
                    size={18}
                    className="ai-forecast-signal-icon"
                  />


                  <span
                    className="ai-forecast-signal-value"
                  >
                    Increasing
                  </span>


                  <span
                    className="ai-forecast-signal-label"
                  >
                    Cloud cover
                  </span>

                </div>


                <div
                  className="ai-forecast-signal"
                >

                  <Gauge
                    size={18}
                    className="ai-forecast-signal-icon"
                  />


                  <span
                    className="ai-forecast-signal-value"
                  >
                    Stable
                  </span>


                  <span
                    className="ai-forecast-signal-label"
                  >
                    Atmospheric trend
                  </span>

                </div>

              </div>


              {/* AI REASONING */}

              <div
                className="ai-forecast-reasoning"
              >

                <p
                  className="ai-forecast-reasoning-title"
                >
                  WHY THE AI EXPECTS THIS
                </p>


                <p
                  className="ai-forecast-reasoning-text"
                >
                  Cooler air and increasing cloud cover
                  are likely to reduce solar heating.
                  Combined with the current forecast
                  pattern, this suggests a steady
                  temperature decline rather than a
                  sudden change.
                </p>

              </div>

            </section>

          </div>

        )
      }

    </>

  );

};
