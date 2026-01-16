import app, { initializeAdminUser } from "./server.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initializeAdminUser();
  } catch (err) {
    console.error("Erro inicializando usuário admin:", err);
  }

  app.listen(PORT, () => {
    console.log(`🎮 Servidor GameHub rodando na porta ${PORT}`);
  });
})();
