import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private subscriberModel: SoftDeleteModel<SubscriberDocument>) {}

    async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
      const { email, name, skills} = createSubscriberDto;
      const isExist = await this.subscriberModel.findOne({ email });
      if(isExist){
        throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác`) 
      }
      let newSub =  await this.subscriberModel.create({
        email, name, skills,
        createdBy:{
          _id: user._id,
          email: user.email
        }
      });
      return {
        _id: newSub._id,
        createAt: newSub.createdAt
      };
    }


    async findAll(currentPage: number, limit: number, qs: string) {
      const { filter, sort, population } = aqp(qs);
      delete filter.current;
      delete filter.pageSize;
      let offset = (+currentPage - 1) * (+limit);
      let defaultLimit = +limit ? +limit : 10;
      const totalItems = (await this.subscriberModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
      const result = await this.subscriberModel.find(filter)
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
        throw new BadRequestException(`Not found subscriber with id = ${id}`)
      }
      else{
        return await this.subscriberModel.findOne({_id: id})
      }
    }
  
    async update( updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
      return await this.subscriberModel.updateOne(
        { email: user.email }, 
        { ...updateSubscriberDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          } 
        },
        { upsert: true }
      );
    }
  
    async remove(id: string, user: IUser) {
      await this.subscriberModel.updateOne(  // return => use isDelete,... and use update or use as follows
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
        throw new BadRequestException(`Not found subscriber with id = ${id}`)
      }
      else{
        return this.subscriberModel.softDelete({ _id :id });
      }
    }

    async getSkills(user: IUser) {
      const { email } = user;
      return await this.subscriberModel.findOne({ email }, { skills: 1 })
    }
}
