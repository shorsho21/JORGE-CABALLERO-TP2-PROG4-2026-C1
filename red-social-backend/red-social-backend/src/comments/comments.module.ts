import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    // Registramos el schema de Comment para que Mongoose sepa que existe
    // y pueda inyectarlo con @InjectModel(Comment.name) en el servicio
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController], // expone los endpoints HTTP
  providers: [CommentsService],      // registra el servicio para que pueda inyectarse
})
export class CommentsModule {}