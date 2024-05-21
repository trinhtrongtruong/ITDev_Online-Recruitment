import { Company } from './../../companies/schemas/company.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubscriberDocument = HydratedDocument<Subscriber>; // Tham chiếu DB => create document

@Schema({timestamps: true})
export class Subscriber {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];


  @Prop()
  createdAt: Date;
  
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  updatedAT: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  isDeleted: boolean;
  
  @Prop()
  deletedAT: Date;
  
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);