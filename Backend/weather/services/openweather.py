import requests
from django.conf import settings


class OpenWeatherService:
    """
    Service responsible for communicating with OpenWeather API.
    """

    CURRENT_WEATHER_URL = (
        "https://api.openweathermap.org/data/2.5/weather"
    )

    FORECAST_URL = (
        "https://api.openweathermap.org/data/2.5/forecast"
    )

    AIR_POLLUTION_URL = (
        "https://api.openweathermap.org/data/2.5/air_pollution"
    )

    ONE_CALL_URL = (
        "https://api.openweathermap.org/data/3.0/onecall"
    )

    # =========================================================
    # API KEY
    # =========================================================

    @classmethod
    def _get_api_key(cls):
        api_key = settings.OPENWEATHER_API_KEY

        if not api_key:
            raise ValueError(
                "OpenWeather API key is not configured."
            )

        return api_key

    # =========================================================
    # CURRENT WEATHER
    # =========================================================

    @classmethod
    def get_current_weather(
        cls,
        latitude: float,
        longitude: float,
    ):
        """
        Fetch current weather data.
        """

        api_key = cls._get_api_key()

        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "units": "metric",
        }

        response = requests.get(
            cls.CURRENT_WEATHER_URL,
            params=params,
            timeout=10,
        )

        response.raise_for_status()

        return response.json()

    # =========================================================
    # 5-DAY FORECAST
    # =========================================================

    @classmethod
    def get_forecast(
        cls,
        latitude: float,
        longitude: float,
    ):
        """
        Fetch 5-day / 3-hour forecast data.
        """

        api_key = cls._get_api_key()

        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "units": "metric",
        }

        response = requests.get(
            cls.FORECAST_URL,
            params=params,
            timeout=10,
        )

        response.raise_for_status()

        return response.json()

    # =========================================================
    # AIR QUALITY
    # =========================================================

    @classmethod
    def get_air_quality(
        cls,
        latitude: float,
        longitude: float,
    ):
        """
        Fetch current air pollution data.
        """

        api_key = cls._get_api_key()

        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
        }

        response = requests.get(
            cls.AIR_POLLUTION_URL,
            params=params,
            timeout=10,
        )

        response.raise_for_status()

        return response.json()

    # =========================================================
    # UV INDEX
    # =========================================================

    @classmethod
    def get_uv_index(
        cls,
        latitude: float,
        longitude: float,
    ):
        """
        Fetch current UV Index using
        OpenWeather One Call API 3.0.

        UV data is available through:
        current.uvi
        hourly.uvi
        daily.uvi
        """

        api_key = cls._get_api_key()

        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "units": "metric",

            # We only need current + hourly UV data.
            # This keeps the response smaller.
            "exclude": "minutely,daily,alerts",
        }

        response = requests.get(
            cls.ONE_CALL_URL,
            params=params,
            timeout=10,
        )

        # -----------------------------------------------------
        # Better error message for debugging
        # -----------------------------------------------------

        if not response.ok:

            try:
                error_data = response.json()
            except ValueError:
                error_data = {}

            message = error_data.get(
                "message",
                "Unknown OpenWeather error."
            )

            raise ValueError(
                f"OpenWeather UV API error "
                f"{response.status_code}: {message}"
            )

        return response.json()

    # =========================================================
# WEATHER MAP TILE
# =========================================================

    @classmethod
    def get_weather_map_tile(
        cls,
        layer: str,
        z: int,
        x: int,
        y: int,
    ):
        """
        Fetch a weather map tile from OpenWeather.

        Example layers:
        - precipitation_new
        - clouds_new
        - pressure_new
        - temp_new
        - wind_new
        """

        api_key = cls._get_api_key()

        url = (
            "https://tile.openweathermap.org/"
            f"map/{layer}/{z}/{x}/{y}.png"
        )

        params = {
            "appid": api_key,
        }

        response = requests.get(
            url,
            params=params,
            timeout=15,
        )

        response.raise_for_status()

        return response.content

    