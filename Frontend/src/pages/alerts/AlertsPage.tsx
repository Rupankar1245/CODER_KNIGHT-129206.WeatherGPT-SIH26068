import { useState } from 'react';

import {
  AlertTriangle,
  Bell,
  Calendar,
  Car,
  Check,
  Clock,
  CloudRain,
  Crosshair,
  Download,
  FileText,
  MapPin,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Send,
  Settings,
  Share2,
  Sparkles,
  Umbrella,
  Wind,
  X,
  Zap,
} from 'lucide-react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

import { AlertSummaryCards } from '../../components/alerts/AlertSummaryCards';
import { AlertAnalyticsPanels } from '../../components/alerts/AlertAnalyticsPanels';
import { AlertHistoryTable } from '../../components/alerts/AlertHistoryTable';
import { alertHistoryData } from '../../components/alerts/alertHistoryData';


/* =====================================================
   TYPES
===================================================== */

type ModalType =
  | 'details'
  | 'ai'
  | 'preferences'
  | 'locations'
  | 'history'
  | null;


interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}


interface District {
  id: string;
  name: string;
  d: string;
  fill: string;
  labelX: number;
  labelY: number;
}


/* =====================================================
   DISTRICT DATA
===================================================== */

const districts: District[] = [
  {
    id: 'north-24',
    name: 'North 24',
    d: 'M250 90 L330 105 L350 175 L300 220 L230 185 Z',
    fill: 'rgba(239, 68, 68, 0.22)',
    labelX: 280,
    labelY: 145,
  },

  {
    id: 'kolkata',
    name: 'Kolkata',
    d: 'M230 185 L300 220 L275 265 L215 240 Z',
    fill: 'rgba(56, 189, 248, 0.16)',
    labelX: 250,
    labelY: 225,
  },

  {
    id: 'howrah',
    name: 'Howrah',
    d: 'M160 175 L230 185 L215 240 L145 225 Z',
    fill: 'rgba(245, 158, 11, 0.14)',
    labelX: 185,
    labelY: 210,
  },

  {
    id: 'south-24',
    name: 'South 24',
    d: 'M215 240 L275 265 L300 320 L220 315 L175 270 Z',
    fill: 'rgba(34, 197, 94, 0.14)',
    labelX: 235,
    labelY: 285,
  },
];


/* =====================================================
   COMPONENT
===================================================== */

export const AlertPage = () => {

  const [activeModal, setActiveModal] =
    useState<ModalType>(null);

  const [zoomLevel, setZoomLevel] =
    useState(1);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [selectedDistrict, setSelectedDistrict] =
    useState('north-24');

  const [toastMessage, setToastMessage] =
    useState('');

  const [chatInput, setChatInput] =
    useState('');

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([
      {
        role: 'assistant',
        text:
          'I am monitoring the current severe rainfall situation. Ask me about travel, safety, flooding, or expected weather changes.',
      },
    ]);


  /* =====================================================
     TOAST
  ===================================================== */

  const triggerToast = (
    message: string
  ) => {

    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage('');
    }, 3000);

  };


  /* =====================================================
     MAP CONTROLS
  ===================================================== */

  const handleZoomIn = () => {

    setZoomLevel((previous) =>
      Math.min(
        previous + 0.2,
        1.8
      )
    );

  };


  const handleZoomOut = () => {

    setZoomLevel((previous) =>
      Math.max(
        previous - 0.2,
        0.8
      )
    );

  };


  const handleResetZoom = () => {

    setZoomLevel(1);

    triggerToast(
      'Map centered on the active alert region.'
    );

  };


  /* =====================================================
     CHAT
  ===================================================== */

  const handleSendMessage = () => {

    const message =
      chatInput.trim();

    if (!message) {
      return;
    }


    setChatMessages((previous) => [
      ...previous,
      {
        role: 'user',
        text: message,
      },
    ]);


    setChatInput('');


    window.setTimeout(() => {

      setChatMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text:
            'Based on the current alert, avoid unnecessary travel during peak rainfall hours. Monitor local authorities for evacuation or road closure updates.',
        },
      ]);

    }, 500);

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <>

      {/* =================================================
          PAGE CSS
      ================================================= */}

      <style>{`

        /* =====================================================
           PAGE ROOT
        ===================================================== */

        .alert-page-root {
          display: flex;

          width: 100%;
          height: 100vh;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #092242 0%,
              #082d54 30%,
              #0d4b75 65%,
              #004d64 100%
            );

          color: #ffffff;
        }


        /* =====================================================
           CONTENT AREA
        ===================================================== */

        .alert-content-area {
          flex: 1;

          min-width: 0;
          min-height: 0;

          height: 100vh;

          padding:
            0
            32px
            32px;

          overflow-y: auto;
          overflow-x: hidden;
        }


        /* =====================================================
           STICKY HEADER
        ===================================================== */

        .alert-page-header {
          position: sticky;

          top: 0;

          z-index: 100;

          width: 100%;

          padding:
            12px
            0;
        }


        /* =====================================================
           PAGE BODY
        ===================================================== */

        .alert-page-body {
          display: flex;
          flex-direction: column;

          gap: 18px;

          padding-top: 4px;
        }


        /* =====================================================
           GLASS PANEL
        ===================================================== */

        .glass-panel {
          min-width: 0;

          border-radius: 20px;

          padding: 18px;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.10),
              rgba(255, 255, 255, 0.035)
            );

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          border:
            1px solid
            rgba(255, 255, 255, 0.13);

          box-shadow:
            0 8px 28px
            rgba(0, 0, 0, 0.14);
        }


        /* =====================================================
           SUMMARY CARDS
        ===================================================== */

        .metric-cards-grid {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 14px;
        }


        .metric-card {
          min-height: 94px;

          padding: 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.10),
              rgba(255, 255, 255, 0.035)
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.12);

          backdrop-filter:
            blur(16px);

          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }


        .metric-card:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(255, 255, 255, 0.2);
        }


        .metric-content-left {
          display: flex;
          flex-direction: column;

          gap: 5px;
        }


        .metric-number {
          font-size: 24px;
          font-weight: 700;

          line-height: 1;
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


        .metric-label {
          font-size: 10px;

          color: #94a3b8;
        }


        .metric-icon-wrap {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.06);
        }


        .live-monitoring-info {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }


        .live-monitoring-title {
          font-size: 12px;
          font-weight: 600;

          color: #f1f5f9;
        }


        .live-status-row {
          display: flex;
          align-items: center;

          gap: 6px;

          font-size: 10px;

          color: #94a3b8;
        }


        .green-pulse-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 10px
            rgba(34, 197, 94, 0.8);

          animation:
            greenPulse
            2s
            infinite;
        }


        @keyframes greenPulse {

          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }

        }


        /* =====================================================
           GRID LAYOUT
        ===================================================== */

        .grid-3-col-main {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          align-items: stretch;
        }


        .grid-3-col-secondary {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          align-items: stretch;
        }


        .grid-3-col-bottom {
          display: grid;

          grid-template-columns:
            1.35fr
            1fr
            1fr;

          gap: 18px;

          align-items: stretch;
        }


        /* =====================================================
           STANDARD CARD HEADER
        ===================================================== */

        .card-header-simple {
          display: flex;
          align-items: center;

          gap: 8px;

          margin: 0;

          font-size: 13px;
          font-weight: 600;

          color: #f8fafc;
        }


        .card-header-simple > span {
          font-size: inherit !important;
        }


        /* =====================================================
           ACTIVE ALERT
        ===================================================== */

        .active-alert-card {
          display: flex;
          flex-direction: column;

          justify-content: space-between;

          min-height: 338px;
        }


        .alert-card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          margin-bottom: 14px;
        }


        .critical-badge {
          display: inline-flex;
          align-items: center;

          gap: 5px;

          padding:
            5px
            8px;

          border-radius: 7px;

          background:
            rgba(239, 68, 68, 0.13);

          border:
            1px solid
            rgba(239, 68, 68, 0.25);

          color: #f87171;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.4px;
        }


        .ai-confidence-badge {
          font-size: 9px;

          color: #c084fc;

          padding:
            5px
            7px;

          border-radius: 7px;

          background:
            rgba(168, 85, 247, 0.09);
        }


        .alert-headline h2 {
          margin: 0;

          font-size: 20px;
          font-weight: 650;

          color: #ffffff;
        }


        .alert-headline p {
          margin:
            5px
            0
            16px;

          font-size: 11px;

          color: #94a3b8;
        }


        .alert-specs-list {
          display: flex;
          flex-direction: column;

          gap: 9px;
        }


        .alert-spec-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          font-size: 10px;
        }


        .spec-left {
          display: flex;
          align-items: center;

          gap: 7px;

          color: #94a3b8;
        }


        .spec-value {
          color: #e2e8f0;

          font-weight: 500;

          text-align: right;
        }


        .extreme-risk-pill {
          padding:
            4px
            8px;

          border-radius: 999px;

          background:
            rgba(239, 68, 68, 0.12);

          border:
            1px solid
            rgba(239, 68, 68, 0.25);

          color: #f87171;

          font-size: 9px;
          font-weight: 600;
        }


        /* =====================================================
           ALERT ACTIONS
        ===================================================== */

        .alert-actions-row {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 8px;

          margin-top: 16px;
        }


        .action-btn-red,
        .action-btn-navy,
        .action-btn-purple {
          min-height: 34px;

          border: none;

          border-radius: 9px;

          padding:
            8px
            10px;

          color: #ffffff;

          font-size: 10px;
          font-weight: 500;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            filter 0.2s ease;
        }


        .action-btn-red {
          background:
            linear-gradient(
              135deg,
              #dc2626,
              #ef4444
            );
        }


        .action-btn-navy {
          background:
            rgba(56, 189, 248, 0.12);

          border:
            1px solid
            rgba(56, 189, 248, 0.25);
        }


        .action-btn-purple {
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }


        .action-btn-red:hover,
        .action-btn-navy:hover,
        .action-btn-purple:hover {
          transform:
            translateY(-1px);

          filter:
            brightness(1.08);
        }


        /* =====================================================
           MAP
        ===================================================== */

        .map-card-container {
          display: flex;
          flex-direction: column;

          min-height: 338px;
        }


        .map-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 12px;
        }


        .map-title-left {
          display: flex;
          align-items: center;

          gap: 8px;

          font-size: 13px;
          font-weight: 600;
        }


        .map-canvas-wrapper {
          position: relative;

          flex: 1;

          min-height: 240px;

          overflow: hidden;

          border-radius: 14px;

          background:
            radial-gradient(
              circle at center,
              rgba(56, 189, 248, 0.09),
              rgba(8, 22, 40, 0.55)
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.06);
        }


        .map-controls-overlay {
          position: absolute;

          top: 10px;
          right: 10px;

          z-index: 5;

          display: flex;
          flex-direction: column;

          gap: 5px;
        }


        .map-ctrl-btn {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          border:
            1px solid
            rgba(255, 255, 255, 0.12);

          background:
            rgba(8, 22, 40, 0.75);

          color: #cbd5e1;

          cursor: pointer;
        }


        .map-ctrl-btn:hover {
          color: #ffffff;

          background:
            rgba(56, 189, 248, 0.15);
        }


        .map-svg {
          width: 100%;
          height: 100%;

          transform-origin: center;

          transition:
            transform 0.3s ease;
        }


        .district-path {
          stroke:
            rgba(255, 255, 255, 0.22);

          stroke-width: 1.5;

          cursor: pointer;

          transition:
            opacity 0.2s ease,
            stroke-width 0.2s ease;
        }


        .district-path:hover,
        .district-path.selected {
          stroke: #38bdf8;

          stroke-width: 2.5;

          filter:
            drop-shadow(
              0 0 8px
              rgba(56, 189, 248, 0.7)
            );
        }


        .district-label {
          fill:
            rgba(226, 232, 240, 0.75);

          font-size: 9px;

          text-anchor: middle;

          pointer-events: none;
        }


        /* =====================================================
           AI ANALYSIS
        ===================================================== */

        .ai-analysis-card {
          display: flex;
          flex-direction: column;

          justify-content: space-between;

          gap: 20px;

          min-height: 338px;
        }


        .ai-analysis-card .ai-analysis-text {
          margin:
            12px
            0
            0;

          font-size: 12px;

          line-height: 1.6;

          color: #94a3b8;
        }


        .why-matters-heading {
          margin:
            0
            0
            10px;

          font-size: 12px;
          font-weight: 600;

          color: #e2e8f0;
        }


        .why-matters-list {
          display: flex;
          flex-direction: column;

          gap: 9px;
        }


        .why-item {
          display: flex;
          align-items: center;

          gap: 8px;

          font-size: 11px;

          color: #cbd5e1;
        }


        /* =====================================================
           SECONDARY PANELS
        ===================================================== */

        .secondary-panel-inner {
          display: flex;
          flex-direction: column;

          padding: 18px;
        }


        /* =====================================================
           RISK SCORE
        ===================================================== */

        .risk-score-panel .risk-bars-container {
          display: flex;
          flex-direction: column;

          gap: 11px;

          margin-top: 16px;
        }


        .risk-score-panel .risk-bar-row {
          display: grid;

          grid-template-columns:
            minmax(92px, 112px)
            minmax(0, 1fr)
            46px;

          align-items: center;

          gap: 9px;
        }


        .risk-score-panel .risk-label-group {
          display: flex;
          align-items: center;

          gap: 7px;

          min-width: 0;

          font-size: 11px;

          color: #cbd5e1;

          white-space: nowrap;
        }


        .risk-score-panel .risk-score-value {
          text-align: right;

          font-size: 10px;
          font-weight: 500;

          color: #94a3b8;

          white-space: nowrap;
        }


        .risk-score-panel .progress-track {
          height: 6px;

          overflow: hidden;

          border-radius: 999px;

          background:
            rgba(255, 255, 255, 0.08);
        }


        .risk-score-panel .progress-fill {
          height: 100%;

          border-radius: inherit;
        }


        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline-panel .timeline-container {
          margin-top: 18px;
        }


        .timeline-panel .timeline-node {
          width: 64px;

          gap: 6px;
        }


        .timeline-panel .timeline-time {
          font-size: 10px;

          color: #94a3b8;

          white-space: nowrap;
        }


        .timeline-panel .timeline-label {
          font-size: 10px;

          color: #cbd5e1;

          text-align: center;
        }


        .timeline-panel .timeline-circle {
          width: 26px;
          height: 26px;

          min-width: 26px;

          border-radius: 50%;
        }


        .timeline-panel .timeline-track-line {
          top: 29px;
        }


        /* =====================================================
           IMPACT PANEL
        ===================================================== */

        .impact-list-container {
          display: flex;
          flex-direction: column;

          gap: 9px;

          margin-top: 15px;
        }


        .impact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
        }


        .impact-left {
          display: flex;
          align-items: center;

          gap: 8px;

          min-width: 0;

          font-size: 11px;

          color: #cbd5e1;
        }


        .impact-pill {
          padding:
            4px
            9px;

          border-radius: 999px;

          font-size: 9px;
          font-weight: 600;

          white-space: nowrap;
        }


        /* =====================================================
           HISTORY
        ===================================================== */

        .history-table-container {
          width: 100%;

          margin-top: 14px;

          overflow-x: auto;
        }


        .history-table {
          width: 100%;

          border-collapse: collapse;

          min-width: 520px;
        }


        .history-table th {
          padding:
            9px
            8px;

          text-align: left;

          font-size: 9px;
          font-weight: 600;

          color: #64748b;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.09);

          white-space: nowrap;
        }


        .history-table td {
          padding:
            11px
            8px;

          font-size: 10px;

          color: #94a3b8;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.055);

          white-space: nowrap;
        }


        .history-table tbody tr:last-child td {
          border-bottom: none;
        }


        .history-table tbody tr:hover {
          background:
            rgba(255, 255, 255, 0.035);
        }


        .view-all-btn {
          padding:
            5px
            9px;

          border-radius: 8px;

          border:
            1px solid
            rgba(56, 189, 248, 0.18);

          background:
            rgba(56, 189, 248, 0.06);

          color: #38bdf8;

          font-size: 10px;

          cursor: pointer;
        }


        .view-all-btn:hover {
          background:
            rgba(56, 189, 248, 0.12);
        }


        /* =====================================================
           STATUS BADGES
        ===================================================== */

        .status-badge-active,
        .status-badge-expired {
          display: inline-flex;

          padding:
            4px
            8px;

          border-radius: 999px;

          font-size: 9px;
          font-weight: 600;
        }


        .status-badge-active {
          color: #34d399;

          background:
            rgba(16, 185, 129, 0.12);
        }


        .status-badge-expired {
          color: #94a3b8;

          background:
            rgba(148, 163, 184, 0.09);
        }


        /* =====================================================
           SETTINGS
        ===================================================== */

        .settings-buttons-group {
          display: flex;
          flex-direction: column;

          gap: 9px;

          margin-top: 16px;
        }


        .settings-nav-btn {
          width: 100%;

          padding:
            10px
            11px;

          display: flex;
          align-items: center;

          gap: 9px;

          border-radius: 10px;

          border:
            1px solid
            rgba(255, 255, 255, 0.08);

          background:
            rgba(255, 255, 255, 0.035);

          color: #cbd5e1;

          font-size: 11px;

          cursor: pointer;

          text-align: left;
        }


        .settings-nav-btn:hover {
          background:
            rgba(56, 189, 248, 0.07);

          border-color:
            rgba(56, 189, 248, 0.2);
        }


        /* =====================================================
           QUICK ACTIONS
        ===================================================== */

        .quick-actions-group {
          display: flex;
          flex-direction: column;

          gap: 9px;

          margin-top: 16px;
        }


        .quick-action-gpt,
        .quick-action-share,
        .quick-action-download {
          width: 100%;

          padding:
            10px
            11px;

          display: flex;
          align-items: center;

          gap: 9px;

          border-radius: 10px;

          font-size: 11px;

          cursor: pointer;

          color: #ffffff;
        }


        .quick-action-gpt {
          border: none;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }


        .quick-action-share {
          border:
            1px solid
            rgba(56, 189, 248, 0.2);

          background:
            rgba(56, 189, 248, 0.08);
        }


        .quick-action-download {
          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          background:
            rgba(255, 255, 255, 0.045);
        }


        /* =====================================================
           MODAL
        ===================================================== */

        .modal-overlay {
          position: fixed;

          inset: 0;

          padding: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(2, 8, 23, 0.78);

          backdrop-filter:
            blur(8px);

          z-index: 1000;

          animation:
            modalFadeIn
            0.2s ease;
        }


        @keyframes modalFadeIn {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }


        .modal-card {
          width: 100%;
          max-width: 560px;

          overflow: hidden;

          display: flex;
          flex-direction: column;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              #0c1d33,
              #081525
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.13);

          box-shadow:
            0 24px 70px
            rgba(0, 0, 0, 0.55);
        }


        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            15px
            18px;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.08);
        }


        .modal-header h3 {
          margin: 0;

          display: flex;
          align-items: center;

          gap: 8px;

          font-size: 13px;
          font-weight: 600;

          color: #f8fafc;
        }


        .modal-close-btn {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 8px;

          background: transparent;

          color: #94a3b8;

          cursor: pointer;
        }


        .modal-close-btn:hover {
          color: #ffffff;

          background:
            rgba(255, 255, 255, 0.07);
        }


        .modal-body {
          padding: 18px;

          display: flex;
          flex-direction: column;

          gap: 12px;

          max-height: 70vh;

          overflow-y: auto;
        }


        /* =====================================================
           TOAST
        ===================================================== */

        .toast-notification {
          position: fixed;

          right: 24px;
          bottom: 24px;

          z-index: 9999;

          padding:
            11px
            15px;

          display: flex;
          align-items: center;

          gap: 9px;

          border-radius: 12px;

          background:
            rgba(10, 30, 52, 0.96);

          border:
            1px solid
            rgba(56, 189, 248, 0.35);

          color: #ffffff;

          font-size: 11px;

          box-shadow:
            0 12px 35px
            rgba(0, 0, 0, 0.35);
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1200px) {

          .metric-cards-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .grid-3-col-main,
          .grid-3-col-secondary,
          .grid-3-col-bottom {
            grid-template-columns:
              1fr;
          }


          .active-alert-card,
          .map-card-container,
          .ai-analysis-card {
            min-height: auto;
          }

        }


        /* =====================================================
           TABLET LAYOUT
        ===================================================== */

        @media (max-width: 1023px) {

          .alert-page-root > :first-child {
            display: none !important;
          }


          .alert-content-area {
            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              30px;
          }


          .alert-page-header {
            padding: 10px 0;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {

          .alert-page-root > :first-child {
            display: none !important;

            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
          }


          .alert-content-area {
            display: block;

            width: 100% !important;

            min-width: 0 !important;

            flex: 1 1 100%;

            height: 100vh;

            padding:
              0
              12px
              20px;

            overflow-x: hidden;
            overflow-y: auto;
          }


          .alert-page-header {
            padding: 8px 0;
          }


          .metric-cards-grid {
            grid-template-columns: 1fr;
          }


          .alert-actions-row {
            grid-template-columns: 1fr;
          }


          .risk-score-panel .risk-bar-row {
            grid-template-columns:
              100px
              minmax(0, 1fr)
              42px;

            gap: 7px;
          }


          .timeline-panel .timeline-container {
            overflow-x: auto;

            padding-bottom: 6px;
          }


          .timeline-panel .timeline-node {
            min-width: 64px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 479px) {

          .alert-content-area {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;
          }


          .alert-page-header {
            padding: 6px 0;
          }


          .glass-panel {
            padding: 15px;

            border-radius: 17px;
          }


          .risk-score-panel .risk-bar-row {
            grid-template-columns:
              88px
              minmax(0, 1fr)
              38px;
          }


          .alert-card-top-row {
            flex-wrap: wrap;
          }

        }


        /* =====================================================
           VERY SMALL MOBILE
        ===================================================== */

        @media (max-width: 359px) {

          .alert-content-area {
            padding-left: 6px;
            padding-right: 6px;
          }

        }

      `}</style>


      {/* =================================================
          PAGE
      ================================================= */}

      <div className="alert-page-root">


        {/* ===============================================
            SIDEBAR
        =============================================== */}

        <Sidebar />


        {/* ===============================================
            MAIN CONTENT
        =============================================== */}

        <main className="alert-content-area">


          {/* HEADER */}

          <div className="alert-page-header">
            <Header />
          </div>


          {/* PAGE BODY */}

          <div className="alert-page-body">


            {/* =============================================
                SUMMARY CARDS
            ============================================= */}

            <AlertSummaryCards />


            {/* =============================================
                MAIN ROW
            ============================================= */}

            <div className="grid-3-col-main">


              {/* =========================================
                  ACTIVE ALERT
              ========================================= */}

              <div className="glass-panel active-alert-card">

                <div>

                  <div className="alert-card-top-row">

                    <span className="critical-badge">
                      <AlertTriangle size={11} />
                      CRITICAL ALERT
                    </span>


                    <span className="ai-confidence-badge">
                      AI Confidence: 94%
                    </span>

                  </div>


                  <div className="alert-headline">

                    <h2>
                      Heavy Rainfall
                    </h2>

                    <p>
                      North 24 Parganas, West Bengal
                    </p>

                  </div>


                  <div className="alert-specs-list">


                    <div className="alert-spec-row">

                      <span className="spec-left">
                        <Calendar size={13} />
                        Start Time
                      </span>

                      <span className="spec-value">
                        23 Aug 2025, 08:00 AM
                      </span>

                    </div>


                    <div className="alert-spec-row">

                      <span className="spec-left">
                        <Clock size={13} />
                        End Time
                      </span>

                      <span className="spec-value">
                        23 Aug 2025, 04:00 PM
                      </span>

                    </div>


                    <div className="alert-spec-row">

                      <span className="spec-left">
                        <CloudRain size={13} />
                        Expected Rainfall
                      </span>

                      <span className="spec-value">
                        120 - 150 mm
                      </span>

                    </div>


                    <div className="alert-spec-row">

                      <span className="spec-left">
                        <Wind size={13} />
                        Wind Speed
                      </span>

                      <span className="spec-value">
                        35 - 45 km/h
                      </span>

                    </div>


                    <div className="alert-spec-row">

                      <span className="spec-left">
                        <AlertTriangle
                          size={13}
                          color="#ef4444"
                        />
                        Risk Level
                      </span>

                      <span className="extreme-risk-pill">
                        Extreme
                      </span>

                    </div>


                  </div>

                </div>


                <div className="alert-actions-row">

                  <button
                    className="action-btn-red"
                    onClick={() =>
                      setActiveModal('details')
                    }
                  >
                    View Details
                  </button>


                  <button
                    className="action-btn-navy"
                    onClick={handleResetZoom}
                  >
                    View on Map
                  </button>


                  <button
                    className="action-btn-purple"
                    onClick={() =>
                      setActiveModal('ai')
                    }
                  >
                    Ask AI
                  </button>

                </div>

              </div>


              {/* =========================================
                  LIVE ALERT MAP
              ========================================= */}

              <div className="glass-panel map-card-container">


                <div className="map-card-header">

                  <div className="map-title-left">
                    <MapPin
                      size={15}
                      color="#38bdf8"
                    />
                    <span>
                      Live Alert Map
                    </span>
                  </div>


                  <button
                    className="map-ctrl-btn"
                    onClick={() =>
                      setIsFullscreen(
                        (previous) =>
                          !previous
                      )
                    }
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen
                      ? <Minimize2 size={12} />
                      : <Maximize2 size={12} />
                    }
                  </button>

                </div>


                <div className="map-canvas-wrapper">


                  {/* MAP CONTROLS */}

                  <div className="map-controls-overlay">

                    <button
                      className="map-ctrl-btn"
                      onClick={handleZoomIn}
                      title="Zoom In"
                    >
                      <Plus size={13} />
                    </button>


                    <button
                      className="map-ctrl-btn"
                      onClick={handleZoomOut}
                      title="Zoom Out"
                    >
                      <Minus size={13} />
                    </button>


                    <button
                      className="map-ctrl-btn"
                      onClick={handleResetZoom}
                      title="Center Map"
                    >
                      <Crosshair size={13} />
                    </button>

                  </div>


                  {/* SVG MAP */}

                  <svg
                    viewBox="0 0 420 340"
                    className="map-svg"
                    style={{
                      transform:
                        `scale(${zoomLevel})`,
                    }}
                  >


                    {/* RADAR */}

                    <circle
                      cx="280"
                      cy="200"
                      r="40"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.15)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />


                    <circle
                      cx="280"
                      cy="200"
                      r="80"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="6 6"
                    />


                    <circle
                      cx="280"
                      cy="200"
                      r="130"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.06)"
                      strokeWidth="1"
                    />


                    {/* RAIN BANDS */}

                    <ellipse
                      cx="300"
                      cy="180"
                      rx="65"
                      ry="95"
                      fill="rgba(34, 197, 94, 0.22)"
                    />


                    <ellipse
                      cx="310"
                      cy="190"
                      rx="45"
                      ry="70"
                      fill="rgba(239, 68, 68, 0.3)"
                    />


                    {/* DISTRICTS */}

                    {districts.map((district) => {

                      const isSelected =
                        selectedDistrict ===
                        district.id;


                      return (

                        <g
                          key={district.id}
                          onClick={() =>
                            setSelectedDistrict(
                              district.id
                            )
                          }
                        >

                          <path
                            d={district.d}
                            fill={district.fill}
                            className={
                              `district-path ${
                                isSelected
                                  ? 'selected'
                                  : ''
                              }`
                            }
                          />


                          <text
                            x={district.labelX}
                            y={district.labelY}
                            className="district-label"
                          >
                            {district.name}
                          </text>

                        </g>

                      );

                    })}


                    {/* LOCATION */}

                    <g transform="translate(280, 218)">

                      <circle
                        cx="0"
                        cy="0"
                        r="9"
                        fill="rgba(56, 189, 248, 0.3)"
                      >
                        <animate
                          attributeName="r"
                          values="6;16;6"
                          dur="2s"
                          repeatCount="indefinite"
                        />

                        <animate
                          attributeName="opacity"
                          values="0.8;0.1;0.8"
                          dur="2s"
                          repeatCount="indefinite"
                        />

                      </circle>


                      <circle
                        cx="0"
                        cy="0"
                        r="5"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                    </g>


                  </svg>


                </div>

              </div>


              {/* =========================================
                  AI RISK ANALYSIS
              ========================================= */}

              <div className="glass-panel ai-analysis-card">


                <div>

                  <div className="card-header-simple">

                    <Sparkles
                      size={15}
                      color="#c084fc"
                    />

                    <span>
                      AI Risk Analysis
                    </span>

                  </div>


                  <p className="ai-analysis-text">

                    Rainfall intensity is expected
                    to increase rapidly over the next
                    3 hours. Low-lying areas may
                    experience significant waterlogging.

                  </p>

                </div>


                <div>

                  <h3 className="why-matters-heading">
                    Why this alert matters
                  </h3>


                  <div className="why-matters-list">


                    <div className="why-item">

                      <CloudRain
                        size={15}
                        color="#38bdf8"
                      />

                      <span>
                        Rain intensity increasing
                      </span>

                    </div>


                    <div className="why-item">

                      <Umbrella
                        size={15}
                        color="#fb923c"
                      />

                      <span>
                        Drainage risk elevated
                      </span>

                    </div>


                    <div className="why-item">

                      <Car
                        size={15}
                        color="#f87171"
                      />

                      <span>
                        Travel disruption possible
                      </span>

                    </div>


                    <div className="why-item">

                      <AlertTriangle
                        size={15}
                        color="#facc15"
                      />

                      <span>
                        Avoid unnecessary travel
                      </span>

                    </div>


                  </div>

                </div>


              </div>


            </div>


            {/* =============================================
                ANALYTICS PANELS
            ============================================= */}

            <AlertAnalyticsPanels />


            {/* =============================================
                BOTTOM ROW
            ============================================= */}

            <div className="grid-3-col-bottom">


              {/* ALERT HISTORY */}

              <AlertHistoryTable
                onViewAll={() =>
                  setActiveModal('history')
                }
              />


              {/* ALERT SETTINGS */}

              <div className="glass-panel secondary-panel-inner">

                <div>

                  <div
                    className="card-header-simple"
                    style={{
                      marginBottom: 4,
                    }}
                  >

                    <Settings
                      size={15}
                      color="#38bdf8"
                    />

                    <span>
                      Alert Settings
                    </span>

                  </div>


                  <p
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      margin: 0,
                    }}
                  >
                    Manage your alert preferences
                    and locations
                  </p>

                </div>


                <div className="settings-buttons-group">

                  <button
                    className="settings-nav-btn"
                    onClick={() =>
                      setActiveModal(
                        'preferences'
                      )
                    }
                  >

                    <Bell
                      size={13}
                      color="#38bdf8"
                    />

                    <span>
                      Alert Preferences
                    </span>

                  </button>


                  <button
                    className="settings-nav-btn"
                    onClick={() =>
                      setActiveModal(
                        'locations'
                      )
                    }
                  >

                    <MapPin
                      size={13}
                      color="#38bdf8"
                    />

                    <span>
                      My Locations
                    </span>

                  </button>

                </div>

              </div>


              {/* QUICK ACTIONS */}

              <div className="glass-panel secondary-panel-inner">

                <div className="card-header-simple">

                  <Zap
                    size={15}
                    color="#facc15"
                  />

                  <span>
                    Quick Actions
                  </span>

                </div>


                <div className="quick-actions-group">


                  <button
                    className="quick-action-gpt"
                    onClick={() =>
                      setActiveModal('ai')
                    }
                  >

                    <Sparkles size={13} />

                    <span>
                      Ask WeatherGPT
                    </span>

                  </button>


                  <button
                    className="quick-action-share"
                    onClick={() => {

                      navigator
                        .clipboard
                        ?.writeText(
                          window.location.href
                        );

                      triggerToast(
                        'Alert broadcast URL copied to clipboard.'
                      );

                    }}
                  >

                    <Share2 size={13} />

                    <span>
                      Share Alert
                    </span>

                  </button>


                  <button
                    className="quick-action-download"
                    onClick={() =>
                      triggerToast(
                        'Emergency Weather Alert report generated.'
                      )
                    }
                  >

                    <Download size={13} />

                    <span>
                      Download Report
                    </span>

                  </button>


                </div>

              </div>


            </div>


          </div>


        </main>


        {/* =================================================
            VIEW DETAILS MODAL
        ================================================= */}

        {activeModal === 'details' && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveModal(null)
            }
          >

            <div
              className="modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <h3>

                  <AlertTriangle
                    size={16}
                    color="#ef4444"
                  />

                  Heavy Rainfall Warning Details

                </h3>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setActiveModal(null)
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div className="modal-body">

                <div
                  style={{
                    background:
                      'rgba(239,68,68,0.1)',

                    padding: 12,

                    borderRadius: 10,

                    border:
                      '1px solid rgba(239,68,68,0.3)',
                  }}
                >

                  <strong
                    style={{
                      color: '#f87171',

                      display: 'block',

                      marginBottom: 5,

                      fontSize: 12,
                    }}
                  >
                    Urgent Flood & Waterlogging Advisory
                  </strong>


                  <p
                    style={{
                      fontSize: 11.5,

                      lineHeight: 1.6,

                      color: '#cbd5e1',

                      margin: 0,
                    }}
                  >
                    High-resolution weather modelling
                    indicates intense rainfall over
                    North 24 Parganas. Low-lying
                    areas may experience waterlogging
                    during peak hours.
                  </p>

                </div>


                <button
                  className="action-btn-red"
                  style={{
                    width: '100%',
                  }}
                  onClick={() => {

                    setActiveModal(null);

                    triggerToast(
                      'Emergency response guidelines dispatched.'
                    );

                  }}
                >
                  Acknowledge Alert
                </button>


              </div>

            </div>

          </div>

        )}


        {/* =================================================
            WEATHERGPT MODAL
        ================================================= */}

        {activeModal === 'ai' && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveModal(null)
            }
          >

            <div
              className="modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <h3>

                  <Sparkles
                    size={16}
                    color="#c084fc"
                  />

                  WeatherGPT Risk Assistant

                </h3>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setActiveModal(null)
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div
                className="modal-body"
                style={{
                  minHeight: 300,
                }}
              >

                <div
                  style={{
                    display: 'flex',

                    flexDirection: 'column',

                    gap: 10,

                    flex: 1,
                  }}
                >

                  {chatMessages.map(
                    (message, index) => (

                      <div
                        key={index}
                        style={{
                          alignSelf:
                            message.role === 'user'
                              ? 'flex-end'
                              : 'flex-start',

                          maxWidth: '85%',

                          padding:
                            '9px 12px',

                          borderRadius: 10,

                          fontSize: 12,

                          lineHeight: 1.5,

                          background:
                            message.role === 'user'
                              ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                              : 'rgba(255,255,255,0.08)',

                          color: '#ffffff',

                          border:
                            message.role === 'user'
                              ? 'none'
                              : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {message.text}
                      </div>

                    )
                  )}

                </div>


                <div
                  style={{
                    display: 'flex',

                    gap: 7,

                    marginTop: 10,
                  }}
                >

                  <input
                    type="text"
                    placeholder="Ask WeatherGPT..."
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {

                      if (
                        event.key === 'Enter'
                      ) {
                        handleSendMessage();
                      }

                    }}
                    style={{
                      flex: 1,

                      background:
                        'rgba(255,255,255,0.06)',

                      border:
                        '1px solid rgba(255,255,255,0.15)',

                      borderRadius: 8,

                      padding:
                        '9px 12px',

                      color: '#ffffff',

                      fontSize: 11.5,

                      outline: 'none',
                    }}
                  />


                  <button
                    onClick={handleSendMessage}
                    style={{
                      background: '#7c3aed',

                      border: 'none',

                      borderRadius: 8,

                      padding:
                        '0 14px',

                      color: '#ffffff',

                      cursor: 'pointer',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Send size={14} />
                  </button>

                </div>


              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ALERT PREFERENCES MODAL
        ================================================= */}

        {activeModal === 'preferences' && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveModal(null)
            }
          >

            <div
              className="modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <h3>

                  <Bell
                    size={16}
                    color="#38bdf8"
                  />

                  Alert Notification Preferences

                </h3>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setActiveModal(null)
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div
                className="modal-body"
                style={{
                  fontSize: 12,
                }}
              >

                <label>
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  {' '}
                  Receive critical weather alerts

                </label>


                <label>
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  {' '}
                  Thunderstorm & lightning alerts

                </label>


                <label>
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  {' '}
                  Daily weather digest

                </label>


                <button
                  className="action-btn-navy"
                  style={{
                    width: '100%',
                    marginTop: 10,
                  }}
                  onClick={() => {

                    setActiveModal(null);

                    triggerToast(
                      'Preferences saved successfully.'
                    );

                  }}
                >
                  Save Preferences
                </button>


              </div>

            </div>

          </div>

        )}


        {/* =================================================
            LOCATIONS MODAL
        ================================================= */}

        {activeModal === 'locations' && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveModal(null)
            }
          >

            <div
              className="modal-card"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <h3>

                  <MapPin
                    size={16}
                    color="#38bdf8"
                  />

                  Monitored Locations

                </h3>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setActiveModal(null)
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div className="modal-body">

                <div
                  style={{
                    display: 'flex',

                    flexDirection: 'column',

                    gap: 9,
                  }}
                >

                  {[
                    {
                      name:
                        'North 24 Parganas',

                      status:
                        'Active Alert',
                    },

                    {
                      name:
                        'Siliguri, West Bengal',

                      status:
                        'Clear',
                    },

                    {
                      name:
                        'Kolkata Central',

                      status:
                        'Advisory',
                    },
                  ].map((location) => (

                    <div
                      key={location.name}
                      style={{
                        display: 'flex',

                        alignItems: 'center',

                        justifyContent:
                          'space-between',

                        gap: 10,

                        padding: 10,

                        background:
                          'rgba(255,255,255,0.05)',

                        borderRadius: 9,
                      }}
                    >

                      <strong
                        style={{
                          fontSize: 12,
                        }}
                      >
                        {location.name}
                      </strong>


                      <span
                        className={
                          location.status === 'Clear'
                            ? 'status-badge-expired'
                            : 'status-badge-active'
                        }
                      >
                        {location.status}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            HISTORY MODAL
        ================================================= */}

        {activeModal === 'history' && (

          <div
            className="modal-overlay"
            onClick={() =>
              setActiveModal(null)
            }
          >

            <div
              className="modal-card"
              style={{
                maxWidth: 720,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="modal-header">

                <h3>

                  <FileText
                    size={16}
                    color="#38bdf8"
                  />

                  Full Alert History

                </h3>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setActiveModal(null)
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div className="modal-body">

                <div className="history-table-container">

                  <table className="history-table">

                    <thead>

                      <tr>
                        <th>Date</th>
                        <th>Event</th>
                        <th>Location</th>
                        <th>Severity</th>
                        <th>Status</th>
                      </tr>

                    </thead>


                    <tbody>

                      {[
                        ...alertHistoryData,

                        {
                          date:
                            '19 Aug 2025',

                          event:
                            'Squall & Lightning',

                          location:
                            'Howrah',

                          severity:
                            'Severe',

                          sevColor:
                            '#f97316',

                          status:
                            'Expired',
                        },

                        {
                          date:
                            '15 Aug 2025',

                          event:
                            'Monsoon Depression',

                          location:
                            'South 24 Parganas',

                          severity:
                            'High',

                          sevColor:
                            '#ef4444',

                          status:
                            'Expired',
                        },

                      ].map(
                        (row, index) => (

                          <tr
                            key={`${row.date}-${index}`}
                          >

                            <td>
                              {row.date}
                            </td>


                            <td
                              style={{
                                color: '#f1f5f9',
                                fontWeight: 500,
                              }}
                            >
                              {row.event}
                            </td>


                            <td>
                              {row.location}
                            </td>


                            <td>

                              <span
                                style={{
                                  color:
                                    row.sevColor,
                                }}
                              >
                                ● {row.severity}
                              </span>

                            </td>


                            <td>

                              <span
                                className={
                                  row.status === 'Active'
                                    ? 'status-badge-active'
                                    : 'status-badge-expired'
                                }
                              >
                                {row.status}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            TOAST
        ================================================= */}

        {toastMessage && (

          <div className="toast-notification">

            <Check
              size={15}
              color="#38bdf8"
            />

            <span>
              {toastMessage}
            </span>

          </div>

        )}


      </div>

    </>

  );

};


export default AlertPage;