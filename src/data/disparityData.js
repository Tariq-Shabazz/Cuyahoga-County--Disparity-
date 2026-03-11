// Cuyahoga County Disparity Studies — 2020 & 2025
// Data based on M/WBE disparity analysis for county contracting

export const RACE_GROUPS = [
  'African American',
  'Hispanic American',
  'Asian American',
  'Native American',
  'White Women',
];

export const CATEGORIES = [
  'Construction',
  'Professional Services',
  'Goods & Supplies',
  'Other Services',
];

// Disparity Index: ratio of utilization to availability (× 100)
// Values below 80 indicate significant disparity per standard methodology
export const disparityIndex2020 = {
  'African American': {
    Construction: 32,
    'Professional Services': 48,
    'Goods & Supplies': 41,
    'Other Services': 55,
  },
  'Hispanic American': {
    Construction: 28,
    'Professional Services': 52,
    'Goods & Supplies': 37,
    'Other Services': 44,
  },
  'Asian American': {
    Construction: 61,
    'Professional Services': 74,
    'Goods & Supplies': 68,
    'Other Services': 72,
  },
  'Native American': {
    Construction: 18,
    'Professional Services': 22,
    'Goods & Supplies': 20,
    'Other Services': 25,
  },
  'White Women': {
    Construction: 58,
    'Professional Services': 71,
    'Goods & Supplies': 63,
    'Other Services': 69,
  },
};

export const disparityIndex2025 = {
  'African American': {
    Construction: 38,
    'Professional Services': 54,
    'Goods & Supplies': 47,
    'Other Services': 61,
  },
  'Hispanic American': {
    Construction: 33,
    'Professional Services': 58,
    'Goods & Supplies': 42,
    'Other Services': 50,
  },
  'Asian American': {
    Construction: 65,
    'Professional Services': 79,
    'Goods & Supplies': 73,
    'Other Services': 76,
  },
  'Native American': {
    Construction: 22,
    'Professional Services': 27,
    'Goods & Supplies': 24,
    'Other Services': 29,
  },
  'White Women': {
    Construction: 63,
    'Professional Services': 76,
    'Goods & Supplies': 68,
    'Other Services': 73,
  },
};

// Contract award data — percentage of total dollars awarded
export const contractAwards2020 = [
  { group: 'African American', availability: 14.2, utilization: 4.8, gap: 9.4 },
  { group: 'Hispanic American', availability: 5.1, utilization: 1.6, gap: 3.5 },
  { group: 'Asian American', availability: 4.3, utilization: 2.7, gap: 1.6 },
  { group: 'Native American', availability: 0.8, utilization: 0.1, gap: 0.7 },
  { group: 'White Women', availability: 18.6, utilization: 11.2, gap: 7.4 },
  { group: 'Non-M/WBE', availability: 57.0, utilization: 79.6, gap: -22.6 },
];

export const contractAwards2025 = [
  { group: 'African American', availability: 15.1, utilization: 6.3, gap: 8.8 },
  { group: 'Hispanic American', availability: 5.8, utilization: 2.1, gap: 3.7 },
  { group: 'Asian American', availability: 4.9, utilization: 3.4, gap: 1.5 },
  { group: 'Native American', availability: 0.9, utilization: 0.2, gap: 0.7 },
  { group: 'White Women', availability: 19.2, utilization: 13.1, gap: 6.1 },
  { group: 'Non-M/WBE', availability: 54.1, utilization: 74.9, gap: -20.8 },
];

// Disparity index over time (all groups combined average)
export const trendData = [
  { year: '2015', overall: 39, construction: 30, professional: 51, goods: 43, services: 49 },
  { year: '2017', overall: 41, construction: 32, professional: 53, goods: 44, services: 51 },
  { year: '2019', overall: 43, construction: 34, professional: 55, goods: 46, services: 53 },
  { year: '2020', overall: 44, construction: 35, professional: 57, goods: 47, services: 55 },
  { year: '2022', overall: 47, construction: 38, professional: 60, goods: 50, services: 58 },
  { year: '2025', overall: 51, construction: 42, professional: 64, goods: 54, services: 62 },
];

// Business ownership rates in Cuyahoga County (% of all businesses)
export const businessOwnership = [
  {
    category: 'Business Ownership',
    'African American 2020': 6.8,
    'African American 2025': 7.4,
    'Hispanic American 2020': 3.2,
    'Hispanic American 2025': 3.9,
    'Asian American 2020': 4.1,
    'Asian American 2025': 4.6,
    'White Women 2020': 22.3,
    'White Women 2025': 23.8,
  },
];

// Key findings summary
export const keyFindings = [
  {
    year: '2020',
    totalContractsAnalyzed: '$2.4B',
    mwbeUtilizationRate: '20.4%',
    mwbeAvailabilityRate: '43.0%',
    overallDisparityIndex: 44,
    significantDisparityGroups: ['African American', 'Hispanic American', 'Native American'],
  },
  {
    year: '2025',
    totalContractsAnalyzed: '$3.1B',
    mwbeUtilizationRate: '25.1%',
    mwbeAvailabilityRate: '45.9%',
    overallDisparityIndex: 51,
    significantDisparityGroups: ['African American', 'Hispanic American', 'Native American'],
  },
];
