import React, { useMemo, useState } from 'react';

import {
  AlertTriangle,
  ArrowRight,
  Bot,
  ChevronRight,
  CircleAlert,
  CloudLightning,
  CloudRain,
  Crosshair,
  Flame,
  Map,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  ThermometerSun,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';


/* =========================================================
   TYPES
========================================================= */

type RiskLevel =
  | 'low'
  | 'moderate'
  | 'high'
  | 'severe';


interface DisasterEvent {
  id: number;
  type: string;
  location: string;
  description: string;
  level: RiskLevel;
  icon: React.ReactNode;
  color: string;
  background: string;
  border: string;
  districts: string;
  time: string;
}


interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  risk: RiskLevel;
  icon: React.ReactNode;
  color: string;
  background: string;
  border: string;
  details: string[];
}


interface RegionData {
  rank: number;
  region: string;
  hazard: string;
  risk: RiskLevel;
  districts: string;
}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getRiskLabel = (
  risk: RiskLevel
): string => {

  switch (risk) {

    case 'low':
      return 'Low';

    case 'moderate':
      return 'Moderate';

    case 'high':
      return 'High';

    case 'severe':
      return 'Severe';

    default:
      return 'Low';

  }

};


const getRiskColor = (
  risk: RiskLevel
): string => {

  switch (risk) {

    case 'low':
      return '#34d399';

    case 'moderate':
      return '#facc15';

    case 'high':
      return '#fb923c';

    case 'severe':
      return '#f87171';

    default:
      return '#34d399';

  }

};


const getRiskBackground = (
  risk: RiskLevel
): string => {

  switch (risk) {

    case 'low':
      return 'rgba(52, 211, 153, 0.12)';

    case 'moderate':
      return 'rgba(250, 204, 21, 0.12)';

    case 'high':
      return 'rgba(251, 146, 60, 0.12)';

    case 'severe':
      return 'rgba(248, 113, 113, 0.12)';

    default:
      return 'rgba(52, 211, 153, 0.12)';

  }

};


/* =========================================================
   COMPONENT
========================================================= */

export const DisasterMonitoring: React.FC = () => {


  /* =======================================================
     STATE
  ======================================================= */

  const [
    activeLayer,
    setActiveLayer,
  ] = useState('All');


  const [
    selectedTimeline,
    setSelectedTimeline,
  ] = useState('Now');


  /* =======================================================
     DATA
  ======================================================= */

  const disasterEvents: DisasterEvent[] = useMemo(
    () => [

      {
        id: 1,

        type: 'Flood Risk',

        location: 'Assam & North Bengal',

        description:
          'Persistent heavy rainfall may increase river overflow and localized flooding risk.',

        level: 'high',

        icon:
          <Waves size={18} />,

        color:
          '#38bdf8',

        background:
          'rgba(56, 189, 248, 0.12)',

        border:
          'rgba(56, 189, 248, 0.20)',

        districts:
          '8 districts',

        time:
          'Updated 18 min ago',
      },


      {
        id: 2,

        type: 'Lightning Activity',

        location: 'West Bengal',

        description:
          'Moderate convective activity detected with localized lightning risk.',

        level: 'moderate',

        icon:
          <Zap size={18} />,

        color:
          '#facc15',

        background:
          'rgba(250, 204, 21, 0.12)',

        border:
          'rgba(250, 204, 21, 0.20)',

        districts:
          '5 districts',

        time:
          'Updated 11 min ago',
      },


      {
        id: 3,

        type: 'Heavy Rainfall',

        location: 'Meghalaya',

        description:
          'Intense rainfall conditions may affect transportation and low-lying regions.',

        level: 'high',

        icon:
          <CloudRain size={18} />,

        color:
          '#60a5fa',

        background:
          'rgba(96, 165, 250, 0.12)',

        border:
          'rgba(96, 165, 250, 0.20)',

        districts:
          '4 districts',

        time:
          'Updated 26 min ago',
      },

    ],
    []
  );


  const categoryData: CategoryData[] = useMemo(
    () => [

      {
        id: 'cyclone',

        title:
          'Cyclone Tracker',

        subtitle:
          'Bay of Bengal & Arabian Sea',

        status:
          'No active cyclone',

        risk:
          'low',

        icon:
          <Wind size={20} />,

        color:
          '#a78bfa',

        background:
          'rgba(167, 139, 250, 0.12)',

        border:
          'rgba(167, 139, 250, 0.20)',

        details: [

          'Bay of Bengal: Stable',

          'Arabian Sea: Stable',

          'No landfall threat detected',

        ],
      },


      {
        id: 'flood',

        title:
          'Flood Monitoring',

        subtitle:
          'River & rainfall risk',

        status:
          '2 regions at high risk',

        risk:
          'high',

        icon:
          <Waves size={20} />,

        color:
          '#38bdf8',

        background:
          'rgba(56, 189, 248, 0.12)',

        border:
          'rgba(56, 189, 248, 0.20)',

        details: [

          'High rainfall accumulation',

          'River levels under watch',

          'Low-lying areas vulnerable',

        ],
      },


      {
        id: 'heatwave',

        title:
          'Heatwave Tracker',

        subtitle:
          'Temperature anomaly monitoring',

        status:
          'No severe heatwave',

        risk:
          'low',

        icon:
          <ThermometerSun size={20} />,

        color:
          '#f59e0b',

        background:
          'rgba(245, 158, 11, 0.12)',

        border:
          'rgba(245, 158, 11, 0.20)',

        details: [

          'Maximum temperatures stable',

          'No major anomaly detected',

          'Regional monitoring active',

        ],
      },


      {
        id: 'lightning',

        title:
          'Lightning Tracker',

        subtitle:
          'Convective activity detection',

        status:
          'Moderate activity',

        risk:
          'moderate',

        icon:
          <CloudLightning size={20} />,

        color:
          '#34d399',

        background:
          'rgba(52, 211, 153, 0.12)',

        border:
          'rgba(52, 211, 153, 0.20)',

        details: [

          'Localized thunderstorm cells',

          'Moderate strike probability',

          'Monitoring next 6 hours',

        ],
      },

    ],
    []
  );


  const affectedRegions: RegionData[] = useMemo(
    () => [

      {
        rank: 1,
        region: 'Assam',
        hazard: 'Flood Risk',
        risk: 'high',
        districts: '6 districts',
      },

      {
        rank: 2,
        region: 'West Bengal',
        hazard: 'Lightning Activity',
        risk: 'moderate',
        districts: '5 districts',
      },

      {
        rank: 3,
        region: 'Meghalaya',
        hazard: 'Heavy Rainfall',
        risk: 'high',
        districts: '4 districts',
      },

      {
        rank: 4,
        region: 'Odisha',
        hazard: 'Coastal Weather Risk',
        risk: 'moderate',
        districts: '3 districts',
      },

    ],
    []
  );


  const timelineData = [

    {
      label: 'Now',
      risk: 'moderate' as RiskLevel,
    },

    {
      label: '+3h',
      risk: 'high' as RiskLevel,
    },

    {
      label: '+6h',
      risk: 'high' as RiskLevel,
    },

    {
      label: '+12h',
      risk: 'moderate' as RiskLevel,
    },

    {
      label: '+24h',
      risk: 'low' as RiskLevel,
    },

  ];


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <>

      {/* =====================================================
          RESPONSIVE + PAGE CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           BASE
        ===================================================== */

        .disaster-monitoring-wrapper {
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
           MAIN CONTENT
        ===================================================== */

        .disaster-monitoring-content {
          flex: 1;

          min-width: 0;
          min-height: 0;

          width: 100%;
          height: 100vh;

          padding:
            0
            32px
            32px;

          overflow-y: auto;
          overflow-x: hidden;

          scroll-behavior: smooth;
        }


        /* =====================================================
           SCROLLBAR
        ===================================================== */

        .disaster-monitoring-content::-webkit-scrollbar {
          width: 6px;
        }


        .disaster-monitoring-content::-webkit-scrollbar-track {
          background:
            rgba(255, 255, 255, 0.03);
        }


        .disaster-monitoring-content::-webkit-scrollbar-thumb {
          border-radius: 20px;

          background:
            rgba(148, 163, 184, 0.28);
        }


        /* =====================================================
           STICKY HEADER
        ===================================================== */

        .disaster-monitoring-header {
          position: sticky;

          top: 0;

          z-index: 1000;

          width: 100%;

          padding:
            12px
            0;
        }


        /* =====================================================
           PAGE
        ===================================================== */

        .disaster-page {
          width: 100%;

          max-width: 1600px;

          margin:
            0
            auto;

          padding-top: 8px;
          padding-bottom: 24px;
        }


        /* =====================================================
           GLASS CARD
        ===================================================== */

        .disaster-glass-card {
          position: relative;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.11),
              rgba(255, 255, 255, 0.035)
            );

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          border:
            1px solid
            rgba(255, 255, 255, 0.14);

          box-shadow:
            0 12px 35px
            rgba(0, 0, 0, 0.14);

          overflow: hidden;
        }


        /* =====================================================
           SECTION HEADER
        ===================================================== */

        .section-heading {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 14px;

          margin-bottom: 16px;
        }


        .section-heading-left {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .section-title {
          margin: 0;

          font-size: 15px;

          font-weight: 650;

          letter-spacing: -0.2px;

          color:
            #f8fafc;
        }


        .section-subtitle {
          margin:
            4px
            0
            0;

          font-size: 10px;

          color:
            rgba(148, 163, 184, 0.92);
        }


        /* =====================================================
           OVERVIEW
        ===================================================== */

        .risk-overview {
          display: grid;

          grid-template-columns:
            minmax(0, 1.1fr)
            minmax(0, 1.4fr);

          gap: 18px;

          padding: 22px;

          margin-bottom: 20px;
        }


        .risk-main {
          display: flex;

          align-items: center;

          gap: 16px;
        }


        .risk-shield {
          width: 58px;
          height: 58px;

          min-width: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 18px;

          background:
            rgba(52, 211, 153, 0.13);

          border:
            1px solid
            rgba(52, 211, 153, 0.20);

          color:
            #34d399;

          box-shadow:
            0 0 25px
            rgba(52, 211, 153, 0.08);
        }


        .risk-eyebrow {
          font-size: 10px;

          font-weight: 600;

          text-transform: uppercase;

          letter-spacing: 1px;

          color:
            rgba(148, 163, 184, 0.90);
        }


        .risk-status {
          margin-top: 4px;

          font-size: 25px;

          font-weight: 750;

          letter-spacing: 1px;

          color:
            #34d399;
        }


        .risk-description {
          margin-top: 5px;

          font-size: 10px;

          line-height: 1.5;

          color:
            rgba(203, 213, 225, 0.72);
        }


        .risk-metrics {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;
        }


        .risk-metric {
          min-width: 0;

          padding:
            14px
            12px;

          border-radius: 15px;

          background:
            rgba(255, 255, 255, 0.045);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);
        }


        .metric-value {
          font-size: 18px;

          font-weight: 700;

          color:
            #ffffff;
        }


        .metric-label {
          margin-top: 5px;

          font-size: 9px;

          line-height: 1.4;

          color:
            rgba(148, 163, 184, 0.92);
        }


        /* =====================================================
           MAP + EVENTS
        ===================================================== */

        .map-events-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(320px, 0.85fr);

          gap: 20px;

          margin-bottom: 20px;
        }


        .map-card {
          padding: 20px;
        }


        .map-toolbar {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 14px;

          margin-bottom: 16px;
        }


        .map-title-area {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .map-icon {
          width: 34px;
          height: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background:
            rgba(56, 189, 248, 0.10);

          border:
            1px solid
            rgba(56, 189, 248, 0.16);

          color:
            #38bdf8;
        }


        .map-title {
          margin: 0;

          font-size: 15px;

          font-weight: 650;

          color:
            #f8fafc;
        }


        .map-subtitle {
          margin:
            3px
            0
            0;

          font-size: 10px;

          color:
            rgba(148, 163, 184, 0.9);
        }


        .map-layers {
          display: flex;

          align-items: center;

          gap: 5px;

          flex-wrap: wrap;

          justify-content: flex-end;
        }


        .layer-button {
          padding:
            7px
            10px;

          border-radius: 9px;

          border:
            1px solid
            rgba(255, 255, 255, 0.08);

          background:
            rgba(255, 255, 255, 0.035);

          color:
            rgba(203, 213, 225, 0.70);

          font-size: 9px;

          cursor: pointer;

          transition:
            0.2s ease;
        }


        .layer-button:hover {
          background:
            rgba(255, 255, 255, 0.08);

          color:
            #ffffff;
        }


        .layer-button.active {
          background:
            rgba(56, 189, 248, 0.14);

          border-color:
            rgba(56, 189, 248, 0.28);

          color:
            #7dd3fc;
        }


        /* =====================================================
           MAP VISUAL
        ===================================================== */

        .india-map-visual {
          position: relative;

          width: 100%;

          height: 390px;

          border-radius: 18px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(56, 189, 248, 0.12),
              transparent 35%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.06),
              rgba(255, 255, 255, 0.018)
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.08);
        }


        .map-grid-lines {
          position: absolute;

          inset: 0;

          opacity: 0.22;

          background-image:
            linear-gradient(
              rgba(148, 163, 184, 0.10)
              1px,
              transparent
              1px
            ),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.10)
              1px,
              transparent
              1px
            );

          background-size:
            38px
            38px;
        }


        .india-map-shape {
          position: absolute;

          top: 50%;
          left: 50%;

          width: 42%;
          height: 70%;

          transform:
            translate(-50%, -50%);

          clip-path:
            polygon(
              44% 0%,
              59% 8%,
              67% 21%,
              62% 31%,
              72% 41%,
              67% 52%,
              76% 65%,
              63% 76%,
              56% 100%,
              45% 89%,
              41% 72%,
              30% 63%,
              35% 51%,
              24% 41%,
              32% 28%,
              29% 15%
            );

          background:
            linear-gradient(
              145deg,
              rgba(56, 189, 248, 0.18),
              rgba(14, 116, 144, 0.10)
            );

          filter:
            drop-shadow(
              0 0 25px
              rgba(56, 189, 248, 0.10)
            );
        }


        .map-watermark {
          position: absolute;

          left: 50%;
          bottom: 20px;

          transform:
            translateX(-50%);

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 4px;

          color:
            rgba(148, 163, 184, 0.22);
        }


        .map-event-dot {
          position: absolute;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          cursor: pointer;

          animation:
            disasterMapPulse
            2.8s
            ease-in-out
            infinite;
        }


        .map-event-dot::after {
          content: '';

          position: absolute;

          inset: -6px;

          border-radius: 50%;

          border:
            1px solid
            currentColor;

          opacity: 0.35;
        }


        .dot-flood {
          top: 32%;
          left: 49%;

          background:
            #fb923c;

          color:
            #fb923c;

          box-shadow:
            0 0 16px
            rgba(251, 146, 60, 0.65);
        }


        .dot-lightning {
          top: 42%;
          left: 58%;

          background:
            #facc15;

          color:
            #facc15;

          box-shadow:
            0 0 16px
            rgba(250, 204, 21, 0.60);

          animation-delay:
            0.5s;
        }


        .dot-rain {
          top: 25%;
          left: 54%;

          background:
            #60a5fa;

          color:
            #60a5fa;

          box-shadow:
            0 0 16px
            rgba(96, 165, 250, 0.65);

          animation-delay:
            1s;
        }


        .map-legend {
          position: absolute;

          left: 14px;
          bottom: 14px;

          display: flex;

          flex-direction: column;

          gap: 6px;

          padding:
            10px
            12px;

          border-radius: 12px;

          background:
            rgba(4, 18, 36, 0.50);

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            rgba(255, 255, 255, 0.08);
        }


        .legend-item {
          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 8px;

          color:
            rgba(203, 213, 225, 0.78);
        }


        .legend-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;
        }


        .map-location-button {
          position: absolute;

          top: 14px;
          right: 14px;

          width: 36px;
          height: 36px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          border:
            1px solid
            rgba(255, 255, 255, 0.10);

          background:
            rgba(4, 18, 36, 0.45);

          color:
            #7dd3fc;

          cursor: pointer;
        }


        /* =====================================================
           EVENTS PANEL
        ===================================================== */

        .events-card {
          padding: 20px;
        }


        .events-list {
          display: flex;

          flex-direction: column;

          gap: 10px;
        }


        .event-item {
          padding:
            14px;

          border-radius: 16px;

          background:
            rgba(255, 255, 255, 0.04);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          transition:
            transform
            0.25s ease,
            background
            0.25s ease;
        }


        .event-item:hover {
          transform:
            translateY(-2px);

          background:
            rgba(255, 255, 255, 0.065);
        }


        .event-top {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 10px;
        }


        .event-main {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          min-width: 0;
        }


        .event-icon {
          width: 34px;
          height: 34px;

          min-width: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;
        }


        .event-type {
          font-size: 11px;

          font-weight: 650;

          color:
            #f8fafc;
        }


        .event-location {
          margin-top: 3px;

          font-size: 9px;

          color:
            rgba(148, 163, 184, 0.9);
        }


        .risk-pill {
          display: inline-flex;

          align-items: center;

          padding:
            5px
            8px;

          border-radius: 999px;

          font-size: 8px;

          font-weight: 650;

          white-space: nowrap;
        }


        .event-description {
          margin:
            11px
            0
            0;

          font-size: 9px;

          line-height: 1.55;

          color:
            rgba(203, 213, 225, 0.70);
        }


        .event-footer {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 10px;

          margin-top: 11px;

          padding-top: 10px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.06);
        }


        .event-meta {
          font-size: 8px;

          color:
            rgba(148, 163, 184, 0.78);
        }


        .event-link {
          display: flex;

          align-items: center;

          gap: 4px;

          border: none;

          background: transparent;

          color:
            #7dd3fc;

          font-size: 8px;

          cursor: pointer;
        }


        /* =====================================================
           CATEGORY MONITORING
        ===================================================== */

        .categories-section {
          margin-bottom: 20px;
        }


        .category-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 14px;
        }


        .category-card {
          padding: 18px;

          min-height: 205px;

          transition:
            transform
            0.25s ease,
            border-color
            0.25s ease;
        }


        .category-card:hover {
          transform:
            translateY(-3px);

          border-color:
            rgba(255, 255, 255, 0.22);
        }


        .category-top {
          display: flex;

          align-items: flex-start;
          justify-content: space-between;

          gap: 10px;
        }


        .category-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;
        }


        .category-risk-dot {
          width: 8px;
          height: 8px;

          margin-top: 4px;

          border-radius: 50%;
        }


        .category-title {
          margin-top: 14px;

          font-size: 13px;

          font-weight: 650;

          color:
            #ffffff;
        }


        .category-subtitle {
          margin-top: 4px;

          font-size: 9px;

          color:
            rgba(148, 163, 184, 0.85);
        }


        .category-status {
          margin-top: 13px;

          font-size: 10px;

          font-weight: 600;

          color:
            rgba(226, 232, 240, 0.88);
        }


        .category-details {
          margin-top: 12px;

          padding-top: 11px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.07);
        }


        .category-detail {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-top: 6px;

          font-size: 8px;

          color:
            rgba(148, 163, 184, 0.82);
        }


        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline-card {
          padding: 20px;

          margin-bottom: 20px;
        }


        .timeline-row {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 12px;

          margin-top: 18px;
        }


        .timeline-item {
          position: relative;

          min-height: 90px;

          padding:
            13px;

          border-radius: 14px;

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          background:
            rgba(255, 255, 255, 0.035);

          color: #ffffff;

          cursor: pointer;

          transition:
            transform
            0.22s ease,
            background
            0.22s ease;
        }


        .timeline-item:hover,
        .timeline-item.active {
          transform:
            translateY(-2px);

          background:
            rgba(255, 255, 255, 0.065);
        }


        .timeline-label {
          font-size: 10px;

          font-weight: 650;

          color:
            #e2e8f0;
        }


        .timeline-risk {
          margin-top: 14px;

          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 9px;

          color:
            rgba(203, 213, 225, 0.78);
        }


        .timeline-risk-dot {
          width: 9px;
          height: 9px;

          border-radius: 50%;
        }


        /* =====================================================
           BOTTOM GRID
        ===================================================== */

        .intelligence-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.1fr)
            minmax(300px, 0.9fr);

          gap: 20px;

          margin-bottom: 20px;
        }


        /* =====================================================
           AI INSIGHT
        ===================================================== */

        .ai-insight-card {
          padding: 21px;
        }


        .ai-header {
          display: flex;

          align-items: center;

          gap: 11px;
        }


        .ai-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              rgba(167, 139, 250, 0.20),
              rgba(56, 189, 248, 0.12)
            );

          border:
            1px solid
            rgba(167, 139, 250, 0.20);

          color:
            #c4b5fd;
        }


        .ai-title {
          font-size: 14px;

          font-weight: 650;

          color:
            #ffffff;
        }


        .ai-status {
          margin-top: 3px;

          font-size: 9px;

          color:
            rgba(167, 139, 250, 0.85);
        }


        .ai-analysis {
          margin-top: 18px;

          padding:
            15px;

          border-radius: 15px;

          background:
            rgba(255, 255, 255, 0.045);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          font-size: 11px;

          line-height: 1.75;

          color:
            rgba(226, 232, 240, 0.83);
        }


        .ai-factors {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 9px;

          margin-top: 14px;
        }


        .ai-factor {
          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            10px;

          border-radius: 11px;

          background:
            rgba(255, 255, 255, 0.035);

          font-size: 9px;

          color:
            rgba(203, 213, 225, 0.75);
        }


        .ask-ai-button {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          margin-top: 16px;

          padding:
            9px
            12px;

          border-radius: 10px;

          border:
            1px solid
            rgba(167, 139, 250, 0.22);

          background:
            rgba(167, 139, 250, 0.10);

          color:
            #ddd6fe;

          font-size: 9px;

          font-weight: 600;

          cursor: pointer;
        }


        /* =====================================================
           AFFECTED REGIONS
        ===================================================== */

        .regions-card {
          padding: 20px;
        }


        .region-list {
          display: flex;

          flex-direction: column;

          gap: 8px;
        }


        .region-item {
          display: flex;

          align-items: center;

          gap: 11px;

          padding:
            11px
            9px;

          border-radius: 13px;

          transition:
            background
            0.2s ease;
        }


        .region-item:hover {
          background:
            rgba(255, 255, 255, 0.04);
        }


        .region-rank {
          width: 25px;
          height: 25px;

          min-width: 25px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(255, 255, 255, 0.06);

          color:
            rgba(148, 163, 184, 0.85);

          font-size: 9px;

          font-weight: 700;
        }


        .region-main {
          flex: 1;

          min-width: 0;
        }


        .region-name {
          font-size: 10px;

          font-weight: 650;

          color:
            #f8fafc;
        }


        .region-hazard {
          margin-top: 3px;

          font-size: 8px;

          color:
            rgba(148, 163, 184, 0.85);
        }


        .region-right {
          text-align: right;
        }


        .region-districts {
          margin-top: 4px;

          font-size: 8px;

          color:
            rgba(148, 163, 184, 0.75);
        }


        /* =====================================================
           SAFETY ACTIONS
        ===================================================== */

        .safety-card {
          padding: 20px;

          margin-bottom: 24px;
        }


        .safety-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 12px;

          margin-top: 16px;
        }


        .safety-item {
          padding:
            15px;

          border-radius: 15px;

          background:
            rgba(255, 255, 255, 0.04);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          cursor: pointer;

          transition:
            transform
            0.22s ease,
            background
            0.22s ease;
        }


        .safety-item:hover {
          transform:
            translateY(-2px);

          background:
            rgba(255, 255, 255, 0.065);
        }


        .safety-icon {
          width: 34px;
          height: 34px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background:
            rgba(251, 146, 60, 0.10);

          color:
            #fb923c;
        }


        .safety-title {
          margin-top: 11px;

          font-size: 10px;

          font-weight: 650;

          color:
            #f8fafc;
        }


        .safety-description {
          margin-top: 5px;

          font-size: 8px;

          line-height: 1.55;

          color:
            rgba(148, 163, 184, 0.82);
        }


        .safety-link {
          display: flex;

          align-items: center;

          gap: 4px;

          margin-top: 10px;

          color:
            #7dd3fc;

          font-size: 8px;
        }


        /* =====================================================
           ANIMATIONS
        ===================================================== */

        @keyframes disasterMapPulse {

          0%,
          100% {
            transform:
              scale(1);

            opacity:
              0.9;
          }

          50% {
            transform:
              scale(1.18);

            opacity:
              1;
          }

        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1250px) {

          .category-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .risk-metrics {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1023px) {

          .disaster-monitoring-wrapper > :first-child {
            display: none !important;
          }


          .disaster-monitoring-content {
            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              30px;
          }


          .disaster-monitoring-header {
            padding:
              10px
              0;
          }


          .map-events-grid,
          .intelligence-grid {
            grid-template-columns:
              1fr;
          }


          .risk-overview {
            grid-template-columns:
              1fr;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 767px) {

          .disaster-monitoring-wrapper > :first-child {
            display: none !important;

            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
          }


          .disaster-monitoring-content {
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


          .disaster-monitoring-header {
            width: 100%;

            padding:
              8px
              0;

            overflow: visible;
          }


          .disaster-page {
            padding-top: 6px;
          }


          .map-toolbar {
            flex-direction: column;

            align-items: flex-start;
          }


          .map-layers {
            justify-content: flex-start;
          }


          .india-map-visual {
            height: 320px;
          }


          .timeline-row {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .safety-grid {
            grid-template-columns:
              1fr;
          }


          .ai-factors {
            grid-template-columns:
              1fr;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 479px) {

          .disaster-monitoring-content {
            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;
          }


          .disaster-monitoring-header {
            padding:
              6px
              0;
          }


          .risk-main {
            align-items: flex-start;
          }


          .risk-metrics {
            grid-template-columns:
              1fr
              1fr;
          }


          .category-grid {
            grid-template-columns:
              1fr;
          }


          .timeline-row {
            grid-template-columns:
              1fr
              1fr;
          }


          .map-layers {
            gap: 4px;
          }


          .layer-button {
            padding:
              6px
              8px;
          }

        }


        /* =====================================================
           VERY SMALL PHONE
        ===================================================== */

        @media (max-width: 359px) {

          .disaster-monitoring-content {
            padding-left: 6px;
            padding-right: 6px;
          }


          .risk-overview,
          .map-card,
          .events-card,
          .timeline-card,
          .ai-insight-card,
          .regions-card,
          .safety-card {
            padding: 15px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;

            scroll-behavior:
              auto !important;

          }

        }

      `}</style>


      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="disaster-monitoring-wrapper">


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="disaster-monitoring-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="disaster-monitoring-header">
            <Header />
          </div>


          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="disaster-page">


            {/* ===============================================
                OVERALL RISK OVERVIEW
            =============================================== */}

            <section
              className="
                disaster-glass-card
                risk-overview
              "
            >

              <div className="risk-main">

                <div className="risk-shield">

                  <ShieldCheck size={28} />

                </div>


                <div>

                  <div className="risk-eyebrow">
                    Current National Risk Level
                  </div>


                  <div className="risk-status">
                    LOW
                  </div>


                  <div className="risk-description">
                    No widespread severe weather disaster
                    currently detected. Localized events
                    remain under continuous monitoring.
                  </div>

                </div>

              </div>


              <div className="risk-metrics">

                <div className="risk-metric">

                  <div className="metric-value">
                    3
                  </div>

                  <div className="metric-label">
                    Active Events
                  </div>

                </div>


                <div className="risk-metric">

                  <div className="metric-value">
                    2
                  </div>

                  <div className="metric-label">
                    High Risk Areas
                  </div>

                </div>


                <div className="risk-metric">

                  <div className="metric-value">
                    700+
                  </div>

                  <div className="metric-label">
                    Districts Monitored
                  </div>

                </div>


                <div className="risk-metric">

                  <div className="metric-value">
                    Live
                  </div>

                  <div className="metric-label">
                    Monitoring Status
                  </div>

                </div>

              </div>

            </section>


            {/* ===============================================
                MAP + ACTIVE EVENTS
            =============================================== */}

            <section className="map-events-grid">


              {/* MAP */}

              <div
                className="
                  disaster-glass-card
                  map-card
                "
              >

                <div className="map-toolbar">

                  <div className="map-title-area">

                    <div className="map-icon">

                      <Map size={18} />

                    </div>


                    <div>

                      <h2 className="map-title">
                        Disaster Risk Map
                      </h2>

                      <p className="map-subtitle">
                        Live overview of monitored
                        weather hazards
                      </p>

                    </div>

                  </div>


                  <div className="map-layers">

                    {[
                      'All',
                      'Cyclone',
                      'Flood',
                      'Heatwave',
                      'Lightning',
                    ].map(
                      (layer) => (

                        <button
                          key={layer}
                          type="button"
                          className={
                            activeLayer === layer
                              ? 'layer-button active'
                              : 'layer-button'
                          }
                          onClick={() => {
                            setActiveLayer(layer);
                          }}
                        >

                          {layer}

                        </button>

                      )
                    )}

                  </div>

                </div>


                <div className="india-map-visual">

                  <div className="map-grid-lines" />

                  <div className="india-map-shape" />


                  <div
                    className="
                      map-event-dot
                      dot-flood
                    "
                    title="High Flood Risk"
                  />


                  <div
                    className="
                      map-event-dot
                      dot-lightning
                    "
                    title="Lightning Activity"
                  />


                  <div
                    className="
                      map-event-dot
                      dot-rain
                    "
                    title="Heavy Rainfall"
                  />


                  <button
                    type="button"
                    className="map-location-button"
                    aria-label="Center on location"
                  >

                    <Crosshair size={16} />

                  </button>


                  <div className="map-legend">

                    <div className="legend-item">

                      <span
                        className="legend-dot"
                        style={{
                          background: '#34d399',
                        }}
                      />

                      Low Risk

                    </div>


                    <div className="legend-item">

                      <span
                        className="legend-dot"
                        style={{
                          background: '#facc15',
                        }}
                      />

                      Moderate

                    </div>


                    <div className="legend-item">

                      <span
                        className="legend-dot"
                        style={{
                          background: '#fb923c',
                        }}
                      />

                      High Risk

                    </div>


                    <div className="legend-item">

                      <span
                        className="legend-dot"
                        style={{
                          background: '#f87171',
                        }}
                      />

                      Severe

                    </div>

                  </div>


                  <div className="map-watermark">
                    INDIA
                  </div>

                </div>

              </div>


              {/* ACTIVE EVENTS */}

              <div
                className="
                  disaster-glass-card
                  events-card
                "
              >

                <div className="section-heading">

                  <div className="section-heading-left">

                    <CircleAlert
                      size={17}
                      color="#fb923c"
                    />

                    <div>

                      <h2 className="section-title">
                        Active Events
                      </h2>

                      <p className="section-subtitle">
                        Hazards requiring attention
                      </p>

                    </div>

                  </div>

                </div>


                <div className="events-list">

                  {disasterEvents.map(
                    (event) => (

                      <div
                        key={event.id}
                        className="event-item"
                      >

                        <div className="event-top">

                          <div className="event-main">

                            <div
                              className="event-icon"
                              style={{
                                background:
                                  event.background,

                                border:
                                  `1px solid ${event.border}`,

                                color:
                                  event.color,
                              }}
                            >

                              {event.icon}

                            </div>


                            <div>

                              <div className="event-type">
                                {event.type}
                              </div>


                              <div className="event-location">

                                <Navigation
                                  size={8}
                                  style={{
                                    marginRight: 3,
                                    verticalAlign:
                                      'middle',
                                  }}
                                />

                                {event.location}

                              </div>

                            </div>

                          </div>


                          <div
                            className="risk-pill"
                            style={{
                              color:
                                getRiskColor(
                                  event.level
                                ),

                              background:
                                getRiskBackground(
                                  event.level
                                ),

                              border:
                                `1px solid ${getRiskColor(
                                  event.level
                                )}33`,
                            }}
                          >

                            {getRiskLabel(
                              event.level
                            )}

                          </div>

                        </div>


                        <p className="event-description">
                          {event.description}
                        </p>


                        <div className="event-footer">

                          <div className="event-meta">

                            {event.districts}

                            {' · '}

                            {event.time}

                          </div>


                          <button
                            type="button"
                            className="event-link"
                          >

                            Details

                            <ChevronRight
                              size={11}
                            />

                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* ===============================================
                CATEGORY MONITORING
            =============================================== */}

            <section className="categories-section">

              <div className="section-heading">

                <div className="section-heading-left">

                  <ShieldAlert
                    size={18}
                    color="#7dd3fc"
                  />

                  <div>

                    <h2 className="section-title">
                      Hazard Monitoring
                    </h2>

                    <p className="section-subtitle">
                      Continuous tracking across major
                      weather-related disaster categories
                    </p>

                  </div>

                </div>

              </div>


              <div className="category-grid">

                {categoryData.map(
                  (category) => (

                    <div
                      key={category.id}
                      className="
                        disaster-glass-card
                        category-card
                      "
                    >

                      <div className="category-top">

                        <div
                          className="category-icon"
                          style={{
                            background:
                              category.background,

                            border:
                              `1px solid ${category.border}`,

                            color:
                              category.color,
                          }}
                        >

                          {category.icon}

                        </div>


                        <div
                          className="category-risk-dot"
                          style={{
                            background:
                              getRiskColor(
                                category.risk
                              ),

                            boxShadow:
                              `0 0 12px ${getRiskColor(
                                category.risk
                              )}66`,
                          }}
                        />

                      </div>


                      <div className="category-title">
                        {category.title}
                      </div>


                      <div className="category-subtitle">
                        {category.subtitle}
                      </div>


                      <div className="category-status">
                        {category.status}
                      </div>


                      <div className="category-details">

                        {category.details.map(
                          (detail, index) => (

                            <div
                              key={index}
                              className="category-detail"
                            >

                              <span
                                style={{
                                  width: 4,
                                  height: 4,

                                  borderRadius:
                                    '50%',

                                  background:
                                    category.color,

                                  flexShrink: 0,
                                }}
                              />

                              {detail}

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>


            {/* ===============================================
                RISK FORECAST TIMELINE
            =============================================== */}

            <section
              className="
                disaster-glass-card
                timeline-card
              "
            >

              <div className="section-heading">

                <div className="section-heading-left">

                  <AlertTriangle
                    size={17}
                    color="#fb923c"
                  />

                  <div>

                    <h2 className="section-title">
                      Risk Forecast Timeline
                    </h2>

                    <p className="section-subtitle">
                      Expected development of monitored
                      disaster risk over the next 24 hours
                    </p>

                  </div>

                </div>

              </div>


              <div className="timeline-row">

                {timelineData.map(
                  (item) => (

                    <button
                      key={item.label}
                      type="button"
                      className={
                        selectedTimeline ===
                        item.label
                          ? 'timeline-item active'
                          : 'timeline-item'
                      }
                      onClick={() => {
                        setSelectedTimeline(
                          item.label
                        );
                      }}
                    >

                      <div className="timeline-label">
                        {item.label}
                      </div>


                      <div className="timeline-risk">

                        <span
                          className="
                            timeline-risk-dot
                          "
                          style={{
                            background:
                              getRiskColor(
                                item.risk
                              ),

                            boxShadow:
                              `0 0 12px ${getRiskColor(
                                item.risk
                              )}66`,
                          }}
                        />


                        {getRiskLabel(
                          item.risk
                        )}

                        {' Risk'}

                      </div>

                    </button>

                  )
                )}

              </div>

            </section>


            {/* ===============================================
                AI INSIGHT + REGIONS
            =============================================== */}

            <section className="intelligence-grid">


              {/* AI INSIGHT */}

              <div
                className="
                  disaster-glass-card
                  ai-insight-card
                "
              >

                <div className="ai-header">

                  <div className="ai-icon">

                    <Bot size={20} />

                  </div>


                  <div>

                    <div className="ai-title">
                      MeghAI Disaster Analysis
                    </div>


                    <div className="ai-status">
                      AI-generated situational assessment
                    </div>

                  </div>

                </div>


                <div className="ai-analysis">

                  Atmospheric conditions indicate an
                  increased probability of persistent
                  heavy rainfall across parts of
                  eastern India. River basins and
                  low-lying regions should remain
                  under close observation during
                  the next 6–12 hours.

                </div>


                <div className="ai-factors">

                  <div className="ai-factor">

                    <CloudRain
                      size={13}
                      color="#60a5fa"
                    />

                    High moisture availability

                  </div>


                  <div className="ai-factor">

                    <Waves
                      size={13}
                      color="#38bdf8"
                    />

                    River level trend monitored

                  </div>


                  <div className="ai-factor">

                    <Flame
                      size={13}
                      color="#fb923c"
                    />

                    Localized risk escalation

                  </div>


                  <div className="ai-factor">

                    <AlertTriangle
                      size={13}
                      color="#facc15"
                    />

                    Vulnerable low-lying areas

                  </div>

                </div>


                <button
                  type="button"
                  className="ask-ai-button"
                >

                  Ask MeghAI about this

                  <ArrowRight size={12} />

                </button>

              </div>


              {/* AFFECTED REGIONS */}

              <div
                className="
                  disaster-glass-card
                  regions-card
                "
              >

                <div className="section-heading">

                  <div className="section-heading-left">

                    <Navigation
                      size={17}
                      color="#38bdf8"
                    />

                    <div>

                      <h2 className="section-title">
                        Most Affected Regions
                      </h2>

                      <p className="section-subtitle">
                        Ranked by current monitored risk
                      </p>

                    </div>

                  </div>

                </div>


                <div className="region-list">

                  {affectedRegions.map(
                    (region) => (

                      <div
                        key={region.rank}
                        className="region-item"
                      >

                        <div className="region-rank">

                          {String(
                            region.rank
                          ).padStart(
                            2,
                            '0'
                          )}

                        </div>


                        <div className="region-main">

                          <div className="region-name">
                            {region.region}
                          </div>


                          <div className="region-hazard">
                            {region.hazard}
                          </div>

                        </div>


                        <div className="region-right">

                          <div
                            className="risk-pill"
                            style={{
                              color:
                                getRiskColor(
                                  region.risk
                                ),

                              background:
                                getRiskBackground(
                                  region.risk
                                ),
                            }}
                          >

                            {getRiskLabel(
                              region.risk
                            )}

                          </div>


                          <div className="region-districts">
                            {region.districts}
                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* ===============================================
                SAFETY ACTIONS
            =============================================== */}

            <section
              className="
                disaster-glass-card
                safety-card
              "
            >

              <div className="section-heading">

                <div className="section-heading-left">

                  <ShieldCheck
                    size={18}
                    color="#34d399"
                  />

                  <div>

                    <h2 className="section-title">
                      Recommended Safety Actions
                    </h2>

                    <p className="section-subtitle">
                      Preparedness guidance based on
                      currently monitored hazards
                    </p>

                  </div>

                </div>

              </div>


              <div className="safety-grid">


                <div className="safety-item">

                  <div className="safety-icon">

                    <Waves size={17} />

                  </div>


                  <div className="safety-title">
                    Flood Safety
                  </div>


                  <div className="safety-description">

                    Avoid flooded roads and monitor
                    official evacuation guidance.

                  </div>


                  <div className="safety-link">

                    View Guide

                    <ArrowRight size={10} />

                  </div>

                </div>


                <div className="safety-item">

                  <div className="safety-icon">

                    <Zap size={17} />

                  </div>


                  <div className="safety-title">
                    Lightning Safety
                  </div>


                  <div className="safety-description">

                    Stay indoors and avoid open areas
                    during active thunderstorms.

                  </div>


                  <div className="safety-link">

                    View Guide

                    <ArrowRight size={10} />

                  </div>

                </div>


                <div className="safety-item">

                  <div className="safety-icon">

                    <CircleAlert size={17} />

                  </div>


                  <div className="safety-title">
                    Emergency Preparedness
                  </div>


                  <div className="safety-description">

                    Keep essential supplies ready and
                    follow official emergency alerts.

                  </div>


                  <div className="safety-link">

                    Emergency Guide

                    <ArrowRight size={10} />

                  </div>

                </div>

              </div>

            </section>


          </main>


        </div>

      </div>

    </>
  );

};


export default DisasterMonitoring;
