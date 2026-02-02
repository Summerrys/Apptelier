from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from database import Base
import uuid

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    period = Column(String(50), default="month")
    description = Column(Text)
    popular = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class PlanFeature(Base):
    __tablename__ = "plan_features"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), nullable=False)
    name = Column(String(255), nullable=False)
    included = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)

class Service(Base):
    __tablename__ = "services"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    icon = Column(String(100))
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    role = Column(String(200))
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    avatar = Column(String(10))
    created_at = Column(DateTime, server_default=func.now())

class HeroStat(Base):
    __tablename__ = "hero_stats"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    value = Column(String(50), nullable=False)
    label = Column(String(100), nullable=False)
    order_index = Column(Integer, default=0)
