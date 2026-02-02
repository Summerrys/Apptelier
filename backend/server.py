from fastapi import FastAPI, APIRouter, Depends, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import logging
from pathlib import Path
from typing import List

from database import engine, get_db, Base
from models import SubscriptionPlan as PlanModel, PlanFeature as FeatureModel
from models import Service as ServiceModel, Testimonial as TestimonialModel, HeroStat as HeroStatModel
from schemas import SubscriptionPlan, Service, Testimonial, HeroStat, PlanFeature
from seed_data import seed_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create tables
Base.metadata.create_all(bind=engine)

# Create the main app
app = FastAPI(title="Apptelier API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Welcome to Apptelier API"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Apptelier"}

# Subscription Plans Endpoints
@api_router.get("/plans", response_model=List[SubscriptionPlan])
async def get_subscription_plans(db: Session = Depends(get_db)):
    plans = db.query(PlanModel).order_by(PlanModel.order_index).all()
    result = []
    for plan in plans:
        features = db.query(FeatureModel).filter(
            FeatureModel.plan_id == plan.id
        ).order_by(FeatureModel.order_index).all()
        plan_dict = {
            "id": plan.id,
            "name": plan.name,
            "price": plan.price,
            "period": plan.period,
            "description": plan.description,
            "popular": plan.popular,
            "order_index": plan.order_index,
            "created_at": plan.created_at,
            "updated_at": plan.updated_at,
            "features": [
                {
                    "id": f.id,
                    "plan_id": f.plan_id,
                    "name": f.name,
                    "included": f.included,
                    "order_index": f.order_index
                }
                for f in features
            ]
        }
        result.append(plan_dict)
    return result

# Services Endpoints
@api_router.get("/services", response_model=List[Service])
async def get_services(db: Session = Depends(get_db)):
    services = db.query(ServiceModel).order_by(ServiceModel.order_index).all()
    return services

# Testimonials Endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(db: Session = Depends(get_db)):
    testimonials = db.query(TestimonialModel).all()
    return testimonials

# Hero Stats Endpoints
@api_router.get("/hero-stats", response_model=List[HeroStat])
async def get_hero_stats(db: Session = Depends(get_db)):
    stats = db.query(HeroStatModel).order_by(HeroStatModel.order_index).all()
    return stats

# Seed data endpoint (for initial setup)
@api_router.post("/seed")
async def seed_data(db: Session = Depends(get_db)):
    try:
        seed_database(db)
        return {"message": "Database seeded successfully"}
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Apptelier API...")
    # Auto-seed on startup if database is empty
    db = next(get_db())
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Error during startup seed: {e}")
    finally:
        db.close()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Apptelier API...")
