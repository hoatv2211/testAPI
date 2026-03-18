# Treatstorm QR Voting Backend

A Next.js application for QR code-based voting system for the Treatstorm game.

## Features

- QR code generation for voting sessions
- Help/Hinder voting buttons
- Real-time vote counting
- Session-based voting

## API Endpoints

### POST /api/vote
Submit a vote: `{"sessionId": "abc", "voteType": "help"}`

### GET /api/summary?sessionId=abc
Get vote summary for a session.

## Pages

- `/` - Home page with QR code
- `/vote?session={sessionId}` - Voting page

## Deployment

Push to GitHub and import to Vercel.
