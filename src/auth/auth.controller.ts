import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.gard';
import { AuthUserId } from 'src/decorators/user.decorator';
import { InvalidExepctionFilter } from 'src/filters/invalid-data-excepction.filters';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@AuthUserId() userId: number) {
    return this.authService.signin(userId);
  }

  @Post('signup')
  @UseFilters(InvalidExepctionFilter)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
