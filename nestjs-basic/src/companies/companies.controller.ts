import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage("Create a company")
  create(
    @Body() createCompanyDto: CreateCompanyDto, 
    @User() user: IUser 
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch list company with paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string // get all  req.query : page, limit
    ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  } 

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch company by id")
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update company by id")
  update( 
    @Param('id') id: string, 
    @Body() updateCompanyDto: UpdateCompanyDto, 
    @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete company by id")
  remove(
    @Param('id') id: string, 
    @User() user: IUser
    ) {
    return this.companiesService.remove(id, user);
  }
}
