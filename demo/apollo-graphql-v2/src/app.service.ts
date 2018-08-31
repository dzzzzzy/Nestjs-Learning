import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    async sayHello(name: string) {
        return `Hello ${name}!`;
    }
}