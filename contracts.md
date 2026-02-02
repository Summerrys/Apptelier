# Apptelier API Contracts

## Database: MySQL (MariaDB)
- **Connection**: mysql+pymysql://apptelier:apptelier123@localhost/apptelier
- **Tables**: subscription_plans, plan_features, services, testimonials, hero_stats

## API Endpoints

### GET /api/hero-stats
**Response**: Array of HeroStat objects
```json
[
  { "id": "uuid", "value": "10K+", "label": "Active Businesses", "order_index": 0 }
]
```

### GET /api/plans
**Response**: Array of SubscriptionPlan objects with nested features
```json
[
  {
    "id": "uuid",
    "name": "Basic",
    "price": 49.0,
    "period": "month",
    "description": "...",
    "popular": false,
    "order_index": 0,
    "features": [
      { "id": "uuid", "plan_id": "uuid", "name": "Feature name", "included": true, "order_index": 0 }
    ]
  }
]
```

### GET /api/services
**Response**: Array of Service objects
```json
[
  {
    "id": "uuid",
    "title": "Online Ordering System",
    "description": "...",
    "icon": "ShoppingCart",
    "order_index": 0,
    "created_at": "datetime"
  }
]
```

### GET /api/testimonials
**Response**: Array of Testimonial objects
```json
[
  {
    "id": "uuid",
    "name": "Sarah Chen",
    "role": "Owner, Sakura Bistro",
    "content": "...",
    "rating": 5,
    "avatar": "SC",
    "created_at": "datetime"
  }
]
```

## Frontend Integration
- All sections fetch data dynamically from backend APIs
- Hero stats, services, pricing plans, and testimonials are database-driven
- Special offers section removed per user request
- Color theme: Aqua-Cyan (#5BC5E2, #85E0F7) with navy dark background (#0a1628)
