from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Plan Feature Schemas
class PlanFeatureBase(BaseModel):
    name: str
    included: bool = True
    order_index: int = 0

class PlanFeatureCreate(PlanFeatureBase):
    pass

class PlanFeature(PlanFeatureBase):
    id: str
    plan_id: str
    
    class Config:
        from_attributes = True

# Subscription Plan Schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    price: float
    period: str = "month"
    description: Optional[str] = None
    popular: bool = False
    order_index: int = 0

class SubscriptionPlanCreate(SubscriptionPlanBase):
    features: List[PlanFeatureCreate] = []

class SubscriptionPlan(SubscriptionPlanBase):
    id: str
    features: List[PlanFeature] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Service Schemas
class ServiceBase(BaseModel):
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    order_index: int = 0

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    content: str
    rating: int = 5
    avatar: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Hero Stat Schemas
class HeroStatBase(BaseModel):
    value: str
    label: str
    order_index: int = 0

class HeroStatCreate(HeroStatBase):
    pass

class HeroStat(HeroStatBase):
    id: str
    
    class Config:
        from_attributes = True
