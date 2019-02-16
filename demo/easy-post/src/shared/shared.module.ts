import { Module } from '@nestjs/common';

import { CryptoUtil } from './utils/crypto.util';

/**
 * 共享模块，向 nest 容器提供单例的共享模块，其他模块使用共享模块导出的 provider 时，只需导入 SharedModule
 */
@Module({
    providers: [CryptoUtil],
    exports: [CryptoUtil]
})
export class SharedModule { }