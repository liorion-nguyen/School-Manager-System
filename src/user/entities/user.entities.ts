import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum UserRole {
    PATIENT = 'Parient',
    DOCTOR = 'Doctor',
    RECEPTION = 'Receptionist',
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
    cccdNumber: string;

    @Prop({ default: "" })   
    profileImage: string;

    @Prop({ default: "" })   
    emergencyContact: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: null }) 
    lastLogin: Date;

    @Prop({ default: "" })   
    insuranceNumber: string;

    @Prop({ default: "" })  
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
