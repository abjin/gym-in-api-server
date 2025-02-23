import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const defaultTimeZone = 'Asia/Seoul';

@Injectable()
export class DateService {
  constructor() {}

  static getDateString({
    timeZone = defaultTimeZone,
    format = 'YYYY-MM-DD',
  } = {}): string {
    return dayjs().tz(timeZone).format(format);
  }

  static getStartOfDay(date?: Date, timeZone: string = defaultTimeZone): Date {
    return dayjs(date).tz(timeZone).startOf('day').utc().toDate();
  }

  static getStartOfMonthString(
    date: Date | string = new Date(),
    timeZone: string = defaultTimeZone,
    format = 'YYYY-MM-DD',
  ): string {
    return dayjs(date).tz(timeZone).startOf('month').format(format);
  }

  static getEndOfMonthString(
    date: Date | string = new Date(),
    timeZone: string = defaultTimeZone,
    format = 'YYYY-MM-DD',
  ): string {
    return dayjs(date).tz(timeZone).endOf('month').format(format);
  }
}
