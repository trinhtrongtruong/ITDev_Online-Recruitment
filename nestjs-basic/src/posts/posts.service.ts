import { BadRequestException, Injectable, } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, Post } from './schemas/post.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private postModel: SoftDeleteModel<PostDocument>) {}

  async create(createPostDto: CreatePostDto, user: IUser) {
    return await this.postModel.create(
      {
        ...createPostDto,
        createBy: {
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
    const totalItems = (await this.postModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.postModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentPage, 
      pageSize: limit,
      pages: totalPages,
      total: totalItems
      },
      result //kết quả query
      }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`not found post with id = ${id}`)
    }
    else{
      return await this.postModel.findOne({_id: id})
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`not found post with id = ${id}`)
    }
    else{
      return await this.postModel.updateOne(
        { _id: id }, 
        { ...updatePostDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          } 
        }
      )
    }
  }

  async remove(id: string, user: IUser) {
    await this.postModel.updateOne( 
      { _id: id }, 
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        } 
      }
    )
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`not found post with id = ${id}`)
    }
    else{
      return this.postModel.softDelete({ _id :id });
    }
  }
}
