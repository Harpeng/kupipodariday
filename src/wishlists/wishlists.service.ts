import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
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

  async findAll() {
    const wishlists = await this.wishListRepository.find({
      relations: ['owner', 'items'],
    });

    if (!wishlists) {
      throw new NotFoundException('WishList not found');
    }

    return wishlists;
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

  async delete(userId: number, wishListId: number) {
    const wishlist = await this.findById(wishListId);

    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('You are not the owner of the wishlist');
    }

    return await this.wishListRepository.delete(wishListId);
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
