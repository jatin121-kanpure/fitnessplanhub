⚙️ Installation & Setup
1. Prerequisites
Node.js (v16+ recommended)​

npm or yarn

MongoDB (local or Atlas cluster)​

2. Clone the Repository
git clone https://github.com/<your-username>/fitplanhub.git
cd fitplanhub
3. Backend Setup

cd backend
npm install
Create .env in backend/:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
Start backend:
npm run dev
# Server: http://localhost:5000

4. Frontend Setup
cd ../frontend
npm install
npm start
# App: http://localhost:3000

🧪 Usage Guide
Trainer Flow
Sign up as Trainer on /signup (with certification).

Go to /trainer-dashboard.

Create new plans (title, description, price, duration, category, exercises).

See all own plans and delete if needed.

User Flow
Sign up as User on /signup.

Explore all plans on /.

Go to /feed:

See recommended trainers.

Follow trainers.

See plans from followed trainers.

Subscribe to a plan to unlock it (simulated 30‑day subscription).
