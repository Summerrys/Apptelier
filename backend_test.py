#!/usr/bin/env python3
"""
Backend API Testing for Apptelier Website
Tests all API endpoints for ordering and booking systems
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Backend URL from frontend .env
BACKEND_URL = "https://smart-order-hub-1.preview.emergentagent.com/api"

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, endpoint: str, status: str, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "endpoint": endpoint,
            "status": status,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        print(f"[{status}] {endpoint}: {message}")
        if details:
            print(f"    Details: {json.dumps(details, indent=2)}")
    
    def test_endpoint(self, endpoint: str, expected_count: int = None, 
                     expected_fields: List[str] = None) -> Dict:
        """Generic endpoint tester"""
        url = f"{self.base_url}{endpoint}"
        try:
            print(f"\n🔍 Testing: {url}")
            response = self.session.get(url, timeout=10)
            
            # Check status code
            if response.status_code != 200:
                self.log_test(endpoint, "FAIL", 
                            f"Expected 200, got {response.status_code}", 
                            {"response_text": response.text[:500]})
                return {"success": False, "data": None}
            
            # Parse JSON
            try:
                data = response.json()
            except json.JSONDecodeError as e:
                self.log_test(endpoint, "FAIL", 
                            f"Invalid JSON response: {str(e)}", 
                            {"response_text": response.text[:500]})
                return {"success": False, "data": None}
            
            # Check if response is a list
            if not isinstance(data, list):
                self.log_test(endpoint, "FAIL", 
                            f"Expected list, got {type(data).__name__}", 
                            {"response": data})
                return {"success": False, "data": None}
            
            # Check expected count
            if expected_count is not None and len(data) != expected_count:
                self.log_test(endpoint, "FAIL", 
                            f"Expected {expected_count} items, got {len(data)}", 
                            {"actual_count": len(data), "items": data})
                return {"success": False, "data": data}
            
            # Check expected fields in first item
            if expected_fields and data:
                missing_fields = []
                for field in expected_fields:
                    if field not in data[0]:
                        missing_fields.append(field)
                
                if missing_fields:
                    self.log_test(endpoint, "FAIL", 
                                f"Missing required fields: {missing_fields}", 
                                {"first_item": data[0]})
                    return {"success": False, "data": data}
            
            self.log_test(endpoint, "PASS", 
                        f"Successfully returned {len(data)} items", 
                        {"sample_item": data[0] if data else None})
            return {"success": True, "data": data}
            
        except requests.exceptions.RequestException as e:
            self.log_test(endpoint, "FAIL", 
                        f"Request failed: {str(e)}")
            return {"success": False, "data": None}
    
    def test_hero_stats(self):
        """Test GET /api/hero-stats endpoint"""
        print("\n" + "="*60)
        print("🏆 TESTING HERO STATS ENDPOINT")
        print("="*60)
        
        expected_fields = ["id", "value", "label", "order_index"]
        result = self.test_endpoint("/hero-stats", 4, expected_fields)
        
        if result["success"] and result["data"]:
            data = result["data"]
            
            # Verify specific stats exist
            expected_labels = ["Active Businesses", "Orders Processed", "Uptime", "Customer Rating"]
            actual_labels = [item["label"] for item in data]
            
            missing_labels = [label for label in expected_labels if label not in actual_labels]
            if missing_labels:
                self.log_test("/hero-stats", "FAIL", 
                            f"Missing expected labels: {missing_labels}", 
                            {"expected": expected_labels, "actual": actual_labels})
                return False
            
            # Check ordering
            order_indices = [item["order_index"] for item in data]
            if order_indices != sorted(order_indices):
                self.log_test("/hero-stats", "FAIL", 
                            "Items not properly ordered by order_index", 
                            {"order_indices": order_indices})
                return False
            
            self.log_test("/hero-stats", "PASS", 
                        "All hero stats validation passed")
            return True
        
        return False
    
    def test_plans(self):
        """Test GET /api/plans endpoint"""
        print("\n" + "="*60)
        print("💰 TESTING SUBSCRIPTION PLANS ENDPOINT")
        print("="*60)
        
        expected_fields = ["id", "name", "price", "period", "description", 
                          "popular", "order_index", "features"]
        result = self.test_endpoint("/plans", 3, expected_fields)
        
        if result["success"] and result["data"]:
            data = result["data"]
            
            # Verify specific plans exist
            expected_plans = [
                {"name": "Basic", "price": 49},
                {"name": "Growth", "price": 129},
                {"name": "Professional", "price": 299}
            ]
            
            for expected_plan in expected_plans:
                found = False
                for plan in data:
                    if (plan["name"] == expected_plan["name"] and 
                        plan["price"] == expected_plan["price"]):
                        found = True
                        break
                
                if not found:
                    self.log_test("/plans", "FAIL", 
                                f"Missing expected plan: {expected_plan}", 
                                {"available_plans": [(p["name"], p["price"]) for p in data]})
                    return False
            
            # Check features array in each plan
            for plan in data:
                if not isinstance(plan.get("features"), list):
                    self.log_test("/plans", "FAIL", 
                                f"Plan '{plan['name']}' missing features array", 
                                {"plan": plan})
                    return False
                
                if not plan["features"]:
                    self.log_test("/plans", "FAIL", 
                                f"Plan '{plan['name']}' has empty features array", 
                                {"plan": plan})
                    return False
                
                # Check feature structure
                feature = plan["features"][0]
                required_feature_fields = ["id", "plan_id", "name", "included", "order_index"]
                missing_feature_fields = [f for f in required_feature_fields if f not in feature]
                
                if missing_feature_fields:
                    self.log_test("/plans", "FAIL", 
                                f"Plan '{plan['name']}' features missing fields: {missing_feature_fields}", 
                                {"sample_feature": feature})
                    return False
            
            # Check ordering
            order_indices = [plan["order_index"] for plan in data]
            if order_indices != sorted(order_indices):
                self.log_test("/plans", "FAIL", 
                            "Plans not properly ordered by order_index", 
                            {"order_indices": order_indices})
                return False
            
            self.log_test("/plans", "PASS", 
                        "All subscription plans validation passed")
            return True
        
        return False
    
    def test_services(self):
        """Test GET /api/services endpoint"""
        print("\n" + "="*60)
        print("🛠️  TESTING SERVICES ENDPOINT")
        print("="*60)
        
        expected_fields = ["id", "title", "description", "icon", "order_index"]
        result = self.test_endpoint("/services", 6, expected_fields)
        
        if result["success"] and result["data"]:
            data = result["data"]
            
            # Verify expected icons exist
            expected_icons = ["ShoppingCart", "Calendar", "Utensils", "Users", "Plug", "BarChart3"]
            actual_icons = [item["icon"] for item in data]
            
            missing_icons = [icon for icon in expected_icons if icon not in actual_icons]
            if missing_icons:
                self.log_test("/services", "FAIL", 
                            f"Missing expected icons: {missing_icons}", 
                            {"expected": expected_icons, "actual": actual_icons})
                return False
            
            # Check ordering
            order_indices = [item["order_index"] for item in data]
            if order_indices != sorted(order_indices):
                self.log_test("/services", "FAIL", 
                            "Services not properly ordered by order_index", 
                            {"order_indices": order_indices})
                return False
            
            # Verify all services have meaningful content
            for service in data:
                if not service.get("title") or not service.get("description"):
                    self.log_test("/services", "FAIL", 
                                f"Service missing title or description", 
                                {"service": service})
                    return False
            
            self.log_test("/services", "PASS", 
                        "All services validation passed")
            return True
        
        return False
    
    def test_testimonials(self):
        """Test GET /api/testimonials endpoint"""
        print("\n" + "="*60)
        print("💬 TESTING TESTIMONIALS ENDPOINT")
        print("="*60)
        
        expected_fields = ["id", "name", "role", "content", "rating", "avatar"]
        result = self.test_endpoint("/testimonials", 4, expected_fields)
        
        if result["success"] and result["data"]:
            data = result["data"]
            
            # Verify all testimonials have required content
            for testimonial in data:
                if not testimonial.get("name") or not testimonial.get("content"):
                    self.log_test("/testimonials", "FAIL", 
                                f"Testimonial missing name or content", 
                                {"testimonial": testimonial})
                    return False
                
                # Check rating is valid (1-5)
                rating = testimonial.get("rating", 0)
                if not isinstance(rating, int) or rating < 1 or rating > 5:
                    self.log_test("/testimonials", "FAIL", 
                                f"Invalid rating: {rating} (should be 1-5)", 
                                {"testimonial": testimonial})
                    return False
            
            self.log_test("/testimonials", "PASS", 
                        "All testimonials validation passed")
            return True
        
        return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("\n" + "🚀" + "="*58 + "🚀")
        print("🚀" + " "*20 + "APPTELIER API TESTING" + " "*17 + "🚀")
        print("🚀" + "="*58 + "🚀")
        print(f"Backend URL: {self.base_url}")
        
        # Test all endpoints
        tests = [
            ("Hero Stats", self.test_hero_stats),
            ("Subscription Plans", self.test_plans),
            ("Services", self.test_services),
            ("Testimonials", self.test_testimonials)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, "ERROR", f"Test failed with exception: {str(e)}")
        
        # Summary
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED!")
            return True
        else:
            print("⚠️  SOME TESTS FAILED - Check details above")
            return False

def main():
    """Main test runner"""
    tester = APITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()