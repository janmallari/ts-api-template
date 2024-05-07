import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

import loadApp from '@/app';
import WebSocket from '@/infrastructure/websocket';
import DB from '@/config/db';

// import registerModels from '@/models/registerModels';

// import initializeIndices from '@/infrastructure/elasticsearch/indices';

async function main() {
  try {
    const db = DB({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME,
      dialect: 'mariadb',
      logging: false, // Disable SQL query logging
      retry: {
        max: 10,
        timeout: 3000,
      },
    });

    await db.authenticate();
    console.log('📦 Database connected');

    // await initializeIndices();

    // registerModels(db);

    const port = process.env.PORT || 3000;

    const app = loadApp();

    const server = http.createServer(app);

    const webSocketService = WebSocket.getInstance();
    webSocketService.initialize(server);

    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('📦 Database connection failed', error);
    process.exit(1);
  }
}

main().catch(console.error);
