import { gql } from '@apollo/client';

export const TELEGRAM_LOGIN = gql`
	mutation TelegramLogin($input: TelegramAuthInput!) {
		telegramLogin(input: $input) {
			_id
			memberNick
			memberFullName
			memberImage
			accessToken
		}
	}
`;
