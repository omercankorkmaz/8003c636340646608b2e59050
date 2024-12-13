import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import User from './user.model';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(
    @Query() query: { search: string; page: number; pageSize: number },
  ): Promise<{ message: string; users?: User[] }> {
    return this.userService.getAll(query);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<{ message: string; user?: User }> {
    return this.userService.getById(id);
  }

  @Post('/save')
  save(@Body() user: User): Promise<{ message: string }> {
    return this.userService.save(user);
  }

  @Post('/update')
  update(@Body() user: User): Promise<{ message: string }> {
    return this.userService.update(user);
  }
}
