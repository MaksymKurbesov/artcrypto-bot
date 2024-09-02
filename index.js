import { Telegraf } from "telegraf";
import { generatePage, generateTaskButtons, updatePage } from "./helpers.js";

const startCaption = `<b>CRYPTO APATE BOT -> Главное меню</b>\n\nТы: <b>#SWK58XOH</b>\nМесто в топе: <b>Нет</b>\nВыведено: <b>0$</b>\n\n <a href="https://t.me/+h9EN6YjY--05YjEy">💬 <b>Чат</b></a>`;
const startInlineKeyboard = [
  [{ text: "₿ Получить BTC ", callback_data: "1" }],
  [
    { text: "💳 Мои кошельки", callback_data: "2" },
    { text: "💸 Выводы", callback_data: "3" },
  ],
  [
    { text: "📝 Задачи", callback_data: "tasks" },
    { text: "👥 Пригласить друзей", callback_data: "4" },
  ],
  [
    { text: "🌍 Язык", callback_data: "5" },
    { text: "🆘 Support", callback_data: "6" },
  ],
];

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота
const bot = new Telegraf("7427158827:AAHweRtzXbYUW0K_iwFPSNNMXCzMBlxmMiE");

bot.action(/page_(\d+)/, (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  ctx.answerCbQuery();
  ctx.editMessageReplyMarkup(generateTaskButtons(page).reply_markup);
});

bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData === "1") {
    // Обновляем подпись и клавиатуру
    await updatePage(ctx, "Новая подпись", [
      [{ text: "Ещё раз изменить", callback_data: "update_caption" }],
    ]);
  }

  if (callbackData === "tasks") {
    ctx.reply("Ваши задачи:", generateTaskButtons());
  }

  // Завершаем callback query, чтобы кнопка перестала отображаться как загруженная
  await ctx.answerCbQuery();
});

// Обработка команды /start
bot.start((ctx) => {
  generatePage(ctx, startCaption, startInlineKeyboard);
});

// Запуск бота
bot.launch();

// Обработка SIGINT и SIGTERM для корректного завершения работы
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
