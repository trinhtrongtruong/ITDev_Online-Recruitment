import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto, 
    @User() user: IUser
  ) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch list Posts with paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string // get all  req.query : page, limit
  ) {
    
    return this.postsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch Post by Id")
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Put Post by Id")
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto,
    @User() user: IUser
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete Post by Id")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.postsService.remove(id, user);
  }
}
