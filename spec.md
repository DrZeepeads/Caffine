# Nelson GPT - Pediatric AI Chat Interface

## Overview
Nelson-GPT is a Progressive Web App (PWA) chat-based AI application designed for pediatric knowledge with a warm, professional design using amber, beige, and neutral gray color palette (no blue tones). The interface follows a Perplexity-style layout but is rebranded for pediatric use.

## Core Features

### PWA Support
- Full Progressive Web App implementation with manifest.json
- App name: "Nelson-GPT", short_name: "Nelson-GPT"
- Standalone display mode for native app experience
- Theme color and background color matching the amber color palette
- Service worker registration for offline functionality and installability
- "Add to Home Screen" prompt for users
- App icon support for all required PWA sizes
- Content language: English

### Splash Screen
- Custom splash screen displayed on app launch
- "Nelson-GPT" title with animated typing effect
- Subtitle: "Pediatric Knowledge at Your Finger Tips"
- Smooth transition from splash to welcome screen
- Branded styling consistent with app design

### Welcome Screen
- Mobile-first design with vertically centered layout
- Large input card (90% width, max 480px, 240px height) with white background and soft shadow
- Mode toggle with two options: "Academic" (amber) and "Clinical" (green)
- Multiline text input (max 3 lines) with placeholder "Ask Nelson-GPT anything…"
- Circular send button (44x44px) with paper-plane icon in amber color
- Auto-focus on input field

### Chat Interface
- Animated transition from welcome screen to chat interface
- Header with back button, "Nelson-GPT" title, and menu button
- Chat thread with message bubbles:
  - User messages: right-aligned, beige background (#F4EFEA), with user avatar
  - AI messages: left-aligned, white background with shadow, amber "N" avatar
- Inline citations displayed as numbered references [1], [2], etc.
- Expandable citation details
- Follow-up question chips below AI responses
- Input dock at bottom (64px height) with voice icon, typing field, and send button
- Mini mode toggle above input dock
- Typing indicator with 3-dot animation

### Navigation
- Sidebar with profile card at top
- Action items: New Chat, Recent Chats, Pinned/Saved chats
- Settings section: Theme, Font, Notifications, AI Tone, Depth, Privacy, Help
- Log out link in footer

### Chat Management
- Chat history persistence with ability to pin, rename, and delete conversations
- Local storage of chat sessions
- Streaming chat responses with real-time updates

### App Footer
- "Powered by Nelson Textbook of Pediatrics" text displayed in footer
- Visible on all screens in subtle, centered styling
- Consistent with overall app design

## Technical Requirements

### PWA Implementation
- Manifest.json configuration with all required properties
- Service worker for caching and offline functionality
- Install prompt handling
- Native app appearance when installed
- Icon generation for all PWA required sizes

### Animations
- Smooth transitions using spring animations (400ms duration)
- Fade effects (200ms duration)
- 60fps performance target
- Input card animation from center to bottom dock on first message
- Animated typing effect for splash screen title

### State Management
- Chat history and current conversation state
- User preferences and settings
- Mode selection (Academic/Clinical)
- Sidebar navigation state
- PWA installation state

### Message Rendering
- Markdown support for formatted text
- Code block syntax highlighting
- Mathematical expressions rendering
- Citation linking and expansion

### Keyboard Support
- Keyboard shortcuts for common actions
- Enter to send messages
- Navigation shortcuts

## Backend Requirements
The backend must store:
- Chat conversation history for each user session
- User preferences and settings
- Pinned and saved conversations
- Citation data and references

Backend operations:
- Save and retrieve chat conversations
- Process AI chat requests with streaming responses
- Manage user settings and preferences
- Handle citation data and follow-up suggestions

## Design Specifications
- Color palette: amber primary, beige secondary, neutral gray, green for clinical mode
- Typography: Professional, readable font family
- Border radius: 18-20px for cards, full radius for input elements
- Shadows: Soft, subtle shadows for depth
- Spacing: Consistent 16px padding, appropriate margins
- Mobile-first responsive design
- PWA-compliant design for native app experience
