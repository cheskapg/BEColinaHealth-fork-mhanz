import { Module } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { LabResultsFilesController } from './labResultsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';
import { IdService } from 'services/uuid/id.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients,LabResultsFiles, LabResults, Prescriptions])],

  controllers: [LabResultsFilesController],
  providers: [LabResultsFilesService, IdService ,LabResultsService, PatientsService],
})
export class LabResultsFilesModule { }
