# Credit Card System

A modern Angular application for managing credit cards with real-time validation and a clean, responsive UI.

![image](https://github.com/user-attachments/assets/f08f7f16-d211-4865-b9c1-4c413cf2005c)

## 🚀 Features

- **Add Credit Cards**: Form with real-time validation including Luhn 10 algorithm
- **Display Cards**: Responsive table showing all credit cards
- **Form Validation**: Client-side validation with error handling
- **Real-time Updates**: Cards list updates automatically after adding new cards
- **Error Handling**: Comprehensive error handling for network and server issues
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Spring Boot (REST API)
- **Testing**: Jasmine/Karma for unit tests
- **Styling**: CSS with Bootstrap classes
- **HTTP Client**: Angular HttpClient

## 📋 Prerequisites

- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd credit-card-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend (Spring Boot)
```bash
# Navigate to your Spring Boot project directory
cd ../your-springboot-backend

# Start the application
./mvnw spring-boot:run
# or
mvn spring-boot:run
```

The backend should be running on `http://localhost:8080`

### 4. Start the Angular Application
```bash
# In the Angular project directory
ng serve
```

The application will be available at `http://localhost:4200`

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
ng test

# Run tests in headless mode
ng test --watch=false --browsers=ChromeHeadless
```

### Integration Tests
```bash
# Make sure your Spring Boot backend is running first
ng test --include="**/*.integration.spec.ts"
```


## 🔧 Configuration

### API Configuration
The application is configured to connect to the backend at:
- **Base URL Credit Cards Endpoint**: `http://localhost:8080/api/credit-cards`



## 📝 Usage

### Adding a Credit Card
1. Fill in the cardholder name (letters and spaces only)
2. Enter the card number (13-19 digits, must pass Luhn 10 validation)
3. Set the credit limit (positive number)
4. Click "Add" to submit

### Viewing Credit Cards
- All credit cards are displayed in a responsive table
- Cards are automatically refreshed after adding new ones
- Negative balances are highlighted in red

## 🧪 Test Coverage

The application includes comprehensive unit tests covering:

- **AddCardComponent**: Form validation, Luhn 10 validation, form reset, error handling
- **GetAllCardsComponent**: Display logic, formatting functions, empty state
- **AppComponent**: Service integration, data loading, error handling
- **CreditCardService**: HTTP requests, error handling

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Backend connection error | Ensure Spring Boot is running on port 8080 |
| CORS errors | Add `@CrossOrigin` to your Spring Boot controller |
| Tests failing | Run `npm install` and ensure all dependencies are installed |
| Port conflicts | Kill processes on ports 4200 or 8080 |

### Debug Commands
```bash
# Check if backend is running
curl http://localhost:8080/api/credit-cards

# Check for port conflicts
lsof -i :8080
lsof -i :4200

# Clear Angular cache
ng cache clean
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credit-cards` | Retrieve all credit cards |
| POST | `/api/credit-cards` | Add a new credit card |

### Request/Response Format

**POST /api/credit-cards**
```json
{
  "cardHolderName": "John Doe",
  "cardNumber": "4111111111111111",
  "cardLimit": 1000
}
```

**GET /api/credit-cards**
```json
[
  {
    "id": 1,
    "cardHolderName": "John Doe",
    "cardNumber": "4111111111111111",
    "balance": 0,
    "cardLimit": 1000
  }
]
```
