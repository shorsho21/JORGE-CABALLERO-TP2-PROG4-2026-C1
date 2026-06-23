import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    //hace que las variable de entorno del .env esten disponibles en la app
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //conecta a la base de datos de mongo usando la variable de entorno mongo_url
    MongooseModule.forRoot(process.env.MONGO_URL!),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
