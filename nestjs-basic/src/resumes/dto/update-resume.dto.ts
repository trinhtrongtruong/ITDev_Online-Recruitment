import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsEmail()
    @IsNotEmpty()
    email: string;      
}

class History {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    updateAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updateBy: UpdatedBy
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    // @IsNotEmpty({ message: 'History không được để trống'})
    // @IsArray({ message: 'History phải là dạng Array'})
    // @ValidateNested()
    // @Type(() => History)
    // histoty: History[];
}