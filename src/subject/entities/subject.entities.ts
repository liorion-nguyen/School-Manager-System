import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Class {
    teacherId: string,
    classId: string,
}

@Schema({
    timestamps: true,
})
export class Subject extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    countTime: string;

    @Prop({ required: true })
    course: string;

    @Prop({ required: true })
    classes: Class[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
