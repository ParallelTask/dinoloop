# Reminder

### KeyPoints
1. *IUserIdentity* is still an experimental feature which brings task-context concept into single-threaded javascript environment. Make sure the dependency objects in the resolution graph of IUserIdentity must not be singleton and those objects in the resolution graph must be dependency per resolve, otherwise data gets tampered between multiple requests. 

    * Consider `A => B => IUserIdentity`, and  `A => C => D`, Objects A,  B must not be singletons since those objects are in resolution graph of *IUserIdentity* but C, D can be (singleton or anything) as you desire since those are not in resolution graph of *IUserIdentity*.
