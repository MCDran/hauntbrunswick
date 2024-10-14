// backend/server.ts
import dotenv from "dotenv";
dotenv.config();
console.log('DB_HOST: ', process.env.DB_HOST);

import express from 'express';
import cors from 'cors';
import registrationRoutes from './routes/registrations'
import timeSlots from "./routes/timeSlots";

const app = express();
const PORT = 5000;

const allowedOrigins = [
    'http://localhost:5173',
    `http://${process.env.LOCAL_IP}:5173`  // Replace with your local IP or set it in .env
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true  // Allow credentials if needed
}));


app.options('*', cors());

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

app.use('/api', registrationRoutes);
app.use('/api', timeSlots);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
