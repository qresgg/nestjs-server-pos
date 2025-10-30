import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Staff } from "./entities/staff.entity";

@Injectable()
export class StaffService {
    constructor(@InjectRepository(Staff) private readonly staffRepository: Repository<Staff>,) {}

  create(createStaffDto: CreateStaffDto) {
        return 'This action adds a new staff';
  }

  findAll() {
        return this.staffRepository.find();
  }

  findOne(id: string) {
      return this.staffRepository.findOneBy({ id });
  }

    async findByCode(code: string){
        return this.staffRepository.findOne({ where: { code } });
    }


    async update(id: string, data: Partial<Staff>) {
        await this.staffRepository.update({ id }, data);
        return this.staffRepository.findOne({ where: { id } });
    }

  remove(id: string) {
    return `This action removes a #${id} staff`;
  }
}
