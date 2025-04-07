import express from "express";
import TelegramBot from "node-telegram-bot-api";
import cors from "cors";
import pg from 'pg';
const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(cors());

const bot = new TelegramBot('7945129872:AAHAE1rsx2pMpTCN6hsodFbqqElnyPACnKg', { polling: true });

const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'dargatech_db',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '2020',
});

const saveUserTelegram = async (id, phoneNumber, chatId) => {
    const checkUserQuery = `SELECT users.id FROM users, profile, techniciens WHERE users.id = profile.user_id AND users.id = techniciens.user_id AND profile.contact = $1 OR techniciens.contact = $1`;
    const userExists = await pool.query(checkUserQuery, [phoneNumber]);

    if (userExists) {
        console.error(`L'utilisateur avec numero tel ${phoneNumber} n'existe pas dans la table 'users'`);
        return;
    }

    const query = `
    INSERT INTO usertelgram (id, user_id, phone_number, chat_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET phone_number = EXCLUDED.phone_number, chat_id = EXCLUDED.chat_id, updated_at = CURRENT_TIMESTAMP;
  `;

    try {
        await pool.query(query, [id, userExists, phoneNumber, chatId]);
        console.log("Utilisateur ajouté ou mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur Telegram :", error);
    }
}

const saveMessage = async (phone_number, text, sender) => {
    const query = ` INSERT INTO messages (phone_number, text, sender) VALUES ($1, $2, $3); `;

    try {
        await pool.query(query, [phone_number, text, sender]);
        console.log("Message envoyé avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'envoi du message via Telegram :", error);
    }
}

const getPhoneNumber = async (chatId) => {
    const query = `SELECT phone_number FROM usertelgram WHERE chat_id=$1;`;

    try {
        const result = await pool.query(query, [chatId]);
        return result.rows.length > 0 ? result.rows[0].phone_number : null;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de téléphone Telegram :", error);
        return null;
    }
};

const getChatId = async (phone) => {
    const query = `SELECT chat_id FROM usertelgram WHERE phone_number=$1;`;

    try {
        const result = await pool.query(query, [phone]);
        return result.rows.length > 0 ? result.rows[0].chat_id : null;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de téléphone Telegram :", error);
        return null;
    }
};

const getMessages = async (phone) => {
    const query = `SELECT * FROM messages WHERE phone_number=$1;`;

    try {
        const result = await pool.query(query, [phone]);
        return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        return null;
    }
};

bot.on("contact", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const phoneNumber = msg.contact.phone_number;
    const firstName = msg.from.first_name + ' ' + msg.from.last_name || "User";
    const message = "Numéro enregistré ! \nBonjour " + firstName;

    try {
        await saveUserTelegram(userId, phoneNumber, chatId);
        saveMessage(phoneNumber, message, firstName);
        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'enregistrement : ', error);
    }
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = await getPhoneNumber(chatId);
    const message = "Bienvenue ! Utilisez les commandes suivantes :\n/help - Obtenez de l'aide\n/messages - Voir vos messages";
    bot.sendMessage(chatId, message);
    saveMessage(phoneNumber, message, "Bot");
});

bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = await getPhoneNumber(chatId);
    const message = "Voici les commandes disponibles :\n/start - Démarrer le bot\n/messages - Voir vos messages";
    bot.sendMessage(chatId, message);
    saveMessage(phoneNumber, message, "Bot");
});

bot.onText(/\/messages/, async (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = await getPhoneNumber(chatId);
    const message = "Voici les commandes disponibles :\n/start - Démarrer le bot\n/messages - Voir vos messages";
    bot.sendMessage(chatId, message);
    saveMessage(phoneNumber, message, "Bot");
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";
    const phoneNumber = await getPhoneNumber(chatId);

    if (!phoneNumber) {
        bot.sendMessage(chatId, "Envoyez votre contact en cliquant sur 📎 puis 'Envoyer mon numéro'.");
        return;
    }

    saveMessage(phoneNumber, msg.text, firstName);
    // bot.sendMessage(chatId, `Tu as dit : ${msg.text}`);
    // saveMessage(phoneNumber, `Tu as dit : ${msg.text}`, "Bot");
});

app.get("/messages/:phone", async (req, res) => {
    const phone = req.params.phone;
    res.json(await getMessages(phone) || []);
});

app.post("/sendMessage", async (req, res) => {
    const { phone, message } = req.body;
    if (!message || !phone) return res.status(400).json({ error: "Données invalides" });

    const chatId = await getChatId(phone);

    if (!chatId) {
        return res.status(404).json({ error: `Aucun utilisateur trouvé avec le numéro ${phone}` });
    }

    try {
        await bot.sendMessage(chatId, message);
        await saveMessage(phone, message, "Bot");
        res.json({ success: true, response: `Message envoyé à ${phone}` });
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        res.status(500).json({ error: "Impossible d'envoyer le message." });
    }
});

app.get("/", (req, res) => {
    res.send("Bot Telegram avec Express.js est en ligne !");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
});
