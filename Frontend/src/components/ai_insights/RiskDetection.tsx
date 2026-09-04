
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ShieldAlert,
  MapPin,
  CloudRain,
  Waves,
  AlertTriangle,
  X,
  Activity,
  Clock,
  Navigation,
  ShieldCheck,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const RiskDetection: React.FC = () => {

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


  /* =======================================================
     KEYBOARD HANDLER
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

      {/* ===================================================
          INTEGRATED STYLES
      =================================================== */}

      <style>
        {`

          /* ===============================================
             MODAL ANIMATIONS
          =============================================== */

          @keyframes riskModalFadeIn {

            from {

              opacity:
                0;

            }


            to {

              opacity:
                1;

            }

          }


          @keyframes riskModalSlideUp {

            from {

              opacity:
                0;

              transform:
                translateY(22px)
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


          /* ===============================================
             CARD
          =============================================== */

          .risk-detection-card {

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
                  251,
                  146,
                  60,
                  0.16
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
                  120,
                  53,
                  15,
                  0.12
                )
                100%
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
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


          /* ===============================================
             CARD BACKGROUND GLOW
          =============================================== */

          .risk-detection-card::before {

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
                  251,
                  146,
                  60,
                  0.18
                )
                0%,
                transparent
                70%
              );

            pointer-events:
              none;

            z-index:
              -1;

          }


          /* ===============================================
             CARD HOVER
             ONLY GLOW — NO MOVEMENT
          =============================================== */

          .risk-detection-card:hover {

            border-color:
              rgba(
                251,
                146,
                60,
                0.48
              );

            box-shadow:
              0 12px 38px
              rgba(
                0,
                0,
                0,
                0.18
              ),
              0 0 34px
              rgba(
                251,
                146,
                60,
                0.12
              ),
              inset
              0 1px 0
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .risk-detection-card:focus-visible {

            outline:
              2px solid
              #fb923c;

            outline-offset:
              4px;

          }


          /* ===============================================
             TOP ROW
          =============================================== */

          .risk-detection-top {

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


          .risk-detection-number {

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
              #fb923c;

            background:
              rgba(
                251,
                146,
                60,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
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


          .risk-detection-icon {

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
              #fdba74;

            background:
              rgba(
                251,
                146,
                60,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
                0.22
              );

            box-shadow:
              0 0 22px
              rgba(
                251,
                146,
                60,
                0.13
              );

          }


          /* ===============================================
             HEADING
          =============================================== */

          .risk-detection-heading {

            position:
              relative;

            z-index:
              2;

            margin-top:
              18px;

          }


          .risk-detection-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #fb923c;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .risk-detection-title {

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


          .risk-detection-description {

            position:
              relative;

            z-index:
              2;

            margin:
              8px 0 16px;

            max-width:
              90%;

            color:
              #9fb3c8;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* ===============================================
             RISK SUMMARY
          =============================================== */

          .risk-detection-summary {

            position:
              relative;

            z-index:
              2;

            display:
              flex;

            align-items:
              center;

            gap:
              12px;

            padding:
              12px 13px;

            border-radius:
              14px;

            background:
              rgba(
                38,
                20,
                8,
                0.58
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
                0.23
              );

          }


          .risk-detection-risk-indicator {

            display:
              grid;

            place-items:
              center;

            width:
              38px;

            height:
              38px;

            flex-shrink:
              0;

            border-radius:
              12px;

            color:
              #fb923c;

            background:
              rgba(
                251,
                146,
                60,
                0.12
              );

          }


          .risk-detection-summary-content {

            min-width:
              0;

          }


          .risk-detection-summary-label {

            display:
              block;

            margin-bottom:
              2px;

            color:
              #7e92a8;

            font-size:
              10px;

            text-transform:
              uppercase;

            letter-spacing:
              0.08em;

          }


          .risk-detection-summary-value {

            display:
              block;

            color:
              #fed7aa;

            font-size:
              13px;

            font-weight:
              700;

            line-height:
              1.4;

          }


          /* ===============================================
             METRICS
          =============================================== */

          .risk-detection-zones {

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


          .risk-detection-zone {

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


          .risk-detection-zone-icon {

            margin-bottom:
              7px;

            color:
              #fdba74;

          }


          .risk-detection-zone-value {

            display:
              block;

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              700;

          }


          .risk-detection-zone-label {

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
             MODAL OVERLAY
          =============================================== */

          .risk-detection-modal-overlay {

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
              24px;

            background:
              rgba(
                2,
                8,
                23,
                0.76
              );

            backdrop-filter:
              blur(10px);

            -webkit-backdrop-filter:
              blur(10px);

            animation:
              riskModalFadeIn
              0.22s
              ease;

          }


          /* ===============================================
             MODAL
          =============================================== */

          .risk-detection-modal {

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
                calc(
                  100vh - 48px
                )
              );

            overflow-y:
              auto;

            border-radius:
              28px;

            color:
              #ffffff;

            background:
              linear-gradient(
                145deg,
                rgba(
                  38,
                  20,
                  8,
                  0.96
                ),
                rgba(
                  12,
                  18,
                  30,
                  0.98
                )
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
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
              0 0 60px
              rgba(
                251,
                146,
                60,
                0.08
              );

            animation:
              riskModalSlideUp
              0.3s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );

          }


          .risk-detection-modal::-webkit-scrollbar {

            width:
              6px;

          }


          .risk-detection-modal::-webkit-scrollbar-thumb {

            border-radius:
              999px;

            background:
              rgba(
                251,
                146,
                60,
                0.28
              );

          }


          /* ===============================================
             MODAL GLOW
          =============================================== */

          .risk-detection-modal::before {

            content:
              "";

            position:
              absolute;

            width:
              330px;

            height:
              330px;

            top:
              -170px;

            right:
              -100px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  251,
                  146,
                  60,
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

          .risk-detection-modal-header {

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

            padding:
              28px
              28px
              20px;

          }


          .risk-detection-modal-heading {

            display:
              flex;

            align-items:
              center;

            gap:
              14px;

          }


          .risk-detection-modal-icon {

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
              #fdba74;

            background:
              rgba(
                251,
                146,
                60,
                0.13
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
                0.25
              );

            box-shadow:
              0 0 28px
              rgba(
                251,
                146,
                60,
                0.14
              );

          }


          .risk-detection-modal-eyebrow {

            margin:
              0 0 5px;

            color:
              #fb923c;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .risk-detection-modal-title {

            margin:
              0;

            color:
              #ffffff;

            font-size:
              24px;

            font-weight:
              750;

          }


          /* ===============================================
             ANIMATED CLOSE BUTTON
          =============================================== */

          .risk-detection-close {

            display:
              grid;

            place-items:
              center;

            width:
              38px;

            height:
              38px;

            flex-shrink:
              0;

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

            color:
              #cbd5e1;

            background:
              rgba(
                255,
                255,
                255,
                0.05
              );

            cursor:
              pointer;

            transition:
              background
              0.22s
              ease,
              color
              0.22s
              ease,
              border-color
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


          .risk-detection-close:hover {

            color:
              #ffffff;

            border-color:
              rgba(
                251,
                146,
                60,
                0.42
              );

            background:
              rgba(
                251,
                146,
                60,
                0.14
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
                146,
                60,
                0.20
              );

          }


          .risk-detection-close:active {

            transform:
              rotate(
                90deg
              )
              scale(
                0.94
              );

          }


          .risk-detection-close:focus-visible {

            outline:
              2px solid
              #fb923c;

            outline-offset:
              3px;

          }


          /* ===============================================
             MODAL CONTENT
          =============================================== */

          .risk-detection-modal-content {

            position:
              relative;

            z-index:
              2;

            padding:
              0
              28px
              28px;

          }


          /* ===============================================
             ALERT BANNER
          =============================================== */

          .risk-detection-alert-banner {

            display:
              flex;

            align-items:
              flex-start;

            gap:
              12px;

            padding:
              16px;

            margin-bottom:
              22px;

            border-radius:
              17px;

            background:
              rgba(
                251,
                146,
                60,
                0.08
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
                0.22
              );

          }


          .risk-detection-alert-banner-icon {

            flex-shrink:
              0;

            color:
              #fb923c;

          }


          .risk-detection-alert-label {

            display:
              block;

            margin-bottom:
              4px;

            color:
              #fdba74;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.1em;

          }


          .risk-detection-alert-text {

            margin:
              0;

            color:
              #f8fafc;

            font-size:
              14px;

            font-weight:
              600;

            line-height:
              1.5;

          }


          /* ===============================================
             ANALYSIS SECTION
          =============================================== */

          .risk-detection-section {

            margin-top:
              22px;

          }


          .risk-detection-section-title {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            margin:
              0 0 12px;

            color:
              #ffffff;

            font-size:
              13px;

            font-weight:
              700;

          }


          .risk-detection-section-title svg {

            color:
              #fb923c;

          }


          .risk-detection-analysis-box {

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


          .risk-detection-analysis-text {

            margin:
              0;

            color:
              #b9c6d3;

            font-size:
              13px;

            line-height:
              1.7;

          }


          /* ===============================================
             DETAILS GRID
          =============================================== */

          .risk-detection-details-grid {

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
              10px;

          }


          .risk-detection-detail-item {

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


          .risk-detection-detail-icon {

            margin-bottom:
              9px;

            color:
              #fdba74;

          }


          .risk-detection-detail-label {

            display:
              block;

            margin-bottom:
              4px;

            color:
              #71859a;

            font-size:
              10px;

          }


          .risk-detection-detail-value {

            display:
              block;

            color:
              #ffffff;

            font-size:
              14px;

            font-weight:
              700;

          }


          /* ===============================================
             ACTION PANEL
          =============================================== */

          .risk-detection-action-panel {

            display:
              flex;

            align-items:
              flex-start;

            gap:
              12px;

            padding:
              16px;

            margin-top:
              22px;

            border-radius:
              17px;

            background:
              linear-gradient(
                135deg,
                rgba(
                  251,
                  146,
                  60,
                  0.10
                ),
                rgba(
                  251,
                  146,
                  60,
                  0.035
                )
              );

            border:
              1px solid
              rgba(
                251,
                146,
                60,
                0.18
              );

          }


          .risk-detection-action-icon {

            display:
              grid;

            place-items:
              center;

            width:
              38px;

            height:
              38px;

            flex-shrink:
              0;

            border-radius:
              12px;

            color:
              #fb923c;

            background:
              rgba(
                251,
                146,
                60,
                0.12
              );

          }


          .risk-detection-action-title {

            margin:
              0 0 4px;

            color:
              #ffffff;

            font-size:
              12px;

            font-weight:
              700;

          }


          .risk-detection-action-text {

            margin:
              0;

            color:
              #aab8c6;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* ===============================================
             CONFIDENCE
          =============================================== */

          .risk-detection-confidence {

            margin-top:
              22px;

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


          .risk-detection-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              8px;

          }


          .risk-detection-confidence-label {

            color:
              #94a3b8;

            font-size:
              11px;

          }


          .risk-detection-confidence-value {

            color:
              #fdba74;

            font-size:
              12px;

            font-weight:
              800;

          }


          .risk-detection-confidence-bar {

            height:
              6px;

            overflow:
              hidden;

            border-radius:
              999px;

            background:
              rgba(
                255,
                255,
                255,
                0.07
              );

          }


          .risk-detection-confidence-fill {

            width:
              87%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #d97706,
                #fb923c
              );

            box-shadow:
              0 0 14px
              rgba(
                251,
                146,
                60,
                0.45
              );

          }


          /* ===============================================
             RESPONSIVE
          =============================================== */

          @media (
            max-width:
            700px
          ) {

            .risk-detection-card {

              min-height:
                330px;

              padding:
                20px;

            }


            .risk-detection-title {

              font-size:
                20px;

            }


            .risk-detection-modal-overlay {

              padding:
                12px;

            }


            .risk-detection-modal-header {

              padding:
                22px
                20px
                18px;

            }


            .risk-detection-modal-content {

              padding:
                0
                20px
                22px;

            }


            .risk-detection-modal-title {

              font-size:
                21px;

            }


            .risk-detection-details-grid {

              grid-template-columns:
                1fr;

            }

          }

        `}
      </style>


      {/* ===================================================
          CARD
      =================================================== */}

      <article
        className="risk-detection-card"
        onClick={openModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open Risk Detection details"
      >


        {/* ===============================================
            TOP
        =============================================== */}

        <div
          className="risk-detection-top"
        >

          <span
            className="risk-detection-number"
          >
            02
          </span>


          <div
            className="risk-detection-icon"
          >

            <ShieldAlert
              size={21}
            />

          </div>

        </div>


        {/* ===============================================
            HEADING
        =============================================== */}

        <div
          className="risk-detection-heading"
        >

          <span
            className="risk-detection-eyebrow"
          >
            STAY AHEAD OF DANGER
          </span>


          <h2
            className="risk-detection-title"
          >
            Risk Detection
          </h2>

        </div>


        <p
          className="risk-detection-description"
        >
          Combines rainfall, terrain, wind and local
          signals to identify threats early.
        </p>


        {/* ===============================================
            RISK SUMMARY
        =============================================== */}

        <div
          className="risk-detection-summary"
        >

          <div
            className="risk-detection-risk-indicator"
          >

            <AlertTriangle
              size={19}
            />

          </div>


          <div
            className="risk-detection-summary-content"
          >

            <span
              className="risk-detection-summary-label"
            >
              Primary Threat
            </span>


            <span
              className="risk-detection-summary-value"
            >
              High flood risk in low-lying areas
            </span>

          </div>

        </div>


        {/* ===============================================
            METRICS
        =============================================== */}

        <div
          className="risk-detection-zones"
        >

          <div
            className="risk-detection-zone"
          >

            <MapPin
              size={15}
              className="risk-detection-zone-icon"
            />

            <span
              className="risk-detection-zone-value"
            >
              3
            </span>

            <span
              className="risk-detection-zone-label"
            >
              Risk zones
            </span>

          </div>


          <div
            className="risk-detection-zone"
          >

            <CloudRain
              size={15}
              className="risk-detection-zone-icon"
            />

            <span
              className="risk-detection-zone-value"
            >
              45mm
            </span>

            <span
              className="risk-detection-zone-label"
            >
              Heavy rain
            </span>

          </div>


          <div
            className="risk-detection-zone"
          >

            <Waves
              size={15}
              className="risk-detection-zone-icon"
            />

            <span
              className="risk-detection-zone-value"
            >
              High
            </span>

            <span
              className="risk-detection-zone-label"
            >
              Flood level
            </span>

          </div>

        </div>

      </article>


      {/* ===================================================
          MODAL
      =================================================== */}

      {isModalOpen && (

        <div
          className="risk-detection-modal-overlay"
          onMouseDown={closeModal}
          role="presentation"
        >

          <section
            className="risk-detection-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="risk-detection-modal-title"
            onMouseDown={(event) => {

              event.stopPropagation();

            }}
          >


            {/* ===========================================
                MODAL HEADER
            =========================================== */}

            <div
              className="risk-detection-modal-header"
            >

              <div
                className="risk-detection-modal-heading"
              >

                <div
                  className="risk-detection-modal-icon"
                >

                  <ShieldAlert
                    size={24}
                  />

                </div>


                <div>

                  <p
                    className="risk-detection-modal-eyebrow"
                  >
                    AI RISK INTELLIGENCE
                  </p>


                  <h2
                    id="risk-detection-modal-title"
                    className="risk-detection-modal-title"
                  >
                    Risk Detection
                  </h2>

                </div>

              </div>


              <button
                type="button"
                className="risk-detection-close"
                onClick={closeModal}
                aria-label="Close risk details"
              >

                <X
                  size={18}
                />

              </button>

            </div>


            {/* ===========================================
                MODAL CONTENT
            =========================================== */}

            <div
              className="risk-detection-modal-content"
            >


              {/* ALERT */}

              <div
                className="risk-detection-alert-banner"
              >

                <AlertTriangle
                  size={21}
                  className="risk-detection-alert-banner-icon"
                />


                <div>

                  <span
                    className="risk-detection-alert-label"
                  >
                    PRIMARY THREAT
                  </span>


                  <p
                    className="risk-detection-alert-text"
                  >
                    High flood risk detected in
                    low-lying areas.
                  </p>

                </div>

              </div>


              {/* AI ANALYSIS */}

              <section
                className="risk-detection-section"
              >

                <h3
                  className="risk-detection-section-title"
                >

                  <Activity
                    size={16}
                  />

                  AI Risk Analysis

                </h3>


                <div
                  className="risk-detection-analysis-box"
                >

                  <p
                    className="risk-detection-analysis-text"
                  >
                    Heavy rainfall combined with poor
                    drainage capacity may cause rapid
                    water accumulation in vulnerable
                    low-lying zones. Current atmospheric
                    conditions indicate an increased
                    possibility of localized flooding
                    during periods of intense rainfall.
                  </p>

                </div>

              </section>


              {/* SIGNALS */}

              <section
                className="risk-detection-section"
              >

                <h3
                  className="risk-detection-section-title"
                >

                  <Activity
                    size={16}
                  />

                  Key Risk Signals

                </h3>


                <div
                  className="risk-detection-details-grid"
                >

                  <div
                    className="risk-detection-detail-item"
                  >

                    <MapPin
                      size={17}
                      className="risk-detection-detail-icon"
                    />

                    <span
                      className="risk-detection-detail-label"
                    >
                      Vulnerable Areas
                    </span>

                    <span
                      className="risk-detection-detail-value"
                    >
                      3 risk zones
                    </span>

                  </div>


                  <div
                    className="risk-detection-detail-item"
                  >

                    <CloudRain
                      size={17}
                      className="risk-detection-detail-icon"
                    />

                    <span
                      className="risk-detection-detail-label"
                    >
                      Rainfall Intensity
                    </span>

                    <span
                      className="risk-detection-detail-value"
                    >
                      Up to 45mm/hr
                    </span>

                  </div>


                  <div
                    className="risk-detection-detail-item"
                  >

                    <Waves
                      size={17}
                      className="risk-detection-detail-icon"
                    />

                    <span
                      className="risk-detection-detail-label"
                    >
                      Flood Level
                    </span>

                    <span
                      className="risk-detection-detail-value"
                    >
                      High
                    </span>

                  </div>


                  <div
                    className="risk-detection-detail-item"
                  >

                    <Clock
                      size={17}
                      className="risk-detection-detail-icon"
                    />

                    <span
                      className="risk-detection-detail-label"
                    >
                      Critical Window
                    </span>

                    <span
                      className="risk-detection-detail-value"
                    >
                      3 PM – 7 PM
                    </span>

                  </div>

                </div>

              </section>


              {/* ACTION */}

              <div
                className="risk-detection-action-panel"
              >

                <div
                  className="risk-detection-action-icon"
                >

                  <Navigation
                    size={19}
                  />

                </div>


                <div>

                  <p
                    className="risk-detection-action-title"
                  >
                    Recommended Action
                  </p>


                  <p
                    className="risk-detection-action-text"
                  >
                    Avoid low-lying roads during heavy
                    rainfall and monitor local weather
                    alerts for rapidly changing conditions.
                  </p>

                </div>

              </div>


              {/* CONFIDENCE */}

              <div
                className="risk-detection-confidence"
              >

                <div
                  className="risk-detection-confidence-top"
                >

                  <span
                    className="risk-detection-confidence-label"
                  >
                    AI confidence level
                  </span>


                  <span
                    className="risk-detection-confidence-value"
                  >
                    87%
                  </span>

                </div>


                <div
                  className="risk-detection-confidence-bar"
                >

                  <div
                    className="risk-detection-confidence-fill"
                  />

                </div>

              </div>


              {/* VERIFIED */}

              <section
                className="risk-detection-section"
              >

                <h3
                  className="risk-detection-section-title"
                >

                  <ShieldCheck
                    size={16}
                  />

                  Intelligence Sources

                </h3>


                <div
                  className="risk-detection-analysis-box"
                >

                  <p
                    className="risk-detection-analysis-text"
                  >
                    Terrain elevation data, rainfall
                    monitoring, urban drainage signals
                    and live atmospheric observations.
                  </p>

                </div>

              </section>

            </div>

          </section>

        </div>

      )}

    </>

  );

};
