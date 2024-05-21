import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({ message: 'Email không đúng định dạng email '})
  @IsNotEmpty({ message: 'API Path không được để trống' })
  email: string;

  @IsArray({ message: 'skills phải có định dạng array' })
  @IsNotEmpty({ message: 'skills không được để trống' })
  @IsString({ each: true, message: 'skill có định dạng là string'})//each : validation on each item of the array
  skills: string[];

}
