# Coding Rules

### Guidelines
1. Dinoloop follows [this](https://stackoverflow.com/questions/469161/how-do-you-define-a-good-or-bad-api) principles. While there are situations, these principles might be discarded.
2. Do not perform null/undefined checks for every method, do it at api exposed level methods. Methods which are closer/next to api must cleanse the data and pass on to inner methods.
3. Test cases should follow 

    `describe(path.to.test.spec.ts)`
    
    `it([methodname].[returns/throws/[other]_description_seperated_with_dashes])`.
    
4. Comments must be brief and self explanatory particularly on API methods.
5. API methods/properties/classes must be short, notable and easy to remember.
6. Method accepts more than 3 arguments, it is better to prefer objects.
7. There are situations where a method is made public to break down larger code into smaller logical units, to unit test properly. Those methods are not on the interface contract, make a comment at method level when it has to be done.
8. Do not invoke the constructor/new operator inside other classes/methods, it is better design to have static factory method `.create()` on a class which internally invokes new/calls the constructor. Having `.create()` static method makes easy to spy on the object creation for unit tests.
9. Do not commit package-lock.json, it is a personal choice based on [here](https://stackoverflow.com/questions/44206782/do-i-commit-the-package-lock-json-file-created-by-npm-5) and [here](https://stackoverflow.com/questions/44297803/package-lock-json-role)
10. Feel free to suggest and add best practises.


That's it! Happy Coding!
