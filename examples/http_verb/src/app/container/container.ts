import { ReflectiveInjector } from 'injection-js';
import { HomeController } from '../controllers/home.controller';

// Define all the services and their implementations to be injected at runtime
// Note that we are using angular di container as a wrapper for dependency injection
const injector = ReflectiveInjector.resolveAndCreate([

    // Register the controllers
    { provide: HomeController, useClass: HomeController }

    // Register the services
    // Register the action filters
]);

export { injector as Container };
