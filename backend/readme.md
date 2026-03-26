# Prominno Task Backend

## Tools / Libraries Used

- Node.js
- Express
- MongoDB (Mongoose)
- dotenv
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- multer (file uploads)
- pdfkit (PDF generation) - used in `utils/generatePDF.js`
- cors
- nodemon (dev)

Note: Check `package.json` for the exact versions used in this project.

---

## Project Structure

- `app.js` - main Express app setup
- `server.js` - server bootstrap
- `config/db.js` - MongoDB connection
- `controllers/` - controller logic
  - `adminController.js`
  - `authController.js`
  - `productController.js`
- `middleware/` - custom middleware
  - `authMiddleware.js` - verifies JWT and sets `req.user`
  - `errorMiddleware.js` - error handler
  - `validateMiddleware.js` - runs request validations
- `models/` - Mongoose models
  - `User.js`
  - `Product.js`
- `routes/` - Express routers
  - `adminRoutes.js`
  - `authRoutes.js`
  - `productRoutes.js`
- `utils/`
  - `generatePDF.js` - PDF helper
  - `multerConfig.js` - images uploads
  - `seedAdmin.js` - helper to create a seeded admin user
- `validations/` - request validation rules
  - `authValidation.js`
  - `productValidation.js`
  - `sellerValidation.js`

---

## Temporary Admin Credentials (for testing)

- Email: `admin@example.com`
- Password: `Admin@123` (temporary - change in production)

If `utils/seedAdmin.js` exists, run it or check the database to ensure the admin user is created.

---

## How to run (development)

1. Install dependencies:

   cd backend 
   npm install

2. Create a `.env` file in the project root with at least:

   MONGO_URI=mongodb://localhost:27017/ProminnoDB
   JWT_SECRET=your_jwt_secret
   PORT=5000

3. Start the server (development):

   npm run dev

---

## API Documentation

Notes:
- Base API path used below: `/api`
- Authorization: endpoints that modify data or view protected info require a Bearer token in the `Authorization` header: `Authorization: Bearer <token>`
- All request and response examples use JSON unless specified.


### Auth Routes

1) Login for admin (demo credentails)
- Description: Authenticate user and receive JWT
- Endpoint: `POST /api/auth/login`
- Auth: No
- Req.params: none
- Req.body (JSON):
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin123"
  }
  ```
- Response (200 success):
  ```json
  {
    "token": ".........",
    "role": "admin"
  }
  ```
- Response (401 unauthorized):
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```


### Admin Routes

(Require admin role - provide Bearer token from an admin user)

1) Create seller
- Description: Admin creates a seller user
- Endpoint: `POST /api/admin/create-seller`
- Auth: Yes (Bearer token) - admin
- Req.params: none
- Req.body (JSON):
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string (10 digits)",
    "country": ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany"],
    "state": "string",  //(required if country is India)
    "skills": ["string", "string"],
    "password": "string (min 6 chars)"
  }
  ```
- Response (201):
  ```json
  {
    "success": true,
    "data": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "country": "string",
      "state": "string",
      "skills": ["string"],
      "role": "seller",
      "createdAt": "ISODate",
      "updatedAt": "ISODate"
    }
  }
  ```

2) Get sellers
- Description: Admin gets list of sellers
- Endpoint: `GET /api/admin/sellers` 
- for pagination: `GET /api/admin/sellers?page=1`  (10 records per page)
- Auth: Yes (Bearer token) - admin
- Req.params: none
- Req.body: none
- Response (200):
  ```json
  {
    "success": true,
    "data": [
      {"_id":"...","name":"...","email":"...","role":"seller"}
    ]
  }
  ```


### Product Routes

1) Login for seller (use credentails which admin has used to create seller)
- Description: Authenticate user and receive JWT
- Endpoint: `POST /api/auth/login`
- Auth: No
- Req.params: none
- Req.body (JSON):
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response (200 success):
  ```json
  {
    "token": ".........",
    "role": "seller"
  }
  ```
- Response (401 unauthorized):
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

2) Create product
- Description: Seller creates a new product
- Endpoint: `POST /api/product`
- Auth: Yes (Bearer token) - seller (access token)
- Req.params: none
- Req.body (JSON):
  ```json
  {
    "productName": "string",
    "productDescription": "string",
    "brands": [
      {
        "brandName": "string",
        "detail": "string",
        "image": "string (url or filename)",
        "price": 100
      }
    ]
  }
  ```
- Response (201):
  ```json
  {
    "success": true,
    "data": {
      "_id": "string",
      "productName": "string",
      "productDescription": "string",
      "sellerId": "string",
      "brands": [
        {
          "brandName": "string",
          "detail": "string",
          "image": "string",
          "price": 100
        }
      ],
      "createdAt": "ISODate",
      "updatedAt": "ISODate"
    }
  }
  ```

3) Get products
- Description: Seller retrieves their products (project routes use seller auth)
- Endpoint: `GET /api/products`
- for pagination: `GET /api/product?page=1`
- Auth: Yes (Bearer token) - seller
- Req.params: none
- Req.query: optional filters/pagination depending on implementation
- Response (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "productName": "...",
        "brands": [
          {"brandName": "...", "price": 100}
        ],
        "sellerId": "..."
      }
    ]
  }
  ```

4) Delete product
- Description: Seller deletes a product by id
- Endpoint: `DELETE /api/products/:id`
- Auth: Yes (Bearer token) - seller
- Req.params:
  - `id` - product id
- Req.body: none
- Response (200):
  ```json
  {
    "success": true,
    "message": "Product deleted"
  }
  ```
- Response (404):
  ```json
  {
    "success": false,
    "message": "Product not found"
  }
  ```

5) Get product PDF
- Description: Generate or download product PDF (implementation provided by `getProductPDF` controller)
- Endpoint: `GET /api/products/:id/pdf`
- Auth: Yes (Bearer token) - seller
- Req.params:
  - `id` - product id
- Req.body: none
- Response (200):
  - Binary/pdf stream or a JSON indicating the PDF generation result depending on controller implementation. Example JSON response when returning info:
  ```json
  {
    "success": true,
    "message": "PDF generated",
    "data": {
      "productId": "string",
      "pdfUrl": "string (if uploaded/served)"
    }
  }
  ```

---
