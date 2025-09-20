# MediPulse API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/auth`)

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "admin" | "doctor" | "patient",
  "firebaseUid": "string" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "string"
  },
  "token": "string"
}
```

#### POST `/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "string"
  },
  "token": "string"
}
```

#### POST `/auth/forgot-password`
Send password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Patient Routes (`/patients`)

#### POST `/patients`
Create a new patient. (Admin, Doctor only)

**Request Body:**
```json
{
  "digitalHealthId": "string",
  "name": "string",
  "contact": "string",
  "age": "number",
  "gender": "Male" | "Female" | "Other",
  "address": {
    "state": "string",
    "region": "string",
    "locality": "string"
  },
  "healthCategory": "string",
  "medicalHistory": [
    {
      "condition": "string",
      "diagnosisDate": "string",
      "treatment": "string"
    }
  ],
  "allergies": ["string"],
  "medications": [
    {
      "name": "string",
      "dosage": "string",
      "frequency": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "_id": "string",
    "digitalHealthId": "string",
    "name": "string",
    "contact": "string",
    "age": "number",
    "gender": "string",
    "address": "object",
    "healthCategory": "string",
    "medicalHistory": "array",
    "allergies": "array",
    "medications": "array",
    "createdAt": "string"
  }
}
```

#### GET `/patients`
Get all patients. (Admin, Doctor only)

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of patients per page
- `search` (optional): Search term for name or digitalHealthId

**Response:**
```json
{
  "success": true,
  "patients": [
    {
      "_id": "string",
      "digitalHealthId": "string",
      "name": "string",
      "contact": "string",
      "age": "number",
      "gender": "string",
      "address": "object",
      "healthCategory": "string",
      "createdAt": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "pages": "number"
}
```

#### GET `/patients/:id`
Get patient by ID. (Admin, Doctor, Patient - own record only)

**Response:**
```json
{
  "success": true,
  "patient": {
    "_id": "string",
    "digitalHealthId": "string",
    "name": "string",
    "contact": "string",
    "age": "number",
    "gender": "string",
    "address": "object",
    "healthCategory": "string",
    "medicalHistory": "array",
    "allergies": "array",
    "medications": "array",
    "createdAt": "string"
  }
}
```

#### PUT `/patients/:id`
Update patient. (Admin, Doctor only)

**Request Body:** Same as POST `/patients`

**Response:**
```json
{
  "success": true,
  "patient": "object"
}
```

#### DELETE `/patients/:id`
Delete patient. (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

### Search Routes (`/search`)

#### GET `/search`
Search patients by various criteria. (Admin, Doctor only)

**Query Parameters:**
- `state` (optional): Filter by state
- `region` (optional): Filter by region
- `category` (optional): Filter by health category
- `search` (optional): General search term
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "patients": "array",
  "total": "number",
  "page": "number",
  "pages": "number"
}
```

### Emergency Routes (`/emergency`)

#### POST `/emergency`
Create emergency request. (All roles)

**Request Body:**
```json
{
  "patient": "string", // Patient ID
  "location": "string",
  "state": "string",
  "region": "string",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "emergency": {
    "_id": "string",
    "patient": "string",
    "location": "string",
    "state": "string",
    "region": "string",
    "status": "Pending",
    "priority": "string",
    "reportedAt": "string",
    "notes": "string"
  }
}
```

#### GET `/emergency`
Get all emergencies. (Admin, Doctor only)

**Query Parameters:**
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "emergencies": "array",
  "total": "number",
  "page": "number",
  "pages": "number"
}
```

#### GET `/emergency/:id`
Get emergency by ID. (All roles)

**Response:**
```json
{
  "success": true,
  "emergency": "object"
}
```

#### PUT `/emergency/:id`
Update emergency status. (Admin, Doctor only)

**Request Body:**
```json
{
  "status": "Acknowledged" | "Dispatched" | "Resolved" | "Cancelled",
  "assignedTo": "string", // User ID
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "emergency": "object"
}
```

#### DELETE `/emergency/:id`
Delete emergency. (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Emergency deleted successfully"
}
```

### AI Routes (`/ai`)

#### POST `/ai/summarize`
Summarize medical report. (Doctor, Admin only)

**Request Body:**
```json
{
  "reportContent": "string",
  "patientId": "string" // optional
}
```

**Response:**
```json
{
  "success": true,
  "summaryText": "string",
  "glossary": [
    {
      "term": "string",
      "explanation": "string"
    }
  ],
  "disclaimer": "string"
}
```

#### POST `/ai/explain`
Explain medical term. (All roles)

**Request Body:**
```json
{
  "term": "string"
}
```

**Response:**
```json
{
  "success": true,
  "explanation": "string",
  "disclaimer": "string"
}
```

#### POST `/ai/faq`
Answer patient FAQ. (All roles)

**Request Body:**
```json
{
  "question": "string",
  "patientId": "string" // optional
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "disclaimer": "string"
}
```

#### POST `/ai/predict`
Predict health analytics. (Admin, Doctor only) - Roadmap feature

**Request Body:**
```json
{
  "patientId": "string",
  "dataType": "string"
}
```

**Response:**
```json
{
  "success": true,
  "predictions": "object",
  "confidence": "number",
  "disclaimer": "string"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["array of validation errors"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Rate Limiting

- AI endpoints: 10 requests per minute per user
- Other endpoints: 100 requests per minute per user

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

## Data Models

### User
```typescript
{
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'doctor' | 'patient';
  firebaseUid?: string;
  createdAt: Date;
}
```

### Patient
```typescript
{
  _id: string;
  digitalHealthId: string;
  user?: string; // User ID
  name: string;
  contact?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  address?: {
    state?: string;
    region?: string;
    locality?: string;
  };
  healthCategory?: string;
  medicalHistory?: Array<{
    condition: string;
    diagnosisDate: Date;
    treatment: string;
  }>;
  allergies?: string[];
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
  }>;
  createdAt: Date;
}
```

### Emergency
```typescript
{
  _id: string;
  patient: string; // Patient ID
  location: string;
  state?: string;
  region?: string;
  status: 'Pending' | 'Acknowledged' | 'Dispatched' | 'Resolved' | 'Cancelled';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  reportedAt: Date;
  resolvedAt?: Date;
  notes?: string;
  assignedTo?: string; // User ID
}
```

### Summary
```typescript
{
  _id: string;
  patient: string; // Patient ID
  uploader?: string; // User ID
  originalRef?: string;
  summaryText: string;
  glossary?: Array<{
    term: string;
    explanation: string;
  }>;
  aiModel?: string;
  metadata?: {
    uploadDate?: Date;
    reportType?: string;
    originalFileName?: string;
  };
}
```

## Testing

Use tools like Postman or curl to test the API endpoints. Make sure to:

1. Register a user first
2. Use the returned JWT token for authenticated requests
3. Test different user roles for authorization
4. Verify error handling with invalid data

## Support

For API support and questions, please contact the development team.
