import express, { Request, Response } from 'express';
import {randomUUID} from 'crypto';
import {alsMiddleWare} from "./middleware/ALSMiddleware";
import {logger} from './utils/logger';
import db from "./routes/dbSimulate";

const app = express();
const port = process.env.PORT || 3000;

// ALS middleware
app.use(alsMiddleWare);

app.use(express.json());

/*app.get('/', (req: Request, res: Response) => {
    logger.info('Hello world');
    res.json({ message: 'Express + TypeScript server is running' });
});*/

app.use('/simulate', db)

app.listen(port,() => {
  logger.info(`Server listening on http://localhost:${port}`);
});


