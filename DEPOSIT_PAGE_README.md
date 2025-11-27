# Deposit Page System

A complete full-stack deposit page system built with React.js, Tailwind CSS, and Razorpay integration.

## Features

### Frontend Components
- **AccountSummary**: Displays user account details with balance and policy information
- **DepositAmount**: Amount input with validation and quick selection buttons
- **PaymentMethod**: Multiple payment options (UPI, Cards, Net Banking, etc.)
- **ReviewSummary**: Transaction summary with terms acceptance
- **PaymentSuccess**: Success page with transaction details and receipt download
- **PaymentFailure**: Error handling with retry options
- **TransactionHistory**: Complete transaction history with filtering and pagination
- **SecuritySection**: Security information and FAQ

### Key Features
- ✅ Real-time form validation
- ✅ Multiple payment methods support
- ✅ Razorpay payment gateway integration
- ✅ Responsive mobile-first design
- ✅ Transaction history with filtering
- ✅ PDF receipt generation
- ✅ Error handling and retry mechanisms
- ✅ Loading states and user feedback
- ✅ Security badges and trust indicators

## Technology Stack

- **Frontend**: React.js with Hooks
- **Styling**: Tailwind CSS
- **Validation**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Payment Gateway**: Razorpay
- **State Management**: React Context API

## API Endpoints

The system expects these backend endpoints:

```
GET  /api/user/account-summary     - Get user account details
POST /api/deposit/validate         - Validate deposit amount
POST /api/deposit/initiate         - Initiate payment with Razorpay
POST /api/deposit/callback         - Handle payment callback
GET  /api/transactions             - Get transaction history
GET  /api/transaction/:id          - Get specific transaction
GET  /api/transaction/:id/receipt  - Download transaction receipt
```

## Environment Variables

Create a `.env` file in the project root with:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Note**: This project uses Vite, so environment variables must be prefixed with `VITE_` instead of `REACT_APP_`.

## Usage

1. Import the component:
```jsx
import DepositPage from './pages/Deposite';
```

2. Use in your routing:
```jsx
<Route path="/deposit" component={DepositPage} />
```

## Payment Flow

1. User enters deposit amount
2. Selects payment method
3. Reviews transaction summary
4. Confirms payment
5. Razorpay payment modal opens
6. User completes payment
7. Success/failure page displayed
8. Transaction added to history

## Customization

- Update colors in Tailwind classes
- Modify validation rules in `depositSchema`
- Add new payment methods in `PaymentMethod` component
- Customize API endpoints in `apiService`

## Security Features

- SSL encryption indicators
- PCI DSS compliance badges
- Secure payment processing
- Input validation and sanitization
- Error handling without exposing sensitive data

## Mobile Responsiveness

- Mobile-first design approach
- Responsive grid layouts
- Touch-friendly buttons
- Optimized for all screen sizes
