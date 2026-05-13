import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
