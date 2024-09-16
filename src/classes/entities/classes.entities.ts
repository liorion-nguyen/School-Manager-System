import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Classes extends Document {
    @Prop({ required: true })
    className: string;

    @Prop({ required: true })
    room: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    studentsId: string[];

    @Prop({ required: true })
    teacherId: string;
}

export const ClassesSchema = SchemaFactory.createForClass(Classes);
