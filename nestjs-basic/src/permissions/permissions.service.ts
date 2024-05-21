import { PermissionsModule } from './permissions.module';
import { Permission, PermissionDocument, PermissionSchema } from './schemas/permission.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private permissionModel: SoftDeleteModel<PermissionDocument>) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const checkExist = await this.permissionModel.findOne({ apiPath, method });
    if(checkExist){
      throw new BadRequestException(`Permission với API Path: ${apiPath} và method: ${method} đã tồn tại`)
    }
    const newPermission =  await this.permissionModel.create({
      name, apiPath, method, module,
      createBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: newPermission._id,
      createAt: newPermission.createdAt
    };
  }

    async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentPage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found permission with id = ${id}`)
    }
    else{
      return await this.permissionModel.findOne({ _id: id }) ;
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found permission with id = ${id}`)
    }
    else{
      return await this.permissionModel.updateOne(
        { _id: id },
        {
          ...updatePermissionDto,
          updateBy: {
            _id: user._id,
            email: user.email
          }
        }
      );
    }
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found permission with id = ${id}`)
    }
    else{
      await this.permissionModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        }
      );
    }
    return this.permissionModel.softDelete({ _id: id })
  }
}
