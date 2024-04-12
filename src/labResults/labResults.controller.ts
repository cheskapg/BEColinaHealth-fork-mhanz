import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { CreateLabResultInput } from './dto/create-labResults.input';
import { UpdateLabResultInput } from './dto/update-labResults.input';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lab-results')
export class LabResultsController {
    constructor(private readonly labResultsService: LabResultsService) { }
    @Post(':id')
    createLabResult(@Param('id') patientId: string,
        @Body() createLabResultInput: CreateLabResultInput) {
        return this.labResultsService.createLabResults(patientId, createLabResultInput);
    }
    @Post('get/all')
    getLabResults() {
        return this.labResultsService.getAllLabResults();
    }
    @Post('list/:id')
    findAllLabResultsByPatient(
        @Param('id') patientId: string,
        @Body() body: { term: string, page: number, sortBy: string, sortOrder: 'ASC' | 'DESC' }
    ) {
        const { term = "", page, sortBy, sortOrder } = body;
        return this.labResultsService.getAllLabResultsByPatient(term, patientId, page, sortBy, sortOrder);
    }
    @Patch('update/:id')
    updateLabResults(@Param('id') id: string, @Body() updateLabResultInput: UpdateLabResultInput) {
        return this.labResultsService.updateLabResults(id, updateLabResultInput);
    }
    @Patch('delete/:id')
    softDeletePrescriptions(@Param('id') id: string) {
        return this.labResultsService.softDeleteLabResults(id);
    }

    //labFile
    @Post('lab-results/:id/file')
    @UseInterceptors(FileInterceptor('file'))
    addLabFile(@Param('id') @UploadedFile() id: string, file: Express.Multer.File) {
        return this.labResultsService.addLabFile(id, file.buffer, file.originalname);
    }

}

