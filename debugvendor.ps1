# Debug script for Vendor Profile 403 error

$baseUrl = "https://ecom-backend-h7ui-93o1ufnmy-nikhils-projects-bcb3c0d0.vercel.app"

function Write-Info { 
    param($message) 
    Write-Host "INFO: $message" -ForegroundColor Cyan 
}

function Write-Success { 
    param($message) 
    Write-Host "SUCCESS: $message" -ForegroundColor Green 
}

function Write-Error { 
    param($message) 
    Write-Host "ERROR: $message" -ForegroundColor Red 
}

# Login as Vendor
$vendorLoginBody = @{
    email = "vendor1@ecommerce.com"
    password = "vendor123"
}

Write-Host "`n========== Testing Vendor Authentication ==========" -ForegroundColor Yellow

try {
    $vendorLogin = Invoke-RestMethod -Uri "$baseUrl/api/vendors/login" -Method POST -Body ($vendorLoginBody | ConvertTo-Json) -Headers @{"Content-Type" = "application/json"}
    $vendorToken = $vendorLogin.data.token
    Write-Success "Vendor login successful"
    Write-Info "Vendor Token: $($vendorToken.Substring(0, 50))..."
    
    # Test 1: Try /api/vendors/me
    Write-Host "`nTest 1: GET /api/vendors/me" -ForegroundColor Cyan
    try {
        $response1 = Invoke-RestMethod -Uri "$baseUrl/api/vendors/me" -Method GET -Headers @{
            "Authorization" = "Bearer $vendorToken"
            "Content-Type" = "application/json"
        }
        Write-Success "Vendor profile retrieved via /api/vendors/me"
        Write-Info "Response: $($response1 | ConvertTo-Json -Depth 3)"
    }
    catch {
        Write-Error "Failed: $($_.Exception.Message)"
        Write-Info "Status Code: $($_.Exception.Response.StatusCode.value__)"
    }
    
    # Test 2: Try /api/users/me with vendor token
    Write-Host "`nTest 2: GET /api/users/me (using vendor token)" -ForegroundColor Cyan
    try {
        $response2 = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method GET -Headers @{
            "Authorization" = "Bearer $vendorToken"
            "Content-Type" = "application/json"
        }
        Write-Success "Profile retrieved via /api/users/me"
        Write-Info "Response: $($response2 | ConvertTo-Json -Depth 3)"
    }
    catch {
        Write-Error "Failed: $($_.Exception.Message)"
    }
    
    # Test 3: Verify vendor can still create products
    Write-Host "`nTest 3: POST /api/products (verify vendor permissions)" -ForegroundColor Cyan
    $testProduct = @{
        name = "Debug Test Product"
        description = "Testing vendor permissions"
        price = 99.99
        categoryId = 1
        brand = "TestBrand"
        stock = 10
    }
    try {
        $response3 = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method POST -Body ($testProduct | ConvertTo-Json) -Headers @{
            "Authorization" = "Bearer $vendorToken"
            "Content-Type" = "application/json"
        }
        Write-Success "Vendor can create products - permissions OK"
        Write-Info "Created Product ID: $($response3.data.product.id)"
    }
    catch {
        Write-Error "Failed: $($_.Exception.Message)"
    }
    
}
catch {
    Write-Error "Vendor login failed: $($_.Exception.Message)"
}

Write-Host "`n========== Debug Summary ==========" -ForegroundColor Yellow
Write-Info "If Test 2 succeeded, use /api/users/me instead of /api/vendors/me"
Write-Info "If Test 3 succeeded, the vendor token is valid but /api/vendors/me might not exist"
Write-Host ""