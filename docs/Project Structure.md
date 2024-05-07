# Project Structure

![Clean Code Architecture ](clean%20architecture%20call%20flow.png) 

1. [Call Flow](#call-flow)
2. [Architecture Layers](#architecture-layers)
    - [Routes](#routes)
    - [Controllers](#controllers)
      - [Validation Schema](#validation-schema)
    - [Routes](#routes)
    - [Use Cases](#use-cases)
    - [Repositories](#repositories)

This project follows [Clean Code Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

Basically, the idea here is to isolate all working parts of the codebase. It emphasizes the idea that different parts of the application should have clearly defined responsibilities and should be independent of each other.

Some benefits of using clean code architecture;

1. **Modularity**: Clean Code Architecture promotes modular design, making it easier to understand, maintain, and extend the codebase.
2. **Testability**: The architecture encourages writing testable code by separating business logic from external dependencies, enabling comprehensive unit testing.
3. **Scalability**: Clean Code Architecture allows for scalability by providing clear boundaries between different layers of the application, making it easier to add or modify functionality.
4. **Code Reusability**: The architecture promotes reusable code components, reducing duplication and improving development efficiency.
5. **Maintainability**: With its emphasis on separation of concerns, Clean Code Architecture enhances code maintainability, making it easier to identify and fix issues or add new features.  
  
  

## Call Flow
The data flows like;

`Routes -> Controllers -> Use Cases -> Entities -> Repositories -> Models -> DB`.

Otherwise, the arrows that you see in the image above how each layer is dependent on another.

- `Routes` are dependent on `Controllers`
- `Controllers` are dependent on `Use Cases`
- `Use Cases` are dependent on `Entities`
- `Repositories` are dependent on `DB` or other connections to data sources

## Architecture Layers

### Routes
`Routes` are the main access of the presentation layers *(in our case, the nurse dashboard and mobile apps)*. They are directly dependent to `Controllers`.

```typescript
class NurseRoutes {
  // this.router
  public router: Router;

  // this is type of controller to be used
  private _nurseController: NurseController;

  constructor(nurseController: NurseController) {
    // initiate express router
    this.router = Router();

    // localize the nurse controller passed to this route
    this._nurseController = nurseController;

    // initialize the routes and the functions from the controller
    this._initiateRoutes();
  }

  _initiateRoutes(): void {
    // initialize routes like how you initialize routes
    // on your express app
    // https://expressjs.com/en/starter/basic-routing.html

    /*
     * @route: POST /nurses
     */
    this.router.post(
      '/nurses',
      validate(this._nurseController.createNurseSchema),
      this._nurseController.createNurse
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

//
// To use this route in src/app.ts
// Assuming we have nurseController initialized already

const nurseRoutes = new NurseRoutes(nurseController);
app.use('/v1', nurseRoutes.getRouter());

```
---
### Controllers
`Controllers` serve as the intermediary between the `routes` and the `use cases`. They handle the incoming requests, validate the data, and invoke the appropriate use case to perform the required business logic. Controllers help in keeping the routes clean and decoupled from the business logic, promoting separation of concerns and maintainability.


> **⚠️ IMPORTANT NOTE ⚠️**:
> 
> `Controller's` main and **ONLY** purpose is to orchestrate different use cases. We also validate and clean data in controllers before passing to services.

```typescript
class NurseController {
  private _nurseService: NurseService;

  constructor(nurseService: NurseService) {
    this._nurseService = nurseService
  }

  public createNurse = async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, password, isAdmin, facilityId } =
        req.body;

      const nurse = await this._nurseService.createNurse({
        email,
        firstName,
        lastName,
        password,
        isAdmin,
        facilityId,
      });

      return res.status(201).json(nurse);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
}

// the createNurse function is then called in the routes
// nurseRoute.ts
...
...
this.router.post(
      '/nurses',
      validate(this._nurseController.createNurseSchema),
      this._nurseController.createNurse
    );
...
...


// To use this controler in src/app.ts
// Assuming we have nurseService initialized already
const nurseController = new NurseController(nurseService);

// inject the controller instance into nurseRoutes
const nurseRoutes = new NurseRoute(nurseController);
```

#### Validation Schema
Aside from the functions under the controller, we also initialize the validation schema in here as 
well.

```typescript
//
// nurseController.ts
constructor(nurseService: NurseService) {
    this._nurseService = nurseService;

    // This is the validation schema for the createNurse method
    // which is used in the validate middleware in
    // src/middleware/express-validator.ts
    this.createNurseSchema = z.object({
      body: z.object({
        email: z
          .string({
            required_error: 'Email is required',
          })
          .email({
            message: 'Please provide a valid email address',
          }),
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
        password: z.string({
          required_error: 'Password is required',
        }),
        facilityId: z.number({
          required_error: 'Facility ID is required',
        }).optional(),
      }),
    });
  }

// the validation schema is then used in middleware
// nurseRoute.ts
this.router.post(
  '/nurses',
   // the validation schema is called here
   // it is using zod to validate the values
  validate(this._nurseController.createNurseSchema),
  this._nurseController.createNurse
);
```

---

### Use Cases
In clean code, `use cases` represent the specific actions or operations that can be performed within a software system. They **encapsulate the business logic** and define the behavior of the system in response to different user interactions or external events. Use cases help to organize and structure the codebase by separating the application's functionality into distinct, reusable units.

By defining use cases, developers can focus on implementing specific features or requirements in a modular and testable manner. Each use case typically represents a single, well-defined task or user goal, making it easier to understand, maintain, and extend the codebase over time.

Use cases also promote the principles of separation of concerns and single responsibility, as they encapsulate the necessary logic for a specific action or operation. This helps to keep the codebase clean, readable, and maintainable, as each use case is responsible for a specific task and can be easily tested in isolation.


> **⚠️ IMPORTANT NOTE ⚠️**:
> 
> `Use Case's` main and **ONLY** purpose is to orchestrate different `repositories` and pass back the data to `controllers`.

```typescript
// nurseService.ts
class NurseService {
  private _nurseRepository: NurseRepository;

  constructor(nurseRepository: NurseRepository) {
    this._nurseRepository = nurseRepository;
  }

  async createNurse(nurseData) {
    const nurse = await this._nurseRepository.createNurse();

    return nurse;
  }
}

// To use this controler in src/app.ts
// Assuming we have nurseRepository initialized already
const nurseService = new NurseService(nurseRepository);

// the service is then injected to the controller
const controller = new NurseController(nurseService);
```

### Repositories
`Repositories` are responsible for handling data access and persistence. They provide an abstraction layer between the application's business logic and the underlying data storage, such as a database or external API.

Repositories encapsulate the logic for querying, creating, updating, and deleting data entities. They abstract away the specific details of the data storage implementation, allowing the rest of the application to work with a consistent interface.

By using repositories, the application's business logic remains decoupled from the data storage implementation. This promotes modularity, testability, and maintainability. It also allows for easier switching or swapping of data storage technologies without affecting the rest of the application.

> **⚠️ IMPORTANT NOTE ⚠️**:
> 
> `Repostory's` main and **ONLY** purpose is to `query`, `create`, `update`, `delete` data entities.

```typescript
class NurseRepository {
  constructor() {
    private _nurseModel = NurseModel;
  }

  async createNurse(createNurseProps: CreateNurseProps): Promise<NurseDTO> {
    const { email, firstName, lastName, passwordHash, isAdmin, facilityId } =
      createNurseProps;

    const nurse = await this._nurseModel.create({
      email,
      last_name: lastName,
      first_name: firstName,
      password_hash: passwordHash,
      is_admin: isAdmin,
      facility_id: facilityId,
    });

    return nurse.toDTO();
  }
}
```