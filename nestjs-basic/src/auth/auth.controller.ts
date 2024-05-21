import { RegisterUserDto, UserLoginDto } from './../users/dto/create-user.dto';
import { Controller, Get, Post, Render, UseGuards, Body, Res, Req} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    // @Throttle(10, 60) override
    @ApiBody({ type: UserLoginDto, })
    @Post('/login')
    @ResponseMessage("User Login")
    handleLogin(
      @Req() req, 
      @Res({ passthrough: true }) response: Response){
      return this.authService.login(req.user, response);
    }

    
    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto){
      return this.authService.register(registerUserDto);
    }

    @Get('/account')
    @ResponseMessage("Get User information")
    async handleAccount(@User() user: IUser){
      const temp = await this.roleService.findOne( user.role._id ) as any;
      user.permissions = temp.permissions;
      return { user };
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage("Get User by refresh token")
    handleRefreshToken(
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response){
      const refreshToken = request.cookies["refresh_token"];
      return this.authService.processNewToken(refreshToken, response);
    }

    @Post('/logout')
    @ResponseMessage("User Logout")
    handleLogOut(
      @Res({ passthrough: true }) response: Response,
      @User() user: IUser){
      return this.authService.logout(response, user);
    }

    @Public()
    @Post('forgot-password')
    forgotPassword(
      @Body() payload: any){
      return this.authService.forgotPassword(payload);
    }

    @Public()
    @Post('verify-otp')
    verifyOtp(
      @Body() payload: any){
      return this.authService.verifyOtp(payload);
    }

    // @UseGuards(LocalAuthGuard)
    // @UseGuards(ThrottlerGuard)
    @Public()
    @Post('reset-password')
    resetPassword(
      @Body() payload: any){
      return this.authService.resetPassword(payload);
    }
}
