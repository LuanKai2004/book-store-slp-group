import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting application bootstrap process...');
  try {
    console.log('Creating NestJS application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    console.log('Application created, setting up middleware...');
    // Apply global middleware
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors(); // Enable CORS
    
    // Start the server
    const port = process.env.PORT || 3000;
    console.log(`Attempting to start server on port ${port}...`);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Application failed to start with error:');
    console.error(error);
    process.exit(1); // Exit with error code
  }
}

console.log('Calling bootstrap function...');
bootstrap().catch(err => {
  console.error('Unhandled error in bootstrap:');
  console.error(err);
  process.exit(1);
});
