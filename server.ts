import App from './app';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  const app = App.getInstance();
  await App.startDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(err => console.error('Failed to start server:', err));
