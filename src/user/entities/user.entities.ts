import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum UserRole {
    STUDENT = 'Student',
    TEACHER = 'Teacher',
    ADMIN = 'Admin',
}

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, enum: UserRole })
    role: UserRole;

    @Prop({ default: "" })   
    email: string;

    @Prop({ default: "" })   
    phoneNumber: string;

    @Prop()
    dateOfBirth: Date;

    @Prop({ enum: Gender })
    gender: Gender;

    @Prop({ default: "" })   
    address: string;

    @Prop({ default: "" })   
    profileImage: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: null }) 
    lastLogin: Date;

    @Prop({ default: "" })  
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
