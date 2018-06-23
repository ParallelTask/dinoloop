# Notes

### KeyPoints
1. Built-in middlewares are singletons for memory optimization.
2. When query-string and named-segments have same variables (or keys) then the named-segments values are injected into action args. 
3. Result values (objects) are passed by reference, if one of your result filter mutates object the same mutated object reflects in other filters.
2. While creating spies in unit-tests, do not worry about the function args and types unless you use them. Just have empty args in your spy function returning desired value.
