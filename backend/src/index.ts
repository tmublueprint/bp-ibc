import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sectionRoute from './routes/sectionRoute';
import pageRoute from './routes/pageRoute';
import draftRoute from './routes/draftRoute';
import siteRoute from './routes/siteRoute';
import publishedRoute from './routes/publishedRoute';
import deployRoute from './routes/deployRoute'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api', siteRoute);
app.use('/api', draftRoute);
app.use('/api', pageRoute);
app.use('/api', sectionRoute);
app.use('/api', publishedRoute);
app.use('/api', deployRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
