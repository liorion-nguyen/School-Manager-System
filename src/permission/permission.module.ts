import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './entities/permission.entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Permission',
        schema: PermissionSchema,
      },
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],

})
export class PermissionModule {}