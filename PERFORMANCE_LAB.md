# Performance Data Hub - AI Update Guide

**Location**: `frontend/src/data/performanceMetrics.json`

## Overview
The Performance Data Hub (`/performance-lab`) is powered by a static JSON file. This allows for automated monthly updates by an AI agent without requiring code changes or database migrations.

## Update Process
The AI Agent should perform the following steps on the 1st of every month:

1.  **Analyze**: Review the file `frontend/src/data/performanceMetrics.json`.
2.  **Research**: Crawl reliable technical sources or internal lab reports for updated metrics on:
    *   Boxing Gloves (Impact Absorption, Wrist Stability)
    *   Resistance Bands (Tensile Strength)
    *   Footwear (Grip Coefficient, Energy Return)
3.  **Update**: Modify the JSON values.
    *   Update `"last_updated"` to the current date (YYYY-MM-DD).
    *   Update specific metric `value` fields.
    *   Do NOT change the structure or keys (`id`, `name`, `unit`).
4.  **Verify**: Ensure the JSON is valid.

## JSON Structure

```json
{
  "last_updated": "YYYY-MM-DD",
  "version": "1.0.X",
  "categories": [
    {
      "id": "category-id",
      "name": {
        "en": "English Name",
        "fr": "Nom Français"
      },
      "metrics": [
        {
          "name": {
            "en": "Metric Name",
            "fr": "Nom Métrique"
          },
          "value": "Value (e.g. 98%) or object {en:..., fr:...}",
          "unit": "Unit or object {en:..., fr:...}",
          "description": {
            "en": "English description",
            "fr": "Description française"
          }
        }
      ]
    }
  ],
  "faq": [
    {
      "question": {
        "en": "English Question",
        "fr": "Question Française"
      },
      "answer": {
        "en": "English Answer",
        "fr": "Réponse Française"
      }
    }
  ]
}
```

## Schema.org
The page automatically generates `Dataset` schema based on this JSON. No manual schema update is required.
