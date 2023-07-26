import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Create new user with salted and hashed password', async () => {
    const user = await service.signup('asd@asd.com', 'asd');

    expect(user.password).not.toEqual('asd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup('asd@asd.com', 'pass');

    await expect(service.signup('asd@asd.com', 'asd')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws an error when signin is called with unused email', async () => {
    await expect(service.signin('asd@asd.com', 'asd')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Throws an error when invalid password is provided', async () => {
    await service.signup('asd@asd.com', 'qwe');

    await expect(service.signin('asd@asd.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Returns a user if correct password is provided', async () => {
    await service.signup('asd@asd.com', 'pass');

    const user = await service.signin('asd@asd.com', 'pass');
    expect(user).toBeDefined;
  });
});
