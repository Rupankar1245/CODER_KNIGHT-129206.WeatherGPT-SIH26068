from datetime import datetime
from .openweather import OpenWeatherService


class WeatherAlertService:
    """
    Detects significant weather conditions from
    OpenWeather forecast data and converts them
    into MeghAI weather alerts.
    """

    @classmethod
    def get_alert(
        cls,
        latitude: float,
        longitude: float,
    ) -> dict:

        # =====================================================
        # FETCH FORECAST DATA
        # =====================================================

        data = OpenWeatherService.get_forecast(
            latitude,
            longitude,
        )

        forecast_list = data.get("list", [])

        city = data.get("city", {})

        if not forecast_list:
            return {
                "active": False,
                "severity": "Low",
                "event": "",
                "description": "",
                "weather_type": "",
                "updated_at": datetime.now().strftime(
                    "%Y-%m-%d %H:%M"
                ),
                "location": {
                    "name": city.get("name"),
                    "country": city.get("country"),
                },
            }

        # =====================================================
        # CHECK FORECAST ITEMS
        # =====================================================

        for item in forecast_list:

            main = item.get("main", {})
            weather = item.get(
                "weather",
                [{}],
            )[0]
            wind = item.get("wind", {})

            weather_id = weather.get("id", 0)
            weather_main = (
                weather.get("main") or ""
            ).lower()

            temperature = main.get("temp")
            wind_speed = wind.get("speed", 0)
            rain_probability = (
                item.get("pop") or 0
            ) * 100

            # =================================================
            # THUNDERSTORM
            # =================================================

            if 200 <= weather_id < 300:

                return cls._build_alert(
                    severity="Severe",
                    event="Thunderstorm Alert",
                    description=(
                        "Thunderstorm conditions are "
                        "expected in your area. "
                        "Stay indoors and avoid "
                        "open areas if possible."
                    ),
                    weather_type="Thunderstorm",
                )

            # =================================================
            # HEAVY RAIN
            # =================================================

            if (
                weather_id in range(502, 505)
                or rain_probability >= 80
            ):

                return cls._build_alert(
                    severity="Moderate",
                    event="Heavy Rain Alert",
                    description=(
                        "Heavy rainfall is possible "
                        "in your area. Carry an umbrella "
                        "and take care while travelling."
                    ),
                    weather_type="Rain",
                )

            # =================================================
            # STRONG WIND
            # =================================================

            if wind_speed >= 15:

                return cls._build_alert(
                    severity="Moderate",
                    event="Strong Wind Alert",
                    description=(
                        "Strong winds are expected "
                        "in your area. Secure loose "
                        "objects and exercise caution."
                    ),
                    weather_type="Wind",
                )

            # =================================================
            # EXTREME HEAT
            # =================================================

            if (
                temperature is not None
                and temperature >= 40
            ):

                return cls._build_alert(
                    severity="Severe",
                    event="Extreme Heat Alert",
                    description=(
                        "Extremely high temperatures "
                        "are expected. Stay hydrated "
                        "and avoid prolonged exposure "
                        "to direct sunlight."
                    ),
                    weather_type="Heat",
                )

        # =====================================================
        # NO ACTIVE ALERT
        # =====================================================

        return {
            "active": False,
            "severity": "Low",
            "event": "",
            "description": "",
            "weather_type": "",
            "updated_at": datetime.now().strftime(
                "%Y-%m-%d %H:%M"
            ),
            "location": {
                "name": city.get("name"),
                "country": city.get("country"),
            },
        }

    # =========================================================
    # ALERT BUILDER
    # =========================================================

    @staticmethod
    def _build_alert(
        severity: str,
        event: str,
        description: str,
        weather_type: str,
    ) -> dict:

        return {
            "active": True,
            "severity": severity,
            "event": event,
            "description": description,
            "weather_type": weather_type,
            "updated_at": datetime.now().strftime(
                "%Y-%m-%d %H:%M"
            ),
        }