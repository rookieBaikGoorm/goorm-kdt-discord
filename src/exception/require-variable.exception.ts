import { InternalServerErrorException } from '@nestjs/common';

export class RequireVariableException extends InternalServerErrorException {
	constructor(public requiredVariables: string) {
		super(
			`앱을 구동하기 위해 필요한 ${requiredVariables} 변수의 값이 누락되었습니다.`,
		);
	}
}
