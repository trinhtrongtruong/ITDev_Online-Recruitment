import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>; // Tham chiếu DB => create document

@Schema({timestamps: true})
export class Post {
  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop()
  content: string;

  @Prop()
  image: string;

  // @Prop()
  // isActive: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAT: Date;

  @Prop()
  isDeleted: Date;

  @Prop()
  deletedAT: Date;
  
}

export const PostSchema = SchemaFactory.createForClass(Post);