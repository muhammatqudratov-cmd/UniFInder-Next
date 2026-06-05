import type { NextApiRequest, NextApiResponse } from 'next';

const TELEGRAM_API = `https://api.telegram.org/bot`;
const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? 'http://localhost:3004/graphql';
const WEBHOOK_URL = 'http://127.0.0.1:80/api/telegram';

interface TelegramMessage {
	message_id: number;
	from: { id: number; first_name: string; username?: string };
	chat: { id: number; type: string };
	text?: string;
}

interface TelegramCallbackQuery {
	id: string;
	from: { id: number; first_name: string };
	message?: { chat: { id: number } };
	data?: string;
}

interface TelegramUpdate {
	update_id: number;
	message?: TelegramMessage;
	callback_query?: TelegramCallbackQuery;
}

async function telegramPost(token: string, method: string, body: object) {
	await fetch(`${TELEGRAM_API}${token}/${method}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
}

async function sendMessage(token: string, chatId: number, text: string, replyMarkup?: object) {
	const payload: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' };
	if (replyMarkup) payload.reply_markup = replyMarkup;
	await telegramPost(token, 'sendMessage', payload);
}

async function answerCallbackQuery(token: string, callbackQueryId: string) {
	await telegramPost(token, 'answerCallbackQuery', { callback_query_id: callbackQueryId });
}

async function queryGraphQL(query: string, variables: object) {
	const res = await fetch(GRAPHQL_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables }),
	});
	return res.json();
}

async function fetchTopUniversities() {
	return queryGraphQL(
		`query GetUniversities($input: UniversitiesInquiry!) {
			getUniversities(input: $input) {
				list {
					_id
					universityName
					universityLocation
					universityTuition
				}
			}
		}`,
		{ input: { page: 1, limit: 5 } },
	);
}

async function searchUniversities(text: string) {
	return queryGraphQL(
		`query GetUniversities($input: UniversitiesInquiry!) {
			getUniversities(input: $input) {
				list {
					_id
					universityName
					universityLocation
					universityTuition
				}
				metaCounter { total }
			}
		}`,
		{ input: { page: 1, limit: 5, search: { text } } },
	);
}

const mainWidget = {
	inline_keyboard: [
		[{ text: '🔍 Search Universities', callback_data: 'search_prompt' }],
		[{ text: '🏆 Top Universities', callback_data: 'top_universities' }],
		[{ text: '🌐 Visit Website', url: 'http://127.0.0.1:80' }],
	],
};

async function handleMessage(token: string, message: TelegramMessage) {
	const chatId = message.chat.id;
	const text = message.text ?? '';

	if (text === '/start') {
		await sendMessage(
			token,
			chatId,
			`Welcome to <b>Uni-Finder</b>, ${message.from.first_name}!\n\nDiscover universities in South Korea.`,
			mainWidget,
		);
		return;
	}

	const result = await searchUniversities(text);
	const list: any[] = result?.data?.getUniversities?.list ?? [];

	if (list.length > 0) {
		const body = list
			.map((u) => `📚 <b>${u.universityName}</b>\n📍 ${u.universityLocation}\n💰 ${u.universityTuition}`)
			.join('\n\n');
		await sendMessage(token, chatId, `Results for "<b>${text}</b>":\n\n${body}`, mainWidget);
	} else {
		await sendMessage(token, chatId, `No results for "<b>${text}</b>". Try another search.`, mainWidget);
	}
}

async function handleCallbackQuery(token: string, query: TelegramCallbackQuery) {
	const chatId = query.message?.chat.id;
	await answerCallbackQuery(token, query.id);
	if (!chatId) return;

	if (query.data === 'search_prompt') {
		await sendMessage(token, chatId, 'Send me a university name or city to search:');
	} else if (query.data === 'top_universities') {
		const result = await fetchTopUniversities();
		const list: any[] = result?.data?.getUniversities?.list ?? [];

		if (list.length > 0) {
			const body = list.map((u, i) => `${i + 1}. <b>${u.universityName}</b> — ${u.universityLocation}`).join('\n');
			await sendMessage(token, chatId, `🏆 <b>Top Universities</b>:\n\n${body}`, mainWidget);
		} else {
			await sendMessage(token, chatId, 'No universities available right now.', mainWidget);
		}
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	if (!token) return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN is not set' });

	// GET /api/telegram — registers the webhook with Telegram
	if (req.method === 'GET') {
		const response = await fetch(`${TELEGRAM_API}${token}/setWebhook`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: WEBHOOK_URL }),
		});
		const data = await response.json();
		return res.status(200).json(data);
	}

	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

	const update: TelegramUpdate = req.body;

	try {
		if (update.message) await handleMessage(token, update.message);
		else if (update.callback_query) await handleCallbackQuery(token, update.callback_query);
	} catch (err) {
		console.error('Telegram webhook error:', err);
	}

	// Always return 200 so Telegram does not retry the update
	return res.status(200).json({ ok: true });
}
