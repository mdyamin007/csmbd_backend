const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/contents', contentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Content Management API');
  });

  // Sync DB and start server
sequelize.sync({ alter: true })
.then(() => {
  console.log('Database connected and synced.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('Unable to connect to the database:', err));