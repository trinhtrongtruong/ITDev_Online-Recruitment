// middle check xem có sử dụng jwt.strategy.ts
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
      }    
      canActivate(context: ExecutionContext) { // lấy value dự vào key, return true => JwtAuthGuard run next
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ 
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);//check jwt
      }

      
      
      handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [ 
          context.getHandler(),
          context.getClass(),
        ]);
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException("Token không hợp lệ hoặc không có Bearer Token ở Header request");
        }

        //check permission
        const targetMethod = request.method;
        const targetEndpoint = request.route?.path as string;
        // console.log(">>>Check targetMethod: ",targetMethod)
        // console.log(">>>Check targetEndpoint: ",targetEndpoint)
        
        const permissions = user?.permissions??[];
        // console.log(">>>Check user permission: ", permissions??[])
        let isExist = permissions.find(permission => {
          // console.log(">>>Check targetEndpoint: ", targetEndpoint)
          // console.log(">>>Check permission: ", permission)
          // console.log(">>>Check permission.apiPath: ", permission.apiPath)

          return targetMethod === permission.method && targetEndpoint === permission.apiPath
        }
          )
        if(targetEndpoint.startsWith("/api/v1/auth")) isExist = true;
        // console.log(">>>Check isSkipPermission: ", isSkipPermission)
        // console.log(">>>Check isExist: ", isExist)
        // if(!isExist && !isSkipPermission){
        //   throw new ForbiddenException("Bạn không có quyền truy cập Endpoint này!")
        // }
        return user;
      }
}
