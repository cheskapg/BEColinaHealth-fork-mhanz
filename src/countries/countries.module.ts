import { Module } from '@nestjs/common';
import { CountryService } from './countries.service';
import { CountryResolver } from './countries.resolver';
import { CountryController } from './countries.controller';

@Module({
  providers: [CountryResolver, CountryService],
  controllers: [CountryController],
})
export class CountryModule { }
