# Points Calculator - Google Cloud Arcade

Points Calculator is a modern, responsive full-stack web application designed for Google Cloud Arcade participants to calculate and track their earned points, progress, and milestone achievements.

## Key Features

1. **Secure Authentication**: Individual user accounts with signup/login and JWT session storage.
2. **Dynamic Dashboard**:
   - Total Points and completed tasks counters.
   - Interactive milestone progress bars detailing what's needed for the next tier.
   - Graphical progression charts (using Recharts).
   - Real-time active announcements feed.
3. **Interactive Points Calculator**:
   - Easily input completed lab and skill badge counts.
   - Computes point breakdowns instantly using multipliers.
   - Details the closest milestone targets and remaining requirements.
   - "Save Progress" logs evaluations directly to database logs.
4. **Historical Log**:
   - View past calculations.
   - Delete historical items.
   - Recalculate all history instantly matching updated multiplier configurations.
5. **Admin Management Panel**:
   - Real-time edit forms for points per lab, points per skill badge, and milestones tiers.
   - CRUD manager to publish, toggle, and delete announcements.
   - Member administration to list and delete user accounts.
6. **Polished Design**: Modern Google-inspired theme, light/dark mode switcher, fluid transitions, and loading skeletons.

---

## Technical Stack

- **Frontend**: React (Vite-based), Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), Bcrypt.js, Mongoose.
- **Database**: MongoDB.

---

## Installation & Setup

### Prerequisite: Database Configuration
Since MongoDB must be running to load configurations and logs, you need a MongoDB connection string.
- If you have MongoDB installed locally, the server default is set to `mongodb://localhost:27017/arcade_points`. Make sure the MongoDB service is started on your PC.
- If you do not have MongoDB installed locally, we recommend using a free **MongoDB Atlas (Cloud)** database:
  1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
  2. Create a free M0 database cluster.
  3. Under **Database Access**, create a user with read/write privileges.
  4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
  5. Click **Connect** -> **Drivers** and copy your Connection String.
  6. Open `server/.env` and replace `MONGODB_URI` with your connection string (fill in `<password>` and database name).

### 1. Set Up and Run the Backend Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. The server dependencies are already installed. Create/check your `.env` settings:
   ```env
   PORT=5000
   MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
   JWT_SECRET=google_cloud_arcade_super_secret_key_12345
   ADMIN_EMAIL=admin@arcade.com
   ADMIN_PASSWORD=AdminPass123!
   NODE_ENV=development
   ```
3. Start the API server:
   ```bash
   npm run dev
   ```
   The API should listen on [http://localhost:5000](http://localhost:5000).

### 2. Set Up and Run the Frontend Client
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Start the Vite development host server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Default Access Credentials

On backend startup, the system self-bootstraps with a default administrator account using parameters in the `server/.env` file.

- **Admin Email**: `admin@arcade.com`
- **Admin Password**: `AdminPass123!`

You can log in with this account to configure settings and test the Admin Panel immediately, or register a new regular account.
