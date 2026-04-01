"""
Backend API Tests for Sundays Cookie Website
Tests: POST /api/orders, GET /api/orders, GET /api/, GET /api/config
Includes: UPI payment fields, config endpoint
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoints:
    """Test basic API health and root endpoint"""
    
    def test_api_root(self):
        """Test GET /api/ returns correct message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Sundays API"
        print(f"✓ API root returns: {data}")


class TestConfigEndpoint:
    """Test config endpoint for UPI settings"""
    
    def test_get_config(self):
        """Test GET /api/config returns UPI configuration"""
        response = requests.get(f"{BASE_URL}/api/config")
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "upi_id" in data, "Config should contain upi_id"
        assert "business_name" in data, "Config should contain business_name"
        assert "whatsapp" in data, "Config should contain whatsapp"
        
        # Verify values
        assert data["upi_id"] == "sundays@upi", f"Expected sundays@upi, got {data['upi_id']}"
        assert data["business_name"] == "Sundays"
        
        print(f"✓ Config endpoint returns: {data}")


class TestOrdersAPI:
    """Test Orders CRUD operations"""
    
    @pytest.fixture
    def test_order_data(self):
        """Generate unique test order data"""
        unique_id = str(uuid.uuid4())[:8]
        return {
            "customer_name": f"TEST_Customer_{unique_id}",
            "phone": "9876543210",
            "address": f"TEST_Address_{unique_id}, Hyderabad",
            "items": [
                {
                    "cookie_id": "lazy-legend",
                    "cookie_name": "The Lazy Legend",
                    "flavor": "Classic Choco Chip",
                    "quantity": 2,
                    "price_per_unit": 89,
                    "subtotal": 178
                },
                {
                    "cookie_id": "dark-side",
                    "cookie_name": "The Dark Side",
                    "flavor": "Oreo Cookies & Cream",
                    "quantity": 1,
                    "price_per_unit": 99,
                    "subtotal": 99
                }
            ],
            "assorted_boxes": 0,
            "assorted_selections": [],
            "total": 277,
            "notes": f"Test order {unique_id}",
            "payment_reference": f"TXN_{unique_id}",
            "payment_method": "upi"
        }
    
    @pytest.fixture
    def assorted_order_data(self):
        """Generate test order with assorted box"""
        unique_id = str(uuid.uuid4())[:8]
        return {
            "customer_name": f"TEST_Assorted_{unique_id}",
            "phone": "9123456789",
            "address": f"TEST_Assorted_Address_{unique_id}, Hyderabad",
            "items": [],
            "assorted_boxes": 1,
            "assorted_selections": [
                {"cookie_id": "lazy-legend", "cookie_name": "The Lazy Legend", "count": 2},
                {"cookie_id": "dark-side", "cookie_name": "The Dark Side", "count": 2},
                {"cookie_id": "golden-affair", "cookie_name": "The Golden Affair", "count": 2}
            ],
            "total": 649,
            "notes": f"Assorted test {unique_id}"
        }
    
    def test_create_order_success(self, test_order_data):
        """Test POST /api/orders creates order successfully"""
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=test_order_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Verify response structure
        assert "id" in data, "Response should contain 'id'"
        assert "customer_name" in data
        assert "phone" in data
        assert "address" in data
        assert "items" in data
        assert "total" in data
        assert "status" in data
        assert "created_at" in data
        
        # Verify UPI payment fields
        assert "payment_reference" in data, "Response should contain payment_reference"
        assert "payment_method" in data, "Response should contain payment_method"
        assert "payment_status" in data, "Response should contain payment_status"
        
        # Verify data values
        assert data["customer_name"] == test_order_data["customer_name"]
        assert data["phone"] == test_order_data["phone"]
        assert data["address"] == test_order_data["address"]
        assert data["total"] == test_order_data["total"]
        assert data["status"] == "pending"
        assert data["payment_method"] == "upi"
        assert data["payment_status"] == "pending"
        assert len(data["items"]) == 2
        
        print(f"✓ Order created with ID: {data['id']}, Payment ref: {data['payment_reference']}")
    
    def test_create_assorted_order(self, assorted_order_data):
        """Test POST /api/orders with assorted box"""
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=assorted_order_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["assorted_boxes"] == 1
        assert len(data["assorted_selections"]) == 3
        assert data["total"] == 649
        
        print(f"✓ Assorted order created with ID: {data['id']}")
    
    def test_get_orders_list(self):
        """Test GET /api/orders returns list of orders"""
        response = requests.get(f"{BASE_URL}/api/orders")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        print(f"✓ GET /api/orders returned {len(data)} orders")
    
    def test_get_orders_by_phone(self, test_order_data):
        """Test GET /api/orders?phone=xxx filters by phone"""
        # First create an order
        create_response = requests.post(
            f"{BASE_URL}/api/orders",
            json=test_order_data,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        
        # Then filter by phone
        phone = test_order_data["phone"]
        response = requests.get(f"{BASE_URL}/api/orders?phone={phone}")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # All returned orders should have the same phone
        for order in data:
            assert order["phone"] == phone
        
        print(f"✓ GET /api/orders?phone={phone} returned {len(data)} orders")
    
    def test_create_order_and_verify_persistence(self, test_order_data):
        """Test that created order persists in database"""
        # Create order
        create_response = requests.post(
            f"{BASE_URL}/api/orders",
            json=test_order_data,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        created_order = create_response.json()
        order_id = created_order["id"]
        
        # Verify by fetching all orders and finding our order
        get_response = requests.get(f"{BASE_URL}/api/orders")
        assert get_response.status_code == 200
        
        orders = get_response.json()
        found_order = next((o for o in orders if o["id"] == order_id), None)
        
        assert found_order is not None, f"Order {order_id} not found in GET /api/orders"
        assert found_order["customer_name"] == test_order_data["customer_name"]
        assert found_order["total"] == test_order_data["total"]
        
        print(f"✓ Order {order_id} persisted and verified")


class TestOrderValidation:
    """Test order validation scenarios"""
    
    def test_create_order_minimal_fields(self):
        """Test order with minimal required fields"""
        minimal_order = {
            "customer_name": "TEST_Minimal",
            "phone": "9000000001",
            "address": "TEST_Minimal Address",
            "items": [],
            "total": 0
        }
        
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=minimal_order,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print("✓ Minimal order created successfully")
    
    def test_create_order_missing_required_field(self):
        """Test order creation fails without required fields"""
        incomplete_order = {
            "customer_name": "TEST_Incomplete",
            # Missing phone, address, total
        }
        
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=incomplete_order,
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 422 Unprocessable Entity for validation error
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print("✓ Missing required fields correctly rejected with 422")


class TestCookiePrices:
    """Verify cookie prices match expected values"""
    
    def test_lazy_legend_price(self):
        """Test The Lazy Legend price is ₹89"""
        order = {
            "customer_name": "TEST_Price_Check",
            "phone": "9111111111",
            "address": "TEST_Price Address",
            "items": [{
                "cookie_id": "lazy-legend",
                "cookie_name": "The Lazy Legend",
                "flavor": "Classic Choco Chip",
                "quantity": 1,
                "price_per_unit": 89,
                "subtotal": 89
            }],
            "total": 89
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=order)
        assert response.status_code == 200
        data = response.json()
        assert data["items"][0]["price_per_unit"] == 89
        print("✓ The Lazy Legend price verified: ₹89")
    
    def test_little_rebels_price(self):
        """Test Little Rebels price is ₹219/pack"""
        order = {
            "customer_name": "TEST_Rebels_Price",
            "phone": "9222222222",
            "address": "TEST_Rebels Address",
            "items": [{
                "cookie_id": "little-rebels",
                "cookie_name": "Little Rebels",
                "flavor": "Mini Choco Bites",
                "quantity": 1,
                "price_per_unit": 219,
                "subtotal": 219
            }],
            "total": 219
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=order)
        assert response.status_code == 200
        data = response.json()
        assert data["items"][0]["price_per_unit"] == 219
        print("✓ Little Rebels price verified: ₹219/pack")
    
    def test_assorted_box_price(self):
        """Test Assorted Box of 6 price is ₹649"""
        order = {
            "customer_name": "TEST_Assorted_Price",
            "phone": "9333333333",
            "address": "TEST_Assorted Address",
            "items": [],
            "assorted_boxes": 1,
            "assorted_selections": [
                {"cookie_id": "lazy-legend", "cookie_name": "The Lazy Legend", "count": 6}
            ],
            "total": 649
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=order)
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 649
        print("✓ Assorted Box price verified: ₹649")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
