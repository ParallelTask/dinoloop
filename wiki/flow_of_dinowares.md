# Flow of Dinowares
This guide helps you to understand the flow of dinowares.

When dino receives a request and if it is a valid route to handle, this is what happens: 

## Order of Dinowares
* Array of RequestStartMiddlewares (Irrespective of controller).
* Array of Expresswares specific to controller (registered via *use*).
* Array of Middlewares specific to controller (registered via *middlewares*).
* Array of ActionFilters specific to controller (registered via *filters*), `beforeExecution` methods are invoked.
* Action method is invoked.
* Array of ActionFilters specific to controller (registered via *filters*), `afterExecution` methods are invoked.
* Array of ResultFilters specific to controller (registered via *result*).
* Array of RequestEndMiddlewares (Irrespective of controller).

`Note:` Execution of middlewares/dinowares is based on order of registration.

## Order of Dinowares in Base-Child Controller
* Array of RequestStartMiddlewares (Irrespective of controller).
* Array of Expresswares specific to base controller (registered via *use*).
* Array of Expresswares specific to child controller (registered via *use*).
* Array of Middlewares specific to base controller (registered via *middlewares*).
* Array of Middlewares specific to child controller (registered via *middlewares*).
* Array of ActionFilters specific to base controller (registered via *filters*), `beforeExecution` methods are invoked.
* Array of ActionFilters specific to child controller (registered via *filters*), `beforeExecution` methods are invoked.
* Action method is invoked.
* Array of ActionFilters specific to child controller (registered via *filters*), `afterExecution` methods are invoked.
* Array of ActionFilters specific to base controller (registered via *filters*), `afterExecution` methods are invoked.
* Array of ResultFilters specific to child controller (registered via *result*).
* Array of ResultFilters specific to base controller (registered via *result*).
* Array of RequestEndMiddlewares (Irrespective of controller).

## Order of Dinowares When Error occured
* Array of ExceptionFilters specific to controller (registered via *exceptions*).
* Array of ErrorMiddlewares (Irrespective of controller).
* Executes [ErroController]() implementation of `write()` method.

## Order of Dinowares When Error occured in Base-Child
* Array of ExceptionFilters specific to child controller (registered via *exceptions*).
* Array of ExceptionFilters specific to base controller (registered via *exceptions*).
* Array of ErrorMiddlewares (Irrespective of controller).
* Executes [ErroController]() implementation of `write()` method.
