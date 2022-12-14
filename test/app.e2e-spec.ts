import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

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
      it('should throw error if email empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          password: dto.password,
        }).expectStatus(400)
      });
      it('should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({
          email: dto.email,
        }).expectStatus(400)
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      });
      it('should sign up', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    });

    describe('Signin', () => {
      it('should throw error if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          password: dto.password,
        }).expectStatus(400)
      });
      it('should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({
          email: dto.email,
        }).expectStatus(400)
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      });
      it('should sign in', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token')
      })
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200)
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Name',
          email: 'ejemploedit@ejemplo.com'
        }
        return pactum.spec().patch('/users').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email)
      })
    });
  });

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectBody([])
      })
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://lucas-bianchi.vercel.app/'
      }
      it('should create bookmark', () => {
        return pactum.spec().post('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).withBody(dto).expectStatus(201).stores('bookmarkId', 'id')
      })
    });

    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectJsonLength(1)
      })
    });

    describe('Get bookmark by id', () => {
      it('should get bookmarks by ID', () => {
        return pactum.spec().get('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectBodyContains('$S{bookmarkId}')
      })
    });

    describe('Edit bookmark by id', () => {
      it('should edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title: 'Edited Title',
          description: 'Edited description'
        }
        return pactum.spec().patch('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).withBody(dto).expectStatus(200).expectBodyContains(dto.title).expectBodyContains(dto.description)
      })
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum.spec().delete('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(204)
      })

      it('should get empty bookmarks', () => {
        return pactum.spec().get('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectJsonLength(0)
      })
    });
  });
})