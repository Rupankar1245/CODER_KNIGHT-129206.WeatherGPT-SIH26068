# 🌦️ WeatherGPT

### AI-Powered Conversational Weather Intelligence Platform

> **WeatherGPT** is an intelligent weather platform designed to make weather information more accessible, understandable, and actionable through conversational AI.

Built for **SIH 2026 – Problem Statement ID 26068: WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information**, WeatherGPT combines real-time weather data, AI-powered conversations, intelligent alerts, climate insights, disaster monitoring, and personalized advisory into a unified platform.

---

## 🚀 Overview

Traditional weather applications often present large amounts of raw meteorological data that can be difficult for users to interpret.

**WeatherGPT transforms complex weather information into simple, contextual, and actionable insights.**

Users can interact naturally with the platform to understand:

* 🌡️ Current weather conditions
* ⏳ Hourly weather forecasts
* 📅 Multi-day forecasts
* 🚨 Severe weather alerts
* 🌬️ Air quality information
* 🗺️ Interactive weather maps
* 🤖 AI-generated weather insights
* 🌪️ Disaster monitoring
* 🌾 Sector-specific weather advisory

---

## ✨ Key Features

### 🤖 Conversational AI

Ask weather-related questions naturally and receive intelligent, easy-to-understand responses.

**Examples:**

> "Will it rain tomorrow?"

> "Is it safe to travel today?"

> "What should farmers be aware of this week?"

---

### 🌤️ Real-Time Weather Information

Get up-to-date information including:

* Temperature
* Feels-like temperature
* Humidity
* Wind speed and direction
* Atmospheric pressure
* Visibility
* Cloud cover
* Sunrise and sunset

---

### ⏰ Hourly Forecast

View detailed hourly weather predictions to plan your day more effectively.

---

### 📆 Multi-Day Forecast

Access upcoming weather forecasts to support better planning and decision-making.

---

### 🚨 Intelligent Weather Alerts

Receive important alerts related to potentially hazardous weather conditions.

WeatherGPT focuses on transforming passive weather notifications into more understandable and actionable information.

---

### 🌪️ Disaster Monitoring

Monitor weather conditions that may indicate potential extreme events such as:

* Heavy rainfall
* Thunderstorms
* Strong winds
* Extreme temperatures
* Other potentially hazardous weather conditions

---

### 🌾 Sectoral Advisory

Generate weather-aware insights for different sectors, including:

* Agriculture
* Marine
* Aviation
* Urban activities

---

### 🌍 Air Quality Monitoring

Track air quality information and understand environmental conditions more easily.

---

### 🗺️ Interactive Weather Map

Explore weather conditions visually through an interactive map with multiple layers such as:

* Wind
* Temperature
* Rain
* Clouds
* Pressure
* Gusts
* Waves

---

### 📍 Location-Based Weather

Get weather information based on the user's current geographical location.

---

### 💡 AI Weather Insights

WeatherGPT analyzes available weather information and presents important insights in a more human-friendly format.

Instead of overwhelming users with raw meteorological values, the platform highlights important conditions, trends, and potential impacts.

---

## 🧠 Problem Statement

Weather information is widely available, but users often face challenges such as:

* Difficulty understanding complex meteorological data
* Fragmented information across multiple platforms
* Generic alerts with limited actionable guidance
* Lack of conversational interaction with weather systems
* Limited personalized insights for different user needs
* Difficulty connecting weather conditions with real-world decisions

### 💡 Our Solution

WeatherGPT creates a unified AI-powered weather intelligence system that allows users to:

**Ask → Understand → Analyze → Act**

Instead of simply displaying weather data, WeatherGPT aims to help users understand what the weather information actually means for them.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │     User Interface   │
                    │   React + TypeScript │
                    │        + Vite        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      WeatherGPT      │
                    │   Application Layer  │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │ Weather APIs │ │  AI Engine   │ │ Map Services │
       └──────────────┘ └──────────────┘ └──────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Intelligent Insights │
                    │ Alerts & Advisory    │
                    │ Disaster Monitoring  │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Python
* Django
* Django REST Framework

### AI

* Google Gemini
* Natural Language Processing
* Generative AI

### Weather Data

* OpenWeather API
* Open-Meteo
* MET Norway

### Weather Visualization

* Windy

### NWP Models

* GFS
* WRF

### Deployment

* Netlify – Frontend
* Render – Backend

### Containerization & Orchestration

* Docker
* Kubernetes

### Real-Time Communication

* WebSocket
* MQTT / WIS2.0 integration

---

## 📂 Project Structure

```text
weathergpt/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── forecast/
│   │   ├── weather_maps/
│   │   ├── alerts/
│   │   ├── ai_insights/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── DashboardPage
│   │   ├── ForecastPage
│   │   ├── WeatherMapPage
│   │   ├── AlertsPage
│   │   ├── AIInsightPage
│   │   └── AIChatPage
│   │
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── App.tsx
│
├── public/
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git
```

### 2. Navigate to the Project Directory

```bash
cd REPOSITORY-NAME
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create a `.env` file in the root directory.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/
VITE_BACKEND_URL=http://127.0.0.1:8000/

VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-3.1-flash-lite

VITE_WINDY_API_KEY=your_windy_api_key
```

> ⚠️ **Security:** Never expose your API keys publicly or commit your `.env` file to GitHub.

Add `.env` to your `.gitignore` file:

```text
.env
.env.local
```

---

## ▶️ Run the Application

Start the development server:

```bash
npm run dev
```

The application will typically run at:

```text
http://localhost:5173
```

---

## 🔗 Backend Setup

The WeatherGPT backend is built using **Django and Django REST Framework**.

The backend provides APIs for:

* Current Weather
* Hourly Forecast
* Multi-Day Forecast
* Air Quality
* UV Index
* Weather Alerts
* Location-based Weather Data
* Weather-related processing and transformation

Make sure the backend server is running before using the complete application.

The backend can be started using:

```bash
python manage.py runserver
```

The development backend will typically run at:

```text
http://127.0.0.1:8000/
```

---

## 🌐 API Integrations

WeatherGPT integrates multiple services to provide comprehensive weather intelligence.

### OpenWeather

Used for:

* Current weather
* Forecast data
* Air quality
* Weather-related information
* Location-based weather information

### Open-Meteo

Used as an additional meteorological data source for weather and forecast information.

### MET Norway

Used as an additional weather data source for meteorological information and related weather parameters.

### Google Gemini

Used for:

* Conversational AI
* Weather explanations
* Context-aware insights
* Natural language interactions
* Personalized weather interpretation

### Windy

Used for:

* Interactive weather visualization
* Wind layers
* Temperature layers
* Rain layers
* Cloud visualization
* Atmospheric conditions
* Other weather-map layers

---

## 🔄 Application Workflow

```text
User Query / Location
          │
          ▼
   WeatherGPT Interface
          │
          ▼
    Backend API Layer
          │
     ┌────┼─────┐
     ▼    ▼     ▼
  Weather AI   Map
   APIs      Engine Services
     │    │     │
     └────┼─────┘
          ▼
   Data Processing
          │
          ▼
   AI Context Analysis
          │
          ▼
  Human-Friendly Response
          │
          ▼
 Actionable Weather Guidance
```

---

## 🎯 Use Cases

WeatherGPT can assist users in several real-world situations.

### 👨‍🌾 Agriculture

Weather-aware advisory can help users understand potential weather impacts on agricultural activities.

Examples include:

* Rainfall awareness
* Temperature conditions
* Weather-sensitive planning
* Extreme weather awareness

### 🌊 Marine

Weather intelligence can support marine-related planning by providing information about:

* Wind conditions
* Waves
* Rainfall
* Atmospheric conditions
* Potential hazardous weather

### ✈️ Aviation

Weather information can support aviation-related awareness through:

* Wind conditions
* Visibility
* Temperature
* Pressure
* Weather alerts
* Potential severe conditions

### 🏙️ Urban Activities

Weather intelligence can support urban planning and daily activities through:

* Rainfall awareness
* Temperature conditions
* Air quality
* Severe weather alerts
* Commuting-related insights

### 🌪️ Extreme Weather Awareness

Monitor potentially dangerous weather conditions and understand their possible impacts.

---

## 📊 Core Intelligence Pipeline

```text
Raw Meteorological Data
          ↓
Data Aggregation
          ↓
Weather Data Processing
          ↓
AI Context Generation
          ↓
Natural Language Understanding
          ↓
Contextual Weather Insights
          ↓
Actionable Guidance
```

---

## 📸 Screenshots

Screenshots and application previews can be added here.

Recommended sections:

```text
Dashboard
AI Chat
Weather Forecast
Interactive Weather Map
Weather Alerts
AI Weather Insights
Sectoral Advisory
Disaster Monitoring
```

---

## 🗺️ Future Roadmap

* [ ] Advanced personalized weather recommendations
* [ ] Expanded multilingual conversational support
* [ ] Improved disaster risk analysis
* [ ] Push notification system
* [ ] Historical weather analytics
* [ ] Advanced sector-specific advisory
* [ ] Offline weather information support
* [ ] Voice-based AI interaction
* [ ] Advanced climate insights
* [ ] GFS model integration
* [ ] WRF model integration
* [ ] Improved real-time meteorological data streaming
* [ ] Advanced weather prediction and visualization

---

## 🧩 Core Philosophy

```text
          Raw Weather Data
                 ↓
          Data Processing
                 ↓
          AI Understanding
                 ↓
       Contextual Insights
                 ↓
        Actionable Guidance
                 ↓
          Smarter Decisions
```

WeatherGPT aims to move beyond traditional weather applications by making weather information:

**Conversational • Intelligent • Contextual • Actionable**

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the Repository

### 2. Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

Implement and test your changes locally.

### 4. Commit Your Changes

```bash
git commit -m "Add your feature"
```

### 5. Push the Branch

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open a Pull Request describing your changes and improvements.

---

## 👥 Team

Developed as part of **Smart India Hackathon (SIH) 2026**.

### Project

**WeatherGPT – AI-Powered Conversational Weather Intelligence Platform**

### Problem Statement

**ID: 26068**

**WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information**

---

## 📜 License

This project is currently developed for educational, research, and hackathon purposes.

License information will be added in future releases.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐.

It helps support the development and improvement of **WeatherGPT**.

---

<div align="center">

### 🌦️ WeatherGPT

**Ask the Weather. Understand the Future. Act Smarter.**

Built with ❤️ for **Smart India Hackathon 2026**

</div>
