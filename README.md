# 🌦️ MeghAI

### AI-Powered Conversational Weather Intelligence Platform

> **MeghAI** is an intelligent weather platform designed to make weather information more accessible, understandable, and actionable through conversational AI.

Built for **SIH 2026 – Problem Statement ID 26068: WeatherGPT: Conversational AI for Weather Forecasting, Alerts, and Climate Information**, MeghAI combines real-time weather data, AI-powered conversations, intelligent alerts, climate insights, disaster monitoring, and personalized advisory into a unified platform.

---

## 🚀 Overview

Traditional weather applications often present large amounts of raw meteorological data that can be difficult for users to interpret.

**MeghAI transforms complex weather information into simple, contextual, and actionable insights.**

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

MeghAI focuses on transforming passive weather notifications into more understandable and actionable information.

---

### 🌪️ Disaster Monitoring

Monitor weather conditions that may indicate potential extreme events such as:

* Heavy rainfall
* Thunderstorms
* Strong winds
* Extreme temperatures

---

### 🌾 Sectoral Advisory

Generate weather-aware insights for different sectors, including:

* Agriculture
* Travel
* Daily commuting
* Outdoor activities

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

---

### 📍 Location-Based Weather

Get weather information based on the user's current geographical location.

---

### 💡 AI Weather Insights

MeghAI analyzes available weather information and presents important insights in a more human-friendly format.

---

## 🧠 Problem Statement

Weather information is widely available, but users often face challenges such as:

* Difficulty understanding complex meteorological data
* Fragmented information across multiple platforms
* Generic alerts with limited actionable guidance
* Lack of conversational interaction with weather systems
* Limited personalized insights for different user needs

### 💡 Our Solution

MeghAI creates a unified AI-powered weather intelligence system that allows users to:

**Ask → Understand → Analyze → Act**

Instead of simply displaying weather data, MeghAI aims to help users understand what the weather information actually means for them.

---

## 🏗️ System Architecture

```text
                     ┌──────────────────────┐
                     │     User Interface   │
                     │    React + Vite      │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │       MeghAI         │
                     │   Application Layer  │
                     └──────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
       ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
       │ Weather APIs │ │  AI Engine   │ │ Map Services │
       └──────────────┘ └──────────────┘ └──────────────┘
                │               │               │
                └───────────────┼───────────────┘
                                ▼
                     ┌──────────────────────┐
                     │ Intelligent Insights │
                     │ Alerts & Advisory    │
                     └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* Lucide React

### Backend

* Python
* Django
* Django REST Framework

### AI

* Google Gemini

### Weather Data

* OpenWeather API

### Weather Visualization

* Windy API

### Deployment

* Netlify – Frontend
* Render – Backend

---

## 📂 Project Structure

```text
meghai/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── forecast/
│   │   ├── weather-map/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── DashboardPage
│   │   ├── ForecastPage
│   │   ├── WeatherMapPage
│   │   ├── AlertsPage
│   │   └── AIInsightPage
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
VITE_GEMINI_MODEL=gemini-2.5-flash

VITE_WINDY_API_KEY=your_windy_api_key
```

> ⚠️ Never expose your API keys publicly or commit your `.env` file to GitHub.

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

The MeghAI backend is built using **Django and Django REST Framework**.

The backend provides APIs for:

* Current Weather
* Hourly Forecast
* Multi-Day Forecast
* Air Quality
* UV Index
* Weather Alerts
* Location-based Weather Data

Make sure the backend server is running before using the complete application.

---

## 🌐 API Integrations

MeghAI integrates multiple services to provide weather intelligence.

### OpenWeather

Used for:

* Current weather
* Forecast data
* Air quality
* Weather-related information

### Google Gemini

Used for:

* Conversational AI
* Weather explanations
* Context-aware insights
* Natural language interactions

### Windy

Used for:

* Interactive weather visualization
* Wind layers
* Temperature layers
* Rain layers
* Cloud visualization
* Atmospheric conditions

---

## 🎯 Use Cases

MeghAI can assist users in several real-world situations.

### 👨‍🌾 Agriculture

Weather-aware advisory can help users understand potential weather impacts on agricultural activities.

### ✈️ Travel

Users can analyze weather conditions before planning a journey.

### 🚶 Daily Activities

Get insights for commuting, outdoor activities, and daily planning.

### 🌪️ Extreme Weather Awareness

Monitor potentially dangerous weather conditions and understand possible impacts.

---

## 📸 Screenshots

> Screenshots and application previews will be added here.

```text
Dashboard
AI Chat
Weather Forecast
Interactive Weather Map
Weather Alerts
AI Insights
```

---

## 🗺️ Future Roadmap

* [ ] More advanced personalized weather recommendations
* [ ] Multilingual conversational support
* [ ] Improved disaster risk analysis
* [ ] Push notification system
* [ ] Historical weather analytics
* [ ] More sector-specific advisory
* [ ] Offline weather information support
* [ ] Voice-based AI interaction
* [ ] Advanced climate insights

---

## 🧩 Core Philosophy

```text
Raw Weather Data
       ↓
AI Understanding
       ↓
Contextual Insights
       ↓
Actionable Guidance
```

MeghAI aims to move beyond traditional weather applications by making weather information **conversational, intelligent, and actionable**.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

---

## 👥 Team

Developed as part of **Smart India Hackathon (SIH) 2026**.

### Project

**MeghAI – AI-Powered Conversational Weather Intelligence Platform**

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

It helps support the development of **MeghAI**.

---

<div align="center">

### 🌦️ MeghAI

**Ask the Weather. Understand the Future. Act Smarter.**

Built with ❤️ for **Smart India Hackathon 2026**

</div>
