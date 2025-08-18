# Micromax Product Catalogue

A comprehensive product catalog application for browsing and searching Micromax technology solutions and components.

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite + Material-UI
- **Backend**: Node.js + Express
- **Database**: MySQL with Sequelize ORM
- **Storage**: AWS S3 for images and datasheets
- **Styling**: Custom CSS + Material-UI theme

## ⚙️ Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- MySQL database
- AWS S3 bucket for assets

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```powershell
git clone <repository-url>
cd micromax-product-catalogue

# Install backend dependencies
yarn install

# Install frontend dependencies
cd frontend
yarn install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# Environment
NODE_ENV=development
```

### 3. Database Setup

```powershell
# Create your MySQL database
# Import your product data into the 'product' table
```

Expected database schema:

- `model_number` - Product model identifier
- `description` - Product description
- `category` - Product category
- `subcategory` - Product subcategory (optional)
- `brand` - Product brand (optional)
- `images` - S3 URL for product images
- `datasheets` - S3 URL for product datasheets
- `data_hash` - Unique identifier hash
- `last_modified` - Last update timestamp

### 4. AWS S3 Configuration

Your S3 bucket must be configured with proper CORS settings for image loading.

#### S3 CORS Configuration

Navigate to your S3 bucket → Permissions → CORS and add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "http://catalog.int.micromax.com.au",
      "https://catalog.int.micromax.com.au",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
```

#### S3 Bucket Policy (for public image access)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::micromax-product-catalogue/images/*"
    }
  ]
}
```

## 🚀 Running the Application

### Development Mode

```powershell
# Start backend server (runs on port 6000)
yarn dev

# In a new terminal, start frontend (runs on port 5173)
cd frontend
yarn dev
```

### Production Mode

```powershell
# Build frontend
cd frontend
yarn build
cd ..

# Start production server
yarn start
```

The application will be available at:

- **Development**: http://localhost:5173
- **Production**: http://localhost:6000

## 🔧 API Endpoints

### Products API

- `GET /api/products` - Get all products with optional filters
  - Query parameters:
    - `model_number` - Filter by model number (partial match)
    - `category` - Filter by category (partial match)
    - `description` - Filter by description (partial match)

Example: `/api/products?category=Electronics&model_number=AS07`

## 🎨 Features

- **Product Search**: Search by model number, description, or specifications
- **Category Filtering**: Filter products by category and subcategory
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Image Display**: Product images loaded from S3 with fallback placeholders
- **Datasheet Downloads**: Direct links to product documentation
- **Modern UI**: Clean, professional interface with Material-UI components

## 🚨 Important CORS Troubleshooting

### Common Issue: Images Not Loading

**Symptoms**: Console shows CORS errors like:

```
Access to image at 'https://micromax-product-catalogue.s3.ap-southeast-2.amazonaws.com/...'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solution**:

1. Verify S3 CORS configuration is applied correctly
2. **Always perform a hard refresh** when testing CORS changes:
   - **Windows/Linux**: `Ctrl + Shift + R`
   - **Mac**: `Cmd + Shift + R`

**Why Hard Refresh is Needed**:

- Browsers cache CORS preflight responses and failed image requests
- Normal refresh doesn't clear these specific caches
- Hard refresh forces fresh network requests and bypasses cache

### Testing CORS Configuration

Test directly in browser console:

```javascript
fetch(
  "https://micromax-product-catalogue.s3.ap-southeast-2.amazonaws.com/images/test-image.png"
)
  .then((response) => console.log("CORS working!", response))
  .catch((error) => console.log("CORS blocked:", error));
```

## 📦 Deployment

### Production Build

```powershell
cd frontend
yarn build
cd ..
```

### Environment Variables for Production

Update your production environment with:

- Database connection details
- NODE_ENV=production
- Any additional production-specific configurations

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (including hard refresh for any CORS-related changes)
4. Submit a pull request

**Note**: Always remember to perform a hard refresh (`Ctrl+Shift+R`) when testing changes related to CORS, image loading, or caching to ensure you're seeing the latest configuration in effect.
