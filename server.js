// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const smogTestRoutes = require('./routes/smogTest');
const invoiceRoutes = require('./routes/invoice');
const analyticsRoutes = require('./routes/analytics');
const serviceRoutes = require('./routes/service');
const sendForm = require('./routes/sendForm');
const { swaggerUi, swaggerSpec } = require('./swagger');


const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/smog-test', smogTestRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/service", serviceRoutes);
app.use('/api', sendForm);


app.get('/testing', (req, res) => {
  res.status(200).json({ message: 'Testing endpoint is working!' });
});
app.get('/testing2', (req, res) => {
  res.status(200).json({ message: 'Testing endpoint is working244!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
