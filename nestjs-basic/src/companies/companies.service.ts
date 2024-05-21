import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';


@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private companyModel: SoftDeleteModel<CompanyDocument>) {}
    
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create(
      { 
        ... createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.companyModel.find(filter)
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
      throw new BadRequestException(`Not found company with id = ${id}`)
    }
    else{
      return await this.companyModel.findOne({_id: id})
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found company with id = ${id}`)
    }
    else{
      return await this.companyModel.updateOne(
        { _id: id }, 
        { ...updateCompanyDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          } 
        }
      )
    }
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(  // return => use isDelete,... and use update or use as follows
      { _id: id }, 
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        } 
        // ,
        // isDeleted: true,
        // deleteAt: new Date()
      }
    )
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found company with id = ${id}`)
    }
    else{
      return this.companyModel.softDelete({ _id :id });
    }
  }
}
