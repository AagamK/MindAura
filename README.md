# MindAura - Your AI Wellness Companion

MindAura is an AI-powered chat application designed to provide a safe, supportive, and non-judgmental space for users to explore their thoughts and feelings. It acts as a mental wellness companion, offering empathetic conversations and a place for quiet reflection.

## Key Features

*   **Empathetic AI Chat:** Engage in mindful conversations with an AI companion trained to be supportive and understanding.
*   **Mood Selection:** Start your session by selecting your current mood, allowing the AI to tailor its conversation to your emotional state.
*   **User Authentication:** Secure sign-up and login functionality to protect user privacy and conversation history.
*   **Modern, Responsive UI:** A clean, beautiful, and intuitive interface that works seamlessly across all devices.

## Tech Stack

This application is built with a modern, serverless architecture designed for performance and scalability.

### Frontend

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)

### Backend & Services

*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth) is used for secure user sign-up and login, supporting both email/password and Google social login.
*   **Generative AI:** The conversational AI is powered by [Google's Genkit](https://firebase.google.com/docs/genkit) and the Gemini family of models.
*   **Hosting:** The application is deployed on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

## Getting Started

The application is ready to run. To start the development server, you can use the following command:

```bash
npm run dev
```

This will start the Next.js development server, typically on port 9002.
