# PowerShell script to start the backend server
Write-Host "🚀 Starting MySQL backend server..." -ForegroundColor Green

# Navigate to the MySQL directory
Set-Location $PSScriptRoot

# Start the backend server
Write-Host "📡 Starting Node.js server on port 3000..." -ForegroundColor Yellow
npm start

Write-Host "✅ Backend server started successfully!" -ForegroundColor Green
Write-Host "🌐 Server running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 API endpoints available:" -ForegroundColor Cyan
Write-Host "   - GET /api/project (all projects)" -ForegroundColor White
Write-Host "   - GET /api/project/:code (specific project)" -ForegroundColor White
Write-Host "   - PUT /api/project/:code/subscription (update subscription)" -ForegroundColor White

# Keep the script running
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Read-Host "Press Enter to continue"
