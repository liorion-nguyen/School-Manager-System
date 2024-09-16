import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Teacher extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    subjectId: string;

    @Prop({ required: true })
    homeroomId: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
