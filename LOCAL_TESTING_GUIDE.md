# Local Testing Guide - AuraFlow

## ✅ Setup Complete!

Both servers are now running and ready for testing.

### Running Servers

**Backend (Mock Server):**
- URL: http://localhost:3000
- Status: ✅ Running
- Terminal: Terminal #3d96517c (background)
- Command: `node mock-backend.js`

**Frontend (Vite Dev Server):**
- URL: http://localhost:5173
- Status: ✅ Running  
- Terminal: Terminal #3ba3bca6 (background)
- Command: `npm run dev`

---

## 🧪 Testing Scenarios

### Test 1: Basic Route Calculation
**Expected Outcome:** Calculate shortest path between two roads

1. Open http://localhost:5173
2. Click "Open Dashboard"
3. Select "From: Road 1" and "To: Road 14"
4. Click "Calculate Route"
5. **Expected Result:** Path displays: 1 → 7 → 8 → 12 → 14

**Success Indicators:**
- ✅ Route displays on map
- ✅ List of roads shows exact path
- ✅ No error messages

---

### Test 2: Congestion Avoidance
**Expected Outcome:** Route should avoid congested roads

1. From dashboard, open Developer Tools (F12)
2. Go to Console tab
3. Run this command:
```javascript
fetch('http://localhost:3000/api/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ congested: [7, 8] })
})
```
4. In the app, calculate route: From Road 1 → To Road 14
5. **Expected Result:** Path avoids roads 7 & 8: 1 → 4 → 11 → 13 → 14

**Success Indicators:**
- ✅ Route avoids congested roads
- ✅ Still finds valid path
- ✅ Status message shows handling congestion

---

### Test 3: Error Handling - Invalid Input
**Expected Outcome:** Proper error message for bad input

1. Manually navigate to:
```
http://localhost:5173?from=99&to=50
```
2. Click "Calculate Route"
3. **Expected Result:** Error message appears: "Invalid or missing from parameter (1-14)"

**Success Indicators:**
- ✅ Specific error message displayed
- ✅ User guidance provided
- ✅ No console errors

---

### Test 4: Error Handling - No Path Available  
**Expected Outcome:** Handle cases where all routes are blocked

1. Run in console:
```javascript
fetch('http://localhost:3000/api/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ congested: [7, 8, 11, 4] })
})
```
2. Calculate route: From Road 1 → To Road 14
3. **Expected Result:** Error message: "Road cannot be calculated"

**Success Indicators:**
- ✅ Clear error message
- ✅ User understands routes are blocked
- ✅ Graceful handling

---

### Test 5: Backend Unavailable
**Expected Outcome:** Frontend handles backend downtime gracefully

1. Stop backend: Press Ctrl+C in backend terminal
2. In app, calculate any route
3. **Expected Result:** Error message: "Backend is not responding correctly"

**Success Indicators:**
- ✅ Clear message about backend status
- ✅ User knows how to fix (run vercel dev)
- ✅ App doesn't crash

---

### Test 6: Polling Updates
**Expected Outcome:** Frontend periodically polls for congestion updates

1. Open browser console (F12)
2. Filter for `/api/state` requests (Network tab)
3. Watch for requests every 5 seconds
4. **Expected Result:** Requests appear regularly

**Success Indicators:**
- ✅ Requests appear every ~5 seconds
- ✅ Responses contain congestion data
- ✅ No errors in console

---

## 🔍 Debugging Tips

### Check Backend Status
```javascript
fetch('http://localhost:3000/api/roads')
  .then(r => r.json())
  .then(data => console.log('Backend OK:', data))
```

### Check Current Congestion
```javascript
fetch('http://localhost:3000/api/state')
  .then(r => r.json())
  .then(data => console.log('Congestion:', data.congested))
```

### Test Route Calculation
```javascript
fetch('http://localhost:3000/api/route?from=1&to=14&avoid=7,8')
  .then(r => r.json())
  .then(data => console.log('Path:', data.path))
```

### Check Frontend Configuration
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_URL)
```

---

## 📋 Key Bug Fixes Validated

✅ **Bug #1: Frontend not passing congested roads**
- Status: FIXED
- Evidence: `avoid` parameter now included in `/api/route` requests
- Test: Verify in Network tab

✅ **Bug #2: JSON parsing errors**
- Status: FIXED  
- Evidence: Content-type validation before parsing
- Test: Stop backend and see proper error message

✅ **Bug #3: Polling crashes**
- Status: FIXED
- Evidence: Graceful handling of non-JSON responses
- Test: Watch console while backend is down

---

## 🚀 Next Steps

### When Ready for Production:
1. Deploy frontend to Vercel
2. Deploy backend functions to Vercel
3. Set up Upstash Redis credentials
4. Update `VITE_API_URL` environment variable (can be empty for same-origin)
5. Test production deployment

### Environment Variables:
- **Development**: `VITE_API_URL=http://localhost:3000`
- **Production**: `VITE_API_URL=` (empty, uses same origin)

---

## 📞 Support

If tests fail, check:
1. **Backend running?** `netstat -ano | findstr :3000`
2. **Frontend running?** `netstat -ano | findstr :5173`  
3. **Correct API URL?** Check console: `console.log(import.meta.env.VITE_API_URL)`
4. **Browser cache?** Hard refresh (Ctrl+Shift+R)

---

**Last Updated:** Local testing environment set up and ready
**Status:** ✅ All systems operational
