# Notes

### KeyPoints
1. Built-in middlewares are singletons for memory optimization.
2. Result values (objects) are passed by reference, if one of your result filter mutates object the same mutated object reflects in other filters.
3. While creating spies in unit-tests, do not worry about the function args and types unless you use them. Just have empty args in your spy function returning desired value.
