import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { CreateUserDto, Organisation, User } from '../src/core';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { getConnection } from 'typeorm';

const SECONDS = 10000;
jest.setTimeout(70 * SECONDS)

describe('Register End-to-End Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let userRepository: Repository<User>;
  let organisationRepository: Repository<Organisation>;
  const num = Math.floor(Math.random() * 100) + 1

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    organisationRepository = moduleFixture.get<Repository<Organisation>>(getRepositoryToken(Organisation));
  });

  afterAll(async () => {
    await app.close();
    // await getConnection().close();
  });

  it('Should Register User Successfully with Default Organisation', async () => {
    const registerDto: CreateUserDto = {
      firstName: 'Kizito',
      lastName: 'Horlong',
      email: `kizito${num}@hng.com`,
      password: 'password',
      phone: '07043902240'
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(HttpStatus.CREATED);

    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.firstName).toBe(registerDto.firstName);
    expect(response.body.data.user.lastName).toBe(registerDto.lastName);
    expect(response.body.data.user.email).toBe(registerDto.email);
    expect(response.body.data).toHaveProperty('accessToken');

    // Verify the default organisation in the database
    const createdUser = await userRepository.findOne({ where: { email: registerDto.email }, relations: ['organisations'] });
    expect(createdUser).toBeDefined();
    expect(createdUser.organisations).toHaveLength(1);
    expect(createdUser.organisations[0].name).toBe(`${registerDto.firstName}'s Organisation`);
  });

  it('Should Log the user in successfully', async () => {
    const loginDto = {
      email: `kizito${num}@hng.com`,
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK);

    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.email).toBe(loginDto.email);
    expect(response.body.data).toHaveProperty('accessToken');

    accessToken = response.body.data.accessToken;

    // expect(response.body.data.accessToken).toBe(accessToken);
  });

  it('Should Fail If Required Fields Are Missing', async () => {
    const invalidDto = {};

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidDto)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.errors[0]).toBeDefined();
    expect(response.body.errors[0]).toMatchObject({ field: 'firstName', message: 'firstName must be a string' });
    expect(response.body.errors[1]).toMatchObject({ field: 'lastName', message: 'lastName must be a string' });
    expect(response.body.errors[2]).toMatchObject({ field: 'email', message: 'email must be an email' });
    expect(response.body.errors[3]).toMatchObject({ field: 'password', message: 'password must be a string' });
    expect(response.body.errors[4]).toMatchObject({ field: 'phone', message: 'phone must be a string' });
  });

  it("Should Fail if there’s Duplicate Email", async () => {
    const registerDto = {
        firstName: 'Kizito',
        lastName: 'Horlong',
        email: `kizito${num}@hng.com`,
        password: 'password',
        phone: '07043902240'
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({ status: 'Bad request', message: 'Registration unsuccessful', statusCode: 400});
  });
});
