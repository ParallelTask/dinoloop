# FAQ

### KeyPoints
* When query-string and named-segments have same variables (or keys) then the named-segments values are injected into action args.
* Result values (objects) are passed by reference, if one of your result filter mutates object the same object reflects in other filters.
