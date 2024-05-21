import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private resumeModel: SoftDeleteModel<ResumeDocument>) {}

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;
      let newCV =  await this.resumeModel.create({
        url, companyId, email, jobId,
        userId: _id,
        status: 'PENDING',  
        createdBy:{
          _id: user._id,
          email: user.email
        },
        history: [
          {
            status: 'PENDING',
            updateAt: new Date,
            UpdateBy: {
              _id: user._id,
              email: user.email
            }
          }
        ]
      });
      return {
        _id: newCV._id,
        createAt: newCV.createdAt
      };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel.find(filter)
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
      throw new BadRequestException(`Not found resume with id = ${id}`)
    }
    else{
      return await this.resumeModel.findOne({_id: id})
    }
  }

  async findAllCVByUser(user: IUser) {
    return  await this.resumeModel.find({ 
      userId: user._id 
    })
    .sort("-createdAt")
    .populate([
      {
        path: "companyId",
        select: { name: 1 }
      },
      {
        path: "jobId",
        select: { name: 1 }
      }
    ])
  }

  async update(id: string, status: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found resume with id = ${id}`)
    }
    else{
      return await this.resumeModel.updateOne(
        { _id: id},
        {
          status: status,
          updatedBy: {
            _id: user._id,
            email: user.email
          },
          $push: {
            history: {
              status: status,
              updatedAt: new Date,
              updatedBy: {
                _id: user._id,
                email: user.email
              }
            }
          }
        }
      );
    }
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id }, 
      { 
        deletedBy : {
          _id: user._id,
          email: user.email
        }
      }
    )
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found resume with id = ${id}`)
    }
    else{
      return this.resumeModel.softDelete({ _id: id });
    }
  }
}
