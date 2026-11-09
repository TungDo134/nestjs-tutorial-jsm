import { SetMetadata } from '@nestjs/common';

export const Roles = (...agrs: string[]) => SetMetadata('roles', agrs);
