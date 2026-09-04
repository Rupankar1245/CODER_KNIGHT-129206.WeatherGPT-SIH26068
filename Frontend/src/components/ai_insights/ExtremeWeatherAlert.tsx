
import React, {
  useEffect,
  useState,
} from 'react';

import {
  CloudRain,
  AlertTriangle,
  Gauge,
  Zap,
  X,
  CalendarRange,
  MapPin,
  Activity,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const ExtremeWeatherAlert: React.FC = () => {

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isModalClosing,
    setIsModalClosing,
  ] = useState(false);


  /* =======================================================
     MODAL CONTROLS
  ======================================================= */

  const openModal = () => {

    setIsModalClosing(false);

    setIsModalOpen(true);

  };


  const closeModal = () => {

    if (
      isModalClosing
    ) {

      return;

    }

    setIsModalClosing(true);

  };


  /* =======================================================
     REMOVE MODAL AFTER CLOSE ANIMATION
  ======================================================= */

  useEffect(() => {

    if (
      !isModalClosing
    ) {

      return;

    }


    const closeTimer = window.setTimeout(
      () => {

        setIsModalOpen(false);

        setIsModalClosing(false);

      },
      280
    );


    return () => {

      window.clearTimeout(
        closeTimer
      );

    };

  }, [
    isModalClosing,
  ]);


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {

    const handleEscape = (
      event:
        KeyboardEvent
    ) => {

      if (
        event.key === 'Escape' &&
        isModalOpen
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
    isModalClosing,
  ]);


  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {

    if (
      !isModalOpen
    ) {

      return;

    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      'hidden';


    return () => {

      document.body.style.overflow =
        previousOverflow;

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
             KEYFRAMES
          ============================================= */

          @keyframes extremeAlertPulse {

            0%,
            100% {

              opacity:
                0.65;

              transform:
                scale(1);

            }

            50% {

              opacity:
                1;

              transform:
                scale(1.04);

            }

          }


          @keyframes extremeCardGlow {

            0% {

              box-shadow:
                0 12px 38px
                rgba(
                  0,
                  0,
                  0,
                  0.18
                ),
                0 0 20px
                rgba(
                  251,
                  113,
                  133,
                  0.06
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

            50% {

              box-shadow:
                0 18px 45px
                rgba(
                  0,
                  0,
                  0,
                  0.24
                ),
                0 0 42px
                rgba(
                  251,
                  113,
                  133,
                  0.20
                ),
                inset
                0 1px 0
                rgba(
                  255,
                  255,
                  255,
                  0.10
                );

            }

            100% {

              box-shadow:
                0 12px 38px
                rgba(
                  0,
                  0,
                  0,
                  0.18
                ),
                0 0 20px
                rgba(
                  251,
                  113,
                  133,
                  0.06
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

          }


          @keyframes extremeModalAppear {

            from {

              opacity:
                0;

              transform:
                scale(0.97);

            }

            to {

              opacity:
                1;

              transform:
                scale(1);

            }

          }


          @keyframes extremeModalDisappear {

            from {

              opacity:
                1;

              transform:
                scale(1);

            }

            to {

              opacity:
                0;

              transform:
                scale(0.97);

            }

          }


          @keyframes extremeBackdropAppear {

            from {

              opacity:
                0;

            }

            to {

              opacity:
                1;

            }

          }


          @keyframes extremeBackdropDisappear {

            from {

              opacity:
                1;

            }

            to {

              opacity:
                0;

            }

          }


          /* =============================================
             MAIN CARD
          ============================================= */

          .extreme-weather-alert-card {

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
                  251,
                  113,
                  133,
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
                  136,
                  19,
                  55,
                  0.13
                )
                100%
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
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
              ease;

          }


          .extreme-weather-alert-card::before {

            content:
              "";

            position:
              absolute;

            width:
              240px;

            height:
              240px;

            top:
              -110px;

            right:
              -85px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  251,
                  113,
                  133,
                  0.17
                )
                0%,
                transparent
                70%
              );

            pointer-events:
              none;

          }


          .extreme-weather-alert-card:hover {

            border-color:
              rgba(
                251,
                113,
                133,
                0.55
              );

            animation:
              extremeCardGlow
              1.8s
              ease-in-out
              infinite;

          }


          .extreme-weather-alert-card:focus-visible {

            outline:
              2px solid
              #fb7185;

            outline-offset:
              3px;

          }


          /* =============================================
             TOP
          ============================================= */

          .extreme-weather-alert-top {

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


          .extreme-weather-alert-number {

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
              #fb7185;

            background:
              rgba(
                251,
                113,
                133,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
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


          .extreme-weather-alert-icon {

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
              #fda4af;

            background:
              rgba(
                251,
                113,
                133,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.22
              );

            box-shadow:
              0 0 22px
              rgba(
                251,
                113,
                133,
                0.14
              );

          }


          /* =============================================
             HEADING
          ============================================= */

          .extreme-weather-alert-heading {

            position:
              relative;

            z-index:
              2;

            margin-top:
              17px;

          }


          .extreme-weather-alert-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #fb7185;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .extreme-weather-alert-title {

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


          .extreme-weather-alert-description {

            position:
              relative;

            z-index:
              2;

            margin:
              8px 0 14px;

            color:
              #b99aa3;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* =============================================
             ALERT STATUS
          ============================================= */

          .extreme-weather-alert-status {

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
              12px;

            padding:
              11px 13px;

            border-radius:
              14px;

            background:
              rgba(
                40,
                10,
                24,
                0.58
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.22
              );

          }


          .extreme-weather-alert-status-left {

            display:
              flex;

            align-items:
              center;

            gap:
              9px;

            min-width:
              0;

          }


          .extreme-weather-alert-status-icon {

            display:
              grid;

            place-items:
              center;

            width:
              32px;

            height:
              32px;

            flex-shrink:
              0;

            border-radius:
              10px;

            color:
              #fb7185;

            background:
              rgba(
                251,
                113,
                133,
                0.10
              );

          }


          .extreme-weather-alert-status-content {

            min-width:
              0;

          }


          .extreme-weather-alert-status-label {

            display:
              block;

            margin-bottom:
              2px;

            color:
              #8e7179;

            font-size:
              9px;

            font-weight:
              700;

            letter-spacing:
              0.08em;

          }


          .extreme-weather-alert-status-value {

            display:
              block;

            color:
              #fecdd3;

            font-size:
              12px;

            font-weight:
              700;

            line-height:
              1.35;

          }


          .extreme-weather-alert-severity {

            flex-shrink:
              0;

            padding:
              5px 8px;

            border-radius:
              999px;

            color:
              #fecdd3;

            background:
              rgba(
                251,
                113,
                133,
                0.13
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.22
              );

            font-size:
              9px;

            font-weight:
              800;

            animation:
              extremeAlertPulse
              2.2s
              ease-in-out
              infinite;

          }


          /* =============================================
             BOTTOM VISUALIZATION
          ============================================= */

          .extreme-weather-intensity {

            position:
              relative;

            z-index:
              2;

            display:
              grid;

            grid-template-columns:
              1.15fr
              0.85fr;

            gap:
              10px;

            margin-top:
              auto;

            padding-top:
              16px;

          }


          .extreme-weather-intensity-main {

            padding:
              11px 12px;

            border-radius:
              13px;

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


          .extreme-weather-intensity-label {

            display:
              flex;

            align-items:
              center;

            gap:
              5px;

            color:
              #fda4af;

            font-size:
              10px;

            font-weight:
              700;

          }


          .extreme-weather-intensity-value {

            display:
              block;

            margin-top:
              7px;

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


          .extreme-weather-intensity-sub {

            display:
              block;

            margin-top:
              4px;

            color:
              #896f76;

            font-size:
              9px;

          }


          .extreme-weather-gauge {

            margin-top:
              10px;

            height:
              5px;

            border-radius:
              999px;

            overflow:
              hidden;

            background:
              rgba(
                255,
                255,
                255,
                0.08
              );

          }


          .extreme-weather-gauge-fill {

            width:
              78%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #e11d48,
                #fb7185
              );

            box-shadow:
              0 0 10px
              rgba(
                251,
                113,
                133,
                0.6
              );

          }


          .extreme-weather-anomaly {

            padding:
              11px;

            border-radius:
              13px;

            background:
              rgba(
                251,
                113,
                133,
                0.06
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.14
              );

            display:
              flex;

            flex-direction:
              column;

            justify-content:
              space-between;

          }


          .extreme-weather-anomaly-icon {

            color:
              #fda4af;

          }


          .extreme-weather-anomaly-value {

            display:
              block;

            margin-top:
              6px;

            color:
              #ffffff;

            font-size:
              18px;

            font-weight:
              800;

          }


          .extreme-weather-anomaly-label {

            display:
              block;

            margin-top:
              2px;

            color:
              #896f76;

            font-size:
              9px;

          }


          /* =============================================
             MODAL BACKDROP
          ============================================= */

          .extreme-weather-modal-backdrop {

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
              extremeBackdropAppear
              0.28s
              ease
              forwards;

          }


          .extreme-weather-modal-backdrop.is-closing {

            animation:
              extremeBackdropDisappear
              0.28s
              ease
              forwards;

            pointer-events:
              none;

          }


          /* =============================================
             MODAL
          ============================================= */

          .extreme-weather-modal {

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
                  31,
                  12,
                  25,
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
                251,
                113,
                133,
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
                251,
                113,
                133,
                0.08
              );

            animation:
              extremeModalAppear
              0.28s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              )
              forwards;

          }


          .extreme-weather-modal.is-closing {

            animation:
              extremeModalDisappear
              0.28s
              ease
              forwards;

          }


          .extreme-weather-modal::-webkit-scrollbar {

            width:
              6px;

          }


          .extreme-weather-modal::-webkit-scrollbar-thumb {

            border-radius:
              999px;

            background:
              rgba(
                251,
                113,
                133,
                0.3
              );

          }


          .extreme-weather-modal-header {

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


          /* =============================================
             CLOSE BUTTON
          ============================================= */

          .extreme-weather-modal-close {

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
              #fda4af;

            background:
              rgba(
                251,
                113,
                133,
                0.09
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.18
              );

            transition:
              transform
              0.25s
              ease,
              background
              0.25s
              ease,
              box-shadow
              0.25s
              ease,
              border-color
              0.25s
              ease;

          }


          .extreme-weather-modal-close:hover {

            transform:
              rotate(90deg);

            background:
              rgba(
                251,
                113,
                133,
                0.18
              );

            border-color:
              rgba(
                251,
                113,
                133,
                0.42
              );

            box-shadow:
              0 0 18px
              rgba(
                251,
                113,
                133,
                0.28
              );

          }


          .extreme-weather-modal-close:active {

            transform:
              rotate(90deg)
              scale(0.92);

          }


          .extreme-weather-modal-close:focus-visible {

            outline:
              2px solid
              #fb7185;

            outline-offset:
              3px;

          }


          .extreme-weather-modal-badge {

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
              #fda4af;

            background:
              rgba(
                251,
                113,
                133,
                0.09
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.20
              );

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .extreme-weather-modal-title {

            margin:
              16px 0 7px;

            font-size:
              26px;

            font-weight:
              750;

            letter-spacing:
              -0.03em;

          }


          .extreme-weather-modal-subtitle {

            margin:
              0;

            max-width:
              90%;

            color:
              #aa929a;

            font-size:
              13px;

            line-height:
              1.65;

          }


          /* =============================================
             MODAL CONTENT
          ============================================= */

          .extreme-weather-modal-content {

            padding:
              22px
              25px
              26px;

          }


          .extreme-weather-analysis {

            padding:
              17px;

            border-radius:
              16px;

            background:
              rgba(
                251,
                113,
                133,
                0.055
              );

            border:
              1px solid
              rgba(
                251,
                113,
                133,
                0.16
              );

          }


          .extreme-weather-analysis-header {

            display:
              flex;

            align-items:
              center;

            gap:
              10px;

            margin-bottom:
              10px;

            color:
              #fda4af;

          }


          .extreme-weather-analysis-title {

            margin:
              0;

            font-size:
              12px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .extreme-weather-analysis-text {

            margin:
              0;

            color:
              #d2bfc5;

            font-size:
              13px;

            line-height:
              1.7;

          }


          /* =============================================
             DETAILS GRID
          ============================================= */

          .extreme-weather-detail-grid {

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


          .extreme-weather-detail-card {

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


          .extreme-weather-detail-top {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            color:
              #fda4af;

          }


          .extreme-weather-detail-label {

            color:
              #92777f;

            font-size:
              10px;

            font-weight:
              700;

            letter-spacing:
              0.05em;

          }


          .extreme-weather-detail-value {

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


          .extreme-weather-detail-sub {

            display:
              block;

            margin-top:
              3px;

            color:
              #826b72;

            font-size:
              10px;

          }


          /* =============================================
             CONFIDENCE
          ============================================= */

          .extreme-weather-confidence {

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


          .extreme-weather-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              10px;

          }


          .extreme-weather-confidence-label {

            display:
              flex;

            align-items:
              center;

            gap:
              7px;

            color:
              #fda4af;

            font-size:
              11px;

            font-weight:
              800;

          }


          .extreme-weather-confidence-value {

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              800;

          }


          .extreme-weather-confidence-bar {

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


          .extreme-weather-confidence-fill {

            width:
              91%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #e11d48,
                #fb7185
              );

            box-shadow:
              0 0 14px
              rgba(
                251,
                113,
                133,
                0.45
              );

          }


          .extreme-weather-confidence-note {

            margin:
              9px 0 0;

            color:
              #8f747c;

            font-size:
              10px;

            line-height:
              1.5;

          }


          /* =============================================
             RECOMMENDED ACTION
          ============================================= */

          .extreme-weather-action {

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
                251,
                113,
                133,
                0.06
              );

            border-left:
              3px solid
              #fb7185;

          }


          .extreme-weather-action-icon {

            flex-shrink:
              0;

            color:
              #fda4af;

          }


          .extreme-weather-action-content {

            min-width:
              0;

          }


          .extreme-weather-action-title {

            margin:
              0 0 5px;

            color:
              #ffffff;

            font-size:
              12px;

            font-weight:
              800;

          }


          .extreme-weather-action-text {

            margin:
              0;

            color:
              #bba4ab;

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

            .extreme-weather-alert-card {

              min-height:
                350px;

              padding:
                20px;

            }


            .extreme-weather-alert-title {

              font-size:
                20px;

            }


            .extreme-weather-modal-backdrop {

              padding:
                12px;

            }


            .extreme-weather-modal-header {

              padding:
                22px
                20px
                20px;

            }


            .extreme-weather-modal-content {

              padding:
                18px
                20px
                22px;

            }


            .extreme-weather-modal-title {

              font-size:
                22px;

            }


            .extreme-weather-detail-grid {

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
        className="extreme-weather-alert-card"
        onClick={openModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open Extreme Weather Alert details"
      >

        <div
          className="extreme-weather-alert-top"
        >

          <span
            className="extreme-weather-alert-number"
          >
            04
          </span>


          <div
            className="extreme-weather-alert-icon"
          >

            <CloudRain
              size={21}
            />

          </div>

        </div>


        <div
          className="extreme-weather-alert-heading"
        >

          <span
            className="extreme-weather-alert-eyebrow"
          >
            WATCH THE OUTLIERS
          </span>


          <h2
            className="extreme-weather-alert-title"
          >
            Extreme Weather Alert
          </h2>

        </div>


        <p
          className="extreme-weather-alert-description"
        >
          Flags unusual intensity when conditions move
          far beyond the seasonal norm.
        </p>


        <div
          className="extreme-weather-alert-status"
        >

          <div
            className="extreme-weather-alert-status-left"
          >

            <div
              className="extreme-weather-alert-status-icon"
            >

              <AlertTriangle
                size={17}
              />

            </div>


            <div
              className="extreme-weather-alert-status-content"
            >

              <span
                className="extreme-weather-alert-status-label"
              >
                ACTIVE SIGNAL
              </span>


              <span
                className="extreme-weather-alert-status-value"
              >
                Rainfall above seasonal average
              </span>

            </div>

          </div>


          <span
            className="extreme-weather-alert-severity"
          >
            HIGH
          </span>

        </div>


        <div
          className="extreme-weather-intensity"
        >

          <div
            className="extreme-weather-intensity-main"
          >

            <span
              className="extreme-weather-intensity-label"
            >

              <Gauge
                size={13}
              />

              RAIN PROBABILITY

            </span>


            <span
              className="extreme-weather-intensity-value"
            >
              78%
            </span>


            <span
              className="extreme-weather-intensity-sub"
            >
              Elevated precipitation risk
            </span>


            <div
              className="extreme-weather-gauge"
            >

              <div
                className="extreme-weather-gauge-fill"
              />

            </div>

          </div>


          <div
            className="extreme-weather-anomaly"
          >

            <Zap
              size={17}
              className="extreme-weather-anomaly-icon"
            />


            <span
              className="extreme-weather-anomaly-value"
            >
              +2.8σ
            </span>


            <span
              className="extreme-weather-anomaly-label"
            >
              Climate anomaly
            </span>

          </div>

        </div>

      </article>


      {/* =================================================
          MODAL
      ================================================= */}

      {
        isModalOpen && (

          <div
            className={
              `
                extreme-weather-modal-backdrop
                ${
                  isModalClosing
                    ? 'is-closing'
                    : ''
                }
              `
            }
            onClick={closeModal}
            role="presentation"
          >

            <section
              className={
                `
                  extreme-weather-modal
                  ${
                    isModalClosing
                      ? 'is-closing'
                      : ''
                  }
                `
              }
              onClick={
                (
                  event
                ) => {

                  event.stopPropagation();

                }
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="extreme-weather-modal-title"
            >

              <div
                className="extreme-weather-modal-header"
              >

                <button
                  type="button"
                  className="extreme-weather-modal-close"
                  onClick={closeModal}
                  aria-label="Close extreme weather analysis"
                >

                  <X
                    size={18}
                  />

                </button>


                <span
                  className="extreme-weather-modal-badge"
                >

                  <AlertTriangle
                    size={13}
                  />

                  HIGH PRIORITY SIGNAL

                </span>


                <h2
                  id="extreme-weather-modal-title"
                  className="extreme-weather-modal-title"
                >
                  Extreme Event Analysis
                </h2>


                <p
                  className="extreme-weather-modal-subtitle"
                >
                  MeghAI has detected weather conditions
                  that are significantly above the expected
                  seasonal range.
                </p>

              </div>


              <div
                className="extreme-weather-modal-content"
              >

                <div
                  className="extreme-weather-analysis"
                >

                  <div
                    className="extreme-weather-analysis-header"
                  >

                    <Activity
                      size={17}
                    />


                    <p
                      className="extreme-weather-analysis-title"
                    >
                      AI EXTREME EVENT ANALYSIS
                    </p>

                  </div>


                  <p
                    className="extreme-weather-analysis-text"
                  >
                    Atmospheric moisture, rainfall projections
                    and local pressure patterns indicate a
                    higher-than-normal probability of intense
                    precipitation. The current anomaly is
                    outside the typical seasonal range and
                    may increase the chance of localized
                    flooding.
                  </p>

                </div>


                <div
                  className="extreme-weather-detail-grid"
                >

                  <div
                    className="extreme-weather-detail-card"
                  >

                    <div
                      className="extreme-weather-detail-top"
                    >

                      <CloudRain
                        size={15}
                      />


                      <span
                        className="extreme-weather-detail-label"
                      >
                        RAINFALL SIGNAL
                      </span>

                    </div>


                    <span
                      className="extreme-weather-detail-value"
                    >
                      78%
                    </span>


                    <span
                      className="extreme-weather-detail-sub"
                    >
                      Elevated precipitation probability
                    </span>

                  </div>


                  <div
                    className="extreme-weather-detail-card"
                  >

                    <div
                      className="extreme-weather-detail-top"
                    >

                      <TrendingUp
                        size={15}
                      />


                      <span
                        className="extreme-weather-detail-label"
                      >
                        CLIMATE ANOMALY
                      </span>

                    </div>


                    <span
                      className="extreme-weather-detail-value"
                    >
                      +2.8σ
                    </span>


                    <span
                      className="extreme-weather-detail-sub"
                    >
                      Above expected seasonal variation
                    </span>

                  </div>


                  <div
                    className="extreme-weather-detail-card"
                  >

                    <div
                      className="extreme-weather-detail-top"
                    >

                      <CalendarRange
                        size={15}
                      />


                      <span
                        className="extreme-weather-detail-label"
                      >
                        EXPECTED WINDOW
                      </span>

                    </div>


                    <span
                      className="extreme-weather-detail-value"
                    >
                      4–10 hrs
                    </span>


                    <span
                      className="extreme-weather-detail-sub"
                    >
                      Highest activity expected later today
                    </span>

                  </div>


                  <div
                    className="extreme-weather-detail-card"
                  >

                    <div
                      className="extreme-weather-detail-top"
                    >

                      <MapPin
                        size={15}
                      />


                      <span
                        className="extreme-weather-detail-label"
                      >
                        MOST EXPOSED
                      </span>

                    </div>


                    <span
                      className="extreme-weather-detail-value"
                    >
                      Low-lying zones
                    </span>


                    <span
                      className="extreme-weather-detail-sub"
                    >
                      Areas with poor drainage capacity
                    </span>

                  </div>

                </div>


                <div
                  className="extreme-weather-confidence"
                >

                  <div
                    className="extreme-weather-confidence-top"
                  >

                    <span
                      className="extreme-weather-confidence-label"
                    >

                      <ShieldAlert
                        size={15}
                      />

                      AI CONFIDENCE

                    </span>


                    <span
                      className="extreme-weather-confidence-value"
                    >
                      91%
                    </span>

                  </div>


                  <div
                    className="extreme-weather-confidence-bar"
                  >

                    <div
                      className="extreme-weather-confidence-fill"
                    />

                  </div>


                  <p
                    className="extreme-weather-confidence-note"
                  >
                    Confidence is based on agreement between
                    current atmospheric conditions and forecast
                    model signals.
                  </p>

                </div>


                <div
                  className="extreme-weather-action"
                >

                  <ShieldAlert
                    size={19}
                    className="extreme-weather-action-icon"
                  />


                  <div
                    className="extreme-weather-action-content"
                  >

                    <p
                      className="extreme-weather-action-title"
                    >
                      Recommended Action
                    </p>


                    <p
                      className="extreme-weather-action-text"
                    >
                      Monitor local weather updates, avoid
                      flood-prone routes during intense rainfall,
                      and prepare for possible waterlogging in
                      vulnerable areas.
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
