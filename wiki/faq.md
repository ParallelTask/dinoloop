# FAQ

### KeyPoints
* When query-string and named-segments have same variables (or keys) then the named-segments values are injected into action args.
```
@HttpGet('/query/:name')
query(name: string, search: string): string {
    return 'Hello World!';
}

Following are the requests

1. server:8088/api/home/query/stack?search=queue
   name => stack, search => queue

2. server:8088/api/home/query/stack?name=queue
   name => stack, search => undefined (because name is taken from segment and not from query string)

3. server:8088/api/home/query/stack?search=queue&search=list
   name => stack, search => [queue, list]
```
* Result values (objects) are passed by reference, if one of your result filter mutates object the same object reflects in other filters.
