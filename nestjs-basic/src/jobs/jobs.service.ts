import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import dayjs from 'dayjs'
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private jobModel: SoftDeleteModel<JobDocument>) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const { name, skills, company, location, salary, quantity, level, description, startDate, endDate, isActive } = createJobDto;
    if(dayjs(endDate).diff(startDate, 'millisecond') > 0){ // import dayjs to check date
      // console.log(dayjs(endDate).diff(startDate, 'millisecond'))
      let newJob =  await this.jobModel.create({
        name, skills, company, location, salary, quantity, level, description, startDate, endDate, isActive, 
        createdBy:{
          _id: user._id,
          email: user.email
        }
      });
      return {
        _id: newJob._id,
        createAt: newJob.createdAt
      };
    }
    else{
      return `The start date must be greater than the end date`;
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel.find(filter)
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
      throw new BadRequestException(`Not found job with id = ${id}`)
    }
    else{
      return await this.jobModel.findOne({_id: id})
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found job with id = ${id}`)
    }
    else{
      return await this.jobModel.updateOne(
        { _id: id }, 
        { ...updateJobDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          } 
        });
    }
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne(  // return => use isDelete,... and use update or use as follows
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
      throw new BadRequestException(`Not found job with id = ${id}`)
    }
    else{
      return this.jobModel.softDelete({ _id :id });
    }
  }
}
