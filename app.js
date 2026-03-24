const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const campgrounds = require('./routes/campgrounds');
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');

// โหลด environment เฉพาะใน local (Vercel จะใช้ env ที่ตั้งใน dashboard)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config/config.env' });
}

// เชื่อมต่อ MongoDB (จัดการ connection caching)
connectDB();

const app = express();

app.set('query parser', 'extended');
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://projectfrontend-khaki.vercel.app"
      // ถ้ามี domain อื่น ให้เพิ่มตรงนี้
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.options("*", cors());

// เสิร์ฟ static files (ถ้าจำเป็น)
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/v1/campgrounds', campgrounds);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);

module.exports = app;