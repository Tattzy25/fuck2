# AI Reasoning App

An AI-powered web application built with Next.js that provides reasoning, chat, search, and task management capabilities using advanced AI models like DeepSeek R1.

## Features

- **Reasoning API**: Advanced reasoning capabilities with streaming responses
- **Chat Interface**: Interactive AI conversations
- **Search Functionality**: AI-powered search features
- **Task Management**: Task-oriented API endpoints
- **Real-time Streaming**: Up to 30-second streaming responses
- **Modern UI**: Built with React components and modern design

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **UI**: React with custom components
- **AI Integration**: Vercel AI package with DeepSeek models
- **Styling**: CSS with modern design system
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Tattzy25/fuck2.git
   cd fuck2
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Endpoints

The application provides several API endpoints:

### POST `/api/reasoning`
- Handles reasoning requests with DeepSeek R1 model
- Supports streaming responses with reasoning content
- Request: `{ "model": "string", "messages": "UIMessage[]" }`

### POST `/api/chat`
- Provides chat functionality
- Route: `fuck/app/api/chat/route.ts`

### POST `/api/search`
- Handles search queries
- Route: `fuck/app/api/search/route.ts`

### POST `/api/tasks`
- Manages task operations
- Route: `fuck/app/api/tasks/route.ts`

## Project Structure

```
fuck/
├── app/
│   ├── api/
│   │   ├── reasoning/
│   │   │   └── route.ts
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── tasks/
│   │       └── route.ts
│   ├── components/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ai-elements/
│   │   ├── reasoning.tsx
│   │   └── ...
│   └── ui/
│       └── ...
└── lib/
    └── utils.ts
```

## Configuration

- **maxDuration**: API routes are configured for up to 30 seconds of streaming
- **Font**: Uses Geist font family for modern typography
- **ESLint**: Configured for code linting

## Development

- Modify pages in `app/` directory
- Add components in `components/` directory
- API routes in `app/api/` directory
- The application auto-reloads during development

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy easily to Vercel or any platform supporting Next.js:

1. Push to your repository
2. Connect to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI Package](https://vercel.com/docs/ai)
- [DeepSeek R1 Model](https://platform.deepseek.com/)
