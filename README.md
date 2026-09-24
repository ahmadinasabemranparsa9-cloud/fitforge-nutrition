# FitForge Nutrition

FitForge Nutrition is a Node.js/Express microservice that provides a food catalog API backed by MongoDB.

The service uses the USDA Foundation Foods dataset as its source data and preserves `data/foods.json` as the original seed/source artifact.

## Features

* MongoDB-backed food catalog
* USDA Foundation Foods dataset
* JSON source dataset preserved for reseeding
* Idempotent MongoDB seed process
* Pagination
* Food description search
* Food category filtering
* Data type filtering
* Description sorting
* Single-food lookup by FDC ID
* Food count endpoint
* Food filter metadata endpoint
* CORS
* Helmet security headers
* Express rate limiting
* Environment-based configuration

## Tech Stack

* Node.js
* Express
* MongoDB
* Mongoose
* dotenv
* CORS
* Helmet
* express-rate-limit
* Nodemon

## Project Structure

```text
fitforge-nutrition/
├── data/
│   └── foods.json
├── scripts/
│   └── seedFoods.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── foodController.js
│   ├── models/
│   │   └── Food.js
│   ├── routes/
│   │   └── foodRoutes.js
│   ├── services/
│   │   ├── foodService.js
│   │   └── foodSeedService.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Architecture

```text
data/foods.json
        |
        v
foodSeedService.js
        |
        v
     MongoDB
        |
        v
     Food.js
        |
        v
 foodService.js
        |
        v
foodController.js
        |
        v
   foodRoutes.js
        |
        v
    Express API
```

## Dataset

The source file is:

```text
data/foods.json
```

The dataset contains a top-level `FoundationFoods` array.

Current dataset results:

```text
Total source records: 395
Valid records:        363
Skipped records:       32
MongoDB documents:     363
```

The 32 invalid records are skipped during seeding because they do not contain the required food data.

The original JSON file is intentionally preserved so the database can be reseeded when needed.

## Environment Variables

Create a local `.env` file based on `.env.example`.

```dotenv
PORT=4003
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitforge-nutrition
```

Do not commit `.env`.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Run the Development Server

```bash
npm run dev
```

The service runs on:

```text
http://localhost:4003
```

## Run the Production Server

```bash
npm start
```

The server connects to MongoDB before it begins listening for requests.

Expected startup output:

```text
MongoDB connected successfully.
FitForge Nutrition service running on port 4003
```

## Seed MongoDB

Seed the MongoDB food catalog from the preserved JSON dataset:

```bash
npm run seed
```

Expected result:

```text
Food seed completed successfully.
{
  totalSourceRecords: 395,
  validRecords: 363,
  skippedRecords: 32,
  upsertedRecords: 363
}
MongoDB connection closed.
```

The seed process uses `fdcId` as the unique identifier and performs upserts, allowing the dataset to be seeded repeatedly without creating duplicate food records.

## API Endpoints

### Health Check

```http
GET /health
```

Example:

```bash
curl http://localhost:4003/health
```

Response:

```json
{
    "service": "fitforge-nutrition",
    "status": "healthy"
}
```

### Get Foods

```http
GET /api/foods
```

Example:

```bash
curl "http://localhost:4003/api/foods?page=1&limit=5"
```

Query parameters:

```text
page
limit
search
category
dataType
sort
```

Example:

```bash
curl "http://localhost:4003/api/foods?page=1&limit=10&search=hummus"
```

### Search Foods

```http
GET /api/foods?search=hummus
```

Example:

```bash
curl "http://localhost:4003/api/foods?search=hummus&limit=5"
```

### Filter by Category

```http
GET /api/foods?category=<category>
```

Example:

```bash
curl "http://localhost:4003/api/foods?category=Vegetables"
```

### Filter by Data Type

```http
GET /api/foods?dataType=Foundation
```

Example:

```bash
curl "http://localhost:4003/api/foods?dataType=Foundation"
```

### Sort Foods

Ascending:

```http
GET /api/foods?sort=description-asc
```

Descending:

```http
GET /api/foods?sort=description-desc
```

Example:

```bash
curl "http://localhost:4003/api/foods?sort=description-desc"
```

### Get Food by FDC ID

```http
GET /api/foods/:fdcId
```

Example:

```bash
curl http://localhost:4003/api/foods/327357
```

### Get Food Count

```http
GET /api/foods/count
```

Example:

```bash
curl http://localhost:4003/api/foods/count
```

Response:

```json
{
    "success": true,
    "data": {
        "count": 363
    }
}
```

### Get Food Filters

```http
GET /api/foods/filters
```

Example:

```bash
curl http://localhost:4003/api/foods/filters
```

The endpoint returns available food categories and data types.

### Food Not Found

Requesting an unknown FDC ID returns:

```http
404 Not Found
```

Example:

```bash
curl http://localhost:4003/api/foods/does-not-exist
```

Response:

```json
{
    "success": false,
    "message": "Food not found."
}
```

## Validation

The service validates:

* Positive `page` values
* Positive `limit` values
* Maximum `limit` of 100
* Required MongoDB configuration
* Valid food dataset structure

JavaScript files can be syntax-checked with:

```bash
node --check src/server.js
```

Git whitespace can be checked with:

```bash
git diff --check
```

## NPM Scripts

```bash
npm start
```

Starts the production server.

```bash
npm run dev
```

Starts the development server with Nodemon.

```bash
npm run seed
```

Seeds MongoDB from `data/foods.json`.

```bash
npm test
```

Runs the current placeholder test script.

## Security

The Express application currently uses:

* Helmet
* CORS
* Express rate limiting
* Environment variables for configuration

The API rate limit is currently:

```text
100 requests per 15 minutes
```

## Database Model

The `Food` model stores the USDA food record structure, including:

```text
fdcId
dataType
foodClass
description
foodNutrients
scientificName
foodAttributes
nutrientConversionFactors
isHistoricalReference
ndbNumber
foodCategory
foodPortions
publicationDate
inputFoods
```

Nested USDA structures are preserved using flexible MongoDB/Mongoose fields where appropriate.

## Development Workflow

The service follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

The dataset seeding process is separate from normal API request handling:

```text
foods.json
  ↓
Seed Service
  ↓
MongoDB
```

The API does not read `foods.json` during normal requests. Runtime food queries are served from MongoDB.

## Future Improvements

Potential future enhancements include:

* Nutrition-specific query endpoints
* Nutrient filtering
* Advanced food search
* Automated tests
* API documentation
* Health checks with database status
* Improved validation
* Authentication and authorization
* Integration with the FitForge frontend
* Containerized deployment