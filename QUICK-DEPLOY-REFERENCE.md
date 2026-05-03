# 🚀 Quick Deploy Reference Card

## ✅ Git Push - COMPLETE!

```bash
✅ Changes committed
✅ Pushed to GitHub
✅ Repository: github.com/prakashkchaudhary/new-koshi-a-c
✅ Branch: master
```

---

## ⏱️ What's Happening Now (Auto-Deploy)

### Render (Backend)
```
Status: 🔄 Auto-deploying...
URL: https://dashboard.render.com
Service: newkoshi-backend
Time: ~5-8 minutes
```

### Vercel (Frontend)
```
Status: 🔄 Auto-deploying...
URL: https://vercel.com/dashboard
Time: ~2-3 minutes
```

---

## 📋 Your Action Items

### 1️⃣ Monitor Deployments (Now)
- [ ] Open Render Dashboard
- [ ] Open Vercel Dashboard
- [ ] Watch for "Live" and "Ready" status

### 2️⃣ Update Frontend URL (After Backend is Live)
- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Update: `REACT_APP_API_URL=https://newkoshi-backend.onrender.com/api`
- [ ] Save and Redeploy

### 3️⃣ Test Your App (After Both are Live)
- [ ] Open your Vercel URL
- [ ] Test seat layout (should show 1+1|2 config)
- [ ] Test booking flow
- [ ] Test admin panel

---

## 🔗 Quick Links

| Service | Dashboard | Docs |
|---------|-----------|------|
| **Render** | [dashboard.render.com](https://dashboard.render.com) | [render.com/docs](https://render.com/docs) |
| **Vercel** | [vercel.com/dashboard](https://vercel.com/dashboard) | [vercel.com/docs](https://vercel.com/docs) |
| **GitHub** | [Your Repo](https://github.com/prakashkchaudhary/new-koshi-a-c) | - |

---

## 🧪 Quick Test Commands

### Test Backend (Replace URL)
```bash
curl https://newkoshi-backend.onrender.com/api/buses
```

### Test Frontend
```
Open: https://your-project.vercel.app
Check: Seat layout shows C1, A, B, KA, Kha, etc.
```

---

## ⚡ Expected Timeline

```
✅ 00:00 - Git push complete
🔄 00:01 - Deployments detected
🔄 00:03 - Vercel ready (frontend)
🔄 00:08 - Render live (backend)
⚙️ 00:09 - Update Vercel env var
✅ 00:12 - All systems live!
```

---

## 🎯 Success Checklist

- [ ] Render shows "Deploy live"
- [ ] Vercel shows "Ready"
- [ ] Frontend loads
- [ ] Seat layout correct (1+1|2)
- [ ] Can book seats
- [ ] Admin panel works

---

## 🆘 Quick Troubleshooting

**Render build fails?**
→ Check logs in Render dashboard

**Vercel build fails?**
→ Check logs in Vercel dashboard

**Frontend can't reach backend?**
→ Update REACT_APP_API_URL in Vercel

**Seat layout not showing?**
→ Hard refresh (Ctrl+F5)

---

## 📞 Need Help?

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check browser console

---

**Status**: 🚀 Deploying...
**ETA**: ~10-12 minutes
**Next**: Monitor dashboards!
