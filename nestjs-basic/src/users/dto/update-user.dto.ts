import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
//Data Tranfer Object (DTO) // class{}

class Company {
    _id: mongoose.Schema.Types.ObjectId;

    name: string;
  }
export class UpdateUserDto {
    @IsNotEmpty({ message: 'ID không được để trống' })
    _id: string 

    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number;

    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;

    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;
    
    // @IsNotEmpty({ message: 'Role không được để trống' })
    // @IsMongoId({ message: 'Role có định dạng MongoId '})
    role: mongoose.Schema.Types.ObjectId;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
