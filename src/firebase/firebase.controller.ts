import { Body, Controller, Delete, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('firebase')
export class FirebaseController {

    constructor(private readonly filebaseService: FirebaseService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.filebaseService.UploadImage(file);
    }

    @Delete('delete')
    async deleteImage(@Body() imageUrl: any) {
        await this.filebaseService.DeleteImage(imageUrl.imageUrl);
        return {
            status: 200,
            description: 'Image deleted successfully'
        };
    }
}