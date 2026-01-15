# Assignment 2 : News Aggregator API

A RESTful API for personalized news aggregation built with Node.js and Express. This project demonstrates authentication with JWT, user preferences management, and integration with the NewsAPI.ai external API for fetching news articles.

**Tech stack:** Node.js, Express.js, bcrypt, JWT, MongoDB, Mongoose, NewsAPI.ai

**Key features:**

- User authentication with bcrypt and JWT tokens
- Personalized news preferences with granular filtering options
- Integration with NewsAPI.ai for real-time news articles
- Token-based security with middleware protection
- Preference management (keywords, languages, sorting, sentiment filtering, etc.)

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (local instance running)
- A valid API key from NewsAPI.ai (sign up at https://newsapi.ai or use the demo key)

## Installation

Install dependencies:

```bash
npm install
```

## Running the app

Start the server:

```bash
npm start
```

Development mode (auto-reload):

```bash
npm run dev
```

The server listens on port `3000` by default, so the base URL is:

```
http://localhost:3000
```

There is also a simple health endpoint at `/health`.

## MongoDB Setup

This project requires a local MongoDB instance. If you don't have MongoDB installed, follow the [official installation guide](https://www.mongodb.com/docs/manual/installation/).

**Quick setup steps:**

1. Ensure MongoDB is running locally on `mongodb://localhost:27017`
2. The application will automatically create a database and collections on first run
3. No manual database setup is needed - Mongoose handles schema creation

**Verify MongoDB is running:**

```bash
mongosh
```

If the connection succeeds, you're ready to go. Type `exit` to quit the MongoDB shell.

## Environment Setup

Before running the application, configure your environment:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:

   ```plaintext
   MONGODB_URI=mongodb://localhost:27017/
   DB_NAME=news_aggregator_api_dev
   JWT_SECRET=your_secure_random_string
   NEWSAPI_KEY=your_newsapi_key
   PORT=3000
   ```

   **Note:** A demo NewsAPI key is included in `.env.example` for evaluation purposes. Generate your own JWT_SECRET using a secure random string.

## External API Integration

This project uses **NewsAPI.ai** to fetch personalized news articles. The NewsAPI.ai service provides access to millions of news articles from around the world with advanced filtering capabilities.

Key features of the NewsAPI.ai integration:

- Search articles by keywords with advanced query syntax
- Filter by language, source importance, and publication date
- Sort results by date, source importance, or social media score
- Sentiment analysis scoring for each article
- Duplicate detection and filtering
- Access to global news sources and trending topics

For more details, visit the [NewsAPI.ai Documentation](https://newsapi.ai/documentation).

**API Key Notice:** A demo API key is included in `.env.example` for evaluation convenience. This key is non-production and intended strictly for assignment evaluation. In production, API keys must never be committed and should always be stored securely in environment variables.

## Database & Validation

- User data is persisted in MongoDB with Mongoose ORM ([models/UserModel.js](models/UserModel.js)).
- User authentication uses bcrypt for password hashing and JWT for token-based sessions.

## User Preferences Schema

Each user can customize their news feed with detailed preferences:

- **keyword** (array of strings): Keywords to search for in articles
- **language** (array): Supported languages: `eng`, `hin`, `kan`, `spa`, `ita`, `deu`, `zho` (default: `eng`)
- **ignoreKeyword** (array of strings): Keywords to exclude from results
- **articlesSortBy** (string): Sort articles by `date`, `sourceImportance`, or `socialScore` (default: `sourceImportance`)
- **articlesSortByAsc** (boolean): Sort in ascending order (default: `false` for descending)
- **articlesCount** (number): Number of articles to return (1-100, default: 50)
- **maxDaysBack** (number): Maximum age of articles in days (1-30, default: 1)
- **isDuplicateFilter** (string): Duplicate handling (`skipDuplicates`, `keepOnlyDuplicates`, `keepAll`, default: `skipDuplicates`)
- **minSentiment** (number): Minimum sentiment score (-1 to 1, default: -1)
- **maxSentiment** (number): Maximum sentiment score (-1 to 1, default: 1)

## API Endpoints

All examples assume the server is running at `http://localhost:3000`.

### Authentication

- **Register a new user**
  - Method: `POST`
  - Endpoint: `/api/v1/auth/register`
  - Request body (JSON):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

    - Example curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securePassword123"}'
```

- **Login**
  - Method: `POST`
  - Endpoint: `/api/v1/auth/login`
  - Request body (JSON):

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

    - Example curl:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePassword123"}'
```

    - Response includes a JWT token for subsequent authenticated requests.

### Preferences

All preference endpoints require a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

- **Get user preferences**
  - Method: `GET`
  - Endpoint: `/api/v1/preferences`
  - Example curl:

```bash
curl http://localhost:3000/api/v1/preferences \
  -H "Authorization: Bearer your_jwt_token"
```

- **Update user preferences**
  - Method: `PATCH`
  - Endpoint: `/api/v1/preferences`
  - Request body (JSON, partial update):

```json
{
  "keyword": ["technology", "startups"],
  "language": ["eng", "hin"],
  "articlesSortBy": "date",
  "articlesCount": 20,
  "maxDaysBack": 7
}
```

    - Example curl:

```bash
curl -X PATCH http://localhost:3000/api/v1/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"keyword":["technology"],"language":["eng"],"articlesCount":20}'
```

### News

All news endpoints require a valid JWT token in the Authorization header.

- **Get personalized news articles**
  - Method: `GET`
  - Endpoint: `/api/v1/news`
  - Returns articles filtered and sorted according to user preferences
  - Example curl:

```bash
curl http://localhost:3000/api/v1/news \
  -H "Authorization: Bearer your_jwt_token"
```

## Running tests

Run the test suite with:

```bash
npm test
```

The `pretest` script enforces Node.js >= 18.

## Notes & troubleshooting

- Ensure MongoDB is running before starting the application, otherwise you'll see connection errors.
- All endpoints except `/api/v1/auth/*` require a valid JWT token in the `Authorization: Bearer <token>` header.
- Invalid or expired tokens return HTTP 401 (Unauthorized).
- Validation errors return HTTP 400 with details about the invalid payload.
- NewsAPI.ai has rate limits on the free tier. If the demo API key stops working, sign up at https://newsapi.ai/register for your own key.

## Project structure

```
├── app.js                   # Express app configuration
├── server.js                # Server entry point (port 3000)
├── controllers/             # Request handlers (auth, news, preferences)
│   ├── authController.js    # User registration and login
│   ├── newsController.js    # News fetching with user preferences
│   └── preferencesController.js  # User preference management
├── middleware/              # Custom middleware
│   └── authMiddleware.js    # JWT verification
├── models/                  # Data models
│   └── UserModel.js         # User schema with preferences sub-schema
├── routes/                  # API routes
│   ├── authRoute.js
│   ├── newsRoute.js
│   └── preferencesRoute.js
├── utils/                   # Helper functions
│   ├── authUtils.js         # Password hashing and user operations
│   ├── newsUtils.js         # NewsAPI.ai integration
│   └── userUtils.js         # User-related utilities
└── test/                    # Test files
```

## License

MIT © 2026 Ahsas Sharma
