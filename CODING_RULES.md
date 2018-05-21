# Coding Rules

### Guidelines
1. Dinoloop follows [this](https://stackoverflow.com/questions/469161/how-do-you-define-a-good-or-bad-api) principles. While there are situations, these principles might be discarded.
2. Do not perform null/undefined checks for every method, do it at api exposed level methods. Methods which are closer/next to api must cleanse the data and pass on to inner methods.
3. TestCases should follow conventions `[methodname].[returns/throws/[other]_description_seperated_with_dash]`.
4. Comments must be brief and self explanatory particularly on API methods.
5. API methods/properties/classes etc must be short, notable and easy to remember.
6. If method accepts more than 3 arguments prefer objects.
7. There are situations where a method is made public to break down larger code into smaller logical units, to unit test it properly. 
   Though such methods are not available on the interface contract, make a comment at method level when it has to be done.
8. If we are invoking the constructor of a class using new operator inside other classes/methods, it is better design to have static factory method `.create()` which internally calls the constructor. Also, having `.create()` static method makes easy to spy the object creation for unit tests.

That's it! Happy Coding!