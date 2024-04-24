import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InvalidExepctionFilter } from 'src/filters/invalid-data-excepction.filters';
import { AuthUser, AuthUserId } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseFilters(InvalidExepctionFilter)
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findById(id);
  }

  @Patch(':id')
  @UseFilters(InvalidExepctionFilter)
  update(
    @Param('id') wishId: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUserId() userId: number,
  ) {
    return this.wishlistsService.update(wishId, updateWishlistDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') wishId: number, @AuthUserId() userId: number) {
    return this.wishlistsService.remove(wishId, userId);
  }
}
