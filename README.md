# Worker Lunch Recommendation App

[中文文档](README.zh.md) | English

An intelligent restaurant recommendation web application that helps office workers solve the "what to eat" dilemma.

## Project Background

This project originated from an AI Coding offline event, where we aimed to quickly build product demos using AI tools. As such, this product is still quite rough and requires extensive refinement. The idea for this product comes from a real-world need: during workdays, when lunchtime arrives, we often struggle with colleagues and friends to decide what to eat. We hope to help everyone make dining choices more easily through intelligent recommendations, avoiding the frustration of "choice paralysis."

## Features

- 🎯 **Smart Location**: Automatically get user location or manually input address
- 🍽️ **Personal Preferences**: Set taste, price, distance and other preferences
- 🤖 **AI Recommendations**: Integrated SiliconFlow API for intelligent recommendations
- 🗺️ **Map Integration**: Use Amap API to get nearby restaurant information
- 📱 **Responsive Design**: Adapted for mobile and desktop

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **API Integration**: Amap API, SiliconFlow API

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file and fill in the following variables as needed:

| Variable                  | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `VITE_AMAP_API_KEY`       | Amap API Key, required for production                                    |
| `VITE_AMAP_SIG_SECRET`    | (Optional) Used when enabling interface signature verification           |
| `VITE_SILICON_API_KEY`    | SiliconFlow API Key, used for AI recommendations                         |
| `VITE_SILICON_MODEL`      | (Optional) AI model name, default `Qwen/Qwen2.5-7B-Instruct`             |
| `VITE_SILICON_MAX_TOKENS` | (Optional) AI response token limit, default `2048`                       |
| `VITE_USE_DEMO_DATA`      | Set to `true` to use built-in demo data for development without API keys |

```env
VITE_AMAP_API_KEY=your_amap_api_key_here
VITE_AMAP_SIG_SECRET=
VITE_SILICON_API_KEY=your_silicon_api_key_here
VITE_SILICON_MODEL=Qwen/Qwen2.5-7B-Instruct
VITE_SILICON_MAX_TOKENS=2048
VITE_USE_DEMO_DATA=false
```

> ✅ Local experience without any API keys: Set `VITE_USE_DEMO_DATA` to `true`, the system will fall back to built-in restaurant and recommendation samples for quick contributor setup.

### 3. Start Development Server

```bash
pnpm run dev
```

### 4. Build for Production

```bash
pnpm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── store/              # State management
└── utils/              # Utility functions
```

## Core Features

### Location Acquisition

- Browser Geolocation API automatic positioning
- Amap API address resolution
- Manual address input

### Restaurant Search

- Location-based nearby restaurant search
- Multiple filtering conditions (distance, price, cuisine)
- Detailed restaurant information retrieval

### AI Recommendations

- Integrated SiliconFlow AI API
- Personalized recommendation algorithms
- Multi-dimensional rating system

### User Preferences

- Cuisine preference settings
- Price range selection
- Distance range settings
- Dietary restriction options

## API Configuration

### Amap API

- Application URL: https://lbs.amap.com/
- Required services: Geocoding, Reverse geocoding, Place search

### SiliconFlow API

- Application URL: https://siliconflow.cn/
- Default model: `Qwen/Qwen2.5-7B-Instruct` (can be overridden in `.env`)
- Default response `max_tokens=2048`, can be adjusted as needed

## Usage Instructions

1. **Get Location**: Allow browser to get location or manually input address
2. **Set Preferences**: Click settings button to configure personal preferences
3. **Get Recommendations**: Click "Start Recommendation" button to get intelligent recommendations
4. **View Details**: Click restaurant card to view detailed information
5. **Navigation**: Click navigation button to jump to map navigation

## Local Development Experience

- **Strict Types Enabled by Default**: `pnpm run dev` and `pnpm run build` use TypeScript strict configuration, consistent with CI.
- **Demo Data Mode**: Enable `VITE_USE_DEMO_DATA=true`, restaurant search and AI recommendations return built-in samples for offline or keyless debugging.
- **Submission Process**: Run `pnpm run validate` before submitting code to ensure type checking and ESLint pass.

## Development Roadmap

- [ ] Add user login and favorites feature
- [ ] Add restaurant reviews and rating system

## Contributing

Before submitting an Issue or Pull Request, please read [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

This project is released under the [MIT License](LICENSE).
