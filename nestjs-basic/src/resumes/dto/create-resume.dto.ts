import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose, { ObjectId } from "mongoose";


export class CreateResumeDto {
  @IsEmail({ message: 'Email phải đúng định dạng. Eg: abc@gmail.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'UserId không được để trống' })
  @IsMongoId({ message: 'UserId phải là 1 mongo id' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'Status không được để trống' })
  status: string;

  @IsNotEmpty({ message: 'CompanyId không được để trống' })
  @IsMongoId({ message: 'CompanyId phải là 1 mongo id' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId không được để trống' })
  @IsMongoId({ message: 'JobId phải là 1 mongo id' })
  jobId: mongoose.Schema.Types.ObjectId;

}

export class CreateUserCvDto { // upload CV
  @IsNotEmpty({ message: 'URL không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'CompanyId không được để trống' })
  @IsMongoId({ message: 'CompanyId phải là 1 mongo id' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'JobId không được để trống' })
  @IsMongoId({ message: 'JobId phải là 1 mongo id' })
  jobId: mongoose.Schema.Types.ObjectId;

}
