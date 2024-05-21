import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';
import { Response } from 'express';
import moment from 'moment';
import ms from 'ms';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
      private roleService : RolesService,
      private nodeMailerService : NodemailerService,
      ) {}

    //username and pass are 2 parameter Passport Library throw back (ném về) 
      async validateUser(username: string, pass: string): Promise<any> {
          const user = await this.usersService.findOneByUsername(username);
          if(user){
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if(isValid === true){
              const userRole = user.role as unknown as { _id: string; name: string }
              const temp = await this.roleService.findOne(userRole._id);
              const objUser = {
                ...user.toObject(),
                permissions: temp?.permissions??[]
              }
              // console.log(">>>Check: ", temp?.permissions??[])
              // console.log(">>>Check: ", objUser)
              return objUser;
            }
          }
          return null;
        }
    
      async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id)
        //set refresh token as  cookies
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')) 
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
      }

      async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);
        return {
          _id: newUser?._id,
          createdAt: newUser?.createdAt
        };
      }

      createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, 
          {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
          });
        return refresh_token;
      }

      processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
          })

          let user = await this.usersService.findUserByToken(refreshToken)
          if(user){
            const { _id, name, email, role } = user;
        const payload = {
            sub: "token refresh",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload)

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString())

        //fetch user's role
        const userRole = user.role as unknown as { _id: string; name: string } // role ở DB là objectId >>> đổi kiểu sang { _id: string; name: string }
        const temp = await this.roleService.findOne(userRole._id);// >>> permission 
        //Set refresh token as cookies
        response.clearCookie("refresh_token")
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')) 
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions: temp?.permissions??[]
            }
        };
          }else{
          throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập lại`)
          }
          // console.log(user)
        }catch(error){
          throw new BadRequestException(`Refresh token không hợp lệ, vui lòng đăng nhập lại`)
        }
      }
      logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        //Set refresh token as cookies
        response.clearCookie("refresh_token");
        return "ok";
      }

      forgotPassword = async ({ email }: ForgotPasswordDto): Promise<string> => {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new BadRequestException('Không tìm thấy người dùng')
        }

    
        const otpCode =  Math.floor(Math.random() * 9000 + 1000) + '';
        console.log('otpCode', otpCode)
        const expireTime = moment().add(
          15,
          'minutes',
        );
        console.log('expireTime', expireTime)
    
        const hash = CryptoJS.AES.encrypt(
          JSON.stringify({
            email: user.email,
            expireTime,
            otpCode: otpCode,
          }), '561326868364f5ca7a933b826e8c50b77344831f'
        ).toString();

        await this.nodeMailerService.sendMail({
          to: user.email,
          subject: 'forgot password',
          template: 'forgot-password',
          context: {
            name: `${user.email}`,
            expireTime: expireTime.format('LLLL'),
            otpCode,
          },
        });

        return hash;
      }

      verifyOtp = async ({ otpCode, hash }: any): Promise<string> => {
        const bytes = CryptoJS.AES.decrypt(hash, '561326868364f5ca7a933b826e8c50b77344831f');
        const jsonData = bytes.toString(CryptoJS.enc.Utf8);
        if (!jsonData) {
          new BadRequestException('Verify OTP fail')
        }
        const data = JSON.parse(jsonData);
        const expireTime = moment(data.expireTime);
        const currentTime = moment();
        if (currentTime >= expireTime || data.otpCode !== otpCode) {
          new BadRequestException('Incorrect OTP')
        }
        return hash;
      }
    
      resetPassword =  async({
        hash,
        password,
        confirmPassword,
      }: any): Promise<any> => {
        if (confirmPassword !== password) {
          new BadRequestException(
            'Password not match'
          );
        }
        const bytes = CryptoJS.AES.decrypt(hash, '561326868364f5ca7a933b826e8c50b77344831f');
        const jsonData = bytes.toString(CryptoJS.enc.Utf8);
        if (!jsonData) {
          new BadRequestException('Reset password fail')
        }
        const data = JSON.parse(jsonData);
        const user = await this.usersService.findByEmail(data.email);
        if (!user) {
          new BadRequestException('Reset password fail')

        }
        const hashPassword = this.usersService.getHashPassword(password);
    
        return this.usersService.updateOne(user.id,
          {
            password: hashPassword,
          }
        );
      }
}
