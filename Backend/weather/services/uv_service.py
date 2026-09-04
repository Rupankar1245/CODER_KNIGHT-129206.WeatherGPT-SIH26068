import requests

from django.conf import settings


class UVService:
    """
    Service responsible for fetching UV Index data
    from WeatherAPI.com.
    """

    UV_INDEX_URL = (
        "https://api.weatherapi.com/v1/current.json"
    )

    @classmethod
    def get_uv_index(
        cls,
        latitude: float,
        longitude: float,
    ) -> dict:
        """
        Fetch current UV Index data for the given coordinates.
        """

        # =====================================================
        # API KEY
        # =====================================================

        api_key = settings.WEATHERAPI_KEY

        if not api_key:

            raise ValueError(
                "WEATHERAPI_KEY is not configured."
            )

        # =====================================================
        # REQUEST PARAMETERS
        # =====================================================

        params = {
            "key": api_key,
            "q": f"{latitude},{longitude}",
        }

        # =====================================================
        # API REQUEST
        # =====================================================

        try:

            response = requests.get(
                cls.UV_INDEX_URL,
                params=params,
                timeout=10,
            )

            response.raise_for_status()

            data = response.json()

        except requests.exceptions.Timeout:

            raise ValueError(
                "WeatherAPI UV request timed out."
            )

        except requests.exceptions.HTTPError as error:

            if (
                error.response is not None
                and error.response.status_code == 401
            ):
                raise ValueError(
                    "WeatherAPI authentication failed. "
                    "Please check WEATHERAPI_KEY."
                )

            if (
                error.response is not None
                and error.response.status_code == 429
            ):
                raise ValueError(
                    "WeatherAPI rate limit exceeded. "
                    "Please try again later."
                )

            raise ValueError(
                f"WeatherAPI error: {error}"
            )

        except requests.exceptions.RequestException as error:

            raise ValueError(
                f"WeatherAPI request error: {error}"
            )

        # =====================================================
        # VALIDATE RESPONSE
        # =====================================================

        if not data:

            raise ValueError(
                "UV data unavailable."
            )

        # =====================================================
        # RETURN RAW WEATHERAPI RESPONSE
        # =====================================================

        return data