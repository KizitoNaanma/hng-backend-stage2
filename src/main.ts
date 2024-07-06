import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from './common';
// import { BadRequestException, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true
  });
  // app.useGlobalPipes(
  //     new ValidationPipe({ 
  //       transform: true, 
  //       whitelist: true, 
  //       // errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, 
  //       // exceptionFactory: (errors) => {
  //       //   const formattedErrors = errors.map(error => ({
  //       //     field: error.property,
  //       //     message: Object.values(error.constraints).join(', '),
  //       //   }));
  //       //   return new UnprocessableEntityException({
  //       //     // statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       //     errors: formattedErrors,
  //       //   });
  //       // },
  //   })
  // );
  
  await app.listen(process.env.PORT || 3000, () =>
  console.log('Listening on port: ' + process.env.PORT)
);}
bootstrap();
