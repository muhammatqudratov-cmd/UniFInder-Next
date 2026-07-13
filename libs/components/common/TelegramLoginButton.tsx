import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { initializeApollo } from '../../../apollo/client';
import { TELEGRAM_LOGIN } from '../../../apollo/user/telegramMutation';
import { updateStorage, updateUserInfo } from '../../auth';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

const TelegramLoginButton = () => {
	const router = useRouter();
	const widgetRef = useRef<HTMLDivElement>(null);

	const handleTelegramAuth = useCallback(
		async (telegramUser: TelegramUser) => {
			try {
				const apolloClient = initializeApollo();
				const result = await apolloClient.mutate({
					mutation: TELEGRAM_LOGIN,
					variables: {
						input: {
							id: telegramUser.id,
							first_name: telegramUser.first_name,
							last_name: telegramUser.last_name ?? null,
							username: telegramUser.username ?? null,
							photo_url: telegramUser.photo_url ?? null,
							auth_date: telegramUser.auth_date,
							hash: telegramUser.hash,
						},
					},
					fetchPolicy: 'network-only',
				});

				const { accessToken } = result?.data?.telegramLogin;
				if (accessToken) {
					updateStorage({ jwtToken: accessToken });
					updateUserInfo(accessToken);
					window.location.href = String(router.query.referrer ?? '/');
				}
			} catch (err: any) {
				await sweetMixinErrorAlert(err?.message ?? 'Telegram login failed');
			}
		},
		[router],
	);

	// Fallback: postMessage from oauth.telegram.org popup
	useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== 'https://oauth.telegram.org') return;
			try {
				const data: TelegramUser = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
				if (data?.id && data?.hash) handleTelegramAuth(data);
			} catch {}
		};

		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [handleTelegramAuth]);

	// Primary: Telegram Login Widget
	useEffect(() => {
		(window as any).onTelegramAuth = (user: TelegramUser) => {
			handleTelegramAuth(user);
		};

		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-widget.js?22';
		script.setAttribute('data-telegram-login', 'UniFinder02_bot');
		script.setAttribute('data-size', 'large');
		script.setAttribute('data-onauth', 'onTelegramAuth');
		script.setAttribute('data-request-access', 'write');
		script.async = true;

		if (widgetRef.current) {
			widgetRef.current.appendChild(script);
		}

		return () => {
			script.remove();
			delete (window as any).onTelegramAuth;
		};
	}, [handleTelegramAuth]);

	const openAuthPopup = useCallback(() => {
		const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
		if (!botId) {
			sweetMixinErrorAlert('Telegram bot ID is not configured');
			return;
		}

		const origin = encodeURIComponent(window.location.origin);
		const url = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&request_access=write`;

		window.open(url, 'telegram_auth', 'width=550,height=450,resizable=yes');
	}, []);

	return (
		<div id="telegram-login-container" className={'telegram-login-container'}>
			<button type="button" onClick={openAuthPopup} className={'telegram-auth-btn'}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="20" height="20" aria-hidden="true">
					<defs>
						<linearGradient id="tg-grad-a" x1=".667" x2=".417" y1=".167" y2=".75">
							<stop offset="0" stopColor="#37aee2" />
							<stop offset="1" stopColor="#1e96c8" />
						</linearGradient>
						<linearGradient id="tg-grad-b" x1=".66" x2=".851" y1=".437" y2=".418">
							<stop offset="0" stopColor="#efe6d5" />
							<stop offset="1" stopColor="#f3c681" />
						</linearGradient>
					</defs>
					<circle cx="120" cy="120" r="120" fill="url(#tg-grad-a)" />
					<path fill="#c8daea" d="M98 175c-3.888 0-3.227-1.468-4.568-5.17L82 132.207 170 80" />
					<path fill="#a9c9dd" d="M98 175c3 0 4.325-1.372 6-3l16-15.558-19.958-12.035" />
					<path
						fill="url(#tg-grad-b)"
						d="M100.04 144.41l48.36 35.729c5.519 3.045 9.501 1.468 10.876-5.123l19.685-92.763c2.015-8.08-3.08-11.746-8.36-9.349l-115.59 44.571c-7.89 3.165-7.843 7.567-1.438 9.528l29.663 9.259 68.673-43.325c3.242-1.966 6.218-.91 3.776 1.258"
					/>
				</svg>
				Continue with Telegram
			</button>
			<div ref={widgetRef} />
		</div>
	);
};

export default TelegramLoginButton;
