import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads'), // Caminho correto para a pasta uploads
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `photo-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async create(
        @Body() body: { name: string},
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
            }),
        )
        photo?: Express.Multer.File,
    ) {
        // Salvar apenas o caminho relativo
        const photoPath = photo ? `uploads/${photo.filename}` : undefined;
        return this.usersService.create(body.name, photoPath);
    }
}