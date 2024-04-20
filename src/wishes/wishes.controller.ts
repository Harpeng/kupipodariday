import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser, AuthUserId } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PasswordUserInterceptor } from 'src/interceptors/password-user.interceptors';
import { PasswordWishInterceptor } from 'src/interceptors/offer.interceptors';
import { InvalidExepctionFilter } from 'src/filters/invalid-data-excepction.filters';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @UseInterceptors(PasswordUserInterceptor)
  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseInterceptors(PasswordUserInterceptor, PasswordWishInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @UseGuards(JwtGuard)
  @Patch(':id')
  @UseFilters(InvalidExepctionFilter)
  update(
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() userId: number,
  ) {
    return this.wishesService.update(wishId, updateWishDto, userId);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') wishId: number, @AuthUserId() userId: number) {
    return this.wishesService.remove(wishId, userId);
  }

  @UseInterceptors(PasswordUserInterceptor)
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.copy(wishId, user);
  }
}
