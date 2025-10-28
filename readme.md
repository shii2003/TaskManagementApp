# Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the sample `.env` file and update values as needed:

```bash
cp .env.sample .env
```

Edit `.env` with your configuration:

```env
PORT=3002
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://root:example@localhost:27017/mobiledev?authSource=admin
```

> **Important:** Change `JWT_SECRET` to a strong, random string in production!

---

### 4. Start MongoDB with Docker

Run Docker Compose to start MongoDB:

```bash
docker compose up -d
```

This will:

* Start a MongoDB container named **mobile-dev-mongo**
* Create a database named **mobiledev**
* Expose it on port **27017**
* Set up authentication with username **root** and password **example**

To verify MongoDB is running:

```bash
docker ps
```

To view logs:

```bash
docker compose logs -f
```

To stop MongoDB later:

```bash
docker compose down
```

---

### 5. Seed the database with initial users

Before starting the server, seed the database with sample users:

```bash
npm run seed
```

This will create initial test users in the database.

---

### 6. Start the backend server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

Your backend API will be available at:
👉 [http://localhost:3002](http://localhost:3002)

Test the health endpoint:

```bash
curl http://localhost:3002/health
```

---

# Frontend Setup (React Native + Expo)

### 1. Navigate to the mobile folder

```bash
cd mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API base URL

Update your API base URL in your app configuration file
(e.g., `api/config.ts` or wherever you define your axios instance):

```ts
// For iOS simulator or Android emulator on the same machine
export const BASE_URL = "http://localhost:3002";

// For physical device - use your computer's local network IP
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
export const BASE_URL = "http://192.168.1.XXX:3002";
```

💡 **Tip:** To find your local IP address:

* **Windows:** Run `ipconfig` and look for *IPv4 Address*
* **Mac/Linux:** Run `ifconfig` or `ip addr show`

---

### 4. Start the Expo development server

```bash
npm start
```

This will open the Expo developer tools in your browser.

---

### 5. Run on your device

Choose one of the following options:

* Press **a** → Open in Android emulator
* Press **i** → Open in iOS simulator (Mac only)
* **Scan the QR code** with the Expo Go app on your phone:

---

### 6. Additional Expo commands

```bash
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web browser
```

---

### Base URL

```
http://localhost:3002/api
```

### Authentication Endpoints

```
/api/auth/register
/api/auth/login
/api/auth/logout
```