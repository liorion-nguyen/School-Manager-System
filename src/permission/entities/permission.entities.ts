import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum Method {
    READ = 'Read',
    UPDATE = 'Update',
    DELETE = 'Delete',
    CREATE = 'Create',
}

@Schema()
export class Role {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    method: Method[]; 
}

@Schema({
    timestamps: true,
})
export class Permission extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [Role], required: true })
    role: Role[];

    @Prop({ required: true })
    description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export const PermissionSchema = SchemaFactory.createForClass(Permission);
