import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class VerificationCode {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);
