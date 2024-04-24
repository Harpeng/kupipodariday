import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = await this.wishesService.getManyByIds(itemsId);

    const wishlist = await this.wishListRepository.save({
      items,
      owner: user,
      ...rest,
    });
    return wishlist;
  }

  findAll() {
    return (
      this.wishListRepository.find({
        relations: ['owner', 'items'],
      }) || []
    );
  }

  async findById(id: number) {
    const wishlist = await this.wishListRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async remove(userId: number, wishListId: number) {
    const wishlist = await this.wishListRepository.findOne({
      where: { id: wishListId },
      relations: ['owner'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wishlist');
    }
    await this.wishListRepository.delete(wishListId);
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('You are not the owner of the wishlist');
    }
    const { itemsId, name, image, description } = updateWishlistDto;
    const wishes = await this.wishesService.getManyByIds(itemsId || []);

    await this.wishListRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: wishes,
    });
    return await this.findById(id);
  }
}
