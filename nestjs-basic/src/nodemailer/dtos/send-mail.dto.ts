import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  to: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'subject',
    type: String,
    required: true,
  })
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'template',
    type: String,
    required: true,
  })
  template: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    name: 'context',
    type: String,
    required: true,
  })
  context: any;
}
