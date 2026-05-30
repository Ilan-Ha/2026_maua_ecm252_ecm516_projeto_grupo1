// Inicialização do servidor
const startServer = async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI não definida no .env");
      }
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Mongo conectado");
      await initSeed();
      app.listen(PORT, () => {
        console.log(`Rodando em ${config.url}:${PORT}`);
      });
  
    } catch (err) {
      console.error("Falha ao iniciar servidor:", err);
      process.exit(1);
    }
  };
  startServer();