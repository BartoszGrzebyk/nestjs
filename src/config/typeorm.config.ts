import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { InitialSchema1691431579595 } from '../migrations/1691431579595-initial-schema';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const cl = require('../migrations/1691431579595-initial-schema');
    return {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: process.env.NODE_ENV === 'test',
      keepConnectionAlive: process.env.NODE_ENV === 'test',
      migrations: [InitialSchema1691431579595],
      //   dropSchema: true,
    };
  }
}
