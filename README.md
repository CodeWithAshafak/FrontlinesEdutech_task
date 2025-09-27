# Companies API Development

A comprehensive Companies API built with Node.js, Express, MongoDB, and React. This application provides a RESTful API for managing company data with advanced filtering, searching, and pagination capabilities, along with a modern React frontend.

## Features :- 

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with full CRUD operations for companies
- **Advanced Filtering** by industry, size, location, revenue, founded year, and more
- **Text Search** across company names, descriptions, and tags
- **Pagination** with configurable page sizes
- **Sorting** by multiple fields (name, industry, founded year, etc.)
- **Data Validation** with comprehensive error handling
- **Database Indexing** for optimal search performance
- **Sample Data Seeding** for development and testing

### Frontend (React.js)
- **Modern UI** built with React and Tailwind CSS
- **Dual View Modes** - Card view and Table view
- **Advanced Filter Controls** with dropdowns and search inputs
- **Real-time Search** with debounced input
- **Responsive Design** that works on all devices
- **Pagination** with intuitive navigation
- **Loading States** and error handling
- **Interactive Sorting** by clicking column headers


_**Configuration**
Environment Variables
Create a .env file in your backend folder and add:

PORT=8000

# Local MongoDB connection
DB_URL=mongodb://localhost:27017/frotlines

# MongoDB Atlas connection
DB_URL=mongodbatls_connection_string