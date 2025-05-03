# bookstore-be

bookstore app backend exploring, using expressjs, postgreSQL, TypeScript

# SEQUELIZE INIT

npx sequelize-cli init

# AUTHENTICATION FLOW

-   register (DONE)
-   login (DONE)
-   role-based access control (RBAC) (DONE)
-   mfa function
-   support multiple device login (trace)
-   track logged in devices

## role type

-   customer: default role for regular users
-   admin: for managing the application
-   author: for contributing books
-   moderator: optional role for assisting admins
