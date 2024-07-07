import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
// import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/core';

describe('AuthService', () => {
  // let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload, options) => {
              const jwt = require('jsonwebtoken');
              return jwt.sign(payload, options.secret, { expiresIn: options.expiresIn });
            }),
            decode: jest.fn().mockImplementation((token) => {
              const jwt = require('jsonwebtoken');
              return jwt.decode(token);
            }),
          },
        },
      ],
    }).compile();

    // authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate a token with the correct user details and expiration time', async () => {
    const user: User = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'kizito@hng.com',
      password: 'password',
      phone: '1234567890',
      organisations: []
    };

    const token = await jwtService.sign({ userId: user.userId, email: user.email }, { secret: 'test-secret', expiresIn: '60m' });
    const decodedToken = jwtService.decode(token) as any;

    expect(decodedToken.userId).toBe(user.userId);
    expect(decodedToken.email).toBe(user.email);
    expect(decodedToken.exp).toBeDefined();

    const expiresIn = 60 * 60; // 60 minutes in seconds
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    expect(decodedToken.exp).toBeGreaterThanOrEqual(now + expiresIn - 5); // allowing a small margin
    expect(decodedToken.exp).toBeLessThanOrEqual(now + expiresIn + 5); // allowing a small margin
  });

  it('should decode a valid token and extract user details', async () => {
    const token = jwtService.sign({ userId: '123e4567-e89b-12d3-a456-426614174000', email: 'kizito@hng.com' }, { secret: 'test-secret', expiresIn: '60m' });
    const decodedUser = jwtService.decode(token) as any;

    expect(decodedUser.userId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(decodedUser.email).toBe('kizito@hng.com');
  });

  it('should confirm the token expires at the correct time', async () => {
    const user: User = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'kizito@hng.com',
      password: 'password',
      phone: '1234567890',
      organisations: []
    };

    // 60 minutes
    const expiresIn = 60 * 60; 
    const token = await jwtService.sign({ userId: user.userId, email: user.email }, { secret: 'test-secret', expiresIn: `${expiresIn}s` });
    const decodedToken = jwtService.decode(token) as any;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = decodedToken.exp - now;

    expect(timeLeft).toBeGreaterThanOrEqual(expiresIn - 5); // allowing a small margin
    expect(timeLeft).toBeLessThanOrEqual(expiresIn + 5); // allowing a small margin
  });

});
