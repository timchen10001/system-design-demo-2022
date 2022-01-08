import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const DEFAULT_RANDOM_ID_DIGITS = 9;

@Injectable()
export class UserUtil {
  getRandomId(digits = DEFAULT_RANDOM_ID_DIGITS) {
    const randomId = customAlphabet('0123456789', digits);

    return randomId().match(new RegExp('.{1,3}', 'g')).join('-');
  }
}
