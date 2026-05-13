import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sectionRoute from './routes/sectionRoute';
import pageRoute from './routes/pageRoute';
import draftRoute from './routes/draftRoute';
import siteRoute from './routes/siteRoute';
import publishedRoute from './routes/publishedRoute';
import deployRoute from './routes/deployRoute';
import publicRoute from './routes/publicRoute';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api', publicRoute);
app.use('/api', siteRoute);
app.use('/api', draftRoute);
app.use('/api', pageRoute);
app.use('/api', sectionRoute);
app.use('/api', publishedRoute);
app.use('/api', deployRoute);

export default app;
