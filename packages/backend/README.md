# `typescript-express-oop-boilerplate`

---

This is a TypeScript-based backend boilerplate designed to follow best practices
for scalable and maintainable architecture. The boilerplate utilizes Express.js
for handling HTTP requests and utilises common design principles. The main
purpose is to avoid the long setup of an api and just let you focus on
implementing routes.

# How to Get Started

This TypeScript backend project is designed to be run completely within Docker
containers, simplifying the setup and ensuring consistency across different
environments. Below are the steps to get started:

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Yarn](https://yarnpkg.com/getting-started/install) (for managing Node.js
  packages)

## Installation and Setup

1. **Clone the Repository**:

2. **Install Node.js Dependencies**:
   - Although the project runs in Docker, Yarn is used for script execution.
   ```sh
   yarn install
   ```

## Development

1. **Start the Development Server**:

   ```sh
   yarn dev
   ```

   This command will start the entire service using Docker Compose, including
   any dependent services defined in your `docker-compose.yaml` file.

2. **Access the Application**:
   - Once the containers are up and running, the API will be set up to listen on
     port 3000.
   - You can access the API by navigating to
     [http://localhost:3000](http://localhost:3000) in your web browser or using
     a tool like [Postman](https://www.postman.com/) to make HTTP requests.

---

## Testing

1. **Run Tests**:
   ```sh
   yarn test
   ```
   This will run all tests inside Docker containers, ensuring consistency across
   different environments.

## Building the Project

1. **Build the Project**:
   ```sh
   yarn build
   ```
   This will build the project and output the compiled files to the `dist`
   directory.

---

#### Overview:

# Controller Implementation

The project follows a structured approach to handle HTTP requests, utilizing a
base controller for common functionalities and specific controllers for
domain-related actions. Below is an in-depth look at how this is achieved:

## BaseController

The `BaseController` class provides a set of utility methods to standardize the
response structure, handle different response types, and sanitize data before
sending it to the client. It also includes error handling and data
transformation functionalities.

- **setCode, setData, setMessage, setTypeRes**: These methods allow for fluent
  configuration of the response.
- **getResponse**: Based on the previously set configurations, this method sends
  the response back to the client.
- **responseSuccess, responseError**: These are higher-level methods to quickly
  send success or error responses.
- **transformData**: Transforms the data based on the application's settings,
  converting entities to their snake_case representation if necessary, and
  sanitizing the data to remove any sensitive information.
- **sanitizeData**: Removes any tainted fields from the data to prevent
  sensitive information leakage.

## UsersController

The `UsersController` extends the `BaseController` and provides specific
endpoints related to user functionalities to demonstrate how to implement a
basic endpoint.

- **getUsers**: Fetches a list of users with pagination. It utilizes the
  `@GetPagination` decorator to easily extract pagination parameters from the
  request query and the `@HandleErrors` decorator for standardized error
  handling.
- **createUser**: Handles user creation. It uses the `@BodyToCamelCase`
  decorator to transform the request body keys to camelCase, and the
  `@HandleErrors` decorator for error handling.
- **login**: Manages user login, returning a token upon successful
  authentication.

### Decorators Usage

- **@HandleErrors**: Applied to various methods to ensure any thrown errors are
  caught and handled properly.
- **@GetPagination**: Used in the `getUsers` method to extract pagination
  parameters from the request query.
- **@BodyToCamelCase**: Applied in the `createUser` method to transform the
  request body keys to camelCase.

### Middleware and Services Integration

- **@UseBefore**: This routing-controllers decorator is used to apply
  middlewares to specific routes. For example, `authMiddleware` is used to
  protect the `getUsers` endpoint.
- **validationMiddleware**: Applied to validate the request body against DTOs
  (Data Transfer Objects).
- **UsersService, AuthService**: Services are injected into the controller to
  handle business logic, interacting with the database and performing other
  necessary operations.

---

This structure ensures a clean separation of concerns, with the `BaseController`
handling common response-related tasks, and specific controllers focusing on
domain-related actions. The use of decorators and middlewares further
streamlines the code, making it more readable and maintainable.

---

# Middleware

This project includes a variety of decorators and utilities to enhance the
development experience and maintain code quality. Below are detailed
explanations of some of the key features:

## 1. Error Handling

The `HandleErrors` decorator is designed to wrap around class methods to provide
a standardized error handling mechanism. It captures any thrown errors, logs
them, and rethrows them if they are instances of `HttpException`. For all other
error types, it logs the error and throws a new `HttpException` with a generic
internal server error message.

- **Usage**: Apply `@HandleErrors` to any class method where you want to handle
  errors.
- **Benefits**: Centralizes error handling logic, making the codebase cleaner
  and easier to maintain.

## 2. Model Container

The `ModelContainer` decorator is used to inject Sequelize models into classes
using the [TypeDI](https://github.com/typestack/typedi) container. It retrieves
the model based on the table name and registers it in the container.

- **Usage**: Use `@ModelContainer('tableName')` to inject a Sequelize model into
  a class property.
- **Benefits**: Simplifies dependency injection of models, promoting cleaner and
  more maintainable code.

## 3. Pagination

The `GetPagination` function creates a custom parameter decorator for use with
[routing-controllers](https://github.com/typestack/routing-controllers) to
easily handle pagination in your API endpoints.

- **Usage**: Apply `@GetPagination()` to any controller action parameter to
  receive pagination parameters from the request query.
- **Benefits**: Streamlines the process of implementing pagination, making your
  API more robust and user-friendly.

## 4. Camel Case Transformation

The `BodyToCamelCase` decorator is used to transform the keys of the request
body from snake_case to camelCase.

- **Usage**: Apply `@BodyToCamelCase()` to any controller action parameter to
  receive the request body with keys in camelCase.
- **Benefits**: Ensures consistency in variable naming conventions across your
  codebase, regardless of how the client sends the data.

---

### Security

# Tainted Fields Concept

The "Tainted Fields" concept in this project refers to the practice of marking
certain fields within objects as sensitive or secure, ensuring that they are not
accidentally exposed or sent in responses to clients. This is particularly
important for fields that store sensitive information such as hashed passwords.

## Implementation

### TaintedFields Object

The `TaintedFields` object is a constant that explicitly lists out the fields
that are considered tainted or sensitive. For example:

```typescript
const TaintedFields = {
  HASHEDPASSWORD: "hashedPassword",
  HASHED_PASSWORD: "hashed_password",
  PASSWORD: "password",
} as const;
```

### TaintedFieldsSet

The `TaintedFieldsSet` is a Set created from the values of the `TaintedFields`
object. This Set is then used for quick lookups to check if a field is tainted.

```typescript
const TaintedFieldsSet = new Set<string>(Object.values(TaintedFields));
```

### Utility Types

- **TaintedFieldTypes**: A type representing the values of the `TaintedFields`
  object.
- **Sanitized**: A utility type that takes an object type `T` and returns a new
  type with the tainted fields omitted.
- **ObjectOnly**: A utility type that ensures the given type `T` is an object
  and not a primitive type.

```typescript
type TaintedFieldTypes = (typeof TaintedFields)[keyof typeof TaintedFields];
type Sanitized<T> = Omit<T, TaintedFieldTypes>;
type ObjectOnly<T> = T extends object
  ? T
  : "Error: Expected an object, but received a primitive type";
```

## Usage in the BaseController

The `BaseController` utilizes the `TaintedFieldsSet` and `Sanitized` type to
sanitize data before sending it in a response. The `sanitizeData` method
iterates over the object's keys, removing any that are present in the
`TaintedFieldsSet`.

```typescript
private sanitizeData<T>(data: T): Sanitized<T> {
  const sanitizedData: T = { ...data };
  for (const key of Object.keys(data)) {
    if (TaintedFieldsSet.has(key)) {
      delete sanitizedData[key];
    }
  }
  return sanitizedData as Sanitized<T>;
}
```

## Benefits

- **Security**: By explicitly defining and sanitizing tainted fields, the
  project minimizes the risk of accidentally exposing sensitive information.
- **Maintainability**: Having a centralized list of tainted fields makes it
  easier to manage and update which fields should be considered sensitive.
- **Readability**: The use of utility types and constants makes the code more
  readable and the intentions behind the sanitization process clearer.

This approach ensures that sensitive information is handled securely throughout
the application, providing a robust mechanism to prevent data exposure
vulnerabilities.

---

## These features collectively contribute to a more maintainable, robust, and developer-friendly codebase. They abstract away common patterns and practices, allowing developers to focus on writing business logic rather than boilerplate code.

## 1. Configuration and Setup

- **.env.example**: Template for environment variables required by the
  application.
- **.eslintrc.json**: Configuration for ESLint to maintain code quality and
  consistency.
- **.prettierrc**: Prettier configuration for consistent code formatting.
- **.sequelizerc**: Configuration for Sequelize, a popular ORM for Node.js.
- **Dockerfile.dev**: Dockerfile for setting up the development environment.
- **docker-compose.yaml**: Docker Compose configuration to define and run
  multi-container Docker applications.
- **jest.config.js**: Configuration for Jest, a testing framework.
- **nodemon.json**: Configuration for Nodemon, a utility that monitors for
  changes in the source code and automatically restarts the server.
- **tsconfig.json**: TypeScript configuration file.
- **package.json**: Lists project dependencies and scripts.

## 2. Continuous Integration and Deployment

- **.github/workflows/test.yml**: GitHub Actions workflow for running tests to
  ensure code integrity.

## 3. Code Quality and Maintenance

- **.husky/pre-commit**: Husky configuration for enforcing quality checks before
  commits.
- **scripts/check-env-vars.js**: Script to check the availability of required
  environment variables.
- **scripts/har-to-yml.js**: Utility script to convert HAR files to YAML,
  potentially for API testing or documentation.

## 4. Source Code

- **src/**: Main directory containing the application's source code.
  - **api/**: Houses controllers, core functionalities, domain logic, and
    models.
  - **databases/**: Contains database configurations and migration scripts.
  - **lib/**: Utility functions, services, and other libraries.
  - **middlewares/**: Express middlewares for tasks like authentication, error
    handling, and validation.
  - **app.ts**: Main application file.
  - **server.ts**: Server setup and configuration.
  - **env.ts**: Manages environment variables.

## 5. Testing

- **src/api/domain/users/**tests**/usersService.test.ts**: Unit tests for the
  user service.
- **src/lib/**tests**/globalSetup.ts**: Global setup configuration for tests.

## 6. Documentation

- **README.md**: Comprehensive documentation about the project, its setup, and
  usage.
- **docs/spec.yaml**: (Possibly) OpenAPI specification for API documentation.
- **LICENSE**: Project's software license.

## 7. Utilities and Helpers

- **src/lib/debug/**: Debugging utilities.
- **src/lib/env/**: Environment-related utilities.
- **src/lib/validation/**: Validation utilities.
- **src/lib/upload/**: File upload utilities and services.
- **src/lib/db/**: Database utilities.
- **src/lib/services/**: Various services like authentication, caching, and
  more.

## 8. Caching and Uploads

- **src/lib/services/cache/**: Caching services and related decorators.
- **src/lib/upload/**: File upload services and utilities.

## 9. Miscellaneous

- **yarn.lock**: Yarn lock file to ensure consistent installation of
  dependencies.

---

Feel free to modify and expand upon this template to better suit the specifics
of your project and to provide additional information for users and
contributors.
