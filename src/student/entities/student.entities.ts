import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface IScore {
  subjectId: string;
  score: number;
}

@Schema({
    timestamps: true,
})
export class Student extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    contactParents: string;

    @Prop({ required: true })
    listScores: IScore[];


}

export const StudentSchema = SchemaFactory.createForClass(Student);
