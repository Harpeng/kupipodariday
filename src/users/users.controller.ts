import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { PasswordUserInterceptor } from 'src/interceptors/password-user.interceptors';
import { AuthUserId } from 'src/decorators/user.decorator';
import { InvalidExepctionFilter } from 'src/filters/invalid-data-excepction.filters';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@UseInterceptors(PasswordUserInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getOwn(@AuthUserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @Patch('me')
  @UseFilters(InvalidExepctionFilter)
  update(@AuthUserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wises')
  getOwnWishes(@AuthUserId() id: number) {
    return this.usersService.findOwnWishes(id);
  }
}
