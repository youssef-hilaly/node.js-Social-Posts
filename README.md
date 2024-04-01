**# node.js-social-app - Node.js REST API**

This project provides a Node.js application that implements a RESTful API with functionalities related to user authentication, feed management, and user status retrieval.

## Features

* Secure authentication via login and signup endpoints.
* User feed management with CRUD (Create, Read, Update, Delete) operations on posts.
* User status retrieval using a dedicated route.
* JWT (JSON Web Token) authorization for secure access to feed and user routes.
* Middleware ensures authorization checks for protected routes.
* Controller-level authorization checks for delete and edit post methods.

## Technologies

* **Backend:** Node.js (version required information can be found in `.nvmrc` or `package.json` engine section)
* **Framework:** Express.js (v4.19.2 or later)
* **Database:** Mongoose (v8.2.4 or later) (Database configuration details to be provided)
* **Authentication:** JSON Web Tokens (jsonwebtoken v9.0.2 or later)
* **Input Validation:** Express Validator (v7.0.1 or later)
* **File Upload:** Multer (v1.4.5-lts.1 or later) (Optional, if your application allows file uploads)
* **Unique Identifiers:** uuid (v9.0.1 or later)
* **Development:** Nodemon (v3.1.0 or later) (Optional, for hot reloading during development)

**Additional Dependencies:** (List any other essential dependencies not included in the provided list)

## Installation

1. **Prerequisites:** Ensure you have Node.js (version required information) and npm (or yarn) installed on your system.
2. **Clone or Download the Repository:** Clone this repository using Git or download the ZIP archive.
3. **Install Dependencies:** Navigate to the project directory and run:

   ```bash
   npm install
   ```

   (If using yarn, run `yarn install` instead.)

## Configuration

* **Database:**
  * Update the database connection details in an environment variable or configuration file (e.g., `.env`, `config.js`) according to your database provider's instructions.
  * Refer to Mongoose documentation for specific configuration requirements.
* **Authentication:** (If applicable)
  * Configure JWT secret key in an environment variable or configuration file.
  * Consider security best practices for storing sensitive information like secret keys.

## Usage

**1. Development Server:**

Start the development server using Nodemon:

```bash
npm start
```

This will start the server, typically running on port 3000 (modify if needed). Access the API endpoints at `http://localhost:3000/api` (adjust the base path if different).


## API Example

* **GET /api/feed/posts**
  * Retrieves a list of posts.
  * Authentication: Required (JWT token)
  * Response: `{ success: true, data: [post1, post2, ...] }`