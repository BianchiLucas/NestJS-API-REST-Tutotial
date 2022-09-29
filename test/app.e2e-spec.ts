import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Pactum compila todo un módulo y crea un módulo de testing, donde puede realizar requests 
// Jest es el main testing framework

describe('App e2e', () => {
  let app: INestApplication   // Interface Nestjs Application
  let prisma: PrismaService   // Variable para vaciar la DB

  beforeAll(async () => {

    // Compilar módulo
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Crear Nestjs testing application (necesario incluir Pipes)
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }))

    await app.init();
    await app.listen(3333);

    // Clear DB
    prisma = app.get(PrismaService)
    await prisma.cleanDB();

    // URL base para test:
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  // Cerrar la app luego de los tests
  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ejemplotest@test.com',
      password: '123',
    }
    
    describe('Signup', () => {
      it('should sign up', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    });

    describe('Signin', () => {
      it.todo('Signin')
    });
  });

  describe('User', () => {
    describe('Get me', () => { });

    describe('Edit user', () => { });
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => { });

    describe('Get bookmarks', () => { });

    describe('Get bookmark by id', () => { });

    describe('Edit bookmark', () => { });

    describe('Delete bookmark', () => { });
  });
})