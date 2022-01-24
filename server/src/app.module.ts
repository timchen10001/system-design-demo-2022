import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ErrorModule } from './error/error.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'env/app.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('TYPEORM_HOST') || 'localhost',
        port: 5432,
        logging: true,
        username: config.get('TYPEORM_USERNAME'),
        password: config.get('TYPEORM_PASSWORD'),
        database: config.get('TYPEORM_DATABASE') || 'demo01',
        entities: [config.get('TYPEORM_ENTITIES')],
        autoLoadEntities: true,
        synchronize:
          config.get('TYPEORM_SYNCHRONIZE', false) === 'yes' || false,
        migrations: [config.get('TYPEORM_MIGRATIONS')],
        cli: { migrationsDir: config.get('TYPEORM_MIGRATIONS_DIR') },
      }),
    }),
    GraphQLModule.forRoot({
      plugins: [],
      playground: true,
      autoSchemaFile: 'schema/app.gql',
      debug: true,
      formatError: (error: GraphQLError): GraphQLFormattedError => ({
        message:
          error.extensions?.exception?.response?.message || error.message,
        extensions: {
          code: error.extensions?.exception?.status || 500,
        },
      }),
    }),
    AuthModule,
    UserModule,
    FileModule,
    ErrorModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
