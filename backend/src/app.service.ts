import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class AppService implements OnModuleDestroy {
  private pool?: Pool;

  constructor(private readonly configService: ConfigService) {}

  private getPool(): Pool | undefined {
    if (this.pool) return this.pool;
    const connectionString = this.configService.get<string>('DATABASE_URL');
    if (!connectionString) return undefined;
    this.pool = new Pool({ connectionString });
    return this.pool;
  }

  async getHealth() {
    const db = await this.checkDb();
    return { status: 'ok', db };
  }

  private async checkDb(): Promise<string> {
    const pool = this.getPool();
    if (!pool) return 'missing DATABASE_URL';
    try {
      await pool.query('SELECT 1');
      return 'ok';
    } catch (error) {
      return 'error';
    }
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
