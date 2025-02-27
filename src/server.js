import express from 'express';
import dotevn from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotevn.config(path.join(__dirname, '..','.env'));

const PORT = process.env.PORT || 5000;



// Create express app
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Auth Routes
app.use('/api/v1/auth', authRoutes);

// Routes
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,"views","home.html"));
})

app.get('/signup',(req,res
    ) => {
    res.sendFile(path.join(__dirname,"views","auth","signup.html"));
}
)

app.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,"views","auth","login.html"));
}
)

app.get('/home',(req,res
    ) => {
    res.sendFile(path.join(__dirname,"views","home.html"));
}
)

// Connect to MongoDB
mongoose.connect(process.env.MONG_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
    );
}).catch((error) => {
    console.log(error);
}
);

