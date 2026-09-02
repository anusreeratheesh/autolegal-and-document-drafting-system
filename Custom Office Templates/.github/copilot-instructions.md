# AutoLegal AI Copilot Instructions

## Project Overview
AutoLegal is a full-stack legal document generation and review platform with role-based access (users, lawyers, admins). It uses **Node.js/Express backend** with **MongoDB**, and **React frontend** with Redux state management and Tailwind CSS.

## Architecture

### Backend (Express.js + MongoDB)
- **Entry point**: `src/app.js` - configures middleware, routes, database
- **Pattern**: Controllers handle business logic, Services for cross-cutting concerns (email, AI), Models define schemas
- **Key flows**:
  - Authentication via JWT (Bearer tokens) with role-based authorization
  - Document generation via mock AI service (`src/services/aiService.js`)
  - Notifications sent through `notificationService`
- **Error handling**: Custom error classes (`ValidationError`, `AuthenticationError`, `NotFoundError`) in `src/middleware/errorHandler.js`

### Frontend (React + Redux)
- **State management**: Redux slices in `src/store/slices/` handle auth, notifications, user, lawyer, admin, and UI state
- **API integration**: Centralized Axios instance in `src/utils/api.js` with auto-token injection and 401 redirect
- **Routing**: Role-based routes via `ProtectedRoute` component - admin/lawyer/user each have separate dashboards
- **UI**: Tailwind CSS + component-based structure (`src/components/` organized by domain)

## Critical Patterns

### Backend Authentication
```javascript
// Routes use protect middleware + authorize for role checks
router.post('/protected-route', protect, authorize('admin', 'lawyer'), controller)

// Password hashing via bcryptjs (User.js pre-save hook)
// JWT signing on successful auth, token stored in localStorage on frontend
```

### Frontend API Calls
```javascript
// All requests auto-inject Bearer token from localStorage
API.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// 401 errors redirect to /login and clear token
```

### Redux Slice Pattern
- Create slice with `createSlice` in `src/store/slices/`
- Export actions and reducer
- Add reducer to `store.js` configureStore
- Use `useSelector`/`useDispatch` hooks to access state

### Error Handling (Backend)
```javascript
// Throw custom errors; errorHandler middleware catches them
throw new ValidationError('Invalid input');
throw new AuthenticationError('Token expired');
// Middleware converts to { success: false, error: message } responses
```

### Validation (Backend)
- Use `express-validator` for request validation (body, param, query)
- Centralized rules in `src/middleware/validation.js`
- Apply `validate` middleware to routes to check results

## Development Workflow

### Start Development
```bash
# Backend (from auto-legal-drafting-backend/)
npm install && npm run dev  # runs nodemon on src/app.js

# Frontend (from auto-legal-drafting-frontend/)
npm install && npm start    # runs react-scripts start (port 3000)
```

### Environment Setup
- Backend: `.env` needs `MONGO_URI`, `JWT_SECRET`, `PORT` (default 5000), `NODE_ENV`
- Frontend: `.env` needs `REACT_APP_API_BASE_URL` (default: http://localhost:5000/api)

### Key Routes Structure
- `/api/auth` - login/signup/logout/refresh
- `/api/users` - user profile and management
- `/api/documents` - document CRUD and generation
- `/api/lawyers` - lawyer profiles and stats
- `/api/reviews` - lawyer review submissions and ratings
- `/api/payouts` - earnings and payment processing
- `/api/notifications` - notification management

## Common Tasks

### Adding Backend Endpoint
1. Create controller function in `src/controllers/`
2. Add route in `src/routes/` with middleware chain: `router.post('/path', authMiddleware, validateMiddleware, controller)`
3. Add validation rules to `src/middleware/validation.js`
4. Export API function in `src/utils/api.js` (frontend)

### Adding Frontend Page
1. Create page component in `src/pages/{role}/PageName.jsx`
2. Add route in `App.jsx` wrapped with `<ProtectedRoute requiredRole="role">`
3. Use Redux slices for state, API functions for data fetching
4. Add Redux slice if needed for new domain

### Fixing Authentication Issues
- Check JWT token presence in `localStorage.getItem('authToken')`
- Verify `REACT_APP_API_BASE_URL` matches backend port
- Backend `.env` must have valid `JWT_SECRET` matching token generation
- Check role in User.js model matches ProtectedRoute `requiredRole` prop

## Testing & Debugging

### Backend
- Use `npm run dev` with nodemon for auto-reload
- Check `process.env` for all required env vars
- MongoDB must be running (URI from `.env`)
- Use Morgan logging in development mode

### Frontend
- Redux DevTools extension helpful for state inspection
- Network tab shows API requests and token injection
- Toast notifications (react-hot-toast) show errors
- Check browser console for Redux logs

## Key Dependencies
- **Backend**: Express, Mongoose, bcryptjs, JWT, express-validator, morgan, helmet, cors, express-rate-limit
- **Frontend**: React, Redux Toolkit, Axios, React Router, Tailwind CSS, Framer Motion, Draft.js (document editing), Razorpay (payments)

## Important Notes
- MockAIService placeholder in backend - integrations (OpenAI/Gemini) should replace it
- Document generation currently returns mock content - integrate real AI APIs
- Rate limiting on `/api/` and stricter on auth endpoints (`authLimiter`)
- All errors must use custom error classes to ensure proper middleware handling
- Frontend local storage persists auth token - clear on logout
