import React, {
  useEffect,
  useState,
} from 'react';

import {
  Lightbulb,
  Clock3,
  Navigation,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X,
  Activity,
  ShieldCheck,
  Route,
  CloudRain,
  AlertTriangle,
} from 'lucide-react';


/* =========================================================
   COMPONENT
========================================================= */

export const ActionRecommendations: React.FC = () => {

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

          @keyframes actionCardEntrance {

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


          @keyframes actionGlowPulse {

            0%,
            100% {

              opacity:
                0.45;

              transform:
                scale(0.95);

            }

            50% {

              opacity:
                0.9;

              transform:
                scale(1.05);

            }

          }


          @keyframes actionSparkle {

            0%,
            100% {

              opacity:
                0.45;

              transform:
                rotate(0deg)
                scale(0.9);

            }

            50% {

              opacity:
                1;

              transform:
                rotate(12deg)
                scale(1.08);

            }

          }


          @keyframes actionModalAppear {

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


          @keyframes actionBackdropAppear {

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

          .action-recommendations-card {

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
                  191,
                  36,
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
                  120,
                  83,
                  8,
                  0.13
                )
                100%
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
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
              actionCardEntrance
              0.6s
              ease
              both;

          }


          .action-recommendations-card::before {

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
              -90px;

            border-radius:
              50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  251,
                  191,
                  36,
                  0.17
                )
                0%,
                transparent
                70%
              );

            animation:
              actionGlowPulse
              3s
              ease-in-out
              infinite;

            pointer-events:
              none;

          }


          .action-recommendations-card:hover {

            transform:
              translateY(-6px);

            border-color:
              rgba(
                251,
                191,
                36,
                0.55
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
                251,
                191,
                36,
                0.10
              );

          }


          .action-recommendations-card:focus-visible {

            outline:
              2px solid
              #fbbf24;

            outline-offset:
              3px;

          }


          /* =============================================
             TOP
          ============================================= */

          .action-recommendations-top {

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


          .action-recommendations-number {

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
              #fbbf24;

            background:
              rgba(
                251,
                191,
                36,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
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


          .action-recommendations-icon {

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
              #fde68a;

            background:
              rgba(
                251,
                191,
                36,
                0.12
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
                0.22
              );

            box-shadow:
              0 0 22px
              rgba(
                251,
                191,
                36,
                0.12
              );

          }


          .action-recommendations-icon svg {

            animation:
              actionSparkle
              2.5s
              ease-in-out
              infinite;

          }


          /* =============================================
             HEADING
          ============================================= */

          .action-recommendations-heading {

            position:
              relative;

            z-index:
              3;

            margin-top:
              17px;

          }


          .action-recommendations-eyebrow {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #fbbf24;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.13em;

          }


          .action-recommendations-title {

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


          .action-recommendations-description {

            position:
              relative;

            z-index:
              3;

            margin:
              8px 0 14px;

            color:
              #aa9b76;

            font-size:
              12px;

            line-height:
              1.55;

          }


          /* =============================================
             PRIMARY RECOMMENDATION
          ============================================= */

          .action-primary-recommendation {

            position:
              relative;

            z-index:
              3;

            padding:
              13px;

            border-radius:
              15px;

            background:
              rgba(
                38,
                28,
                6,
                0.60
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
                0.22
              );

          }


          .action-primary-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              10px;

            margin-bottom:
              8px;

          }


          .action-priority {

            display:
              inline-flex;

            align-items:
              center;

            gap:
              5px;

            color:
              #fde68a;

            font-size:
              9px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .action-ai-badge {

            display:
              inline-flex;

            align-items:
              center;

            gap:
              4px;

            padding:
              4px 7px;

            border-radius:
              999px;

            color:
              #fef3c7;

            background:
              rgba(
                251,
                191,
                36,
                0.10
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
                0.18
              );

            font-size:
              8px;

            font-weight:
              700;

          }


          .action-primary-text {

            margin:
              0;

            color:
              #f8fafc;

            font-size:
              14px;

            font-weight:
              650;

            line-height:
              1.45;

          }


          /* =============================================
             ACTION DETAILS
          ============================================= */

          .action-details-row {

            position:
              relative;

            z-index:
              3;

            display:
              grid;

            grid-template-columns:
              1fr
              1fr;

            gap:
              10px;

            margin-top:
              12px;

          }


          .action-detail-box {

            padding:
              10px 11px;

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


          .action-detail-label {

            display:
              flex;

            align-items:
              center;

            gap:
              5px;

            color:
              #9c8d68;

            font-size:
              9px;

            font-weight:
              700;

            letter-spacing:
              0.06em;

          }


          .action-detail-value {

            display:
              block;

            margin-top:
              6px;

            color:
              #ffffff;

            font-size:
              13px;

            font-weight:
              700;

          }


          /* =============================================
             FOOTER
          ============================================= */

          .action-footer {

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

            margin-top:
              auto;

            padding-top:
              15px;

          }


          .action-confidence {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

          }


          .action-confidence-ring {

            width:
              8px;

            height:
              8px;

            flex-shrink:
              0;

            border-radius:
              50%;

            background:
              #fbbf24;

            box-shadow:
              0 0 10px
              rgba(
                251,
                191,
                36,
                0.85
              );

          }


          .action-confidence-text {

            color:
              #b6a477;

            font-size:
              10px;

          }


          .action-confidence-text strong {

            color:
              #fde68a;

            font-weight:
              800;

          }


          .action-open-text {

            display:
              flex;

            align-items:
              center;

            gap:
              4px;

            color:
              #fbbf24;

            font-size:
              10px;

            font-weight:
              700;

          }


          /* =============================================
             MODAL BACKDROP
          ============================================= */

          .action-modal-backdrop {

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
              actionBackdropAppear
              0.25s
              ease;

          }


          /* =============================================
             MODAL
          ============================================= */

          .action-modal {

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
                  34,
                  27,
                  12,
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
                191,
                36,
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
                191,
                36,
                0.08
              );

            animation:
              actionModalAppear
              0.3s
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );

          }


          .action-modal::-webkit-scrollbar {

            width:
              6px;

          }


          .action-modal::-webkit-scrollbar-thumb {

            border-radius:
              999px;

            background:
              rgba(
                251,
                191,
                36,
                0.3
              );

          }


          /* =============================================
             MODAL HEADER
          ============================================= */

          .action-modal-header {

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


          .action-modal-close {

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
              #fde68a;

            background:
              rgba(
                251,
                191,
                36,
                0.09
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
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


          .action-modal-close:hover {

            transform:
              rotate(90deg);

            background:
              rgba(
                251,
                191,
                36,
                0.18
              );

          }


          .action-modal-badge {

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
              #fde68a;

            background:
              rgba(
                251,
                191,
                36,
                0.09
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
                0.20
              );

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .action-modal-title {

            margin:
              16px 0 7px;

            font-size:
              26px;

            font-weight:
              750;

            letter-spacing:
              -0.03em;

          }


          .action-modal-subtitle {

            margin:
              0;

            max-width:
              90%;

            color:
              #b8aa85;

            font-size:
              13px;

            line-height:
              1.65;

          }


          /* =============================================
             MODAL CONTENT
          ============================================= */

          .action-modal-content {

            padding:
              22px
              25px
              26px;

          }


          /* =============================================
             AI ANALYSIS
          ============================================= */

          .action-analysis {

            padding:
              17px;

            border-radius:
              16px;

            background:
              rgba(
                251,
                191,
                36,
                0.055
              );

            border:
              1px solid
              rgba(
                251,
                191,
                36,
                0.16
              );

          }


          .action-analysis-header {

            display:
              flex;

            align-items:
              center;

            gap:
              10px;

            margin-bottom:
              10px;

            color:
              #fde68a;

          }


          .action-analysis-title {

            margin:
              0;

            font-size:
              12px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .action-analysis-text {

            margin:
              0;

            color:
              #ddd2b2;

            font-size:
              13px;

            line-height:
              1.7;

          }


          /* =============================================
             PRIORITY ACTION
          ============================================= */

          .action-modal-priority {

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
                191,
                36,
                0.06
              );

            border-left:
              3px solid
              #fbbf24;

          }


          .action-modal-priority-icon {

            flex-shrink:
              0;

            color:
              #fde68a;

          }


          .action-modal-priority-content {

            min-width:
              0;

          }


          .action-modal-priority-label {

            display:
              block;

            margin-bottom:
              5px;

            color:
              #b9a97d;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              0.08em;

          }


          .action-modal-priority-text {

            margin:
              0;

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              750;

            line-height:
              1.5;

          }


          /* =============================================
             DETAILS GRID
          ============================================= */

          .action-modal-grid {

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


          .action-modal-detail-card {

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


          .action-modal-detail-top {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            color:
              #fde68a;

          }


          .action-modal-detail-label {

            color:
              #a5956e;

            font-size:
              10px;

            font-weight:
              700;

            letter-spacing:
              0.05em;

          }


          .action-modal-detail-value {

            display:
              block;

            margin-top:
              9px;

            color:
              #ffffff;

            font-size:
              17px;

            font-weight:
              800;

          }


          .action-modal-detail-sub {

            display:
              block;

            margin-top:
              3px;

            color:
              #8f835f;

            font-size:
              10px;

            line-height:
              1.45;

          }


          /* =============================================
             PREPARATION STEPS
          ============================================= */

          .action-preparation {

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


          .action-preparation-title {

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            margin:
              0 0 13px;

            color:
              #fde68a;

            font-size:
              11px;

            font-weight:
              800;

            letter-spacing:
              0.06em;

          }


          .action-step {

            display:
              flex;

            align-items:
              flex-start;

            gap:
              9px;

            margin-top:
              10px;

            color:
              #cfc3a3;

            font-size:
              11px;

            line-height:
              1.55;

          }


          .action-step:first-of-type {

            margin-top:
              0;

          }


          .action-step-icon {

            flex-shrink:
              0;

            margin-top:
              1px;

            color:
              #fbbf24;

          }


          /* =============================================
             CONFIDENCE
          ============================================= */

          .action-modal-confidence {

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


          .action-modal-confidence-top {

            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            margin-bottom:
              10px;

          }


          .action-modal-confidence-label {

            display:
              flex;

            align-items:
              center;

            gap:
              7px;

            color:
              #fde68a;

            font-size:
              11px;

            font-weight:
              800;

          }


          .action-modal-confidence-value {

            color:
              #ffffff;

            font-size:
              15px;

            font-weight:
              800;

          }


          .action-modal-confidence-bar {

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


          .action-modal-confidence-fill {

            width:
              96%;

            height:
              100%;

            border-radius:
              inherit;

            background:
              linear-gradient(
                90deg,
                #d97706,
                #fbbf24
              );

            box-shadow:
              0 0 14px
              rgba(
                251,
                191,
                36,
                0.45
              );

          }


          .action-modal-confidence-note {

            margin:
              9px 0 0;

            color:
              #968963;

            font-size:
              10px;

            line-height:
              1.5;

          }


          /* =============================================
             RESPONSIVE
          ============================================= */

          @media (
            max-width:
            700px
          ) {

            .action-recommendations-card {

              min-height:
                350px;

              padding:
                20px;

            }


            .action-recommendations-title {

              font-size:
                20px;

            }


            .action-modal-backdrop {

              padding:
                12px;

            }


            .action-modal-header {

              padding:
                22px
                20px
                20px;

            }


            .action-modal-content {

              padding:
                18px
                20px
                22px;

            }


            .action-modal-title {

              font-size:
                22px;

            }


            .action-modal-grid {

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
        className="action-recommendations-card"
        onClick={openModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open Action Recommendations details"
      >


        {/* ===============================================
            TOP
        =============================================== */}

        <div
          className="action-recommendations-top"
        >

          <span
            className="action-recommendations-number"
          >
            06
          </span>


          <div
            className="action-recommendations-icon"
          >

            <Lightbulb
              size={21}
            />

          </div>

        </div>


        {/* ===============================================
            HEADING
        =============================================== */}

        <div
          className="action-recommendations-heading"
        >

          <span
            className="action-recommendations-eyebrow"
          >
            MAKE THE CALL
          </span>


          <h2
            className="action-recommendations-title"
          >
            Action Recommendations
          </h2>

        </div>


        <p
          className="action-recommendations-description"
        >
          Converts weather intelligence into practical
          choices for your day.
        </p>


        {/* ===============================================
            PRIMARY RECOMMENDATION
        =============================================== */}

        <div
          className="action-primary-recommendation"
        >

          <div
            className="action-primary-top"
          >

            <span
              className="action-priority"
            >

              <AlertCircle
                size={12}
              />

              PRIORITY ACTION

            </span>


            <span
              className="action-ai-badge"
            >

              <Sparkles
                size={10}
              />

              AI

            </span>

          </div>


          <p
            className="action-primary-text"
          >
            Avoid outdoor travel between
            3–7 PM.
          </p>

        </div>


        {/* ===============================================
            ACTION DETAILS
        =============================================== */}

        <div
          className="action-details-row"
        >

          <div
            className="action-detail-box"
          >

            <span
              className="action-detail-label"
            >

              <Clock3
                size={12}
              />

              TIME WINDOW

            </span>


            <span
              className="action-detail-value"
            >
              3:00 – 7:00 PM
            </span>

          </div>


          <div
            className="action-detail-box"
          >

            <span
              className="action-detail-label"
            >

              <Navigation
                size={12}
              />

              SAFEST OPTION

            </span>


            <span
              className="action-detail-value"
            >
              Travel before 2 PM
            </span>

          </div>

        </div>


        {/* ===============================================
            FOOTER
        =============================================== */}

        <div
          className="action-footer"
        >

          <div
            className="action-confidence"
          >

            <span
              className="action-confidence-ring"
            />


            <span
              className="action-confidence-text"
            >
              AI confidence{' '}

              <strong>
                96%
              </strong>

            </span>

          </div>


          <div
            className="action-open-text"
          >

            View analysis

            <ChevronRight
              size={15}
            />

          </div>

        </div>

      </article>


      {/* =================================================
          MODAL
      ================================================= */}

      {
        isModalOpen && (

          <div
            className="action-modal-backdrop"
            onClick={closeModal}
            role="presentation"
          >

            <section
              className="action-modal"
              onClick={
                (
                  event
                ) => {

                  event.stopPropagation();

                }
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="action-modal-title"
            >


              {/* ===========================================
                  MODAL HEADER
              =========================================== */}

              <div
                className="action-modal-header"
              >

                <button
                  type="button"
                  className="action-modal-close"
                  onClick={closeModal}
                  aria-label="Close action recommendations"
                >

                  <X
                    size={18}
                  />

                </button>


                <span
                  className="action-modal-badge"
                >

                  <Sparkles
                    size={13}
                  />

                  AI GUIDANCE

                </span>


                <h2
                  id="action-modal-title"
                  className="action-modal-title"
                >
                  Recommended Action Plan
                </h2>


                <p
                  className="action-modal-subtitle"
                >
                  MeghAI combines forecast signals and
                  local weather conditions to suggest the
                  most practical choices for the next
                  several hours.
                </p>

              </div>


              {/* ===========================================
                  MODAL CONTENT
              =========================================== */}

              <div
                className="action-modal-content"
              >


                {/* =========================================
                    AI ANALYSIS
                ========================================= */}

                <div
                  className="action-analysis"
                >

                  <div
                    className="action-analysis-header"
                  >

                    <Activity
                      size={17}
                    />


                    <p
                      className="action-analysis-title"
                    >
                      AI ACTION ANALYSIS
                    </p>

                  </div>


                  <p
                    className="action-analysis-text"
                  >
                    Forecast models indicate an increasing
                    probability of intense rainfall during
                    the afternoon. Combined with possible
                    localized waterlogging and reduced road
                    mobility, earlier travel is currently
                    the lower-risk option.
                  </p>

                </div>


                {/* =========================================
                    PRIORITY ACTION
                ========================================= */}

                <div
                  className="action-modal-priority"
                >

                  <AlertTriangle
                    size={20}
                    className="action-modal-priority-icon"
                  />


                  <div
                    className="action-modal-priority-content"
                  >

                    <span
                      className="action-modal-priority-label"
                    >
                      PRIORITY ACTION
                    </span>


                    <p
                      className="action-modal-priority-text"
                    >
                      Avoid non-essential outdoor travel
                      between 3:00 PM and 7:00 PM.
                    </p>

                  </div>

                </div>


                {/* =========================================
                    DETAILS GRID
                ========================================= */}

                <div
                  className="action-modal-grid"
                >


                  <div
                    className="action-modal-detail-card"
                  >

                    <div
                      className="action-modal-detail-top"
                    >

                      <Clock3
                        size={15}
                      />


                      <span
                        className="action-modal-detail-label"
                      >
                        RISK WINDOW
                      </span>

                    </div>


                    <span
                      className="action-modal-detail-value"
                    >
                      3–7 PM
                    </span>


                    <span
                      className="action-modal-detail-sub"
                    >
                      Higher rainfall and disruption risk
                    </span>

                  </div>


                  <div
                    className="action-modal-detail-card"
                  >

                    <div
                      className="action-modal-detail-top"
                    >

                      <Navigation
                        size={15}
                      />


                      <span
                        className="action-modal-detail-label"
                      >
                        SAFEST OPTION
                      </span>

                    </div>


                    <span
                      className="action-modal-detail-value"
                    >
                      Before 2 PM
                    </span>


                    <span
                      className="action-modal-detail-sub"
                    >
                      Lower expected weather exposure
                    </span>

                  </div>


                  <div
                    className="action-modal-detail-card"
                  >

                    <div
                      className="action-modal-detail-top"
                    >

                      <CloudRain
                        size={15}
                      />


                      <span
                        className="action-modal-detail-label"
                      >
                        MAIN FACTOR
                      </span>

                    </div>


                    <span
                      className="action-modal-detail-value"
                    >
                      Heavy Rain
                    </span>


                    <span
                      className="action-modal-detail-sub"
                    >
                      Intensity expected to increase later
                    </span>

                  </div>


                  <div
                    className="action-modal-detail-card"
                  >

                    <div
                      className="action-modal-detail-top"
                    >

                      <Route
                        size={15}
                      />


                      <span
                        className="action-modal-detail-label"
                      >
                        ALTERNATIVE PLAN
                      </span>

                    </div>


                    <span
                      className="action-modal-detail-value"
                    >
                      Delay Travel
                    </span>


                    <span
                      className="action-modal-detail-sub"
                    >
                      Wait until conditions stabilize
                    </span>

                  </div>

                </div>


                {/* =========================================
                    PREPARATION STEPS
                ========================================= */}

                <div
                  className="action-preparation"
                >

                  <p
                    className="action-preparation-title"
                  >

                    <CheckCircle2
                      size={16}
                    />

                    PRACTICAL PREPARATION

                  </p>


                  <div
                    className="action-step"
                  >

                    <CheckCircle2
                      size={14}
                      className="action-step-icon"
                    />

                    Complete essential travel before the
                    higher-risk afternoon period.

                  </div>


                  <div
                    className="action-step"
                  >

                    <CheckCircle2
                      size={14}
                      className="action-step-icon"
                    />

                    Check local rainfall updates before
                    starting longer journeys.

                  </div>


                  <div
                    className="action-step"
                  >

                    <CheckCircle2
                      size={14}
                      className="action-step-icon"
                    />

                    Avoid routes known for waterlogging
                    during periods of intense rainfall.

                  </div>

                </div>


                {/* =========================================
                    AI CONFIDENCE
                ========================================= */}

                <div
                  className="action-modal-confidence"
                >

                  <div
                    className="action-modal-confidence-top"
                  >

                    <span
                      className="action-modal-confidence-label"
                    >

                      <ShieldCheck
                        size={15}
                      />

                      AI CONFIDENCE

                    </span>


                    <span
                      className="action-modal-confidence-value"
                    >
                      96%
                    </span>

                  </div>


                  <div
                    className="action-modal-confidence-bar"
                  >

                    <div
                      className="action-modal-confidence-fill"
                    />

                  </div>


                  <p
                    className="action-modal-confidence-note"
                  >
                    Confidence is based on agreement between
                    forecast timing, rainfall intensity
                    signals and expected local conditions.
                  </p>

                </div>

              </div>

            </section>

          </div>

        )
      }

    </>

  );

};