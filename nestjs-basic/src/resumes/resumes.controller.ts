import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch list resume with paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string // get all  req.query : page, limit
    ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  } 

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch resume by id")
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @Post(':by-user')
  @ResponseMessage("Fetch resumes by user")
  async findAllCVByUser(@User() user: IUser) {
    return await this.resumesService.findAllCVByUser(user);
  }

  @Patch(':id')
  @ResponseMessage("Update status resume by id")
  update(@Param('id') id: string, @Body("status") status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete resume by id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
