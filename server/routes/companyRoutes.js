const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  

  getCompanyStats,
  getFilterOptions
} = require('../controllers/companyController');


router.get('/', getAllCompanies);


router.get('/stats', getCompanyStats);


router.get('/filter-options', getFilterOptions);


router.get('/:id', getCompanyById);


router.post('/', createCompany);







module.exports = router;
