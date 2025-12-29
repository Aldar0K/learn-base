import { Injectable } from "@nestjs/common";
import { PrismaService } from "./common/prisma";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", db: "ok" };
    } catch (error) {
      return { status: "ok", db: "error" };
    }
  }
}
