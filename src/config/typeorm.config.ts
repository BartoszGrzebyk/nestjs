import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { InitialSchema1691431579595 } from '../migrations/1691431579595-initial-schema';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (process.env.NODE_ENV === 'production') {
      return {
        type: 'postgres',
        synchronize: false,
        url: process.env.DATABASE_URL,
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [InitialSchema1691431579595],
        ssl: {
          rejectUnauthorized: false,
        },
      };
    } else {
      return {
        type: 'sqlite',
        synchronize: false,
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: process.env.NODE_ENV === 'test',
        migrations: [InitialSchema1691431579595],
      };
    }
  }
}
