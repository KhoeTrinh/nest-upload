import {
  Body,
  Controller,
  FileTypeValidator,
  HttpException,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file
  }
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileAndPassValidation(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1000 })
        .addFileTypeValidator({ fileType: 'jpeg' })
        .build({
          errorHttpStatusCode: 400,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      file: file,
    };

  }
  @Post('files')
  @UseInterceptors(FileInterceptor('files'))
  uploadFiles(@UploadedFile() files: Array<Express.Multer.File>) {
  console.log(files);
  return files
  }
}

export abstract class FileValidator<TVO = Record<string, any>> {
  constructor(protected readonly validationOptions: TVO) {}
  abstract isValid(file?: any): boolean | Promise<boolean>;
  abstract buildErrorMessage(file: any): string;
}
