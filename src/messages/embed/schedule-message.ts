import { EmbedBuilder } from '@discordjs/builders';

import dayjs from '#/utils/dayjs';

export const generateSuccessScheduleMessageEmbed = (
	message: string,
	userName: string,
    channelName: string,
) =>
	new EmbedBuilder()
		.setColor(0x124adf)
		.setTitle('예약 메세지 등록 완료!')
		.setDescription('성공적으로 예약 메세지가 등록되었습니다.')
		.addFields([
			{ name: '메세지', value: message },
			{ name: '등록한 유저', value: userName },
			{
				name: '등록 일시',
				value: dayjs().format('YYYY.MM.DD HH시 mm분'),
			},
            {
				name: '등록 채널',
				value: channelName,
			},
		]);
