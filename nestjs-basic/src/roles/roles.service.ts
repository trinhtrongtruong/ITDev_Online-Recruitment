import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private roleModel: SoftDeleteModel<RoleDocument>,
    ) {}
    
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const nameCheck = await this.roleModel.findOne({ name });
    if(nameCheck){
      throw new BadRequestException(`Tên: ${name} đã tồn tại`)
    }
    const createRole = await this.roleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: createRole._id,
      createAt: createRole.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .select(projection as any)
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
      throw new BadRequestException(`Not found role with id = ${id}`)
    }
    else{
      return (await this.roleModel.findOne({ _id: id })).populate({ 
        path: "permissions", 
        select: { _id: 1, apiPath: 1, method: 1, module: 1 }  // 1 is choose >< -1
      });
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = updateRoleDto;
    // const nameCheck = await this.roleModel.findOne({ name });
    // if(nameCheck){
      //   throw new BadRequestException(`Tên: ${name} đã tồn tại`)
      // }
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found role with id = ${id}`)
    }
    else{
      return await this.roleModel.updateOne(
        { _id: id },
        {
          name, description, isActive, permissions,
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
      throw new BadRequestException(`Not found company with id = ${id}`)
    }
    const foundRole = await this.roleModel.findById({ _id: id })
    if(foundRole.name === ADMIN_ROLE){
      throw new BadRequestException(`Không thể xóa role ADMIN: ${foundRole.name}`);
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        updateBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.roleModel.softDelete({ _id: id });
  }
}
