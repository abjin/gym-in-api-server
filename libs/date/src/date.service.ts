import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DateService {
  constructor() {}

  static getDateString({
    timeZone = 'Asia/Seoul',
    format = 'YYYY-MM-DD',
  } = {}): string {
    return dayjs().tz(timeZone).format(format);
  }

  static getStartOfDayUTC(timeZone: string = 'Asia/Seoul'): Date {
    return dayjs().tz(timeZone).startOf('day').utc().toDate();
  }
}
