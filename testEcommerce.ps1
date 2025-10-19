# PowerShell script to test ecommerce-backend APIs with dynamic JWT token acquisition

# Login to get JWT token for admin user
try {
    $loginResponse = Invoke-WebRequest -Method POST -Uri "http://localhost:5000/api/auth/login" `
      -Headers @{ "Content-Type" = "application/json" } `
      -Body '{ "email": "admin@ecommerce.com", "password": "admin123" }'
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    Write-Host "Login successful. Token acquired.`n"
} catch {
    Write-Host "Login failed. Cannot proceed with API tests."
    exit
}

# Function to make requests easily with Authorization header and show output
function Invoke-ApiRequest {
    param(
        [string]$Method = "GET",
        [string]$Uri,
        [string]$Body = $null
    )
    Write-Host "`n$Method $Uri"
    try {
        if ($Body) {
            $response = Invoke-WebRequest -Method $Method -Uri $Uri `
                -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
                -Body $Body
        } else {
            $response = Invoke-WebRequest -Method $Method -Uri $Uri `
                -Headers @{ "Authorization" = "Bearer $token" }
        }
        Write-Host "Status: $($response.StatusCode)"
        Write-Host "Response:"
        Write-Host "$($response.Content)"
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Request failed with status code: $status"
        Write-Host "Error Response: $errorContent"
    }
}

# Health check (no auth required)
Write-Host "`nGET http://localhost:5000/health"
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/health"
    Write-Host "Server Health response: $($health.Content)"
} catch {
    Write-Host "Failed to get health endpoint."
}

# Test 2: Register User (no auth required)
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/auth/register" `
  -Body '{ "name": "Test User", "email": "test@example.com", "password": "password123", "phone": "1234567890" }'

# Test 3: Login again (optional, just to demo)
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/auth/login" `
  -Body '{ "email": "admin@ecommerce.com", "password": "admin123" }'

# Test 4: Get User Profile
Invoke-ApiRequest -Uri "http://localhost:5000/api/users/me"

# Test 5: Get All Products
Invoke-ApiRequest -Uri "http://localhost:5000/api/products"

# Test 6: Get Single Product
Invoke-ApiRequest -Uri "http://localhost:5000/api/products/1"

# Test 7: Get Featured Products
Invoke-ApiRequest -Uri "http://localhost:5000/api/products/featured"

# Test 8: Search Products
Invoke-ApiRequest -Uri "http://localhost:5000/api/search?q=iphone"

# Test 9: Filter Products by Category
Invoke-ApiRequest -Uri "http://localhost:5000/api/products?category=1"

# Test 10: Filter Products by Price Range
Invoke-ApiRequest -Uri "http://localhost:5000/api/products?priceMin=100&priceMax=1000"

# Test 11: Get Categories
Invoke-ApiRequest -Uri "http://localhost:5000/api/categories"

# Test 12: Get Cart
Invoke-ApiRequest -Uri "http://localhost:5000/api/cart"

# Test 13: Add to Cart
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/cart" `
  -Body '{ "productId": 1, "quantity": 2 }'

# Test 14: Update Cart Item
Invoke-ApiRequest -Method "PUT" -Uri "http://localhost:5000/api/cart/1" `
  -Body '{ "quantity": 3 }'

# Test 15: Remove from Cart
Invoke-ApiRequest -Method "DELETE" -Uri "http://localhost:5000/api/cart/1"

# Test 16: Create Order
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/orders" `
  -Body '{ "items": [ { "product": 1, "name": "iPhone 15 Pro", "quantity": 1, "price": 999 } ], "shippingAddress": { "street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA", "phone": "1234567890" }, "paymentMethod": "card" }'

# Test 17: Get User Orders
Invoke-ApiRequest -Uri "http://localhost:5000/api/orders"

# Test 18: Get Single Order
Invoke-ApiRequest -Uri "http://localhost:5000/api/orders/1"

# Test 19: Get Product Reviews
Invoke-ApiRequest -Uri "http://localhost:5000/api/products/1/reviews"

# Test 20: Create Review
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/products/1/reviews" `
  -Body '{ "rating": 5, "comment": "Excellent product! Highly recommended." }'

# Test 21: Get Wishlist
Invoke-ApiRequest -Uri "http://localhost:5000/api/wishlist"

# Test 22: Add to Wishlist
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/wishlist" `
  -Body '{ "productId": 2 }'

# Test 23: Remove from Wishlist
Invoke-ApiRequest -Method "DELETE" -Uri "http://localhost:5000/api/wishlist/2"

# Test 24: Create Address
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/users/me/addresses" `
  -Body '{ "fullName": "John Doe", "phone": "1234567890", "street": "456 Oak Avenue", "city": "Los Angeles", "state": "CA", "zipCode": "90001", "country": "USA", "isDefault": true }'

# Test 25: Get Addresses
Invoke-ApiRequest -Uri "http://localhost:5000/api/users/me/addresses"

# Test 26: Get Notifications
Invoke-ApiRequest -Uri "http://localhost:5000/api/notifications"

# Test 27: Create Product (Admin)
Invoke-ApiRequest -Method "POST" -Uri "http://localhost:5000/api/products" `
  -Body '{ "name": "New Laptop", "description": "High performance laptop", "price": 1299.99, "categoryId": 1, "brand": "TechBrand", "stock": 50, "tags": ["laptop", "computer"] }'

# Test 28: Update Product (Admin)
Invoke-ApiRequest -Method "PUT" -Uri "http://localhost:5000/api/products/1" `
  -Body '{ "price": 899.99, "stock": 75 }'

# Test 29: Get All Orders (Admin)
Invoke-ApiRequest -Uri "http://localhost:5000/api/orders/admin/all"

# Test 30: Update Order Status (Admin)
Invoke-ApiRequest -Method "PUT" -Uri "http://localhost:5000/api/orders/admin/1/status" `
  -Body '{ "status": "shipped" }'
