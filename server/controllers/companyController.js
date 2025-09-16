const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      industry,
      size,
      city,
      state,
      country,
      foundedFrom,
      foundedTo,
      revenue,
      status = 'Active'
    } = req.query;

    // Build filter object
    const filter = {};

    // Text search across name and description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    
    if (industry) {
      filter.industry = industry;
    }

  
    if (size) {
      filter.size = size;
    }

    // Location filters
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }
    if (country) {
      filter['location.country'] = { $regex: country, $options: 'i' };
    }

    // Founded year range
    if (foundedFrom || foundedTo) {
      filter.founded = {};
      if (foundedFrom) filter.founded.$gte = parseInt(foundedFrom);
      if (foundedTo) filter.founded.$lte = parseInt(foundedTo);
    }

    if (revenue) {
      filter.revenue = revenue;
    }

    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const companies = await Company.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Company.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
};


const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company',
      error: error.message
    });
  }
};


const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message
    });
  }
};




// Get company statistics
const getCompanyStats = async (req, res) => {
  try {
    const stats = await Company.aggregate([
      {
        $group: {
          _id: null,
          totalCompanies: { $sum: 1 },
          avgFoundedYear: { $avg: '$founded' },
          industries: { $addToSet: '$industry' },
          sizes: { $addToSet: '$size' },
          cities: { $addToSet: '$location.city' },
          states: { $addToSet: '$location.state' }
        }
      },
      {
        $project: {
          _id: 0,
          totalCompanies: 1,
          avgFoundedYear: { $round: ['$avgFoundedYear', 0] },
          uniqueIndustries: { $size: '$industries' },
          uniqueSizes: { $size: '$sizes' },
          uniqueCities: { $size: '$cities' },
          uniqueStates: { $size: '$states' }
        }
      }
    ]);

    // Get industry distribution
    const industryStats = await Company.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get size distribution
    const sizeStats = await Company.aggregate([
      { $group: { _id: '$size', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        industryDistribution: industryStats,
        sizeDistribution: sizeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company statistics',
      error: error.message
    });
  }
};

// Get filter options for frontend
const getFilterOptions = async (req, res) => {
  try {
    const industries = await Company.distinct('industry');
    const sizes = await Company.distinct('size');
    const cities = await Company.distinct('location.city');
    const states = await Company.distinct('location.state');
    const countries = await Company.distinct('location.country');
    const revenues = await Company.distinct('revenue');
    const statuses = await Company.distinct('status');

    // Get founded year range
    const foundedRange = await Company.aggregate([
      {
        $group: {
          _id: null,
          minFounded: { $min: '$founded' },
          maxFounded: { $max: '$founded' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        industries: industries.sort(),
        sizes: sizes.sort(),
        cities: cities.sort(),
        states: states.sort(),
        countries: countries.sort(),
        revenues: revenues.sort(),
        statuses: statuses.sort(),
        foundedRange: foundedRange[0] || { minFounded: null, maxFounded: null }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  getCompanyStats,
  getFilterOptions
};
