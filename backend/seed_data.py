from sqlalchemy.orm import Session
from models import SubscriptionPlan, PlanFeature, Service, Testimonial, HeroStat
import uuid

def seed_database(db: Session):
    # Check if data already exists
    if db.query(SubscriptionPlan).first():
        print("Database already seeded")
        return
    
    print("Seeding database...")
    
    # Seed Hero Stats
    hero_stats = [
        {"value": "10K+", "label": "Active Businesses", "order_index": 0},
        {"value": "2M+", "label": "Orders Processed", "order_index": 1},
        {"value": "99.9%", "label": "Uptime", "order_index": 2},
        {"value": "4.9/5", "label": "Customer Rating", "order_index": 3},
    ]
    for stat in hero_stats:
        db.add(HeroStat(id=str(uuid.uuid4()), **stat))
    
    # Seed Subscription Plans with Features
    plans_data = [
        {
            "name": "Basic",
            "price": 49,
            "period": "month",
            "description": "Perfect for small businesses just getting started",
            "popular": False,
            "order_index": 0,
            "features": [
                {"name": "Up to 100 orders/month", "included": True},
                {"name": "Basic booking calendar", "included": True},
                {"name": "Email notifications", "included": True},
                {"name": "Standard support", "included": True},
                {"name": "1 user account", "included": True},
                {"name": "Basic analytics", "included": True},
                {"name": "Custom branding", "included": False},
                {"name": "API access", "included": False},
                {"name": "Priority support", "included": False},
            ]
        },
        {
            "name": "Growth",
            "price": 129,
            "period": "month",
            "description": "Ideal for growing businesses with higher demands",
            "popular": True,
            "order_index": 1,
            "features": [
                {"name": "Up to 1,000 orders/month", "included": True},
                {"name": "Advanced booking system", "included": True},
                {"name": "SMS & Email notifications", "included": True},
                {"name": "Priority support", "included": True},
                {"name": "5 user accounts", "included": True},
                {"name": "Advanced analytics", "included": True},
                {"name": "Custom branding", "included": True},
                {"name": "API access", "included": True},
                {"name": "Integrations (Zapier, etc.)", "included": False},
            ]
        },
        {
            "name": "Professional",
            "price": 299,
            "period": "month",
            "description": "Enterprise-grade solution for maximum scalability",
            "popular": False,
            "order_index": 2,
            "features": [
                {"name": "Unlimited orders", "included": True},
                {"name": "Full booking suite", "included": True},
                {"name": "Multi-channel notifications", "included": True},
                {"name": "24/7 dedicated support", "included": True},
                {"name": "Unlimited user accounts", "included": True},
                {"name": "Real-time analytics & reports", "included": True},
                {"name": "White-label branding", "included": True},
                {"name": "Full API access", "included": True},
                {"name": "Custom integrations", "included": True},
            ]
        }
    ]
    
    for plan_data in plans_data:
        features = plan_data.pop("features")
        plan_id = str(uuid.uuid4())
        plan = SubscriptionPlan(id=plan_id, **plan_data)
        db.add(plan)
        
        for idx, feature in enumerate(features):
            db.add(PlanFeature(
                id=str(uuid.uuid4()),
                plan_id=plan_id,
                name=feature["name"],
                included=feature["included"],
                order_index=idx
            ))
    
    # Seed Services
    services = [
        {"title": "Online Ordering System", "description": "Accept and manage orders seamlessly with our intuitive ordering platform. Works across web and mobile.", "icon": "ShoppingCart", "order_index": 0},
        {"title": "Appointment Booking", "description": "Let customers book appointments 24/7 with automated scheduling and reminders.", "icon": "Calendar", "order_index": 1},
        {"title": "Table Reservations", "description": "Manage restaurant bookings efficiently with real-time availability and waitlist management.", "icon": "Utensils", "order_index": 2},
        {"title": "Queue Management", "description": "Reduce wait times and improve customer experience with smart queue systems.", "icon": "Users", "order_index": 3},
        {"title": "Custom Integrations", "description": "Connect with your existing tools - POS, CRM, payment gateways, and more.", "icon": "Plug", "order_index": 4},
        {"title": "Analytics Dashboard", "description": "Gain insights into your business with real-time data and comprehensive reports.", "icon": "BarChart3", "order_index": 5},
    ]
    for service in services:
        db.add(Service(id=str(uuid.uuid4()), **service))
    
    # Seed Testimonials
    testimonials = [
        {"name": "Sarah Chen", "role": "Owner, Sakura Bistro", "content": "Apptelier transformed how we handle reservations. Our no-show rate dropped by 60% and our staff can focus on what matters - serving customers.", "rating": 5, "avatar": "SC"},
        {"name": "Marcus Johnson", "role": "CEO, TechFit Gym", "content": "The booking system is incredibly intuitive. Our members love being able to book classes anytime, and we've seen a 40% increase in class attendance.", "rating": 5, "avatar": "MJ"},
        {"name": "Emily Rodriguez", "role": "Manager, StyleCraft Salon", "content": "Since implementing Apptelier, we've reduced phone time by 70%. The automated reminders have been a game-changer for reducing missed appointments.", "rating": 5, "avatar": "ER"},
        {"name": "David Kim", "role": "Director, MedCare Clinic", "content": "The professional tier gives us everything we need for our multi-location practice. The analytics help us optimize scheduling across all our clinics.", "rating": 5, "avatar": "DK"},
    ]
    for testimonial in testimonials:
        db.add(Testimonial(id=str(uuid.uuid4()), **testimonial))
    
    db.commit()
    print("Database seeded successfully!")
