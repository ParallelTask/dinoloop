# Notes

### KeyPoints
1. When query-string and named-segments have same variables (or keys) then the named-segments values are injected into action args. 
2. Result values (objects) are passed by reference, if one of your result filter mutates object the same object reflects in other filters.
3. Built-in middlewares are singletons for memory optimization.
4. While creating spies in unit-tests, do not worry about the function args and types unless you use them. Just have empty args spy function returning desired value.
