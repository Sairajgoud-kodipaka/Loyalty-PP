# Manual Point Activation Guide

## Problem
In test mode, points activate after 20 seconds, but the cron job only runs hourly. You need a way to manually trigger activation during testing.

## Solution
A manual activation button has been added to the dashboard, plus an API endpoint you can call directly.

---

## Method 1: Dashboard Button (Easiest)

1. Go to **Dashboard** (`/dashboard`)
2. Look for the **"Activate Pending Points"** button in the top-right corner
3. Click it
4. Wait for the success message
5. The page will automatically refresh to show updated balances

**What it does:**
- Calls `activate_pending_points()` function
- Activates all points where `activation_date <= NOW()`
- Updates customer balances
- Shows how many points were activated

---

## Method 2: API Endpoint

You can call the API directly:

```bash
curl -X POST http://localhost:3000/api/admin/activate-points
```

Or from JavaScript:

```javascript
fetch('/api/admin/activate-points', {
  method: 'POST',
})
  .then(res => res.json())
  .then(data => console.log(data))
```

**Response:**
```json
{
  "success": true,
  "message": "Activated 5 pending point entries",
  "activatedCount": 5
}
```

---

## Method 3: Direct SQL (Supabase Dashboard)

If you prefer using SQL directly:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run:
   ```sql
   SELECT activate_pending_points();
   ```
3. Check the result - it returns the number of points activated

---

## Testing Workflow

### Step-by-Step Test Process:

1. **Record Purchase**
   - Register customer
   - Record ₹10,000 purchase
   - Points earned: 200
   - Status: Pending (activation_date = NOW() + 20 seconds)

2. **Wait 20 Seconds**
   - Set a timer
   - Wait for activation_date to pass

3. **Activate Points**
   - Click "Activate Pending Points" button on dashboard
   - OR call the API endpoint
   - OR run SQL: `SELECT activate_pending_points();`

4. **Verify**
   - Refresh customer profile page
   - Check "Available Points" card
   - Should show: ₹200 available ✅

---

## Files Created

1. **API Endpoint:** `app/api/admin/activate-points/route.ts`
   - POST endpoint that calls the activation function
   - Returns count of activated points

2. **UI Component:** `components/admin/ActivatePointsButton.tsx`
   - Button component with loading state
   - Shows toast notifications
   - Auto-refreshes page after activation

3. **Dashboard Integration:** `app/dashboard/page.tsx`
   - Button added to dashboard header
   - Always visible for easy access during testing

---

## Notes

- **Authentication Required:** Only authenticated users can trigger activation
- **No Admin Check:** Currently any logged-in user can activate (useful for testing)
- **Production:** Consider adding admin role check before production launch
- **Cron Job Still Active:** The hourly cron job still runs automatically
- **Manual Trigger:** This is just for testing - in production, cron handles it

---

## Troubleshooting

**Button doesn't work?**
- Check browser console for errors
- Verify you're logged in
- Check API endpoint is accessible

**Points not activating?**
- Verify `activation_date <= NOW()` in database
- Check function permissions (should have SECURITY DEFINER)
- Look for errors in Supabase logs

**Balance not updating?**
- Function should update automatically
- Try refreshing the page
- Check `customers.available_points` in database

---

## Quick Test

```bash
# 1. Start dev server
npm run dev

# 2. Login to dashboard
# 3. Record a purchase (₹10,000 = 200 points)
# 4. Wait 20 seconds
# 5. Click "Activate Pending Points" button
# 6. Verify points are now available
```

Done! 🎉

