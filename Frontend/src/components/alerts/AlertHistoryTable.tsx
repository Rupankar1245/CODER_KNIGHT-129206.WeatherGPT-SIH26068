import { FileText } from 'lucide-react';

import { alertHistoryData } from './alertHistoryData';


/* =========================================================
   TYPES
========================================================= */

interface AlertHistoryTableProps {
  onViewAll: () => void;
}


interface AlertHistoryRowsProps {
  rows: readonly (typeof alertHistoryData)[number][];
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export function AlertHistoryTable({
  onViewAll,
}: AlertHistoryTableProps) {
  return (
    <>
      {/* =====================================================
          COMPONENT CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           HISTORY PANEL
        ===================================================== */

        .alert-history-panel {
          position: relative;

          width: 100%;

          min-width: 0;

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
           TOP LIGHT
        ===================================================== */

        .alert-history-panel::before {
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


        .alert-history-panel:hover {
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
           HEADER
        ===================================================== */

        .alert-history-header {
          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 16px;

          margin-bottom: 18px;
        }


        .alert-history-title-group {
          display: flex;

          align-items: center;

          gap: 8px;

          min-width: 0;

          color:
            #f8fafc;

          font-size: 13px;

          font-weight: 600;

          letter-spacing: -0.1px;
        }


        /* =====================================================
           VIEW ALL BUTTON
        ===================================================== */

        .alert-history-view-all-btn {
          position: relative;

          z-index: 2;

          flex-shrink: 0;

          padding: 6px 11px;

          border-radius: 9px;

          border:
            1px solid
            rgba(56, 189, 248, 0.20);

          background:
            rgba(56, 189, 248, 0.08);

          color:
            #38bdf8;

          font-size: 10px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }


        .alert-history-view-all-btn:hover {
          background:
            rgba(56, 189, 248, 0.14);

          border-color:
            rgba(56, 189, 248, 0.35);

          box-shadow:
            0 0 14px
            rgba(56, 189, 248, 0.10);
        }


        /* =====================================================
           TABLE CONTAINER
        ===================================================== */

        .history-table-container {
          position: relative;

          z-index: 2;

          width: 100%;

          overflow-x: auto;

          border-radius: 13px;

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          background:
            rgba(15, 23, 42, 0.10);

          scrollbar-width: thin;

          scrollbar-color:
            rgba(148, 163, 184, 0.35)
            transparent;
        }


        .history-table-container::-webkit-scrollbar {
          height: 5px;
        }


        .history-table-container::-webkit-scrollbar-track {
          background: transparent;
        }


        .history-table-container::-webkit-scrollbar-thumb {
          border-radius: 999px;

          background:
            rgba(148, 163, 184, 0.30);
        }


        /* =====================================================
           TABLE
        ===================================================== */

        .history-table {
          width: 100%;

          min-width: 720px;

          border-collapse: collapse;

          table-layout: auto;
        }


        /* =====================================================
           TABLE HEADER
        ===================================================== */

        .history-table thead {
          background:
            rgba(255, 255, 255, 0.035);
        }


        .history-table th {
          padding:
            11px
            14px;

          text-align: left;

          white-space: nowrap;

          color:
            rgba(148, 163, 184, 0.90);

          font-size: 9.5px;

          font-weight: 600;

          letter-spacing: 0.15px;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.08);
        }


        /* =====================================================
           TABLE BODY
        ===================================================== */

        .history-table td {
          padding:
            13px
            14px;

          white-space: nowrap;

          color:
            rgba(203, 213, 225, 0.82);

          font-size: 10.5px;

          font-weight: 400;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.055);
        }


        .history-table tbody tr {
          transition:
            background 0.2s ease;
        }


        .history-table tbody tr:hover {
          background:
            rgba(255, 255, 255, 0.035);
        }


        .history-table tbody tr:last-child td {
          border-bottom: none;
        }


        /* =====================================================
           EVENT
        ===================================================== */

        .history-event {
          color:
            #f1f5f9;

          font-weight: 500;
        }


        /* =====================================================
           SEVERITY
        ===================================================== */

        .history-severity {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          font-weight: 500;
        }


        .history-severity-dot {
          width: 6px;
          height: 6px;

          flex-shrink: 0;

          border-radius: 50%;
        }


        /* =====================================================
           STATUS BADGES
        ===================================================== */

        .status-badge {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 58px;

          padding:
            4px
            8px;

          border-radius: 999px;

          font-size: 9px;

          font-weight: 600;
        }


        .status-badge-active {
          color:
            #6ee7b7;

          background:
            rgba(16, 185, 129, 0.12);

          border:
            1px solid
            rgba(16, 185, 129, 0.22);
        }


        .status-badge-expired {
          color:
            #94a3b8;

          background:
            rgba(148, 163, 184, 0.08);

          border:
            1px solid
            rgba(148, 163, 184, 0.14);
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .alert-history-panel {
            padding: 16px;
          }


          .history-table th,
          .history-table td {
            padding-left: 12px;
            padding-right: 12px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .alert-history-panel {
            padding: 14px;

            border-radius: 17px;
          }


          .alert-history-header {
            margin-bottom: 15px;
          }


          .alert-history-title-group {
            font-size: 12px;
          }


          .alert-history-view-all-btn {
            padding: 6px 10px;

            font-size: 9px;
          }


          .history-table {
            min-width: 650px;
          }


          .history-table th {
            padding-top: 10px;
            padding-bottom: 10px;

            font-size: 9px;
          }


          .history-table td {
            padding-top: 11px;
            padding-bottom: 11px;

            font-size: 9.5px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 390px) {

          .alert-history-panel {
            padding: 12px;
          }


          .alert-history-header {
            gap: 10px;
          }


          .history-table {
            min-width: 620px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .alert-history-panel,
          .alert-history-view-all-btn,
          .history-table tbody tr {
            transition: none !important;
          }

        }

      `}</style>


      {/* =====================================================
          HISTORY PANEL
      ===================================================== */}

      <div className="alert-history-panel">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="alert-history-header">

          <div className="alert-history-title-group">

            <FileText
              size={15}
              color="#38bdf8"
            />

            <span>
              Alert History
            </span>

          </div>


          <button
            type="button"
            className="alert-history-view-all-btn"
            onClick={onViewAll}
          >
            View All
          </button>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <AlertHistoryRows
          rows={alertHistoryData}
        />

      </div>
    </>
  );
}


/* =========================================================
   TABLE ROWS COMPONENT
========================================================= */

export function AlertHistoryRows({
  rows,
}: AlertHistoryRowsProps) {
  return (
    <div className="history-table-container">

      <table className="history-table">

        {/* ===============================================
            TABLE HEAD
        =============================================== */}

        <thead>

          <tr>

            <th>
              Date
            </th>

            <th>
              Event
            </th>

            <th>
              Location
            </th>

            <th>
              Severity
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>


        {/* ===============================================
            TABLE BODY
        =============================================== */}

        <tbody>

          {rows.map((row) => (

            <tr
              key={`${row.date}-${row.event}`}
            >

              {/* Date */}

              <td>
                {row.date}
              </td>


              {/* Event */}

              <td>

                <span className="history-event">
                  {row.event}
                </span>

              </td>


              {/* Location */}

              <td>
                {row.location}
              </td>


              {/* Severity */}

              <td>

                <span
                  className="history-severity"
                  style={{
                    color: row.sevColor,
                  }}
                >

                  <span
                    className="history-severity-dot"
                    style={{
                      backgroundColor:
                        row.sevColor,

                      boxShadow:
                        `0 0 8px ${row.sevColor}66`,
                    }}
                  />

                  {row.severity}

                </span>

              </td>


              {/* Status */}

              <td>

                <span
                  className={`status-badge ${
                    row.status === 'Active'
                      ? 'status-badge-active'
                      : 'status-badge-expired'
                  }`}
                >

                  {row.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}