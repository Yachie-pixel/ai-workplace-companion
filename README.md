# AI Workplace Companion

AI Workplace Productivity Assistant — Build Prompt

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

Core Requirements

Create a professional AI productivity tool for workplace users with three main features:

Smart Email Generator

AI Research Assistant

AI Workplace Chatbot

The application must be immediately accessible.

No Authentication

Do NOT create registration, login, sign-in, authentication, user accounts, or onboarding.

When a user opens the application, they should immediately see the dashboard and be able to use the tools.

No Backend

Do not create or require a custom backend, database, authentication system, or user-management system.

Keep the application frontend-focused.

However, the AI features must use real AI generation. Do not use hardcoded, predefined, fake, or generic responses.

Connect the AI functionality to an appropriate AI API/integration available to the project so that responses are dynamically generated from the user's actual prompts and inputs.

If an API key or AI provider configuration is required, structure the application so it is easy to configure.

Design

Use a clean, modern, professional B2B SaaS design.

Primary colors:

Navy

Light blue

White

Very light gray backgrounds

Suggested palette:

Navy: #0B1F3A

Blue: #2563EB

Light Blue: #DBEAFE

Background: #F8FAFC

Text: #0F172A

Secondary text: #64748B

Use:

Rounded cards

Subtle borders

Soft shadows

Generous whitespace

Modern typography

Clear visual hierarchy

Professional icons

Smooth but minimal animations

Avoid excessive gradients, neon colors, clutter, and unnecessary decorative elements.

Dashboard

Create a responsive dashboard with a left sidebar.

Sidebar navigation:

Dashboard

Email Generator

Research Assistant

AI Chat

Also include:

Saved Work

Settings

These can use local browser storage if needed, but do not create a backend.

Dashboard content:

Welcome message

"Good morning 👋"

"Your AI workplace assistant is ready to help you get more done."

Create three main feature cards:

Smart Email Generator

"Generate professional workplace emails using AI."

Button: Generate Email

Research Assistant

"Research topics, summarize information, and generate actionable insights."

Button: Start Research

AI Workplace Chat

"Ask AI for help with workplace tasks, ideas, writing, planning, and decision-making."

Button: Open AI Chat

Add a small "AI Productivity Tip" card and a responsible AI disclaimer.

Smart Email Generator

Create a dedicated email generation page.

Inputs:

Recipient / Audience

Email Purpose

Key Points

Tone

Formal

Friendly

Persuasive

Length

Concise

Balanced

Detailed

Additional Instructions

Button:

Generate Email

When clicked, send the user's actual input to the AI and generate a genuinely customized email.

Do NOT return generic sample text.

The AI output should include:

Subject

Email body

Professional formatting

Place the result in an editable text editor.

Actions:

Edit

Copy

Regenerate

Save

The user must be able to modify the generated email before copying it.

AI Research Assistant

Create a dedicated research page.

Input:

Research Topic

Example:

"How artificial intelligence is changing workplace productivity"

Additional options:

Quick Overview

Detailed Summary

Business Insights

Recommendations

Pros & Cons

Output format options:

Executive Summary

Key Insights

Recommendations

Business Brief

When the user clicks Start Research, use the AI to generate a response based on the user's actual topic and selected options.

Do NOT use hardcoded research answers.

Display the AI response in sections:

Executive Summary

Key Insights

Opportunities

Recommendations

Considerations

Allow the result to be edited, copied, regenerated, and saved.

Clearly distinguish between AI-generated information and verified information.

AI Workplace Chat

Create a modern chatbot interface.

Welcome message:

"Hi! I'm your AI workplace assistant. How can I help you today?"

Provide suggested prompts such as:

Draft a professional email

Help me prepare for a meeting

Create a project plan

Improve this message

Brainstorm ideas

Summarize a topic

The suggestions should populate the chat input rather than return predetermined answers.

Chat input:

"Ask anything about your workplace task..."

When the user sends a message, send the actual user prompt to the AI and display the AI-generated response.

Do NOT use canned chatbot responses.

Allow users to:

Copy responses

Edit responses

Regenerate responses

Save responses

Maintain conversation context during the current browser session where possible.

Structured AI Prompts

Use structured inputs to improve AI results:

Context
What is the situation?

Task
What should the AI do?

Audience
Who is the output for?

Tone
How should it sound?

Desired Output
What format should the AI use?

Include an optional "Improve Prompt" or "Add Context" section.

Saved Work

Create a simple Saved Work page using local browser storage only.

Users can save:

Generated emails

Research results

Chat responses

No database or backend.

Allow users to:

View

Edit

Copy

Delete saved items

Responsible AI

Display this disclaimer in the application:

"AI-generated content may contain errors or omissions. Review important information before using or sharing it. Users remain responsible for reviewing and approving AI-generated content."

Also remind users not to enter confidential or sensitive workplace information unless permitted by their organization's policies.

Responsive Design

The application must work properly on:

Desktop

Laptop

Tablet

Mobile

Desktop should use a persistent sidebar.

Mobile should use a collapsible navigation menu.

All forms, AI outputs, chat messages, and buttons must be mobile-friendly.

Important Technical/Product Rules

No registration.

No login.

No authentication.

No custom backend.

No database.

No hardcoded AI responses.

No generic placeholder responses presented as AI.

AI responses must be dynamically generated from the user's actual input.

Use local browser storage only for saved work or temporary preferences.

AI-generated outputs must be editable.

Include loading, error, and retry states for AI requests.

Keep the UI polished and professional.

Do not add unnecessary features that increase complexity.

Prioritize the three core AI experiences: Email Generator, Research Assistant, and AI Chat.

The finished application should feel like a polished AI workplace productivity SaaS product that a professional could immediately open and use without creating an account.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/27a8c14d-8884-4a44-9097-ce00d9a9ad5e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
