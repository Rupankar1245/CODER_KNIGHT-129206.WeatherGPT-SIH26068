import requests

from datetime import date
from django.conf import settings


class MoonService:
    """
    Service responsible for communicating with
    MET Norway Sunrise API 3.0 for lunar data.
    """

    MOON_URL = (
        "https://api.met.no/weatherapi/"
        "sunrise/3.0/moon"
    )

    # =========================================================
    # USER AGENT
    # =========================================================

    @classmethod
    def _get_headers(cls):
        """
        MET Norway requires an identifying User-Agent.

        You can configure this in Django settings.
        """

        user_agent = getattr(
            settings,
            "MET_API_USER_AGENT",
            None,
        )

        if not user_agent:

            # Fallback for local development.
            user_agent = (
                "MeghAI/1.0 "
                "https://meghai.me"
            )

        return {
            "User-Agent": user_agent,
            "Accept": "application/json",
        }

    # =========================================================
    # FETCH MOON DATA
    # =========================================================

    @classmethod
    def get_moon_data(
        cls,
        latitude: float,
        longitude: float,
        timezone_offset: str = "+05:30",
        target_date: str | None = None,
    ):
        """
        Fetch moon data for a specific location.

        Parameters
        ----------
        latitude:
            Location latitude.

        longitude:
            Location longitude.

        timezone_offset:
            UTC offset in ISO 8601 format.

            Examples:
            +05:30
            -04:00

        target_date:
            Date in YYYY-MM-DD format.

            If not provided,
            today's date is used.

        Returns
        -------
        dict:
            Raw MET Norway Moon API response.
        """

        # -----------------------------------------------------
        # DATE
        # -----------------------------------------------------

        if target_date is None:

            target_date = (
                date.today()
                .isoformat()
            )

        # -----------------------------------------------------
        # COORDINATE PRECISION
        # -----------------------------------------------------
        #
        # MET Norway recommends coordinates
        # with maximum 4 decimal places.
        # -----------------------------------------------------

        latitude = round(
            float(latitude),
            4,
        )

        longitude = round(
            float(longitude),
            4,
        )

        # -----------------------------------------------------
        # REQUEST PARAMETERS
        # -----------------------------------------------------

        params = {
            "lat": latitude,
            "lon": longitude,
            "date": target_date,
            "offset": timezone_offset,
        }

        # -----------------------------------------------------
        # API REQUEST
        # -----------------------------------------------------

        response = requests.get(
            cls.MOON_URL,
            params=params,
            headers=cls._get_headers(),
            timeout=10,
        )

        # -----------------------------------------------------
        # ERROR HANDLING
        # -----------------------------------------------------

        if not response.ok:

            try:

                error_data = (
                    response.json()
                )

            except ValueError:

                error_data = {}

            message = (
                error_data.get(
                    "message"
                )
                or error_data.get(
                    "detail"
                )
                or response.text
                or "Unknown MET Norway API error."
            )

            raise ValueError(
                "MET Norway Moon API error "
                f"{response.status_code}: "
                f"{message}"
            )

        # -----------------------------------------------------
        # RETURN RAW DATA
        # -----------------------------------------------------

        return response.json()