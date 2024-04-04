import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificatorService {
  public async notify() {
    throw new Error('Not implemented');
  }
}
