import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApplyDto } from '../common/dto/apply.dto';
import { Admin } from '../user/admin/entities/admin.entity';
import { User } from '../common/decorator/user.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UserEntity } from '../user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { PostDto } from './dto/post.dto';
import { ApplyService } from '../common/apply.service';
import { FcmService } from '../firebase/fcm.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly applyService: ApplyService,
    private readonly fcmService: FcmService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: { body: CreatePostDto; user: UserEntity }) {
    const post = await this.postService.create(req.body, req.user);
    await this.fcmService.sendPost(post);
    return post;
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('my')
  async myApplies(@User() user: UserEntity) {
    return this.applyService.findByUser(user.id, 'post');
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);
    if (post === null) {
      throw new NotFoundException();
    }

    return plainToInstance(PostDto, post);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Body() body: UpdatePostDto, @Param('id') id: string) {
    const post = await this.postService.findOne(id);
    if (post === null) {
      throw new NotFoundException();
    }

    return this.postService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Get(':id/applies')
  @UseGuards(JwtGuard)
  async applies(
    @User() user: Admin,
    @Param('id') id: string,
  ): Promise<ApplyDto[]> {
    return plainToInstance(
      ApplyDto,
      await this.applyService.findAll(id, 'post'),
    );
  }

  @UseGuards(JwtGuard)
  @Post(':id/apply')
  async apply(@User() user: UserEntity, @Param('id') id: string) {
    return this.applyService.create(user, id, 'post');
  }
}
