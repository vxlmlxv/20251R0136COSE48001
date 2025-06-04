import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { mockUsers } from '../data/mock-data';

@Injectable()
export class UsersService {
  private users: User[] = [...mockUsers];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
