import {
    Body,
    Controller,
    Get, HttpException, HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {PhotoService} from "./photo.service";
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from  'multer';
import { extname } from  'path';
import {CreatePhotoDto} from "./dto/create-photo.dto";
import {AuthGuard} from "@nestjs/passport";

@Controller('photos')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('photo',
        {
            storage: diskStorage({
                destination: './photos',
                filename: (req, file, cb) => {
                    return cb(null, `${uuid()}${extname(file.originalname)}`)
                }
            })
        }
    ))
    create(@Req() req, @Body() createPhotoDto: CreatePhotoDto, @UploadedFile() photo) {
        return this.photoService.create(req.user, createPhotoDto, photo)
    }

    @Get(':fileName')
    async findOne(@Param('fileName') fileName: string) {
        return this.photoService.findOne(fileName);
    }

    @Get(':fileName/file')
    async findFile(@Param('fileName') fileName, @Res() res) {
        try {
            return res.sendFile(fileName, { root: 'photos'});
        } catch {
            throw new HttpException('فایلی یافت نشد!', HttpStatus.NOT_FOUND);
        }
    }
}
