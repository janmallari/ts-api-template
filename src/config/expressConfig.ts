import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

export default function expressConfig(app: Application) {
  app.use(helmet());
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));
  app.use(fileUpload());
}
