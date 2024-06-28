/***
 * This is the entry point of the application.
 * It creates an express app and listens on a port.
 * It also imports the plantRoutes and uses it as middleware.
 */


import express from 'express';
import plantRoutes from './routes/plantRoutes';

const app = express();

app.use('/api/plants', plantRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});