import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/:id/bonus-card', async (req, res) => {
  const { id } = req.params;
  try {
    const bonusCard = await prisma.bonusCard.findUnique({
      where: { userId: id },
    });
    console.log(bonusCard);
    if (bonusCard) {
      res.json(bonusCard);
    } else {
      res.status(404).json({ error: 'Bonus card not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
