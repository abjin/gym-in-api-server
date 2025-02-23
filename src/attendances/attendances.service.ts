import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';

@Injectable()
export class AttendancesService {
  constructor(private readonly prismaService: PrismaService) {}
}
