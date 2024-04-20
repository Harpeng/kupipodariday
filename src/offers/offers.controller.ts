import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { PasswordUserInterceptor } from 'src/interceptors/password-user.interceptors';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@UseInterceptors(PasswordUserInterceptor)
@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
