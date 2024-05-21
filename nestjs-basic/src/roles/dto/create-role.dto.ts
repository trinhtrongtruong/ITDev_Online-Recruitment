import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống', })
  name: string;

  @IsNotEmpty({ message: 'Description không được để trống', })
  description : string;

  @IsBoolean({ message: 'Active phải có giá trị kiểu Boolean',})
  @IsNotEmpty({ message: 'Active không được để trống', })
  isActive: boolean;

  @IsNotEmpty({ message: 'Permission không được để trống', })
  @IsMongoId({ each: true, message: "Each permission is a MongoId" })
  @IsArray({ message: ' Permission phải có định dạng là array',})
  permissions: mongoose.Schema.Types.ObjectId[];

}
