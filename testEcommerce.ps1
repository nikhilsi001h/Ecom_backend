# E-Commerce Backend API Test Suite
# Run this script in PowerShell to test all API endpoints

$baseUrl = "https://ecom-backend-h7ui-93o1ufnmy-nikhils-projects-bcb3c0d0.vercel.app"

function Write-Success { 
    param($message) 
    Write-Host "SUCCESS: $message" -ForegroundColor Green 
}

function Write-Error { 
    param($message) 
    Write-Host "ERROR: $message" -ForegroundColor Red 
}

function Write-Info { 
    param($message) 
    Write-Host "INFO: $message" -ForegroundColor Cyan 
}

function Write-Section { 
    param($message) 
    Write-Host "`n========== $message ==========" -ForegroundColor Yellow 
}

$userToken = $null
$adminToken = $null
$vendorToken = $null
$testUserId = $null
$testProductId = $null
$testCartItemId = $null
$testOrderId = $null
$testReviewId = $null
$testAddressId = $null

function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = $null,
        [string]$Description
    )
    
    try {
        $uri = "$baseUrl$Endpoint"
        $headers = @{ 
            "Content-Type" = "application/json" 
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Success "$Description"
        return $response
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-Error "$Description - $errorMsg"
        return $null
    }
}

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "E-Commerce Backend API - Automated Test Suite" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

Write-Section "1. Health Check"
$health = Invoke-ApiCall -Method GET -Endpoint "/health" -Description "Health Check"
if ($health) {
    Write-Info "Status: $($health.status)"
    Write-Info "Database: $($health.database)"
}

Write-Section "2. Authentication Tests"

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testUserEmail = "testuser$timestamp@example.com"
$registerBody = @{
    name = "Test User $timestamp"
    email = $testUserEmail
    password = "testpass123"
    phone = "1234567890"
}
$registerResult = Invoke-ApiCall -Method POST -Endpoint "/api/auth/register" -Body $registerBody -Description "Register New User"
if ($registerResult) {
    $userToken = $registerResult.data.token
    $testUserId = $registerResult.data.user.id
    Write-Info "User Token: $($userToken.Substring(0, 50))..."
    Write-Info "User ID: $testUserId"
}

$adminLoginBody = @{
    email = "admin@ecommerce.com"
    password = "admin123"
}
$adminLogin = Invoke-ApiCall -Method POST -Endpoint "/api/auth/login" -Body $adminLoginBody -Description "Login as Admin"
if ($adminLogin) {
    $adminToken = $adminLogin.data.token
    Write-Info "Admin Token: $($adminToken.Substring(0, 50))..."
}

$userLoginBody = @{
    email = "user@ecommerce.com"
    password = "user123"
}
$userLogin = Invoke-ApiCall -Method POST -Endpoint "/api/auth/login" -Body $userLoginBody -Description "Login as Regular User"

$vendorLoginBody = @{
    email = "vendor1@ecommerce.com"
    password = "vendor123"
}
$vendorLogin = Invoke-ApiCall -Method POST -Endpoint "/api/vendors/login" -Body $vendorLoginBody -Description "Login as Vendor"
if ($vendorLogin) {
    $vendorToken = $vendorLogin.data.token
    Write-Info "Vendor Token: $($vendorToken.Substring(0, 50))..."
}

Write-Section "3. User Profile Tests"

$profile = Invoke-ApiCall -Method GET -Endpoint "/api/users/me" -Token $userToken -Description "Get User Profile"
if ($profile) {
    Write-Info "Name: $($profile.data.user.name)"
    Write-Info "Email: $($profile.data.user.email)"
}

$updateProfileBody = @{
    name = "Updated Test User"
    phone = "9876543210"
}
Invoke-ApiCall -Method PUT -Endpoint "/api/users/me" -Token $userToken -Body $updateProfileBody -Description "Update User Profile"

Write-Section "4. Product Tests"

$products = Invoke-ApiCall -Method GET -Endpoint "/api/products" -Description "Get All Products"
if ($products -and $products.data.products.Count -gt 0) {
    Write-Info "Found $($products.data.products.Count) products"
    $testProductId = $products.data.products[0].id
    Write-Info "Test Product ID: $testProductId"
}

if ($testProductId) {
    Invoke-ApiCall -Method GET -Endpoint "/api/products/$testProductId" -Description "Get Single Product (ID: $testProductId)"
}

Invoke-ApiCall -Method GET -Endpoint "/api/products/featured" -Description "Get Featured Products"
Invoke-ApiCall -Method GET -Endpoint "/api/products/trending" -Description "Get Trending Products"
Invoke-ApiCall -Method GET -Endpoint "/api/products/new" -Description "Get New Arrivals"

Write-Section "5. Search and Filter Tests"

Invoke-ApiCall -Method GET -Endpoint "/api/search?q=iphone" -Description "Search Products (query: iphone)"
Invoke-ApiCall -Method GET -Endpoint "/api/products?category=1" -Description "Filter by Category (ID: 1)"

$ampersand = "&"
$priceFilterEndpoint = "/api/products?priceMin=100$ampersand" + "priceMax=1000"
Invoke-ApiCall -Method GET -Endpoint $priceFilterEndpoint -Description "Filter by Price Range (100-1000)"

Invoke-ApiCall -Method GET -Endpoint "/api/products?sort=-price" -Description "Sort by Price (descending)"

Write-Section "6. Category Tests"

$categories = Invoke-ApiCall -Method GET -Endpoint "/api/categories" -Description "Get All Categories"
if ($categories) {
    Write-Info "Found $($categories.data.categories.Count) categories"
}

Write-Section "7. Cart Tests"

$cart = Invoke-ApiCall -Method GET -Endpoint "/api/cart" -Token $userToken -Description "Get User Cart"

if ($testProductId) {
    $addToCartBody = @{
        productId = $testProductId
        quantity = 2
    }
    $cartAdd = Invoke-ApiCall -Method POST -Endpoint "/api/cart" -Token $userToken -Body $addToCartBody -Description "Add Item to Cart"
    
    if ($cartAdd -and $cartAdd.data.cart.items.Count -gt 0) {
        $testCartItemId = $cartAdd.data.cart.items[0].id
        Write-Info "Cart Item ID: $testCartItemId"
        
        $updateCartBody = @{ 
            quantity = 3 
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/cart/$testCartItemId" -Token $userToken -Body $updateCartBody -Description "Update Cart Item Quantity"
    }
}

Write-Section "8. Order Tests"

if ($testProductId) {
    $createOrderBody = @{
        items = @(
            @{
                product = $testProductId
                name = "Test Product"
                quantity = 1
                price = 999
            }
        )
        shippingAddress = @{
            street = "123 Main St"
            city = "New York"
            state = "NY"
            zipCode = "10001"
            country = "USA"
            phone = "1234567890"
        }
        paymentMethod = "card"
    }
    $orderResult = Invoke-ApiCall -Method POST -Endpoint "/api/orders" -Token $userToken -Body $createOrderBody -Description "Create Order"
    
    if ($orderResult) {
        $testOrderId = $orderResult.data.order.id
        Write-Info "Order ID: $testOrderId"
        Write-Info "Order Number: $($orderResult.data.order.order_number)"
    }
}

$orders = Invoke-ApiCall -Method GET -Endpoint "/api/orders" -Token $userToken -Description "Get User Orders"

if ($testOrderId) {
    Invoke-ApiCall -Method GET -Endpoint "/api/orders/$testOrderId" -Token $userToken -Description "Get Order Details (ID: $testOrderId)"
}

Write-Section "9. Review Tests"

if ($testProductId) {
    Invoke-ApiCall -Method GET -Endpoint "/api/products/$testProductId/reviews" -Description "Get Product Reviews"
    
    $createReviewBody = @{
        rating = 5
        comment = "Excellent product! Highly recommended. Automated test review."
    }
    $reviewResult = Invoke-ApiCall -Method POST -Endpoint "/api/products/$testProductId/reviews" -Token $userToken -Body $createReviewBody -Description "Create Product Review"
    
    if ($reviewResult) {
        $testReviewId = $reviewResult.data.review.id
        Write-Info "Review ID: $testReviewId"
    }
}

Write-Section "10. Wishlist Tests"

$wishlist = Invoke-ApiCall -Method GET -Endpoint "/api/wishlist" -Token $userToken -Description "Get User Wishlist"

if ($testProductId) {
    $addWishlistBody = @{ 
        productId = $testProductId 
    }
    Invoke-ApiCall -Method POST -Endpoint "/api/wishlist" -Token $userToken -Body $addWishlistBody -Description "Add to Wishlist"
    
    Start-Sleep -Seconds 1
    Invoke-ApiCall -Method DELETE -Endpoint "/api/wishlist/$testProductId" -Token $userToken -Description "Remove from Wishlist"
}

Write-Section "11. Address Tests"

$createAddressBody = @{
    fullName = "John Doe"
    phone = "1234567890"
    street = "456 Oak Avenue"
    city = "Los Angeles"
    state = "CA"
    zipCode = "90001"
    country = "USA"
    isDefault = $true
}
$addressResult = Invoke-ApiCall -Method POST -Endpoint "/api/users/me/addresses" -Token $userToken -Body $createAddressBody -Description "Create Address"

if ($addressResult) {
    $testAddressId = $addressResult.data.address.id
    Write-Info "Address ID: $testAddressId"
}

$addresses = Invoke-ApiCall -Method GET -Endpoint "/api/users/me/addresses" -Token $userToken -Description "Get User Addresses"

if ($testAddressId) {
    $updateAddressBody = @{
        city = "San Francisco"
        zipCode = "94102"
    }
    Invoke-ApiCall -Method PUT -Endpoint "/api/users/me/addresses/$testAddressId" -Token $userToken -Body $updateAddressBody -Description "Update Address"
}

Write-Section "12. Notification Tests"

$notifications = Invoke-ApiCall -Method GET -Endpoint "/api/notifications" -Token $userToken -Description "Get User Notifications"

Write-Section "13. Admin Tests (Requires Admin Token)"

if ($adminToken) {
    Invoke-ApiCall -Method GET -Endpoint "/api/users" -Token $adminToken -Description "Get All Users (Admin)"
    
    $createProductBody = @{
        name = "Test Laptop - Automated"
        description = "High performance laptop created by automated test"
        price = 1299.99
        categoryId = 1
        brand = "TestBrand"
        stock = 50
        tags = @("laptop", "computer", "test")
    }
    $productResult = Invoke-ApiCall -Method POST -Endpoint "/api/products" -Token $adminToken -Body $createProductBody -Description "Create Product (Admin)"
    
    if ($productResult) {
        $newProductId = $productResult.data.product.id
        Write-Info "New Product ID: $newProductId"
        
        $updateProductBody = @{
            price = 1199.99
            stock = 75
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/products/$newProductId" -Token $adminToken -Body $updateProductBody -Description "Update Product (Admin)"
        
        Invoke-ApiCall -Method DELETE -Endpoint "/api/products/$newProductId" -Token $adminToken -Description "Delete Product (Admin)"
    }
    
    $allOrders = Invoke-ApiCall -Method GET -Endpoint "/api/orders/admin/all" -Token $adminToken -Description "Get All Orders (Admin)"
    
    if ($testOrderId) {
        $updateStatusBody = @{ 
            status = "shipped" 
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/orders/admin/$testOrderId/status" -Token $adminToken -Body $updateStatusBody -Description "Update Order Status (Admin)"
        
        $trackingBody = @{ 
            trackingNumber = "TRACK123456789" 
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/orders/admin/$testOrderId/assign-shipment" -Token $adminToken -Body $trackingBody -Description "Assign Tracking Number (Admin)"
    }
    
    $createCategoryBody = @{
        name = "Test Category"
        description = "Category created by automated test"
    }
    $categoryResult = Invoke-ApiCall -Method POST -Endpoint "/api/categories" -Token $adminToken -Body $createCategoryBody -Description "Create Category (Admin)"
    
    if ($categoryResult) {
        $newCategoryId = $categoryResult.data.category.id
        Write-Info "New Category ID: $newCategoryId"
        
        $updateCategoryBody = @{ 
            description = "Updated description" 
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/categories/$newCategoryId" -Token $adminToken -Body $updateCategoryBody -Description "Update Category (Admin)"
        
        Invoke-ApiCall -Method DELETE -Endpoint "/api/categories/$newCategoryId" -Token $adminToken -Description "Delete Category (Admin)"
    }
    
    if ($testUserId) {
        $updateRoleBody = @{ 
            role = "vendor" 
        }
        Invoke-ApiCall -Method PUT -Endpoint "/api/users/$testUserId/role" -Token $adminToken -Body $updateRoleBody -Description "Update User Role (Admin)"
    }
} else {
    Write-Error "Admin token not available. Skipping admin tests."
}

Write-Section "14. Vendor Tests"

if ($vendorToken) {
    Invoke-ApiCall -Method GET -Endpoint "/api/vendors/me" -Token $vendorToken -Description "Get Vendor Profile"
    
    $vendorProductBody = @{
        name = "Vendor Product - Automated"
        description = "Product created by vendor in automated test"
        price = 599.99
        categoryId = 2
        brand = "VendorBrand"
        stock = 100
        tags = @("vendor", "test")
    }
    $vendorProductResult = Invoke-ApiCall -Method POST -Endpoint "/api/products" -Token $vendorToken -Body $vendorProductBody -Description "Create Product (Vendor)"
    
    if ($vendorProductResult) {
        $vendorProductId = $vendorProductResult.data.product.id
        Write-Info "Vendor Product ID: $vendorProductId"
    }
} else {
    Write-Info "Vendor token not available. Skipping vendor tests."
}

Write-Section "15. Cleanup"

if ($testCartItemId) {
    Invoke-ApiCall -Method DELETE -Endpoint "/api/cart/$testCartItemId" -Token $userToken -Description "Remove Cart Item (Cleanup)"
}

if ($testAddressId) {
    Invoke-ApiCall -Method DELETE -Endpoint "/api/users/me/addresses/$testAddressId" -Token $userToken -Description "Delete Address (Cleanup)"
}

Write-Section "Test Summary"

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "Test Suite Completed!" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

Write-Info "Base URL: $baseUrl"
Write-Info "`nGenerated Test Data:"
if ($testUserId) { 
    Write-Info "User ID: $testUserId" 
}
if ($testProductId) { 
    Write-Info "Product ID: $testProductId" 
}
if ($testOrderId) { 
    Write-Info "Order ID: $testOrderId" 
}
if ($testReviewId) { 
    Write-Info "Review ID: $testReviewId" 
}
if ($testAddressId) { 
    Write-Info "Address ID: $testAddressId" 
}

Write-Host "`nAll automated tests completed!" -ForegroundColor Green
Write-Host "Check the output above for any errors.`n" -ForegroundColor Cyan