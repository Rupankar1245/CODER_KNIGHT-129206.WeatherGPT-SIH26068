from django.urls import path

from .views import (
    CurrentWeatherView,
    HourlyForecastView,
    FiveDayForecastView,
    AirQualityView,
    WeatherAlertView,
    UVIndexView,
    MoonView,
    PrecipitationMapView,
    WeatherContextView,
    EdgeTTSView,
)

urlpatterns = [

    # =====================================================
    # CURRENT WEATHER
    # =====================================================

    path(
        "current/",
        CurrentWeatherView.as_view(),
        name="current-weather",
    ),

    # =====================================================
    # HOURLY FORECAST
    # =====================================================

    path(
        "hourly/",
        HourlyForecastView.as_view(),
        name="hourly-forecast",
    ),

    # =====================================================
    # 5-DAY FORECAST
    # =====================================================

    path(
        "forecast/",
        FiveDayForecastView.as_view(),
        name="five-day-forecast",
    ),

    # =====================================================
    # AIR QUALITY
    # =====================================================

    path(
        "air-quality/",
        AirQualityView.as_view(),
        name="air-quality",
    ),


    # =====================================================
    # WEATHER ALERT
    # =====================================================

    path(
        "alerts/",
        WeatherAlertView.as_view(),
        name="weather-alert",
    ),

    # =====================================================
    # UV INDEX
    # =====================================================

    path(
        "uv-index/",
        UVIndexView.as_view(),
        name="uv-index",
    ),

    # =====================================================
    # MOON DATA
    # =====================================================

    path(
        "moon/",
        MoonView.as_view(),
        name="moon-data",
    ),

    # =====================================================
    # PRECIPITATION MAP
    # =====================================================

    path(
        "map/precipitation/",
        PrecipitationMapView.as_view(),
        name="precipitation-map",
    ),

    # =====================================================
# COMPLETE WEATHER CONTEXT FOR AI
# =====================================================

    path(
        "context/",
        WeatherContextView.as_view(),
        name="weather-context",
    ),

    # =====================================================
# EDGE TEXT TO SPEECH
# =====================================================

    path(
        "tts/",
        EdgeTTSView.as_view(),
        name="edge-tts",
    ),
]