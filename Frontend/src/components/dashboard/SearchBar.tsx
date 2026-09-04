import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  MapPin,
  CloudSun,
  Bell,
  X,
} from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    {
      icon: MapPin,
      title: 'Search a city',
      description: 'Find weather for any location',
    },
    {
      icon: CloudSun,
      title: 'Weather forecast',
      description: 'Temperature, rain, wind & more',
    },
    {
      icon: Bell,
      title: 'Weather alerts',
      description: 'Check active weather warnings',
    },
  ];

  /* =====================================================
     KEYBOARD SHORTCUT
     Ctrl + K / Cmd + K
     ===================================================== */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyboard
      );
    };
  }, []);

  /* =====================================================
     SEARCH
     ===================================================== */

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    onSearch?.(trimmedQuery);

    console.log(
      'MeghAI Search:',
      trimmedQuery
    );
  };

  /* =====================================================
     CLEAR SEARCH
     ===================================================== */

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <>
      {/* =================================================
          COMPONENT STYLES
          ================================================= */}

      <style>
        {`
          /* =============================================
             CONTAINER
             ============================================= */

          .meghai-search-container {
            position: relative;

            width: min(420px, 32vw);

            min-width: 300px;

            z-index: 100;
          }


          /* =============================================
             SEARCH BAR
             ============================================= */

          .meghai-search-bar {
            position: relative;

            display: flex;

            align-items: center;

            width: 100%;

            height: 42px;

            padding: 0 10px 0 13px;

            box-sizing: border-box;

            background:
              linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.075),
                rgba(255, 255, 255, 0.035)
              );

            border:
              1px solid
              rgba(255, 255, 255, 0.10);

            border-radius: 13px;

            backdrop-filter: blur(18px);

            -webkit-backdrop-filter: blur(18px);

            box-shadow:
              inset 0 1px 0
              rgba(255, 255, 255, 0.07),

              0 6px 20px
              rgba(0, 0, 0, 0.12);

            transition:
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              background 0.25s ease,
              transform 0.25s ease;
          }


          /* =============================================
             FOCUSED STATE
             ============================================= */

          .meghai-search-focused
          .meghai-search-bar {
            background:
              linear-gradient(
                135deg,
                rgba(56, 189, 248, 0.09),
                rgba(255, 255, 255, 0.045)
              );

            border-color:
              rgba(56, 189, 248, 0.32);

            box-shadow:
              0 0 0 3px
              rgba(56, 189, 248, 0.055),

              0 8px 28px
              rgba(0, 0, 0, 0.18),

              0 0 22px
              rgba(56, 189, 248, 0.08);

            transform:
              translateY(-1px);
          }


          /* =============================================
             SEARCH ICON
             ============================================= */

          .meghai-search-icon {
            display: flex;

            align-items: center;

            justify-content: center;

            flex-shrink: 0;

            color: #94a3b8;

            transition:
              color 0.25s ease,
              transform 0.25s ease;
          }


          .meghai-search-focused
          .meghai-search-icon {
            color: #38bdf8;

            transform:
              scale(1.08)
              rotate(-5deg);
          }


          /* =============================================
             INPUT
             ============================================= */

          .meghai-search-input {
            flex: 1;

            width: 100%;

            min-width: 0;

            margin-left: 9px;

            border: none;

            outline: none;

            background: transparent;

            color: #f8fafc;

            font-family: inherit;

            font-size: 13px;

            font-weight: 450;

            letter-spacing: 0.05px;
          }


          .meghai-search-input::placeholder {
            color:
              rgba(203, 213, 225, 0.52);

            transition:
              color 0.2s ease;
          }


          .meghai-search-input:focus::placeholder {
            color:
              rgba(203, 213, 225, 0.36);
          }


          /* =============================================
             KEYBOARD SHORTCUT
             ============================================= */

          .meghai-search-shortcut {
            display: flex;

            align-items: center;

            gap: 3px;

            flex-shrink: 0;

            padding: 3px 6px;

            border:
              1px solid
              rgba(255, 255, 255, 0.08);

            border-radius: 6px;

            background:
              rgba(255, 255, 255, 0.035);

            color:
              rgba(203, 213, 225, 0.45);

            font-size: 10px;

            font-weight: 500;
          }


          .meghai-search-shortcut
          span:last-child {
            color:
              rgba(203, 213, 225, 0.62);
          }


          /* =============================================
             CLEAR BUTTON
             ============================================= */

          .meghai-search-clear {
            display: flex;

            align-items: center;

            justify-content: center;

            width: 25px;

            height: 25px;

            margin-right: 3px;

            padding: 0;

            border: none;

            border-radius: 7px;

            background:
              rgba(255, 255, 255, 0.055);

            color: #94a3b8;

            cursor: pointer;

            transition:
              background 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease;
          }


          .meghai-search-clear:hover {
            background:
              rgba(255, 255, 255, 0.10);

            color: #f8fafc;

            transform:
              scale(1.05)
              rotate(5deg);
          }


          /* =============================================
             SUBMIT BUTTON
             ============================================= */

          .meghai-search-submit {
            display: flex;

            align-items: center;

            justify-content: center;

            width: 27px;

            height: 27px;

            padding: 0;

            border: none;

            border-radius: 8px;

            background:
              rgba(56, 189, 248, 0.12);

            color: #38bdf8;

            cursor: pointer;

            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }


          .meghai-search-submit:hover {
            background:
              rgba(56, 189, 248, 0.20);

            transform:
              scale(1.05);
          }


          /* =============================================
             DROPDOWN
             ============================================= */

          .meghai-search-dropdown {
            position: absolute;

            top: calc(100% + 9px);

            left: 0;

            right: 0;

            overflow: hidden;

            padding: 9px;

            background:
              linear-gradient(
                145deg,
                rgba(12, 35, 61, 0.97),
                rgba(8, 25, 45, 0.95)
              );

            border:
              1px solid
              rgba(255, 255, 255, 0.10);

            border-radius: 14px;

            backdrop-filter: blur(24px);

            -webkit-backdrop-filter: blur(24px);

            box-shadow:
              0 18px 45px
              rgba(0, 0, 0, 0.30),

              inset 0 1px 0
              rgba(255, 255, 255, 0.06);

            animation:
              meghaiSearchDropdownIn
              0.22s ease forwards;

            transform-origin:
              top center;
          }


          @keyframes meghaiSearchDropdownIn {
            from {
              opacity: 0;

              transform:
                translateY(-7px)
                scale(0.985);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);
            }
          }


          /* =============================================
             DROPDOWN HEADER
             ============================================= */

          .meghai-search-dropdown-header {
            display: flex;

            align-items: center;

            justify-content: space-between;

            padding:
              7px 8px 9px;

            color: #e2e8f0;

            font-size: 11px;

            font-weight: 600;
          }


          .meghai-search-dropdown-hint {
            color:
              rgba(148, 163, 184, 0.55);

            font-size: 10px;

            font-weight: 400;
          }


          /* =============================================
             SUGGESTIONS
             ============================================= */

          .meghai-search-suggestions {
            display: flex;

            flex-direction: column;

            gap: 3px;
          }


          /* =============================================
             SUGGESTION ITEM
             ============================================= */

          .meghai-search-suggestion {
            display: flex;

            align-items: center;

            width: 100%;

            padding: 9px;

            border: none;

            border-radius: 10px;

            background: transparent;

            text-align: left;

            cursor: pointer;

            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }


          .meghai-search-suggestion:hover {
            background:
              rgba(255, 255, 255, 0.055);

            transform:
              translateX(3px);
          }


          /* =============================================
             SUGGESTION ICON
             ============================================= */

          .meghai-suggestion-icon {
            display: flex;

            align-items: center;

            justify-content: center;

            width: 32px;

            height: 32px;

            flex-shrink: 0;

            border:
              1px solid
              rgba(56, 189, 248, 0.12);

            border-radius: 9px;

            background:
              rgba(56, 189, 248, 0.075);

            color: #38bdf8;

            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }


          .meghai-search-suggestion:hover
          .meghai-suggestion-icon {
            background:
              rgba(56, 189, 248, 0.13);

            transform:
              scale(1.04);
          }


          /* =============================================
             SUGGESTION CONTENT
             ============================================= */

          .meghai-suggestion-content {
            display: flex;

            flex-direction: column;

            gap: 2px;

            margin-left: 10px;
          }


          .meghai-suggestion-title {
            color: #f1f5f9;

            font-size: 12px;

            font-weight: 550;
          }


          .meghai-suggestion-description {
            color:
              rgba(148, 163, 184, 0.68);

            font-size: 10px;
          }


          /* =============================================
             DROPDOWN FOOTER
             ============================================= */

          .meghai-search-dropdown-footer {
            display: flex;

            align-items: center;

            justify-content: space-between;

            margin-top: 7px;

            padding:
              8px 9px 4px;

            border-top:
              1px solid
              rgba(255, 255, 255, 0.055);

            color:
              rgba(148, 163, 184, 0.48);

            font-size: 9px;
          }


          .meghai-search-dropdown-footer strong {
            color:
              rgba(203, 213, 225, 0.65);

            font-weight: 500;
          }


          /* =============================================
             RESPONSIVE
             ============================================= */

          @media (max-width: 1100px) {
            .meghai-search-container {
              width: min(360px, 30vw);

              min-width: 250px;
            }
          }


          @media (max-width: 850px) {
            .meghai-search-container {
              width: 300px;

              min-width: 0;
            }

            .meghai-search-shortcut {
              display: none;
            }
          }


          @media (max-width: 680px) {
            .meghai-search-container {
              width: 100%;

              max-width: 100%;
            }

            .meghai-search-bar {
              height: 40px;
            }
          }
        `}
      </style>


      {/* =================================================
          SEARCH COMPONENT
          ================================================= */}

      <div
        className={`
          meghai-search-container
          ${
            isFocused
              ? 'meghai-search-focused'
              : ''
          }
        `}
      >

        {/* ===============================================
            MAIN SEARCH FORM
            =============================================== */}

        <form
          className="meghai-search-bar"
          onSubmit={handleSubmit}
        >

          {/* SEARCH ICON */}

          <div className="meghai-search-icon">
            <Search
              size={18}
              strokeWidth={2}
            />
          </div>


          {/* INPUT */}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onFocus={() =>
              setIsFocused(true)
            }
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
              }, 150);
            }}
            placeholder="Search weather, city, alerts..."
            aria-label="Search weather, city or alerts"
            className="meghai-search-input"
          />


          {/* CLEAR */}

          {query && (
            <button
              type="button"
              className="meghai-search-clear"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}


          {/* KEYBOARD SHORTCUT */}

          {!query && (
            <div className="meghai-search-shortcut">
              <span>⌘</span>
              <span>K</span>
            </div>
          )}


          {/* SEARCH SUBMIT */}

          {query && (
            <button
              type="submit"
              className="meghai-search-submit"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          )}

        </form>


        {/* ===============================================
            QUICK SEARCH DROPDOWN
            =============================================== */}

        {isFocused && !query && (
          <div className="meghai-search-dropdown">

            <div className="meghai-search-dropdown-header">

              <span>
                Quick Search
              </span>

              <span className="meghai-search-dropdown-hint">
                Explore MeghAI
              </span>

            </div>


            <div className="meghai-search-suggestions">

              {suggestions.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <button
                    key={title}
                    type="button"
                    className="meghai-search-suggestion"
                    onMouseDown={(event) =>
                      event.preventDefault()
                    }
                    onClick={() => {
                      setQuery(title);
                      inputRef.current?.focus();
                    }}
                  >

                    <div className="meghai-suggestion-icon">
                      <Icon size={17} />
                    </div>


                    <div className="meghai-suggestion-content">

                      <span className="meghai-suggestion-title">
                        {title}
                      </span>

                      <span className="meghai-suggestion-description">
                        {description}
                      </span>

                    </div>

                  </button>
                )
              )}

            </div>


            {/* FOOTER */}

            <div className="meghai-search-dropdown-footer">

              <span>
                Press <strong>Enter</strong> to search
              </span>

              <span>
                <strong>ESC</strong> to close
              </span>

            </div>

          </div>
        )}

      </div>
    </>
  );
};