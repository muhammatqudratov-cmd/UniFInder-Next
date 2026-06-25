import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { logIn, signUp, updateStorage, updateUserInfo } from '../../libs/auth';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TelegramLoginButton from '../../components/TelegramLoginButton';
import { TELEGRAM_LOGIN } from '../../apollo/user/mutation';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [telegramLogin] = useMutation(TELEGRAM_LOGIN);

	/** HANDLERS **/
	const handleTelegramAuth = async (telegramUser: any) => {
		try {
			const { data } = await telegramLogin({
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
			});

			const member = data?.telegramLogin;
			if (member?.accessToken) {
				updateStorage({ jwtToken: member.accessToken });
				updateUserInfo(member.accessToken);
				await sweetTopSmallSuccessAlert('Telegram orqali muvaffaqiyatli kirdingiz!');
				await router.push(`${router.query.referrer ?? '/'}`);
			}
		} catch (err) {
			console.error('Telegram login error:', err);
			await sweetErrorHandling(err);
		}
	};
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'login-card'}>
					<Stack className={'card-header'}>
						<strong>{loginView ? 'Welcome back' : 'Create your account'}</strong>
						<span>{loginView ? 'Sign in to continue across UniFinder.' : 'Sign up to get started with UniFinder.'}</span>
					</Stack>

					<Stack className={'view-tabs'}>
						<button
							type={'button'}
							className={`view-tab ${loginView ? 'active' : ''}`}
							onClick={() => viewChangeHandler(true)}
						>
							Login
						</button>
						<button
							type={'button'}
							className={`view-tab ${!loginView ? 'active' : ''}`}
							onClick={() => viewChangeHandler(false)}
						>
							Sign up
						</button>
					</Stack>

					<Box className={'input-wrap'}>
						<div className={'input-box'}>
							<span>Nickname</span>
							<input
								type="text"
								placeholder={'Enter your nickname'}
								onChange={(e) => handleInput('nick', e.target.value)}
								required={true}
								onKeyDown={(event) => {
									if (event.key == 'Enter' && loginView) doLogin();
									if (event.key == 'Enter' && !loginView) doSignUp();
								}}
							/>
						</div>
						<div className={'input-box'}>
							<span>Password</span>
							<input
								type="text"
								placeholder={'Enter password'}
								onChange={(e) => handleInput('password', e.target.value)}
								required={true}
								onKeyDown={(event) => {
									if (event.key == 'Enter' && loginView) doLogin();
									if (event.key == 'Enter' && !loginView) doSignUp();
								}}
							/>
						</div>
						{!loginView && (
							<div className={'input-box'}>
								<span>Phone</span>
								<input
									type="text"
									placeholder={'Enter your phone'}
									onChange={(e) => handleInput('phone', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>
							</div>
						)}
					</Box>
					<Box className={'register'}>
						{!loginView && (
							<div className={'type-option'}>
								<span className={'text'}>I want to be registered as:</span>
								<div>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'USER'}
													onChange={checkUserTypeHandler}
													checked={input?.type == 'USER'}
												/>
											}
											label="User"
										/>
									</FormGroup>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'AGENT'}
													onChange={checkUserTypeHandler}
													checked={input?.type == 'AGENT'}
												/>
											}
											label="Agent"
										/>
									</FormGroup>
								</div>
							</div>
						)}

						{loginView && (
							<div className={'remember-info'}>
								<FormGroup>
									<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
								</FormGroup>
								<a>Forgot password?</a>
							</div>
						)}

						{loginView ? (
							<Button
								variant="contained"
								disabled={input.nick == '' || input.password == ''}
								onClick={doLogin}
							>
								Login
							</Button>
						) : (
							<Button
								variant="contained"
								disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
								onClick={doSignUp}
							>
								Sign up
							</Button>
						)}
						{loginView && (
							<>
								<Stack className={'divider-row'}>
									<span className={'line'} />
									<span className={'divider-text'}>or continue with</span>
									<span className={'line'} />
								</Stack>
								<Stack className={'telegram-row'}>
									<TelegramLoginButton onAuth={handleTelegramAuth} />
								</Stack>
							</>
						)}
					</Box>
					<Box className={'ask-info'}>
						{loginView ? (
							<p>
								Not registered yet?
								<b
									onClick={() => {
										viewChangeHandler(false);
									}}
								>
									Sign up
								</b>
							</p>
						) : (
							<p>
								Have account?
								<b onClick={() => viewChangeHandler(true)}> Login</b>
							</p>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
