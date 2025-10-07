import { App } from "./app";

const port = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    const app = new App();
    await app.initialize();
    
    const server = app.getApp().listen(port, () => {
      const worker = `worker-${process.env.HOSTNAME ?? 'local'}`;
      console.log(`Issuance service listening on port ${port} (${worker})`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
