import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from '@nestjs/common'
import { Observable } from "rxjs"

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log("Intercepitando")
    return next.handle().pipe()
  }
}