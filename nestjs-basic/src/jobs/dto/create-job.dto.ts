import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
  }
export class CreateJobDto {
    
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsArray({ message: 'skills phải có định dạng array' })
    @IsNotEmpty({ message: 'skills không được để trống' })
    @IsString({ each: true, message: 'skill có định dạng là string'})//each : validation on each item of the array
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
    
    @IsNotEmpty({ message: 'location không được để trống' })
    location: string;

    @IsNotEmpty({ message: 'salary không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'quantity không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'level không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;
    
    @IsNotEmpty({ message: 'description không được để trống' })
    @Transform(({ value }) => new Date(value)) // convert data string => date
    @IsDate({ message: 'startDate có định dạng là Date '})
    startDate: Date;

    @IsNotEmpty({ message: 'description không được để trống' })
    @Transform(({ value }) => new Date(value)) // convert data string => date
    @IsDate({ message: 'endDate có định dạng là Date '})
    endDate: Date;
    
    @IsNotEmpty({ message: 'Active không được để trống' })
    @IsBoolean({ message: "isActive phải có định dạng Boolean"})
    isActive: boolean;


}
