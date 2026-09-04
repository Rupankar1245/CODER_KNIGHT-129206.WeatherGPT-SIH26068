
import React, { useCallback, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SplashScreen } from './components/common/SplashScreen';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ForecastPage } from './pages/forecast/ForecastPage';
import { WeatherMapPage } from './pages/weather_maps/WeatherMapPage';
import AlertPage from './pages/alerts/AlertsPage';
import { AIInsightPage } from './pages/ai_insights/AiInsightsPage';
import AiChatPage from './pages/ai_chat/AiChatPage';
import SavedLocationPage from './pages/saved_locations/SavedLocationPage';
import SettingsPage from './pages/settings/SettingsPage';
import SectoralAdvisory from './pages/sectoral_advisory/SectoralAdvisory';
import DisasterMonitoring from './pages/disaster_monitoring/DisasterMonitoring';

const SPLASH_SESSION_KEY = 'meghai_splash_seen';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem(
      SPLASH_SESSION_KEY
    ) !== 'true';
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem(
      SPLASH_SESSION_KEY,
      'true'
    );

    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="/forecast"
        element={<ForecastPage />}
      />

      <Route
        path="/weather_maps"
        element={<WeatherMapPage />}
      />

      <Route
        path="/alerts"
        element={<AlertPage />}
      />

      <Route
        path="/ai_insights"
        element={<AIInsightPage />}
      />

      <Route
        path="/ai_chat"
        element={<AiChatPage />}
      />

      <Route
        path="/saved_locations"
        element={<SavedLocationPage />}
      />

      <Route
        path="/sectoral_advisory"
        element={<SectoralAdvisory />}
      />

      <Route
        path="/disaster_monitoring"
        element={<DisasterMonitoring />}
      />

      <Route
        path="/settings"
        element={<SettingsPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;
