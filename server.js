const express = require('express');
const cors = require('cors');
const path = require('path'); // Importa o módulo 'path'
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyClCcUpDopb8hDLsZjkDr6b80XVQLnqIz0"; // Substitua pela sua chave API
const genAI = new GoogleGenerativeAI(apiKey);

const app = express();
app.use(cors({
  origin: 'https://boisterous-faloodeh-c5fb4d.netlify.app', // Permitir apenas este domínio
}));
app.use(express.json()); // Permite que o servidor entenda JSON no corpo da requisição

// Servindo o arquivo HTML estático
app.use(express.static(path.join(__dirname, 'public')));

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post('/send-message', async (req, res) => {
  try {
    const { input } = req.body;

    // Inicia uma sessão de chat
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Envia a mensagem do usuário e obtém a resposta
    const result = await chatSession.sendMessage(input);
    
    // Adicione um log para ver o resultado
    console.log("Resultado da IA:", result.response.text());

    // Retorne a resposta
    res.json({ response: result.response.text() });
  } catch (err) {
    console.error("Erro:", err);
    // Retorna um JSON de erro
    res.status(500).json({ error: "Erro ao processar a mensagem" });
  }
});

const PORT = process.env.PORT || 3000; // Defina a porta que você deseja usar

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
