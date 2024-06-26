import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { id, provider, ...data } = createUserDto;
    const user = this.userRepository.create({
      oauthId: `${provider}:${id}`,
      ...data,
      role: 'user',
      interest: [],
      tags: [],
    });
    return this.userRepository.save(user);
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['organization', 'tags'],
    });
  }

  findByOAuthId(id: string | number, provider: string) {
    return this.userRepository.findOne({
      where: { oauthId: `${provider}:${id}` },
      relations: ['organization', 'tags'],
    });
  }

  getOrgUsers(id: string) {
    return this.userRepository.find({
      where: { organization: { id } },
      relations: ['organization', 'tags'],
    });
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    const { tags, organization: org, ...other } = updateUserDto;

    if (tags != null) {
      const actual = await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'tags')
        .of(id)
        .loadMany();

      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'tags')
        .of(id)
        .addAndRemove(
          tags.map((tag) => ({ id: tag })),
          actual,
        );
    }

    return this.userRepository.update(id, {
      organization: typeof org === 'string' ? { id: org } : org,
      ...other,
    });
  }
}
