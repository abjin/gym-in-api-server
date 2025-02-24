import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

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

  static getStartOfWeekString(
    date: Date | string = new Date(),
    timeZone: string = defaultTimeZone,
    format = 'YYYY-MM-DD',
  ): string {
    return dayjs(date).tz(timeZone).startOf('isoWeek').format(format);
  }

  static getEndOfWeekString(
    date: Date | string = new Date(),
    timeZone: string = defaultTimeZone,
    format = 'YYYY-MM-DD',
  ): string {
    return dayjs(date).tz(timeZone).endOf('isoWeek').format(format);
  }
}
