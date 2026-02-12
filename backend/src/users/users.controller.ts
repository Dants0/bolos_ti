import { Controller, Get, Post, Patch, Put, Body, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
        console.log('DEBUG: UsersController initialized');
    }

    @Get('hello')
    hello() {
        return { message: 'hello from users' };
    }

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
        @Body() body: { name: string },
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

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Body() body: { passKey: string }
    ) {
        if (body.passKey !== '5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220') {
            throw new UnauthorizedException({
                code: 400,
                message: 'Senha incorreta'
            });
        }
        return this.usersService.delete(+id);
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads'),
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `photo-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFile() photo?: any,
    ) {
        console.log('Update User Request Body:', body);
        console.log('Update User Request Info:', { id, photo: photo?.filename });

        const passKey = body?.passKey;
        if (passKey !== '5bb2992b4e4744b6b34cb62ab02ee2203bb2992b4e4744b6b34cb62ab02ee220') {
            console.log('Auth Failed: Received', passKey);
            throw new UnauthorizedException({
                code: 400,
                message: 'Senha incorreta'
            });
        }
        const photoPath = photo ? `uploads/${photo.filename}` : undefined;
        return this.usersService.update(+id, body.name, photoPath);
    }
}