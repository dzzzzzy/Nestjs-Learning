import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 异常拦截器，拦截每个请求中的异常，目的是将异常码和异常信息改写为 { code: xxx, message: xxx } 类型
        return next.handle().pipe(catchError((error, caught): any => {
            if (error instanceof HttpException) {
                return Promise.resolve({
                    code: error.getStatus(),
                    message: error.getResponse()
                });
            }
            return Promise.resolve({
                code: 500,
                message: `出现了意外错误：${error.toString()}`
            });
        }));
    }
}
