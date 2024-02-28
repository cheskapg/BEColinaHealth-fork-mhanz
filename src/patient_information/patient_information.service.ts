import { Injectable } from '@nestjs/common';
import { CreatePatientInformationInput } from './dto/create-patient_information.input';
import { UpdatePatientInformationInput } from './dto/update-patient_information.input';
import { PatientInformation } from './entities/patient_information.entity';
import { ILike, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; // 
import { HttpException, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientInformationService {
  constructor(
    @InjectRepository(PatientInformation)
    private patientInformationRepository: Repository<PatientInformation>,
    private idService: IdService, // Inject the IdService
  ) { }
  //CREATE PATIENT INFO
  async createPatientInformation(input: CreatePatientInformationInput): Promise<PatientInformation> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth = await this.patientInformationRepository.findOne({
      where: {
        firstName: ILike(`%${input.firstName}%`), // Check based on the 
      },

    });
    // If a patient with similar information exists, throw an error
    if (existingLowercaseboth) {
      throw new ConflictException('Patient already exists.');
    }

    // Create a new instance of the PatientInformation entity
    const newPatientInformation = new PatientInformation();

    // Generate a UUID for the patient information
    const uuidPrefix = 'PTN-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    const creationDate = new Date().toISOString();
    // Assign the generated UUID and creation date to the new patient information
    newPatientInformation.uuid = uuid;
    newPatientInformation.created_at = creationDate;

    // Copy the properties from the input object to the new patient information
    Object.assign(newPatientInformation, input);

    // Save the new patient information to the database
    return this.patientInformationRepository.save(newPatientInformation);
  }

  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<PatientInformation[]> {
    return this.patientInformationRepository.find();
  }
  //GET PAGED PATIENT LIST basic info for patient list with return to pages

  async getAllPatientsBasicInfo(page: number = 1, perPage: number = 5):
    //what is the expected data
    Promise<{ data: PatientInformation[], totalPages: number, currentPage: number, totalCount }> {
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientInformationRepository.count({
      select: ["uuid", "firstName", "lastName", "age", "gender"],
      skip: skip,
      take: perPage,
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientInformationRepository.find({
      select: ["uuid", "firstName", "lastName", "age", "gender"],
      skip: skip,
      take: perPage,
    });
    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount : totalPatients
    };
  }


  async searchAllPatientInfoByTerm(term: string, page: number = 1, perPage: number = 5):
    //what is the expected data
    Promise<{ data: PatientInformation[], totalPages: number, currentPage: number, totalCount }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    //count the total rows searched
    const totalPatients = await this.patientInformationRepository.count({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`%ptn-${searchTerm}%`) },
      ],
    });
    //total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    //find the data
    const patientList = await this.patientInformationRepository.find({
      where: [
        { firstName: ILike(searchTerm) },
        { lastName: ILike(searchTerm) },
        { uuid: ILike(`%ptn-${searchTerm}%`) },
        //ptn prefix 
      ],
      skip: skip,
      take: perPage,

    });
    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount : totalPatients
    };
  }



  async getAllPatientsWithDetails(): Promise<PatientInformation[]> {
    return this.patientInformationRepository.find({
      relations: [
        'medications',
        'vital_signs',
        'medical_history',
        'lab_results',
        'notes',
        'appointment',
        'emergency_contact',

      ],
    });
  }
  async updatePatientInformation(
    updatePatientInformationInput: UpdatePatientInformationInput,
  ): Promise<PatientInformation> {
    const { id, ...updateData } = updatePatientInformationInput;

    // Find the patient record by ID
    const patient = await this.patientInformationRepository.findOneOrFail({
      where: { id },
    });

    // Update the patient record with the new data
    Object.assign(patient, updateData);

    // Save the updated patient record
    return this.patientInformationRepository.save(patient);
  }


  removePatientInformation(id: number) {
    return this.patientInformationRepository.delete(id);
  }
}
