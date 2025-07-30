import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {
    console.log('Base connectée ?', dataSource.isInitialized); // Devrait afficher true
  }

  getHello(): string {
    return 'Hello World!';
  }
}
