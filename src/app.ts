import express from 'express';
import { createPlantsTableIfNotExists, parseAndSaveExcelData } from './utils/excelParser';
import plantRoutes from './routes/plantRoutes';

require('dotenv').config();

const app = express();

app.use('/api/plants', plantRoutes);

createPlantsTableIfNotExists()
  .then(() => {
    return parseAndSaveExcelData();
  })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error creating table or parsing and saving Excel data:', error);
    process.exit(1);
  });