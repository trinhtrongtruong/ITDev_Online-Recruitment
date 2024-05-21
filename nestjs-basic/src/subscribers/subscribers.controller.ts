import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage("Create a subscriber")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Post("skills")
  @SkipCheckPermission()
  @ResponseMessage("Get subscriber's skills")
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user)
  }

  @Get()
  @ResponseMessage("Fetch list subscribers with paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string // get all  req.query : page, limit
    ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ResponseMessage("Fetch subscriber by id")
    findOne(@Param('id') id: string) {
      return  this.subscribersService.findOne(id);
    }
  
    @Patch()
    @SkipCheckPermission()
    @ResponseMessage("Update subscriber by id")
    update(
      @Body() updateSubscriberDto: UpdateSubscriberDto,
      @User() user: IUser) {
      return this.subscribersService.update( updateSubscriberDto, user );
    }
  
    @Delete(':id')
    @ResponseMessage("Delete subscriber by id")
    remove(
      @Param('id') id: string, 
      @User() user: IUser
      ) {
      return this.subscribersService.remove(id, user);
    }
}
