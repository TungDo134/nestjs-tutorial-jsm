import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (...agrs: string[]) =>
  SetMetadata('response-message', agrs);
