# Reminder

### KeyPoints
1. After installing dinoloop, user won't be able to have type support on Request, Response and other express objects in dinoloop. To overcome this, ask user to update `src/modules/types/express.ts` inside `node_modules` by replacing with express types path.
2. *IUserIdentity* is still an experimental feature which brings task-context concept into single-threaded javascript environment. Make sure the dependency objects in the resolution graph of IUserIdentity must not be singleton and those objects in the resolution graph must be dependency per resolve, otherwise data gets tampered between multiple requests. 

    * Consider `A => B => IUserIdentity`, and  `A => C => D`, Objects A,  B must not be singletons since those objects are in resolution graph of *IUserIdentity* but C, D can be (singleton or anything) as you desire since those are not in resolution graph of *IUserIdentity*.
3. When query-string and named-segments have same variables (or keys) then the named-segments values are injected into action args. 
4. Result values (objects) are passed by reference, if one of your result filter mutates object the same object reflects in other filters.
