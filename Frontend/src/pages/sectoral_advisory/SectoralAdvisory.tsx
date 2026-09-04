import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Sprout,
  Plane,
  Waves,
  Building2,
  Clock3,
  CloudRain,
  Wind,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  CircleAlert,
  Droplets,
  Eye,
  Navigation,
  CloudLightning,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';


/* =========================================================
   TYPES
========================================================= */

type Sector =
  | 'Agriculture'
  | 'Aviation'
  | 'Marine'
  | 'Urban';

type Priority =
  | 'critical'
  | 'recommended'
  | 'favorable';

type RiskLevel =
  | 'High'
  | 'Moderate'
  | 'Low';


/* =========================================================
   SECTOR CONFIGURATION
========================================================= */

const sectorConfig: Record<
  Sector,
  {
    icon: React.ElementType;
    color: string;
    softColor: string;
    borderColor: string;
    shadowColor: string;
    overview: string;
    risk: RiskLevel;
    primaryFactor: string;
    affectedPeriod: string;
    confidence: string;
    weatherSummary: string;
  }
> = {
  Agriculture: {
    icon: Sprout,
    color: '#34d399',
    softColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    shadowColor: 'rgba(16, 185, 129, 0.12)',
    overview:
      'Rainfall expected over the next 24–48 hours may improve soil moisture but could increase waterlogging risk in low-lying agricultural areas.',
    risk: 'Moderate',
    primaryFactor: 'Rainfall',
    affectedPeriod: 'Next 48 hours',
    confidence: 'High',
    weatherSummary:
      'Rainfall remains the dominant weather factor for agricultural activities.',
  },

  Aviation: {
    icon: Plane,
    color: '#38bdf8',
    softColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    shadowColor: 'rgba(56, 189, 248, 0.12)',
    overview:
      'Thunderstorm activity and reduced visibility may affect flight operations during the next 24 hours.',
    risk: 'Moderate',
    primaryFactor: 'Thunderstorms',
    affectedPeriod: 'Next 24 hours',
    confidence: 'High',
    weatherSummary:
      'Visibility and thunderstorm activity may influence aviation operations.',
  },

  Marine: {
    icon: Waves,
    color: '#60a5fa',
    softColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    shadowColor: 'rgba(59, 130, 246, 0.12)',
    overview:
      'Moderate sea conditions are expected, with occasional wind intensification near coastal waters.',
    risk: 'Moderate',
    primaryFactor: 'Wind & Sea Conditions',
    affectedPeriod: 'Next 48 hours',
    confidence: 'Moderate',
    weatherSummary:
      'Changing wind conditions may increase risks for small marine operations.',
  },

  Urban: {
    icon: Building2,
    color: '#fbbf24',
    softColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    shadowColor: 'rgba(245, 158, 11, 0.12)',
    overview:
      'Persistent rainfall may increase waterlogging and traffic disruption risks in low-lying urban areas.',
    risk: 'Moderate',
    primaryFactor: 'Heavy Rainfall',
    affectedPeriod: 'Next 24–48 hours',
    confidence: 'High',
    weatherSummary:
      'Urban infrastructure and transportation may be affected by persistent rainfall.',
  },
};


/* =========================================================
   ACTION RECOMMENDATIONS
========================================================= */

const sectorActions: Record<
  Sector,
  {
    priority: Priority;
    title: string;
    description: string;
  }[]
> = {
  Agriculture: [
    {
      priority: 'critical',
      title: 'Avoid harvesting during heavy rainfall',
      description:
        'Wet conditions may affect crop quality and make field operations difficult.',
    },
    {
      priority: 'recommended',
      title: 'Check drainage in low-lying fields',
      description:
        'Ensure excess water can drain properly to reduce waterlogging risks.',
    },
    {
      priority: 'recommended',
      title: 'Postpone pesticide application',
      description:
        'Rainfall may reduce treatment effectiveness and increase chemical runoff.',
    },
    {
      priority: 'favorable',
      title: 'Monitor soil moisture levels',
      description:
        'Improved moisture conditions may benefit water-dependent crops.',
    },
  ],

  Aviation: [
    {
      priority: 'critical',
      title: 'Monitor thunderstorm activity closely',
      description:
        'Convective weather may create temporary operational restrictions.',
    },
    {
      priority: 'recommended',
      title: 'Prepare for reduced visibility',
      description:
        'Rainfall and cloud cover may affect approach and departure operations.',
    },
    {
      priority: 'recommended',
      title: 'Review wind conditions',
      description:
        'Occasional wind gusts may influence runway and ground operations.',
    },
    {
      priority: 'favorable',
      title: 'Use improved weather windows',
      description:
        'Operational conditions may improve between rainfall periods.',
    },
  ],

  Marine: [
    {
      priority: 'critical',
      title: 'Avoid unnecessary offshore activity',
      description:
        'Changing wind and sea conditions may affect smaller vessels.',
    },
    {
      priority: 'recommended',
      title: 'Monitor coastal wind forecasts',
      description:
        'Wind intensity may change rapidly near coastal regions.',
    },
    {
      priority: 'recommended',
      title: 'Check vessel safety equipment',
      description:
        'Ensure communication and safety equipment are fully operational.',
    },
    {
      priority: 'favorable',
      title: 'Use calmer weather windows',
      description:
        'Plan essential marine activities during periods of improved conditions.',
    },
  ],

  Urban: [
    {
      priority: 'critical',
      title: 'Avoid severely waterlogged roads',
      description:
        'Flooded streets may become unsafe and disrupt normal transportation.',
    },
    {
      priority: 'recommended',
      title: 'Monitor drainage-prone areas',
      description:
        'Low-lying locations may experience faster water accumulation.',
    },
    {
      priority: 'recommended',
      title: 'Allow extra travel time',
      description:
        'Rainfall may lead to traffic congestion and slower road conditions.',
    },
    {
      priority: 'favorable',
      title: 'Use public weather updates',
      description:
        'Conditions can improve quickly after rainfall intensity decreases.',
    },
  ],
};


/* =========================================================
   IMPACT METRICS
========================================================= */

const sectorImpacts: Record<
  Sector,
  {
    label: string;
    value: number;
    level: string;
    icon: React.ElementType;
  }[]
> = {
  Agriculture: [
    {
      label: 'Rainfall Impact',
      value: 82,
      level: 'High',
      icon: CloudRain,
    },
    {
      label: 'Wind Impact',
      value: 46,
      level: 'Moderate',
      icon: Wind,
    },
    {
      label: 'Waterlogging Risk',
      value: 68,
      level: 'Moderate',
      icon: Droplets,
    },
    {
      label: 'Visibility Impact',
      value: 28,
      level: 'Low',
      icon: Eye,
    },
  ],

  Aviation: [
    {
      label: 'Thunderstorm Impact',
      value: 78,
      level: 'High',
      icon: CloudLightning,
    },
    {
      label: 'Visibility Impact',
      value: 65,
      level: 'Moderate',
      icon: Eye,
    },
    {
      label: 'Wind Impact',
      value: 58,
      level: 'Moderate',
      icon: Wind,
    },
    {
      label: 'Rainfall Impact',
      value: 52,
      level: 'Moderate',
      icon: CloudRain,
    },
  ],

  Marine: [
    {
      label: 'Wind Impact',
      value: 72,
      level: 'High',
      icon: Wind,
    },
    {
      label: 'Sea Condition',
      value: 61,
      level: 'Moderate',
      icon: Waves,
    },
    {
      label: 'Rainfall Impact',
      value: 44,
      level: 'Moderate',
      icon: CloudRain,
    },
    {
      label: 'Visibility Impact',
      value: 36,
      level: 'Low',
      icon: Eye,
    },
  ],

  Urban: [
    {
      label: 'Rainfall Impact',
      value: 85,
      level: 'High',
      icon: CloudRain,
    },
    {
      label: 'Waterlogging Risk',
      value: 74,
      level: 'High',
      icon: Droplets,
    },
    {
      label: 'Traffic Impact',
      value: 62,
      level: 'Moderate',
      icon: Navigation,
    },
    {
      label: 'Wind Impact',
      value: 35,
      level: 'Low',
      icon: Wind,
    },
  ],
};


/* =========================================================
   TIMELINE DATA
========================================================= */

const sectorTimeline: Record<
  Sector,
  {
    time: string;
    weather: string;
    action: string;
    status: string;
  }[]
> = {
  Agriculture: [
    {
      time: 'Today · Evening',
      weather: 'Heavy rainfall expected',
      action: 'Avoid major field operations',
      status: 'High Impact',
    },
    {
      time: 'Tomorrow · Morning',
      weather: 'Moderate rainfall',
      action: 'Inspect drainage systems',
      status: 'Moderate',
    },
    {
      time: 'Tomorrow · Evening',
      weather: 'Rainfall gradually decreasing',
      action: 'Monitor field conditions',
      status: 'Improving',
    },
    {
      time: 'Day After Tomorrow',
      weather: 'Conditions improving',
      action: 'Resume suitable operations',
      status: 'Favorable',
    },
  ],

  Aviation: [
    {
      time: 'Today · Evening',
      weather: 'Thunderstorm activity',
      action: 'Monitor operational restrictions',
      status: 'High Impact',
    },
    {
      time: 'Tomorrow · Morning',
      weather: 'Reduced visibility possible',
      action: 'Prepare for possible delays',
      status: 'Moderate',
    },
    {
      time: 'Tomorrow · Evening',
      weather: 'Conditions stabilizing',
      action: 'Review updated forecasts',
      status: 'Improving',
    },
    {
      time: 'Day After Tomorrow',
      weather: 'Improved conditions',
      action: 'Normal operations likely',
      status: 'Favorable',
    },
  ],

  Marine: [
    {
      time: 'Today · Evening',
      weather: 'Moderate winds',
      action: 'Exercise caution offshore',
      status: 'High Impact',
    },
    {
      time: 'Tomorrow · Morning',
      weather: 'Changing sea conditions',
      action: 'Monitor marine bulletins',
      status: 'Moderate',
    },
    {
      time: 'Tomorrow · Evening',
      weather: 'Wind gradually easing',
      action: 'Review safe operating windows',
      status: 'Improving',
    },
    {
      time: 'Day After Tomorrow',
      weather: 'More stable conditions',
      action: 'Resume planned activity carefully',
      status: 'Favorable',
    },
  ],

  Urban: [
    {
      time: 'Today · Evening',
      weather: 'Heavy rainfall',
      action: 'Avoid waterlogged roads',
      status: 'High Impact',
    },
    {
      time: 'Tomorrow · Morning',
      weather: 'Rain continues',
      action: 'Allow extra travel time',
      status: 'Moderate',
    },
    {
      time: 'Tomorrow · Evening',
      weather: 'Rainfall decreasing',
      action: 'Monitor local road conditions',
      status: 'Improving',
    },
    {
      time: 'Day After Tomorrow',
      weather: 'Conditions improving',
      action: 'Normal movement likely',
      status: 'Favorable',
    },
  ],
};


/* =========================================================
   COMPONENT
========================================================= */

export const SectoralAdvisory: React.FC = () => {

  const [
    activeSector,
    setActiveSector,
  ] = useState<Sector>(
    'Agriculture'
  );

  const [
    contentKey,
    setContentKey,
  ] = useState(0);

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  const pageRef =
    useRef<HTMLDivElement | null>(null);


  /* =======================================================
     VIEWPORT OBSERVER
  ======================================================= */

  useEffect(() => {

    const currentPage =
      pageRef.current;

    if (!currentPage) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (entry.isIntersecting) {
            setIsVisible(true);
          }

        },
        {
          threshold: 0.05,
        }
      );

    observer.observe(currentPage);

    return () => {
      observer.disconnect();
    };

  }, []);


  /* =======================================================
     SECTOR CHANGE
  ======================================================= */

  const handleSectorChange = (
    sector: Sector
  ) => {

    if (
      sector === activeSector
    ) {
      return;
    }

    setActiveSector(sector);

    setContentKey(
      (previous) =>
        previous + 1
    );

  };


  /* =======================================================
     ACTIVE DATA
  ======================================================= */

  const sector =
    sectorConfig[activeSector];

  const SectorIcon =
    sector.icon;

  const actions =
    sectorActions[activeSector];

  const impacts =
    sectorImpacts[activeSector];

  const timeline =
    sectorTimeline[activeSector];


  /* =======================================================
     RISK COLOR
  ======================================================= */

  const getRiskColor = (
    risk: RiskLevel
  ) => {

    if (risk === 'High') {
      return '#f87171';
    }

    if (risk === 'Moderate') {
      return '#fbbf24';
    }

    return '#34d399';

  };


  /* =======================================================
     PRIORITY CONFIG
  ======================================================= */

  const getPriorityConfig = (
    priority: Priority
  ) => {

    if (priority === 'critical') {

      return {
        label:
          'Immediate Action',

        color:
          '#f87171',

        background:
          'rgba(248, 113, 113, 0.10)',

        border:
          'rgba(248, 113, 113, 0.20)',

        icon:
          AlertTriangle,
      };

    }


    if (
      priority ===
      'recommended'
    ) {

      return {
        label:
          'Recommended',

        color:
          '#fbbf24',

        background:
          'rgba(245, 158, 11, 0.10)',

        border:
          'rgba(245, 158, 11, 0.20)',

        icon:
          CircleAlert,
      };

    }


    return {
      label:
        'Favorable',

      color:
        '#34d399',

      background:
        'rgba(16, 185, 129, 0.10)',

      border:
        'rgba(16, 185, 129, 0.20)',

      icon:
        CheckCircle2,
    };

  };


  return (

    <>

      {/* =====================================================
          RESPONSIVE + ANIMATION CSS
          ===================================================== */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .sectoral-advisory-wrapper {
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


        /* ===================================================
           MAIN CONTENT
        =================================================== */

        .sectoral-advisory-content {
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
        }


        /* ===================================================
           HEADER
        =================================================== */

        .sectoral-advisory-header {
          position: sticky;

          top: 0;

          z-index: 1000;

          width: 100%;

          padding: 12px 0;
        }


        /* ===================================================
           PAGE CONTENT
        =================================================== */

        .sectoral-advisory-page {
          width: 100%;

          max-width: 1600px;

          margin: 0 auto;

          padding:
            0
            0
            40px;
        }


        /* ===================================================
           GLASS CARD
        =================================================== */

        .sectoral-glass-card {

          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.12),
              rgba(255, 255, 255, 0.045)
            );

          backdrop-filter:
            blur(22px);

          -webkit-backdrop-filter:
            blur(22px);

          border:
            1px solid
            rgba(255, 255, 255, 0.16);

          box-shadow:
            0
            10px
            35px
            rgba(0, 0, 0, 0.16);

        }


        /* ===================================================
           ENTRY ANIMATION
        =================================================== */

        @keyframes sectorPageEnter {

          from {
            opacity: 0;
            transform:
              translateY(14px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }


        @keyframes sectorContentChange {

          from {
            opacity: 0;
            transform:
              translateY(10px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }


        .sectoral-page-animated {
          opacity: 0;
        }


        .sectoral-page-visible {
          animation:
            sectorPageEnter
            0.75s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            forwards;
        }


        .sectoral-dynamic-content {
          animation:
            sectorContentChange
            0.55s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            forwards;
        }


        /* ===================================================
           TABS
        =================================================== */

        .sectoral-tabs-card {

          padding:
            8px;

          border-radius:
            18px;

          margin-bottom:
            20px;

          overflow-x:
            auto;

          scrollbar-width:
            none;

        }


        .sectoral-tabs {

          display: flex;

          align-items:
            center;

          gap:
            8px;

          min-width:
            max-content;

        }


        .sectoral-tab {

          display: flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            8px;

          padding:
            11px
            18px;

          border-radius:
            13px;

          border:
            1px solid
            transparent;

          background:
            transparent;

          color:
            #94a3b8;

          font-size:
            12px;

          font-weight:
            600;

          cursor:
            pointer;

          transition:
            all
            0.25s
            ease;

        }


        .sectoral-tab:hover {

          color:
            #e2e8f0;

          background:
            rgba(255, 255, 255, 0.055);

        }


        .sectoral-tab.active {

          color:
            #ffffff;

          background:
            rgba(56, 189, 248, 0.13);

          border-color:
            rgba(56, 189, 248, 0.22);

          box-shadow:
            0
            5px
            18px
            rgba(56, 189, 248, 0.08);

        }


        /* ===================================================
           ADVISORY OVERVIEW
        =================================================== */

        .sectoral-overview {

          display: grid;

          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(300px, 0.8fr);

          gap:
            20px;

          margin-bottom:
            20px;

        }


        .sectoral-main-advisory {

          padding:
            24px;

          border-radius:
            24px;

        }


        .sectoral-sector-heading {

          display: flex;

          align-items:
            center;

          gap:
            14px;

          margin-bottom:
            20px;

        }


        .sectoral-sector-icon {

          width:
            52px;

          height:
            52px;

          border-radius:
            15px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid;

        }


        .sectoral-sector-name {

          margin: 0;

          font-size:
            18px;

          font-weight:
            700;

          color:
            #ffffff;

        }


        .sectoral-sector-label {

          margin-top:
            4px;

          font-size:
            10px;

          color:
            #94a3b8;

        }


        .sectoral-risk-badge {

          margin-left:
            auto;

          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          padding:
            7px
            11px;

          border-radius:
            999px;

          font-size:
            10px;

          font-weight:
            700;

          border:
            1px solid;

        }


        .sectoral-overview-text {

          margin: 0;

          max-width:
            760px;

          font-size:
            13px;

          line-height:
            1.75;

          color:
            #cbd5e1;

        }


        .sectoral-info-grid {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap:
            12px;

          margin-top:
            22px;

        }


        .sectoral-info-item {

          padding:
            13px;

          border-radius:
            14px;

          background:
            rgba(255, 255, 255, 0.045);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

        }


        .sectoral-info-label {

          font-size:
            9px;

          font-weight:
            600;

          letter-spacing:
            0.7px;

          text-transform:
            uppercase;

          color:
            #64748b;

        }


        .sectoral-info-value {

          margin-top:
            7px;

          font-size:
            11px;

          font-weight:
            600;

          color:
            #e2e8f0;

        }


        /* ===================================================
           WEATHER SUMMARY
        =================================================== */

        .sectoral-summary-card {

          padding:
            22px;

          border-radius:
            24px;

        }


        .sectoral-card-heading {

          display: flex;

          align-items:
            center;

          gap:
            9px;

          margin-bottom:
            16px;

          font-size:
            13px;

          font-weight:
            700;

          color:
            #ffffff;

        }


        .sectoral-summary-text {

          margin: 0;

          font-size:
            12px;

          line-height:
            1.7;

          color:
            #cbd5e1;

        }


        .sectoral-summary-divider {

          width:
            100%;

          height:
            1px;

          margin:
            18px
            0;

          background:
            rgba(255, 255, 255, 0.09);

        }


        .sectoral-summary-row {

          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            14px;

          font-size:
            10px;

          color:
            #94a3b8;

        }


        .sectoral-summary-row strong {

          font-weight:
            600;

          color:
            #e2e8f0;

        }


        /* ===================================================
           ACTION + IMPACT GRID
        =================================================== */

        .sectoral-analysis-grid {

          display: grid;

          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(320px, 0.8fr);

          gap:
            20px;

          margin-bottom:
            20px;

        }


        .sectoral-section-card {

          padding:
            22px;

          border-radius:
            24px;

        }


        /* ===================================================
           ACTIONS
        =================================================== */

        .sectoral-actions-list {

          display: flex;

          flex-direction:
            column;

          gap:
            11px;

        }


        .sectoral-action {

          display: flex;

          align-items:
            flex-start;

          gap:
            12px;

          padding:
            13px;

          border-radius:
            15px;

          border:
            1px solid;

        }


        .sectoral-action-icon {

          width:
            34px;

          height:
            34px;

          min-width:
            34px;

          border-radius:
            10px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

        }


        .sectoral-action-content {

          min-width:
            0;

          flex:
            1;

        }


        .sectoral-action-label {

          margin-bottom:
            5px;

          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            0.6px;

          text-transform:
            uppercase;

        }


        .sectoral-action-title {

          margin:
            0
            0
            5px;

          font-size:
            11px;

          font-weight:
            650;

          line-height:
            1.45;

          color:
            #e2e8f0;

        }


        .sectoral-action-description {

          margin: 0;

          font-size:
            10px;

          line-height:
            1.55;

          color:
            #94a3b8;

        }


        /* ===================================================
           IMPACTS
        =================================================== */

        .sectoral-impact-list {

          display: flex;

          flex-direction:
            column;

          gap:
            18px;

        }


        .sectoral-impact-item {

          width:
            100%;

        }


        .sectoral-impact-top {

          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            12px;

          margin-bottom:
            8px;

        }


        .sectoral-impact-name {

          display: flex;

          align-items:
            center;

          gap:
            7px;

          font-size:
            10px;

          font-weight:
            600;

          color:
            #cbd5e1;

        }


        .sectoral-impact-level {

          font-size:
            9px;

          font-weight:
            700;

          color:
            #94a3b8;

        }


        .sectoral-impact-bar {

          width:
            100%;

          height:
            6px;

          border-radius:
            999px;

          overflow:
            hidden;

          background:
            rgba(255, 255, 255, 0.07);

        }


        .sectoral-impact-fill {

          height:
            100%;

          border-radius:
            inherit;

          background:
            linear-gradient(
              90deg,
              #38bdf8,
              #60a5fa
            );

          transition:
            width
            0.6s
            ease;

        }


        /* ===================================================
           TIMELINE
        =================================================== */

        .sectoral-timeline-card {

          padding:
            24px;

          border-radius:
            24px;

          margin-bottom:
            20px;

        }


        .sectoral-timeline {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap:
            14px;

        }


        .sectoral-timeline-item {

          padding:
            16px;

          border-radius:
            16px;

          background:
            rgba(255, 255, 255, 0.045);

          border:
            1px solid
            rgba(255, 255, 255, 0.075);

        }


        .sectoral-timeline-time {

          margin-bottom:
            10px;

          font-size:
            9px;

          font-weight:
            700;

          color:
            #38bdf8;

        }


        .sectoral-timeline-weather {

          margin-bottom:
            8px;

          font-size:
            11px;

          font-weight:
            600;

          line-height:
            1.45;

          color:
            #e2e8f0;

        }


        .sectoral-timeline-action {

          font-size:
            10px;

          line-height:
            1.55;

          color:
            #94a3b8;

        }


        .sectoral-timeline-status {

          display:
            inline-flex;

          margin-top:
            12px;

          padding:
            4px
            7px;

          border-radius:
            999px;

          background:
            rgba(56, 189, 248, 0.09);

          font-size:
            8px;

          font-weight:
            700;

          color:
            #7dd3fc;

        }


        /* ===================================================
           ALERT + AI GRID
        =================================================== */

        .sectoral-bottom-grid {

          display: grid;

          grid-template-columns:
            minmax(0, 0.8fr)
            minmax(0, 1.2fr);

          gap:
            20px;

        }


        /* ===================================================
           ALERT
        =================================================== */

        .sectoral-alert-card {

          padding:
            22px;

          border-radius:
            24px;

        }


        .sectoral-alert-box {

          padding:
            16px;

          border-radius:
            16px;

          background:
            rgba(248, 113, 113, 0.08);

          border:
            1px solid
            rgba(248, 113, 113, 0.16);

        }


        .sectoral-alert-title {

          margin:
            0
            0
            7px;

          font-size:
            11px;

          font-weight:
            650;

          color:
            #fca5a5;

        }


        .sectoral-alert-description {

          margin: 0;

          font-size:
            10px;

          line-height:
            1.6;

          color:
            #cbd5e1;

        }


        /* ===================================================
           AI ANALYSIS
        =================================================== */

        .sectoral-ai-card {

          position:
            relative;

          overflow:
            hidden;

          padding:
            22px;

          border-radius:
            24px;

        }


        .sectoral-ai-card::before {

          content:
            '';

          position:
            absolute;

          top:
            -80px;

          right:
            -80px;

          width:
            180px;

          height:
            180px;

          border-radius:
            50%;

          background:
            radial-gradient(
              circle,
              rgba(56, 189, 248, 0.12),
              transparent 70%
            );

          pointer-events:
            none;

        }


        .sectoral-ai-heading {

          position:
            relative;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          margin-bottom:
            14px;

          font-size:
            13px;

          font-weight:
            700;

          color:
            #ffffff;

        }


        .sectoral-ai-text {

          position:
            relative;

          margin: 0;

          font-size:
            12px;

          line-height:
            1.75;

          color:
            #cbd5e1;

        }


        .sectoral-ai-factors {

          position:
            relative;

          display:
            grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap:
            10px;

          margin-top:
            18px;

        }


        .sectoral-ai-factor {

          padding:
            11px;

          border-radius:
            13px;

          background:
            rgba(255, 255, 255, 0.045);

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

        }


        .sectoral-ai-factor-label {

          font-size:
            8px;

          text-transform:
            uppercase;

          letter-spacing:
            0.5px;

          color:
            #64748b;

        }


        .sectoral-ai-factor-value {

          margin-top:
            6px;

          font-size:
            10px;

          font-weight:
            650;

          color:
            #e2e8f0;

        }


        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 1200px) {

          .sectoral-overview {
            grid-template-columns: 1fr;
          }


          .sectoral-analysis-grid {
            grid-template-columns: 1fr;
          }


          .sectoral-timeline {
            grid-template-columns: repeat(2, 1fr);
          }


          .sectoral-bottom-grid {
            grid-template-columns: 1fr;
          }

        }


        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 1023px) {

          .sectoral-advisory-wrapper > :first-child {
            display: none !important;
          }


          .sectoral-advisory-content {

            width: 100%;

            flex: 1 1 100%;

            padding:
              0
              20px
              30px;

          }


          .sectoral-advisory-header {
            padding: 10px 0;
          }

        }


        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 767px) {

          .sectoral-advisory-wrapper > :first-child {

            display: none !important;

            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;

          }


          .sectoral-advisory-content {

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


          .sectoral-advisory-header {

            width: 100%;

            padding: 8px 0;

            overflow: visible;

          }


          .sectoral-page {
            padding-bottom: 28px;
          }


          .sectoral-info-grid {
            grid-template-columns: 1fr;
          }


          .sectoral-timeline {
            grid-template-columns: 1fr;
          }


          .sectoral-ai-factors {
            grid-template-columns: 1fr;
          }

        }


        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (max-width: 479px) {

          .sectoral-advisory-content {

            padding-left: 8px;
            padding-right: 8px;
            padding-bottom: 16px;

          }


          .sectoral-advisory-header {
            padding: 6px 0;
          }


          .sectoral-hero,
          .sectoral-main-advisory,
          .sectoral-summary-card,
          .sectoral-section-card,
          .sectoral-timeline-card,
          .sectoral-alert-card,
          .sectoral-ai-card {

            border-radius: 20px;

          }


          .sectoral-tab {

            padding:
              10px
              14px;

            font-size: 11px;

          }


          .sectoral-sector-heading {

            align-items:
              flex-start;

            flex-wrap:
              wrap;

          }


          .sectoral-risk-badge {
            margin-left: 0;
          }

        }


        /* ===================================================
           VERY SMALL PHONE
        =================================================== */

        @media (max-width: 359px) {

          .sectoral-advisory-content {

            padding-left: 6px;
            padding-right: 6px;

          }

        }


        /* ===================================================
           REDUCED MOTION
        =================================================== */

        @media (prefers-reduced-motion: reduce) {

          .sectoral-page-visible,
          .sectoral-dynamic-content {

            animation: none !important;

            opacity: 1 !important;

            transform: none !important;

          }


          .sectoral-tab {
            transition: none !important;
          }

        }

      `}</style>


      {/* =====================================================
          SECTORAL ADVISORY PAGE
          ===================================================== */}

      <div className="sectoral-advisory-wrapper">


        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <Sidebar />


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <div className="sectoral-advisory-content">


          {/* =================================================
              HEADER
              ================================================= */}

          <div className="sectoral-advisory-header">

            <Header />

          </div>


          {/* =================================================
              PAGE CONTENT
              ================================================= */}

          <main
            ref={pageRef}
            className={`
              sectoral-advisory-page
              sectoral-page-animated
              ${
                isVisible
                  ? 'sectoral-page-visible'
                  : ''
              }
            `}
          >


            {/* ===============================================
                SECTOR NAVIGATION
                =============================================== */}

            <section
              className="
                sectoral-tabs-card
                sectoral-glass-card
              "
            >

              <div className="sectoral-tabs">

                {(
                  Object.keys(
                    sectorConfig
                  ) as Sector[]
                ).map(
                  (sectorName) => {

                    const config =
                      sectorConfig[
                        sectorName
                      ];

                    const Icon =
                      config.icon;

                    const isActive =
                      activeSector ===
                      sectorName;


                    return (

                      <button
                        key={sectorName}
                        type="button"
                        onClick={() =>
                          handleSectorChange(
                            sectorName
                          )
                        }
                        className={`
                          sectoral-tab
                          ${
                            isActive
                              ? 'active'
                              : ''
                          }
                        `}
                      >

                        <Icon
                          size={15}
                        />

                        <span>

                          {sectorName}

                        </span>

                      </button>

                    );

                  }
                )}

              </div>

            </section>


            {/* ===============================================
                DYNAMIC CONTENT
                =============================================== */}

            <div
              key={contentKey}
              className="
                sectoral-dynamic-content
              "
            >


              {/* =============================================
                  OVERVIEW
                  ============================================= */}

              <section className="sectoral-overview">


                {/* MAIN ADVISORY */}

                <div
                  className="
                    sectoral-main-advisory
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-sector-heading">


                    <div
                      className="
                        sectoral-sector-icon
                      "
                      style={{
                        background:
                          sector.softColor,

                        borderColor:
                          sector.borderColor,

                        color:
                          sector.color,

                        boxShadow:
                          `0 8px 22px ${sector.shadowColor}`,
                      }}
                    >

                      <SectorIcon
                        size={25}
                      />

                    </div>


                    <div>

                      <h2 className="sectoral-sector-name">

                        {activeSector}
                        {' '}
                        Advisory

                      </h2>


                      <div className="sectoral-sector-label">

                        Sector-specific weather
                        decision support

                      </div>

                    </div>


                    <div
                      className="
                        sectoral-risk-badge
                      "
                      style={{
                        color:
                          getRiskColor(
                            sector.risk
                          ),

                        background:
                          `${getRiskColor(
                            sector.risk
                          )}12`,

                        borderColor:
                          `${getRiskColor(
                            sector.risk
                          )}33`,
                      }}
                    >

                      <ShieldAlert
                        size={13}
                      />

                      {sector.risk}
                      {' '}
                      Risk

                    </div>


                  </div>


                  <p className="sectoral-overview-text">

                    {sector.overview}

                  </p>


                  <div className="sectoral-info-grid">


                    <div className="sectoral-info-item">

                      <div className="sectoral-info-label">

                        Primary Factor

                      </div>

                      <div className="sectoral-info-value">

                        {sector.primaryFactor}

                      </div>

                    </div>


                    <div className="sectoral-info-item">

                      <div className="sectoral-info-label">

                        Affected Period

                      </div>

                      <div className="sectoral-info-value">

                        {sector.affectedPeriod}

                      </div>

                    </div>


                    <div className="sectoral-info-item">

                      <div className="sectoral-info-label">

                        Forecast Confidence

                      </div>

                      <div className="sectoral-info-value">

                        {sector.confidence}

                      </div>

                    </div>


                  </div>


                </div>


                {/* WEATHER SUMMARY */}

                <div
                  className="
                    sectoral-summary-card
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-card-heading">

                    <CloudRain
                      size={16}
                      color="#38bdf8"
                    />

                    Weather Impact Summary

                  </div>


                  <p className="sectoral-summary-text">

                    {sector.weatherSummary}

                  </p>


                  <div className="sectoral-summary-divider" />


                  <div className="sectoral-summary-row">

                    <span>
                      Dominant Condition
                    </span>

                    <strong>
                      {sector.primaryFactor}
                    </strong>

                  </div>


                  <div className="sectoral-summary-divider" />


                  <div className="sectoral-summary-row">

                    <span>
                      Advisory Window
                    </span>

                    <strong>
                      {sector.affectedPeriod}
                    </strong>

                  </div>


                </div>


              </section>


              {/* =============================================
                  ACTIONS + IMPACTS
                  ============================================= */}

              <section className="sectoral-analysis-grid">


                {/* ACTIONS */}

                <div
                  className="
                    sectoral-section-card
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-card-heading">

                    <CheckCircle2
                      size={16}
                      color="#34d399"
                    />

                    Recommended Actions

                  </div>


                  <div className="sectoral-actions-list">

                    {actions.map(
                      (
                        action,
                        index
                      ) => {

                        const priority =
                          getPriorityConfig(
                            action.priority
                          );

                        const PriorityIcon =
                          priority.icon;


                        return (

                          <div
                            key={index}
                            className="
                              sectoral-action
                            "
                            style={{
                              background:
                                priority.background,

                              borderColor:
                                priority.border,
                            }}
                          >


                            <div
                              className="
                                sectoral-action-icon
                              "
                              style={{
                                background:
                                  `${priority.color}16`,

                                color:
                                  priority.color,
                              }}
                            >

                              <PriorityIcon
                                size={17}
                              />

                            </div>


                            <div
                              className="
                                sectoral-action-content
                              "
                            >


                              <div
                                className="
                                  sectoral-action-label
                                "
                                style={{
                                  color:
                                    priority.color,
                                }}
                              >

                                {priority.label}

                              </div>


                              <h3
                                className="
                                  sectoral-action-title
                                "
                              >

                                {action.title}

                              </h3>


                              <p
                                className="
                                  sectoral-action-description
                                "
                              >

                                {action.description}

                              </p>


                            </div>


                          </div>

                        );

                      }
                    )}

                  </div>


                </div>


                {/* IMPACT ASSESSMENT */}

                <div
                  className="
                    sectoral-section-card
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-card-heading">

                    <AlertTriangle
                      size={16}
                      color="#fbbf24"
                    />

                    Weather Impact Assessment

                  </div>


                  <div className="sectoral-impact-list">

                    {impacts.map(
                      (
                        impact,
                        index
                      ) => {

                        const ImpactIcon =
                          impact.icon;


                        return (

                          <div
                            key={index}
                            className="
                              sectoral-impact-item
                            "
                          >


                            <div
                              className="
                                sectoral-impact-top
                              "
                            >


                              <div
                                className="
                                  sectoral-impact-name
                                "
                              >

                                <ImpactIcon
                                  size={13}
                                  color="#7dd3fc"
                                />

                                {impact.label}

                              </div>


                              <div
                                className="
                                  sectoral-impact-level
                                "
                              >

                                {impact.level}

                              </div>


                            </div>


                            <div
                              className="
                                sectoral-impact-bar
                              "
                            >

                              <div
                                className="
                                  sectoral-impact-fill
                                "
                                style={{
                                  width:
                                    `${impact.value}%`,
                                }}
                              />

                            </div>


                          </div>

                        );

                      }
                    )}

                  </div>


                </div>


              </section>


              {/* =============================================
                  NEXT 72 HOURS
                  ============================================= */}

              <section
                className="
                  sectoral-timeline-card
                  sectoral-glass-card
                "
              >


                <div className="sectoral-card-heading">

                  <Clock3
                    size={16}
                    color="#38bdf8"
                  />

                  Next 72 Hours

                </div>


                <div className="sectoral-timeline">

                  {timeline.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                          sectoral-timeline-item
                        "
                      >


                        <div
                          className="
                            sectoral-timeline-time
                          "
                        >

                          {item.time}

                        </div>


                        <div
                          className="
                            sectoral-timeline-weather
                          "
                        >

                          {item.weather}

                        </div>


                        <div
                          className="
                            sectoral-timeline-action
                          "
                        >

                          {item.action}

                        </div>


                        <div
                          className="
                            sectoral-timeline-status
                          "
                        >

                          {item.status}

                        </div>


                      </div>

                    )
                  )}

                </div>


              </section>


              {/* =============================================
                  ALERT + AI ANALYSIS
                  ============================================= */}

              <section className="sectoral-bottom-grid">


                {/* SECTOR ALERT */}

                <div
                  className="
                    sectoral-alert-card
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-card-heading">

                    <AlertTriangle
                      size={16}
                      color="#f87171"
                    />

                    Sector Alert

                  </div>


                  <div className="sectoral-alert-box">


                    <h3 className="sectoral-alert-title">

                      Weather conditions require
                      attention

                    </h3>


                    <p
                      className="
                        sectoral-alert-description
                      "
                    >

                      Current forecast conditions may
                      temporarily affect normal
                      {' '}
                      {activeSector.toLowerCase()}
                      {' '}
                      operations. Monitor updated
                      weather information before
                      making critical decisions.

                    </p>


                  </div>


                </div>


                {/* AI ANALYSIS */}

                <div
                  className="
                    sectoral-ai-card
                    sectoral-glass-card
                  "
                >


                  <div className="sectoral-ai-heading">

                    <Sparkles
                      size={17}
                      color="#7dd3fc"
                    />

                    MeghAI Analysis

                  </div>


                  <p className="sectoral-ai-text">

                    Based on the current forecast,
                    {' '}
                    {sector.primaryFactor.toLowerCase()}
                    {' '}
                    is expected to remain the
                    dominant weather factor during
                    the advisory period. MeghAI
                    recommends monitoring changing
                    conditions and prioritizing
                    safety-sensitive operations
                    accordingly.

                  </p>


                  <div className="sectoral-ai-factors">


                    <div className="sectoral-ai-factor">

                      <div
                        className="
                          sectoral-ai-factor-label
                        "
                      >

                        Forecast Confidence

                      </div>

                      <div
                        className="
                          sectoral-ai-factor-value
                        "
                      >

                        {sector.confidence}

                      </div>

                    </div>


                    <div className="sectoral-ai-factor">

                      <div
                        className="
                          sectoral-ai-factor-label
                        "
                      >

                        Risk Level

                      </div>

                      <div
                        className="
                          sectoral-ai-factor-value
                        "
                      >

                        {sector.risk}

                      </div>

                    </div>


                    <div className="sectoral-ai-factor">

                      <div
                        className="
                          sectoral-ai-factor-label
                        "
                      >

                        Advisory Period

                      </div>

                      <div
                        className="
                          sectoral-ai-factor-value
                        "
                      >

                        {sector.affectedPeriod}

                      </div>

                    </div>


                  </div>


                </div>


              </section>


            </div>


            {/* ===============================================
                PAGE FOOTER
                =============================================== */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '18px',
              }}
            >

              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border:
                    '1px solid rgba(56, 189, 248, 0.20)',
                  background:
                    'rgba(56, 189, 248, 0.08)',
                  color: '#7dd3fc',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >

                View Detailed Weather Data

                <ArrowRight
                  size={14}
                />

              </button>

            </div>


          </main>


        </div>


      </div>

    </>
  );
};


export default SectoralAdvisory;
