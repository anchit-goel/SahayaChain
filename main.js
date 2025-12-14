// SHARED JAVASCRIPT FOR SAHAYACHAIN WEBSITE

// Toggle mobile navigation menu
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

// Add background to navbar on scroll
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Scroll-triggered animations
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
  });
}

// Initialize all common functions
function initCommon() {
  // Add scroll event listener for navbar
  window.addEventListener('scroll', handleNavbarScroll);
  
  // Initialize animations if elements exist
  if (document.querySelector('.animate')) {
    initAnimations();
  }
  
  // Update navigation based on login status
  updateNavigation();
  
  // Add any additional initialization here
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initCommon();
  
  // Check login status on every page load
  updateNavigation();
});

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Form validation helper
function validateForm(formId, validationRules) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  let isValid = true;
  
  for (const field in validationRules) {
    const input = form.querySelector(`#${field}`);
    const rule = validationRules[field];
    
    if (input) {
      if (rule.required && !input.value.trim()) {
        isValid = false;
        highlightError(input, rule.errorMessage || 'This field is required');
      } else if (rule.pattern && !rule.pattern.test(input.value.trim())) {
        isValid = false;
        highlightError(input, rule.errorMessage || 'Invalid format');
      } else {
        removeError(input);
      }
    }
  }
  
  return isValid;
}

// Helper functions for form validation
function highlightError(input, message) {
  // Remove any existing error
  removeError(input);
  
  // Add error class to input
  input.classList.add('error');
  
  // Create and append error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  input.parentNode.appendChild(errorDiv);
}

function removeError(input) {
  input.classList.remove('error');
  const errorMessage = input.parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Export functions for use in other scripts
window.SahayaChain = {
  toggleMenu,
  handleNavbarScroll,
  initAnimations,
  validateForm
};

// API Configuration
const API_URL = 'http://localhost:5000/api';

// Authentication Functions
/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isLoggedIn() {
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');
  
  // Log detailed information about login status
  console.log('Checking login status:');
  console.log('- Token exists:', !!token);
  console.log('- User data exists:', !!userData);
  
  // Check if both token and user data exist
  return !!token && !!userData;
}

/**
 * Get logged in user data
 * @returns {object|null} User data object or null if not logged in
 */
function getLoggedInUser() {
  try {
    if (!isLoggedIn()) {
      return null;
    }
    
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.warn('User data not found in localStorage');
      return null;
    }
    
    // Attempt to parse user data
    const user = JSON.parse(userData);
    
    // Ensure user object has an ID
    if (!user || (!user._id && !user.id)) {
      console.warn('User object missing ID field:', user);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting logged in user:', error);
    return null;
  }
}

function getToken() {
  // For backward compatibility, check both token and userData
  const directToken = localStorage.getItem('token');
  if (directToken) return directToken;

  // Try to get token from userData if available
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      return parsedData.token || null;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

function getUserData() {
  const userData = localStorage.getItem('userData');
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Standardize logout functionality
function logoutUser() {
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to home page after logout
  window.location.href = 'index-in.html';
}

// Update navigation based on login status
function updateNavigation() {
  const isUserLoggedIn = isLoggedIn();
  
  // Handle login/logout links specifically
  const loginLinks = document.querySelectorAll('#loginLink');
  const logoutLinks = document.querySelectorAll('#logoutLink');
  const dashboardLinks = document.querySelectorAll('#dashboardLink');
  
  if (isUserLoggedIn) {
    // Hide login links
    loginLinks.forEach(link => {
      if (link) link.style.display = 'none';
    });
    
    // Show logout and dashboard links
    logoutLinks.forEach(link => {
      if (link) link.style.display = 'block';
    });
    
    dashboardLinks.forEach(link => {
      if (link) link.style.display = 'block';
    });
  } else {
    // Show login links
    loginLinks.forEach(link => {
      if (link) link.style.display = 'block';
    });
    
    // Hide logout and dashboard links
    logoutLinks.forEach(link => {
      if (link) link.style.display = 'none';
    });
    
    dashboardLinks.forEach(link => {
      if (link) link.style.display = 'none';
    });
  }
}

// API Request Helper
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    // Check if we're in development mode (localhost)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         !API_URL.includes('https://');
    
    // For mobile development/testing, use mock data to avoid network errors
    if (isDevelopment && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      console.log('DEV MODE (Mobile): Using mock response for', endpoint);
      // Add fake delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock responses based on endpoint
      if (endpoint.includes('/auth/send-otp')) {
        return {
          success: true,
          message: 'OTP sent successfully',
          data: { phone: data?.phone || '9876543210' }
        };
      }
      
      if (endpoint.includes('/auth/verify-otp')) {
        // Mock user data for testing
        return {
          success: true,
          token: 'mock-jwt-token-for-testing',
          data: {
            id: 'test-user-123',
            name: 'Test User',
            email: 'test@example.com',
            phone: data?.phone || '9876543210',
            role: 'borrower'
          }
        };
      }
      
      // For other endpoints, return a generic success response
      return {
        success: true,
        data: {}
      };
    }
    
    // Real API request for production or non-mobile development
    const url = `${API_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (isLoggedIn()) {
      options.headers['Authorization'] = `Bearer ${getToken()}`;
    }
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }
    
    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Check if it's a network connectivity issue
    if (!navigator.onLine || error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}

// Authentication API Calls
async function loginUser(credentials) {
  try {
    const response = await apiRequest('/auth/login', 'POST', credentials);
    
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Send OTP for verification
 * @param {string} phone - The phone number to send OTP to
 * @returns {Promise<object>} - Success status and message
 */
async function sendOTP(phone) {
  try {
    console.log('Sending OTP to phone:', phone);
    
    // Check if we're in development mode (localhost)
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          !window.location.hostname.includes('.');
    
    if (isDevelopment) {
      console.log('DEV MODE: Using mock OTP 123456');
      // For development & testing - simulate API response
      sessionStorage.setItem('phone', phone);
      
      // Store last OTP request timestamp to prevent abuse
      localStorage.setItem('lastOtpRequest', Date.now());
      
      // Add fake delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Return mock success response
      return {
        success: true,
        message: 'OTP sent successfully',
        data: { phone }
      };
    }
    
    // Check for rapid OTP requests (potential abuse)
    const lastOtpRequest = localStorage.getItem('lastOtpRequest');
    if (lastOtpRequest) {
      const timeSinceLastRequest = Date.now() - parseInt(lastOtpRequest);
      
      // If less than 30 seconds since last request
      if (timeSinceLastRequest < 30000) {
        console.warn('Potential OTP abuse detected - requests too frequent');
        throw new Error(`Please wait ${Math.ceil((30000 - timeSinceLastRequest)/1000)} seconds before requesting another OTP`);
      }
    }
    
    // Production mode - make actual API call
    const response = await apiRequest('/auth/send-otp', 'POST', { phone });
    
    // Store last OTP request timestamp to prevent abuse
    localStorage.setItem('lastOtpRequest', Date.now());
    
    if (response.success) {
      // Store phone in session storage for verification page
      sessionStorage.setItem('phone', phone);
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error(error.message || 'Service unavailable. Please try again later.');
  }
}

/**
 * Verify OTP entered by user
 * @param {object} data - Contains phone and OTP to verify
 * @returns {Promise<object>} - User data after successful verification
 */
async function verifyOTP(data) {
  try {
    console.log('Verifying OTP for phone:', data.phone);
    
    // Input validation
    if (!data.phone) {
      throw new Error('Phone number is required');
    }
    
    if (!data.otp) {
      throw new Error('OTP is required');
    }
    
    // Check OTP format (6 digits)
    if (!/^\d{6}$/.test(data.otp)) {
      console.warn('Invalid OTP format detected');
      throw new Error('Invalid OTP format. Please enter a 6-digit code.');
    }
    
    // Check if we're in development mode (localhost) or if dev mode is enabled in sessionStorage
    const isDevMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     !window.location.hostname.includes('.') ||
                     sessionStorage.getItem('devMode') === 'true';
    
    if (isDevMode) {
      console.log('DEV MODE: Bypassing OTP verification');
      // For development & testing - auto-verify if using test OTP 123456
      const mockOTP = '123456';
      
      // If OTP doesn't match development code, return error
      if (data.otp && data.otp !== mockOTP) {
        throw new Error('Invalid OTP. Use 123456 for testing.');
      }
      
      // Add minimal delay to simulate network request (reduced from 800ms to 200ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check for suspicious behavior patterns
      const otpAttempts = parseInt(localStorage.getItem('otpAttempts') || '0');
      localStorage.setItem('otpAttempts', '0'); // Reset on success
      
      // Mock user data for testing
      const mockUserData = {
        id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
        phone: data.phone || '9876543210',
        role: 'borrower',
        verified: true
      };
      
      // Store mock token and user data
      localStorage.setItem('userToken', 'mock-jwt-token-for-testing');
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Record successful verification
      recordLoginActivity('success', data.phone);
      
      return mockUserData;
    }
    
    // Track OTP verification attempts for fraud detection
    const otpAttempts = parseInt(localStorage.getItem('otpAttempts') || '0');
    localStorage.setItem('otpAttempts', (otpAttempts + 1).toString());
    
    // If too many failed attempts, add a delay
    if (otpAttempts >= 3) {
      const delayTime = Math.min(30000, 5000 * (otpAttempts - 2)); // Incremental delay
      await new Promise(resolve => setTimeout(resolve, delayTime));
    }
    
    // Production mode - make actual API call
    const response = await apiRequest('/auth/verify-otp', 'POST', data);
    
    if (response.success) {
      // Reset OTP attempts counter on success
      localStorage.setItem('otpAttempts', '0');
      
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
      
      // Record successful login for activity tracking
      recordLoginActivity('success', data.phone);
      
      return response.data;
    } else {
      // Record failed attempt for fraud detection
      recordLoginActivity('failed', data.phone);
      throw new Error(response.message || 'Invalid OTP');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    
    // Record failed attempt for fraud detection
    if (data && data.phone) {
      recordLoginActivity('failed', data.phone);
    }
    
    throw error;
  }
}

// Community API Calls
async function getCommunities(filters = {}) {
  // Check if we're in development mode (localhost)
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        !API_URL.includes('https://');
  
  if (isDevelopment) {
    console.log('DEV MODE: Using mock community data');
    // Add fake delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock community data
    const mockCommunities = [
      {
        _id: 'community-1',
        name: 'Delhi Farmers Collective',
        description: 'A group of small-scale farmers in Delhi working together for sustainable agriculture and financial inclusion.',
        location: 'Delhi, India',
        memberCount: 124,
        isVerified: true,
        image: 'c1.jpeg'
      },
      {
        _id: 'community-2',
        name: 'Mumbai Women Entrepreneurs',
        description: 'Supporting women entrepreneurs in Mumbai through microloans and business mentoring.',
        location: 'Mumbai, India',
        memberCount: 210,
        isVerified: true,
        image: 'c2.jpeg'
      },
      {
        _id: 'community-3',
        name: 'Bangalore Tech Startups',
        description: 'A community of small tech startups in Bangalore supporting each other through funding and resources.',
        location: 'Bangalore, India',
        memberCount: 89,
        isVerified: false,
        image: 'c3.jpeg'
      },
      {
        _id: 'community-4',
        name: 'Chennai Fishermen Cooperative',
        description: 'Traditional fishing families working together to improve livelihoods and sustainable fishing practices.',
        location: 'Chennai, India',
        memberCount: 156,
        isVerified: true,
        image: 'c4.jpg'
      }
    ];
    
    // Filter the mock data based on the provided filters
    let filteredCommunities = [...mockCommunities];
    
    if (filters.location) {
      filteredCommunities = filteredCommunities.filter(community => 
        community.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.search) {
      filteredCommunities = filteredCommunities.filter(community => 
        community.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        community.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.memberCount) {
      switch (filters.memberCount) {
        case 'small':
          filteredCommunities = filteredCommunities.filter(community => community.memberCount < 50);
          break;
        case 'medium':
          filteredCommunities = filteredCommunities.filter(community => 
            community.memberCount >= 50 && community.memberCount < 200
          );
          break;
        case 'large':
          filteredCommunities = filteredCommunities.filter(community => community.memberCount >= 200);
          break;
      }
    }
    
    if (filters.isVerified) {
      const isVerified = filters.isVerified === 'true';
      filteredCommunities = filteredCommunities.filter(community => 
        community.isVerified === isVerified
      );
    }
    
    return filteredCommunities;
  }
  
  // Production mode - make actual API call
  const queryParams = new URLSearchParams();
  
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.memberCount) queryParams.append('memberCount', filters.memberCount);
  if (filters.isVerified) queryParams.append('isVerified', filters.isVerified);
  if (filters.search) queryParams.append('search', filters.search);
  
  const endpoint = `/communities?${queryParams.toString()}`;
  return apiRequest(endpoint);
}

async function getCommunityById(communityId) {
  return apiRequest(`/communities/${communityId}`);
}

/**
 * Join a community
 * @param {string} communityId - The ID of the community to join
 * @returns {Promise<object>} - Success status and message
 */
async function joinCommunity(communityId) {
  if (!communityId) {
    console.error('Community ID is required');
    return { success: false, message: 'Community ID is required' };
  }
  
  if (!isLoggedIn()) {
    console.error('User must be logged in to join a community');
    return { success: false, message: 'You must be logged in to join a community' };
  }
  
  try {
    // Get current user ID
    const userId = getCurrentUserId();
    if (!userId) {
      return { success: false, message: 'User ID not found' };
    }
    
    console.log('Joining community:', communityId);
    
    // Get current community memberships
    const userCommunities = JSON.parse(localStorage.getItem('userCommunities') || '[]');
    
    // Check if user is already a member of this community
    if (userCommunities.includes(communityId)) {
      return { success: true, message: 'You are already a member of this community' };
    }
    
    // Clear previous community since we only allow one
    localStorage.setItem('userCommunities', JSON.stringify([communityId]));
    
    // Set this as the active community
    localStorage.setItem('activeCommunity', communityId);
    
    // Notify other tabs about the change
    try {
      const bc = new BroadcastChannel('community_status');
      bc.postMessage({
        type: 'communityJoined',
        communityId,
        userId
      });
      bc.close();
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
      
      // Fallback to localStorage event
      const timestamp = new Date().getTime();
      localStorage.setItem('communityStatusChange', JSON.stringify({
        type: 'joined',
        communityId,
        timestamp
      }));
    }
    
    console.log('Successfully joined community:', communityId);
    
    return { success: true, message: 'Successfully joined community' };
  } catch (error) {
    console.error('Error joining community:', error);
    return { success: false, message: 'Failed to join community: ' + (error.message || 'Unknown error') };
  }
}

/**
 * Leave a community
 * @param {string} communityId - The ID of the community to leave
 * @returns {Promise<object>} - Success status and message
 */
async function leaveCommunity(communityId) {
  if (!communityId) {
    console.error('Community ID is required');
    return { success: false, message: 'Community ID is required' };
  }
  
  if (!isLoggedIn()) {
    console.error('User must be logged in to leave a community');
    return { success: false, message: 'You must be logged in to leave a community' };
  }
  
  try {
    // Get current user ID
    const userId = getCurrentUserId();
    if (!userId) {
      return { success: false, message: 'User ID not found' };
    }
    
    console.log('Leaving community:', communityId);
    
    // Get current community memberships
    const userCommunities = JSON.parse(localStorage.getItem('userCommunities') || '[]');
    
    // Check if user is a member of this community
    if (!userCommunities.includes(communityId)) {
      return { success: false, message: 'You are not a member of this community' };
    }
    
    // Remove the community
    localStorage.setItem('userCommunities', JSON.stringify([]));
    
    // Remove active community
    localStorage.removeItem('activeCommunity');
    
    // Notify other tabs about the change
    try {
      const bc = new BroadcastChannel('community_status');
      bc.postMessage({
        type: 'communityLeft',
        communityId,
        userId
      });
      bc.close();
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
      
      // Fallback to localStorage event
      const timestamp = new Date().getTime();
      localStorage.setItem('communityStatusChange', JSON.stringify({
        type: 'left',
        communityId,
        timestamp
      }));
    }
    
    console.log('Successfully left community:', communityId);
    
    return { success: true, message: 'Successfully left community' };
  } catch (error) {
    console.error('Error leaving community:', error);
    return { success: false, message: 'Failed to leave community: ' + (error.message || 'Unknown error') };
  }
}

/**
 * Get current user ID from local storage
 * @returns {string|null} - The current user ID or null if not logged in
 */
function getCurrentUserId() {
  try {
    const user = getLoggedInUser();
    console.log('Current user for getting ID:', user);
    
    // Check if user exists and has an ID
    if (!user) {
      console.warn('No user found when getting current user ID');
      return null;
    }
    
    // Try both _id and id fields
    const userId = user._id || user.id;
    
    if (!userId) {
      console.warn('User object exists but no ID found:', user);
      return null;
    }
    
    console.log('Successfully found user ID:', userId);
    return userId;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

/**
 * Get user's trust score
 * @param {string} userId - The user ID
 * @param {string} communityId - The community ID
 * @returns {number} - The user's trust score (0-100)
 */
function getUserTrustScore(userId, communityId) {
  console.log('Getting trust score for user:', userId, 'community:', communityId);
  
  // If no userId provided, try to get current user
  if (!userId) {
    try {
      const user = getLoggedInUser();
      userId = user ? (user._id || user.id) : null;
    } catch (e) {
      console.error('Error getting logged in user:', e);
    }
  }
  
  // If still no userId, return default score
  if (!userId) {
    console.warn('No user ID provided for trust score');
    return 65; // Default score
  }
  
  try {
    // Base trust score calculation (pseudo-generator based on user ID)
    const baseScore = getBaseScore(userId);
    console.log('Base score:', baseScore);
    
    // Community-specific score
    let communityScore = 0;
    
    if (communityId) {
      // Generate a somewhat random but stable community score component based on user ID and community ID
      const combinedString = userId + communityId;
      const combinedSum = combinedString.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      communityScore = (combinedSum % 30); // 0-29 additional points
      console.log('Community score component:', communityScore, 'for community ID:', communityId);
    }
    
    // Combine scores with weights
    const combinedScore = (baseScore * 0.7) + (communityScore * 1.0);
    
    // Ensure the score is within 0-100 range
    const finalScore = Math.min(100, Math.max(0, Math.round(combinedScore)));
    
    console.log('Calculated trust score:', finalScore);
    return finalScore;
  } catch (error) {
    console.error('Error calculating trust score:', error);
    return 65; // Default fallback score
  }
}

/**
 * Get base score for a user
 * @param {string} userId - The user ID
 * @returns {number} - Base score (0-100)
 */
function getBaseScore(userId) {
  if (!userId) return 50;
  
  // Generate a somewhat random but stable score based on the user ID
  const idSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseScore = 50 + (idSum % 30); // Base score between 50-80
  
  return baseScore;
}

// Loan API Calls
async function getMyLoans() {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Check if user is logged in
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        resolve([]);
        return;
      }
      
      // Get stored loans from localStorage
      const storedLoans = localStorage.getItem('userLoans');
      const userLoans = storedLoans ? JSON.parse(storedLoans) : [];
      
      if (userLoans.length === 0) {
        // If no loans exist, provide default sample loan
        const defaultLoans = [
          {
            _id: 'loan-' + Date.now(),
            amount: 50000,
            amountRaised: 50000,
            status: 'active',
            purpose: 'Business Expansion',
            dateRequested: new Date().toISOString(),
            interestRate: 8,
            term: 12,
            community: {
              _id: 'comm1',
              name: 'Delhi Business Network'
            }
          }
        ];
        
        // Save default loans to localStorage
        localStorage.setItem('userLoans', JSON.stringify(defaultLoans));
        resolve(defaultLoans);
      } else {
        resolve(userLoans);
      }
    }, 500);
  });
}

async function getLoanById(loanId) {
  return apiRequest(`/loans/${loanId}`);
}

// Store new loan application
async function applyForLoan(loanData) {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Check if user is logged in
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        throw new Error('User not authenticated');
      }
      
      // Generate loan ID
      const loanId = 'loan-' + Date.now();
      
      // Get community details
      getCommunities().then(communities => {
        const community = communities.find(c => c._id === loanData.community);
        
        // Create new loan object
        const newLoan = {
          _id: loanId,
          amount: parseFloat(loanData.loanAmount) || 0,
          amountRaised: parseFloat(loanData.loanAmount) || 0, // Assuming fully funded for simplicity
          status: 'pending',
          purpose: loanData.purpose || 'Loan',
          dateRequested: new Date().toISOString(),
          interestRate: 8, // Default interest rate
          term: parseInt(loanData.loanTerm) || 12,
          community: {
            _id: loanData.community,
            name: community ? community.name : 'Unknown Community'
          },
          description: loanData.description || ''
        };
        
        // Get existing loans
        const storedLoans = localStorage.getItem('userLoans');
        const userLoans = storedLoans ? JSON.parse(storedLoans) : [];
        
        // Add new loan
        userLoans.push(newLoan);
        
        // Save updated loans to localStorage
        localStorage.setItem('userLoans', JSON.stringify(userLoans));
        
        // Add transaction to blockchain ledger
        try {
          const parsedUserData = JSON.parse(userData);
          const userName = parsedUserData.name || 'User';
          
          // Create transaction data for blockchain
          const transactionData = {
            transactionType: 'Loan Request',
            sender: userName,
            amount: parseFloat(loanData.loanAmount) || 0,
            status: 'Pending',
            details: {
              purpose: loanData.purpose || 'Loan',
              creditScore: 78, // Mock credit score
              requestedTerm: `${loanData.loanTerm} months`,
              requestedRate: '8%',
              loanId: loanId
            }
          };
          
          // Add to ledger
          if (community) {
            addTransactionToLedger(loanData.community, transactionData);
          }
        } catch (error) {
          console.error('Error adding transaction to ledger:', error);
          // Continue with loan creation even if ledger update fails
        }
        
        resolve(newLoan);
      });
    }, 800);
  });
}

async function getLendingOpportunities(communityId) {
  return apiRequest(`/communities/${communityId}/loans`);
}

async function fundLoan(loanId, amount) {
  return apiRequest(`/loans/${loanId}/fund`, 'POST', { amount });
}

// Chatbot API Calls
async function sendChatbotMessage(message) {
  return apiRequest('/chatbot/message', 'POST', { message });
}

async function getChatbotSuggestions() {
  return apiRequest('/chatbot/suggestions');
}

// Helper functions
async function loadCommunities(filters = {}) {
  const communitiesContainer = document.getElementById('communitiesContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorMessage = document.getElementById('errorMessage');
  const noCommunitiesMessage = document.getElementById('noCommunitiesMessage');
  
  if (!communitiesContainer) return;
  
  try {
    loadingIndicator.style.display = 'flex';
    communitiesContainer.style.display = 'none';
    errorMessage.style.display = 'none';
    noCommunitiesMessage.style.display = 'none';
    
    const communities = await getCommunities(filters);
    
    loadingIndicator.style.display = 'none';
    
    if (communities.length === 0) {
      noCommunitiesMessage.style.display = 'block';
      return;
    }
    
    communitiesContainer.innerHTML = '';
    communities.forEach(community => {
      communitiesContainer.appendChild(createCommunityCard(community));
    });
    
    communitiesContainer.style.display = 'grid';
  } catch (error) {
    loadingIndicator.style.display = 'none';
    errorMessage.textContent = error.message || 'Failed to load communities';
    errorMessage.style.display = 'block';
  }
}

function createCommunityCard(community) {
  const card = document.createElement('div');
  card.className = 'community-card';
  
  card.innerHTML = `
    <img src="${community.image || 'c1.jpeg'}" alt="${community.name}">
    <h3>${community.name}</h3>
    <p class="community-description">${community.description}</p>
    <div class="community-details">
      <span><i class="fas fa-map-marker-alt"></i> ${community.location}</span>
      <span><i class="fas fa-users"></i> ${community.memberCount} members</span>
      <span><i class="fas ${community.isVerified ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${community.isVerified ? 'Verified' : 'Unverified'}</span>
    </div>
    <button class="join-button" data-id="${community._id}">Join Community</button>
  `;
  
  const joinButton = card.querySelector('.join-button');
  joinButton.addEventListener('click', async function() {
    if (!isLoggedIn()) {
      showAlert('info', 'Please log in to join communities', function() {
        window.location.href = 'login3.html';
      });
      return;
    }
    
    try {
      await joinCommunity(community._id);
      showAlert('success', `You have joined ${community.name}`);
      joinButton.textContent = 'Joined';
      joinButton.disabled = true;
    } catch (error) {
      showAlert('error', error.message || 'Failed to join community');
    }
  });
  
  return card;
}

async function loadUserLoans() {
  const loansContainer = document.getElementById('myLoans');
  if (!loansContainer) return;
  
  try {
    loansContainer.innerHTML = '<p>Loading your loans...</p>';
    
    const loans = await getMyLoans();
    
    if (loans.length === 0) {
      loansContainer.innerHTML = '<p>You have no active loans. <a href="#apply-section">Apply for a loan</a> to get started.</p>';
      return;
    }
    
    loansContainer.innerHTML = '';
    loans.forEach(loan => {
      loansContainer.appendChild(createLoanCard(loan));
    });
  } catch (error) {
    loansContainer.innerHTML = `<p class="error">Error loading loans: ${error.message}</p>`;
  }
}

function createLoanCard(loan) {
  const card = document.createElement('div');
  card.className = 'loan-card';
  
  const statusClass = loan.status.toLowerCase();
  const progressPercentage = (loan.amountRaised / loan.amount) * 100;
  
  card.innerHTML = `
    <div class="loan-header">
      <h3>${loan.purpose}</h3>
      <span class="loan-status ${statusClass}">${loan.status}</span>
    </div>
    <div class="loan-details">
      <p><strong>Amount:</strong> ₹${loan.amount.toLocaleString()}</p>
      <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
      <p><strong>Term:</strong> ${loan.term} months</p>
      <p><strong>Community:</strong> ${loan.community.name}</p>
      <div class="funding-progress">
        <div class="progress-bar">
          <div class="progress" style="width: ${progressPercentage}%"></div>
        </div>
        <p>${progressPercentage.toFixed(1)}% funded (₹${loan.amountRaised.toLocaleString()} of ₹${loan.amount.toLocaleString()})</p>
      </div>
    </div>
    <a href="loan-details.html?id=${loan._id}" class="view-details">View Details</a>
  `;
  
  return card;
}

function initializeChatbot() {
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotForm = document.getElementById('chatbotForm');
  const suggestionsContainer = document.getElementById('chatbotSuggestions');
  
  if (!chatbotContainer || !chatbotMessages || !chatbotForm) return;
  
  // Add welcome message
  addChatbotMessage('Hello! I\'m your financial assistant. How can I help you today?', 'bot');
  
  // Load suggestions
  loadChatbotSuggestions();
  
  // Handle form submission
  chatbotForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageInput = document.getElementById('chatbotInput');
    const message = messageInput.value.trim();
    
    if (message) {
      addChatbotMessage(message, 'user');
      messageInput.value = '';
      
      try {
        const response = await sendChatbotMessage(message);
        addChatbotMessage(response.message, 'bot');
      } catch (error) {
        addChatbotMessage('Sorry, I encountered an error. Please try again later.', 'bot');
      }
    }
  });
}

async function loadChatbotSuggestions() {
  const suggestionsContainer = document.getElementById('chatbotSuggestions');
  if (!suggestionsContainer) return;
  
  try {
    const suggestions = await getChatbotSuggestions();
    
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.className = 'suggestion-button';
      button.textContent = suggestion;
      
      button.addEventListener('click', async function() {
        addChatbotMessage(suggestion, 'user');
        
        try {
          const response = await sendChatbotMessage(suggestion);
          addChatbotMessage(response.message, 'bot');
        } catch (error) {
          addChatbotMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        }
      });
      
      suggestionsContainer.appendChild(button);
    });
  } catch (error) {
    console.error('Error loading chatbot suggestions:', error);
  }
}

function addChatbotMessage(message, sender) {
  const chatbotMessages = document.getElementById('chatbotMessages');
  if (!chatbotMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${sender}`;
  messageDiv.innerHTML = `<p>${message}</p>`;
  
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showAlert(type, message, callback) {
  const alertContainer = document.createElement('div');
  alertContainer.className = `alert ${type}`;
  alertContainer.innerHTML = `
    <div class="alert-content">
      <p>${message}</p>
      <button class="alert-close">×</button>
    </div>
  `;
  
  document.body.appendChild(alertContainer);
  
  const closeButton = alertContainer.querySelector('.alert-close');
  closeButton.addEventListener('click', function() {
    alertContainer.remove();
    if (typeof callback === 'function') callback();
  });
  
  setTimeout(() => {
    alertContainer.remove();
    if (typeof callback === 'function') callback();
  }, 5000);
}

// Get user communities (for development mode)
async function getUserCommunities() {
  try {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         !API_URL.includes('https://');
    
    if (isDevelopment) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get user's joined communities from localStorage
      const userCommunities = JSON.parse(localStorage.getItem('userCommunities') || '[]');
      
      // Base mock communities
      const allCommunities = [
        {
          id: 'comm-1',
          name: 'Farmers Cooperative',
          location: 'Rural District',
          memberCount: 85,
          trustScore: 87,
          description: 'A community of farmers working together for better access to financing'
        },
        {
          id: 'comm-2',
          name: 'Women Entrepreneurs',
          location: 'Urban Center',
          memberCount: 124,
          trustScore: 92,
          description: 'Supporting women-owned businesses through microfinance'
        },
        {
          id: 'comm-3',
          name: 'Youth Development',
          location: 'Metropolitan Area',
          memberCount: 67,
          trustScore: 73,
          description: 'Helping young entrepreneurs establish businesses'
        },
        {
          id: 'comm-4',
          name: 'Artisan Collective',
          location: 'Suburban Region',
          memberCount: 42,
          trustScore: 81,
          description: 'Supporting traditional artisans with modern financial tools'
        },
        {
          id: 'comm-5',
          name: 'Tech Startups',
          location: 'Innovation Hub',
          memberCount: 56,
          trustScore: 89,
          description: 'Community for tech startups seeking microfinancing options'
        },
        {
          id: 'comm-6',
          name: 'Rural Development',
          location: 'Eastern Region',
          memberCount: 93,
          trustScore: 78,
          description: 'Supporting rural development initiatives through community financing'
        },
        {
          id: 'comm-7',
          name: 'Healthcare Professionals',
          location: 'Metro City',
          memberCount: 64,
          trustScore: 85,
          description: 'Community for healthcare professionals seeking financial collaboration'
        }
      ];
      
      // Get user data for personalized trust score calculation
      const userData = getUserData();
      const userId = userData?.id || 'demo-user-123';
      
      // If we have userCommunities, filter by joined communities
      if (userCommunities && userCommunities.length > 0) {
        // Return only the communities the user has joined
        const joinedCommunities = allCommunities.filter(community => 
          userCommunities.includes(community.id)
        );
        
        // Calculate personalized trust scores for each community
        // This creates variation in trust scores based on user ID and community
        joinedCommunities.forEach(community => {
          // Create a seed from user ID and community ID
          const seed = Array.from(`${userId}${community.id}`).reduce((sum, char) => 
            sum + char.charCodeAt(0), 0);
          
          // Generate a personalized trust score
          // Base score (60-75) + community modifier (0-10) + personal modifier (0-15)
          const baseScore = 60 + (seed % 15);
          const communityModifier = community.trustScore % 10;
          const personalModifier = (seed % community.id.length) + (userId.length % 15);
          
          // Calculate final score (capped at 100)
          const calculatedScore = Math.min(100, baseScore + communityModifier + personalModifier);
          
          // Update community trust score
          community.trustScore = calculatedScore;
          
          // Add joined timestamp if not present
          if (!community.joinedAt) {
            community.joinedAt = new Date().toISOString();
          }
        });
        
        return joinedCommunities;
      } else {
        // User hasn't joined any communities
        return [];
      }
    }
    
    // If not in development mode, make actual API call
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/communities/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
}

// Helper function to broadcast trust score updates
function broadcastTrustScoreUpdate(communityId) {
  try {
    // Save timestamp of update
    localStorage.setItem('trustScoreLastUpdate', new Date().toISOString());
    
    // Broadcast via BroadcastChannel if available
    if (window.BroadcastChannel) {
      const bc = new BroadcastChannel('trust_score_update');
      bc.postMessage({ 
        communityId, 
        action: 'update_trust_score',
        timestamp: new Date().toISOString()
      });
    }
    
    // Dispatch DOM event for real-time updates within the current page
    document.dispatchEvent(new CustomEvent('trustScoreUpdated', {
      detail: {
        communityId,
        timestamp: new Date().toISOString()
      }
    }));
  } catch (error) {
    console.error('Error broadcasting trust score update:', error);
  }
}

// Trust Score Management Functions
async function getUserTrustScore() {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         !API_URL.includes('https://');
    
    if (isDevelopment) {
      // For development & testing - simulate API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get user data to check if they have a stored trust score
      const userData = getUserData();
      const storedTrustScore = localStorage.getItem('userTrustScore');
      
      // Create a default trust score if none exists
      if (!storedTrustScore) {
        const defaultTrustScore = {
          score: 70,
          level: 'Good',
          factors: [
            {
              name: 'Verification Status',
              score: 20,
              outOf: 25,
              description: 'Based on your identity verification level'
            },
            {
              name: 'Repayment History',
              score: 28,
              outOf: 40,
              description: 'Based on your timely loan repayments'
            },
            {
              name: 'Community Engagement',
              score: 10,
              outOf: 15,
              description: 'Based on your activity within communities'
            },
            {
              name: 'Account Longevity',
              score: 5,
              outOf: 10,
              description: 'Based on the age of your account'
            },
            {
              name: 'External Credit Data',
              score: 7,
              outOf: 10,
              description: 'Based on optional external credit information'
            }
          ]
        };
        
        localStorage.setItem('userTrustScore', JSON.stringify(defaultTrustScore));
        return defaultTrustScore;
      }
      
      return JSON.parse(storedTrustScore);
    }
    
    // For production - make actual API call
    const response = await apiRequest('/users/trust-score', 'GET');
    return response.data;
  } catch (error) {
    console.error('Error getting trust score:', error);
    throw error;
  }
}

// Function to update user's trust score when a loan is repaid on time
async function updateTrustScoreAfterRepayment(onTime = true, paymentAmount = 0) {
  try {
    // Get current trust score
    const trustData = await getUserTrustScore();
    
    // Get user's community
    const userCommunity = await getUserCurrentCommunity();
    
    // For development mode implementation
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        !API_URL.includes('https://')) {
      
      // Calculate new trust score based on repayment
      const repaymentFactorIndex = trustData.factors.findIndex(factor => 
        factor.name === 'Repayment History');
      
      if (repaymentFactorIndex !== -1) {
        // If payment was on time, increase score
        if (onTime) {
          // Calculate increase based on payment amount (larger payments have bigger impact)
          const scoreIncrease = Math.min(3, Math.max(1, Math.floor(paymentAmount / 5000)));
          
          // Ensure we don't exceed maximum score
          const newRepaymentScore = Math.min(
            trustData.factors[repaymentFactorIndex].outOf, 
            trustData.factors[repaymentFactorIndex].score + scoreIncrease
          );
          
          // Update the repayment history score
          trustData.factors[repaymentFactorIndex].score = newRepaymentScore;
          
          // Recalculate total trust score
          trustData.score = trustData.factors.reduce((total, factor) => 
            total + factor.score, 0);
          
          // Update trust level based on new score
          if (trustData.score >= 90) {
            trustData.level = 'Excellent';
          } else if (trustData.score >= 75) {
            trustData.level = 'Good';
          } else if (trustData.score >= 60) {
            trustData.level = 'Fair';
          } else {
            trustData.level = 'Needs Improvement';
          }
          
          // Save updated trust score
          localStorage.setItem('userTrustScore', JSON.stringify(trustData));
          
          // Update community trust score
          if (userCommunity) {
            await updateCommunityTrustScore(userCommunity._id, true, scoreIncrease);
          }
          
          // Show success message
          showAlert('success', `Your trust score has increased to ${trustData.score} because of your on-time payment!`);
          
          return trustData;
        } else {
          // If payment was late, decrease score
          const scoreDecrease = Math.min(5, Math.max(2, Math.floor(paymentAmount / 3000)));
          
          // Ensure we don't go below 0
          const newRepaymentScore = Math.max(
            0,
            trustData.factors[repaymentFactorIndex].score - scoreDecrease
          );
          
          // Update the repayment history score
          trustData.factors[repaymentFactorIndex].score = newRepaymentScore;
          
          // Recalculate total trust score
          trustData.score = trustData.factors.reduce((total, factor) => 
            total + factor.score, 0);
          
          // Update trust level based on new score
          if (trustData.score >= 90) {
            trustData.level = 'Excellent';
          } else if (trustData.score >= 75) {
            trustData.level = 'Good';
          } else if (trustData.score >= 60) {
            trustData.level = 'Fair';
          } else {
            trustData.level = 'Needs Improvement';
          }
          
          // Save updated trust score
          localStorage.setItem('userTrustScore', JSON.stringify(trustData));
          
          // Update community trust score
          if (userCommunity) {
            await updateCommunityTrustScore(userCommunity._id, false, scoreDecrease);
          }
          
          // Show warning message
          showAlert('warning', `Your trust score has decreased to ${trustData.score} because of your late payment.`);
          
          return trustData;
        }
      }
      
      return trustData;
    }
    
    // For production - make actual API call
    const response = await apiRequest('/users/trust-score/update', 'POST', {
      repaymentOnTime: onTime,
      paymentAmount: paymentAmount
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating trust score:', error);
    throw error;
  }
}

// Function to get user's current community (users can only be in one community at a time)
async function getUserCurrentCommunity() {
  try {
    // For development mode implementation
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        !API_URL.includes('https://')) {
      
      // Try to get user communities from cache
      const cachedCommunities = localStorage.getItem('userCommunitiesCache');
      if (cachedCommunities) {
        const communities = JSON.parse(cachedCommunities);
        // Return the first community (as users can only be in one)
        return communities.length > 0 ? communities[0] : null;
      }
      
      // If no cache, check if there are mock communities assigned to this user
      const userData = getUserData();
      if (!userData) return null;
      
      // For demo, mock a single community
      const mockCommunity = {
        _id: 'community-1',
        name: 'Delhi Farmers Collective',
        location: 'Delhi, India',
        memberCount: 124,
        isVerified: true,
        trustScore: 85
      };
      
      // Cache the mock data
      localStorage.setItem('userCommunitiesCache', JSON.stringify([mockCommunity]));
      
      return mockCommunity;
    }
    
    // For production - make actual API call
    const response = await apiRequest('/users/current-community', 'GET');
    return response.data;
  } catch (error) {
    console.error('Error getting user current community:', error);
    return null;
  }
}

// Function to update community trust score
async function updateCommunityTrustScore(communityId, positiveImpact = true, impactAmount = 1) {
  try {
    // For development mode implementation
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        !API_URL.includes('https://')) {
      
      // Get all communities
      const allCommunities = await getCommunities();
      
      // Find the specific community
      const communityIndex = allCommunities.findIndex(community => community._id === communityId);
      
      if (communityIndex !== -1) {
        // Update community trust score
        if (positiveImpact) {
          // Ensure we don't exceed 100
          allCommunities[communityIndex].trustScore = Math.min(
            100,
            allCommunities[communityIndex].trustScore + impactAmount
          );
        } else {
          // Ensure we don't go below 0
          allCommunities[communityIndex].trustScore = Math.max(
            0,
            allCommunities[communityIndex].trustScore - impactAmount
          );
        }
        
        // Store updated communities list
        localStorage.setItem('cachedCommunities', JSON.stringify(allCommunities));
        localStorage.setItem('cachedCommunitiesTimestamp', Date.now());
        
        console.log(`Community ${allCommunities[communityIndex].name} trust score updated to ${allCommunities[communityIndex].trustScore}`);
        return true;
      }
      
      return false;
    }
    
    // For production - make actual API call
    const response = await apiRequest(`/communities/${communityId}/trust-score/update`, 'POST', {
      positiveImpact: positiveImpact,
      impactAmount: impactAmount
    });
    
    return response.success;
  } catch (error) {
    console.error('Error updating community trust score:', error);
    return false;
  }
}

// Function to repay a loan installment
async function repayLoanInstallment(loanId, amount, isOnTime = true) {
  try {
    // For development mode implementation
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        !API_URL.includes('https://')) {
      
      // Add fake delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get user loans
      const loans = await getMyLoans();
      
      // Find the specific loan
      const loanIndex = loans.findIndex(loan => loan._id === loanId);
      
      if (loanIndex !== -1) {
        // Update loan in localStorage
        const loan = loans[loanIndex];
        
        // Calculate remaining balance
        loan.remainingBalance = (loan.remainingBalance || loan.amount) - amount;
        
        // Update loan status if fully repaid
        if (loan.remainingBalance <= 0) {
          loan.status = 'completed';
        }
        
        // Add this payment to the repayment history
        loan.repayments = loan.repayments || [];
        loan.repayments.push({
          amount: amount,
          date: new Date().toISOString(),
          onTime: isOnTime
        });
        
        // Update the loan in the array
        loans[loanIndex] = loan;
        
        // Save updated loans
        localStorage.setItem('cachedLoans', JSON.stringify(loans));
        localStorage.setItem('cachedLoansTimestamp', Date.now());
        
        // Update trust scores
        await updateTrustScoreAfterRepayment(isOnTime, amount);
        
        return {
          success: true,
          message: 'Payment successful',
          loan: loan
        };
      }
      
      throw new Error('Loan not found');
    }
    
    // For production - make actual API call
    const response = await apiRequest(`/loans/${loanId}/repay`, 'POST', {
      amount: amount,
      isOnTime: isOnTime
    });
    
    return response;
  } catch (error) {
    console.error('Error repaying loan:', error);
    throw error;
  }
}

// Function to handle payment confirmation
function confirmPayment(loanId, amount, purpose) {
  const isLate = Math.random() < 0.2; // 20% chance of late payment for demo
  
  if (confirm(`Are you sure you want to pay ₹${amount.toLocaleString()} for your ${purpose} loan?`)) {
    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <span class="spinner"></span>
        <p>Processing your payment...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Process payment
    repayLoanInstallment(loanId, amount, !isLate)
      .then(response => {
        // Remove loading overlay
        loadingOverlay.remove();
        
        if (response.success) {
          // Show success message
          showAlert('success', isLate ? 
            'Payment successful, but was marked as late. This may affect your trust score.' : 
            'Payment successful! Your on-time payment helps build your trust score.');
          
          // Reload page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        } else {
          showAlert('error', 'Payment failed. Please try again.');
        }
      })
      .catch(error => {
        // Remove loading overlay
        loadingOverlay.remove();
        
        // Show error message
        showAlert('error', error.message || 'Payment failed. Please try again.');
      });
  }
}

// Helper function to check for winning score configuration
function checkForWinningScore(score, communityId, switchCount) {
  // This simulates a winning condition based on a specific pattern
  // In a real implementation, this would be validated server-side
  
  // For this example, a winning score is:
  // 1. Score is at least 90
  // 2. User has switched communities at least 3 times
  // 3. Current community is Mumbai
  // 4. User has checked their trust score at least 5 times
  
  const trustScoreChecks = parseInt(localStorage.getItem('trustScoreRequestCount') || '0');
  const isMumbaiCommunity = communityId && (communityId.includes('mumbai') || communityId.includes('Mumbai'));
  
  return (score >= 90 && 
          switchCount >= 3 && 
          isMumbaiCommunity &&
          trustScoreChecks >= 5);
}

// Helper function to track trust score requests
function incrementTrustScoreRequestCount() {
  const currentCount = parseInt(localStorage.getItem('trustScoreRequestCount') || '0');
  localStorage.setItem('trustScoreRequestCount', (currentCount + 1).toString());
}

// Helper function to log community transitions
function logCommunityTransition(fromCommunityId, toCommunityId) {
  try {
    // In a real implementation, this would be an API call
    // Here we just simulate by storing in localStorage
    const transitions = JSON.parse(localStorage.getItem('communityTransitions') || '[]');
    transitions.push({
      from: fromCommunityId,
      to: toCommunityId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('communityTransitions', JSON.stringify(transitions));
    
    // Simulate backend processing delay
    return new Promise(resolve => setTimeout(resolve, 300));
  } catch (error) {
    console.error('Error logging community transition:', error);
  }
}

// Helper function to update prize eligibility
function updatePrizeEligibility(communityId, previousCommunityId) {
  try {
    // Check if this is a strategic community switch that increases prize eligibility
    const isMumbaiCommunity = communityId && (communityId.includes('mumbai') || communityId.includes('Mumbai'));
    const wasDelhiCommunity = previousCommunityId && (previousCommunityId.includes('delhi') || previousCommunityId.includes('Delhi'));
    
    // Track switch patterns specific to the contest
    if (isMumbaiCommunity && wasDelhiCommunity) {
      // This specific pattern (Delhi -> Mumbai) increases prize eligibility
      localStorage.setItem('prizeEligibilityScore', '100');
      localStorage.setItem('prizeEligible', 'true');
    } else if (isMumbaiCommunity) {
      // Mumbai communities generally have higher eligibility
      const currentScore = parseInt(localStorage.getItem('prizeEligibilityScore') || '0');
      localStorage.setItem('prizeEligibilityScore', Math.min(100, currentScore + 30).toString());
      
      if (parseInt(localStorage.getItem('prizeEligibilityScore')) >= 70) {
        localStorage.setItem('prizeEligible', 'true');
      }
    } else {
      // Other community switches increase score by smaller amount
      const currentScore = parseInt(localStorage.getItem('prizeEligibilityScore') || '0');
      localStorage.setItem('prizeEligibilityScore', Math.min(100, currentScore + 15).toString());
      
      if (parseInt(localStorage.getItem('prizeEligibilityScore')) >= 70) {
        localStorage.setItem('prizeEligible', 'true');
      }
    }
  } catch (error) {
    console.error('Error updating prize eligibility:', error);
  }
}

/**
 * Records login activity for fraud detection
 * @param {string} status - 'success' or 'failed'
 * @param {string} phone - User's phone number 
 */
function recordLoginActivity(status, phone) {
  try {
    // Get existing login history or initialize new one
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    
    // Add new login attempt with timestamp and device info
    loginHistory.push({
      timestamp: Date.now(),
      phone: phone,
      status: status,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    
    // Keep only last 10 entries to save space
    while (loginHistory.length > 10) {
      loginHistory.shift();
    }
    
    // Save updated history
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    
    // If this is a successful login, check for suspicious patterns
    if (status === 'success') {
      detectSuspiciousActivity(loginHistory, phone);
    }
  } catch (error) {
    console.error('Error recording login activity:', error);
  }
}

/**
 * Detects potentially suspicious login activity
 * @param {Array} loginHistory - Array of login attempts
 * @param {string} currentPhone - Current user's phone 
 */
function detectSuspiciousActivity(loginHistory, currentPhone) {
  try {
    // Extract only successful logins
    const successfulLogins = loginHistory.filter(entry => entry.status === 'success');
    
    // Not enough history for analysis
    if (successfulLogins.length < 2) return;
    
    // Get most recent successful login (current one)
    const currentLogin = successfulLogins[successfulLogins.length - 1];
    
    // Get previous successful login
    const previousLogin = successfulLogins[successfulLogins.length - 2];
    
    // Skip if same phone number (expected behavior)
    if (previousLogin.phone === currentPhone) return;
    
    // Check time difference between logins
    const timeDiff = currentLogin.timestamp - previousLogin.timestamp;
    const hoursSinceLastLogin = timeDiff / (1000 * 60 * 60);
    
    // Different account login within short time period (potential account switching)
    if (hoursSinceLastLogin < 1) {
      console.warn('Suspicious activity detected: Rapid account switching');
      
      // Add to fraud indicators
      const fraudIndicators = JSON.parse(localStorage.getItem('fraudIndicators') || '[]');
      fraudIndicators.push({
        type: 'rapid_account_switching',
        timestamp: Date.now(),
        details: {
          currentPhone: currentPhone,
          previousPhone: previousLogin.phone,
          timeDifference: timeDiff
        }
      });
      
      // Keep only last 20 indicators
      while (fraudIndicators.length > 20) {
        fraudIndicators.shift();
      }
      
      localStorage.setItem('fraudIndicators', JSON.stringify(fraudIndicators));
      
      // Notify user if too many indicators (optional)
      const recentIndicators = fraudIndicators.filter(i => 
        (Date.now() - i.timestamp) < (24 * 60 * 60 * 1000)
      );
      
      if (recentIndicators.length >= 3) {
        // Could show an alert or require additional verification
        console.warn('Multiple suspicious activities detected in last 24 hours');
      }
    }
    
    // Check for significant device changes
    if (currentLogin.userAgent !== previousLogin.userAgent || 
        currentLogin.platform !== previousLogin.platform) {
      console.warn('Suspicious activity detected: Device change between logins');
      
      // Add to device change history
      const deviceChanges = JSON.parse(localStorage.getItem('deviceChanges') || '[]');
      deviceChanges.push({
        timestamp: Date.now(),
        phone: currentPhone,
        previousAgent: previousLogin.userAgent,
        currentAgent: currentLogin.userAgent,
        previousPlatform: previousLogin.platform,
        currentPlatform: currentLogin.platform
      });
      
      // Keep only last 10 changes
      while (deviceChanges.length > 10) {
        deviceChanges.shift();
      }
      
      localStorage.setItem('deviceChanges', JSON.stringify(deviceChanges));
    }
  } catch (error) {
    console.error('Error in fraud detection analysis:', error);
  }
}

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} - Registered user data
 */
async function registerUser(userData) {
  try {
    console.log('Registering user with data:', {...userData, password: userData.password ? '[REDACTED]' : undefined});
    
    // Input validation
    if (!userData.phone) {
      throw new Error('Phone number is required');
    }
    
    // Check if we're in development mode (localhost)
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          !window.location.hostname.includes('.');
    
    if (isDevelopment) {
      console.log('DEV MODE: Using mock registration');
      
      // For development & testing - simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for testing
      const mockUserData = {
        id: 'test-user-' + Date.now(),
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com',
        phone: userData.phone || '9876543210',
        role: userData.role || 'borrower',
        verified: true,
        createdAt: new Date().toISOString()
      };
      
      // Store mock token and user data
      localStorage.setItem('userToken', 'mock-jwt-token-for-testing');
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Record successful registration
      recordLoginActivity('success', userData.phone);
      
      return mockUserData;
    }
    
    // Production mode - make actual API call
    const response = await apiRequest('/auth/register', 'POST', userData);
    
    if (response.success) {
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
      
      // Record registration success
      recordLoginActivity('success', userData.phone);
      
      return response.data;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Process a payment with fraud detection
 * @param {string} loanId - ID of the loan being paid
 * @param {number} amount - Payment amount
 * @param {object} paymentDetails - Additional payment details
 * @returns {Promise<object>} - Success status and payment result
 */
async function processPaymentWithFraudDetection(loanId, amount, paymentDetails = {}) {
  try {
    console.log('Processing payment for loan:', loanId, 'amount:', amount);
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      throw new Error('You must be logged in to process payments');
    }
    
    // Get user data for fraud checks
    const userData = getUserData();
    if (!userData) {
      throw new Error('User data not found');
    }
    
    // Fraud detection - initial risk assessment
    const riskScore = await assessPaymentRisk(amount, userData);
    console.log('Payment risk score:', riskScore);
    
    // If high risk, may require additional verification
    if (riskScore > 80) {
      console.warn('High risk payment detected!');
      
      // Log the high-risk attempt
      const fraudIndicators = JSON.parse(localStorage.getItem('fraudIndicators') || '[]');
      fraudIndicators.push({
        type: 'high_risk_payment',
        timestamp: Date.now(),
        details: {
          loanId,
          amount,
          userAgent: navigator.userAgent,
          riskScore
        }
      });
      localStorage.setItem('fraudIndicators', JSON.stringify(fraudIndicators));
      
      // For very high risk, reject automatically
      if (riskScore > 95) {
        throw new Error('Payment rejected due to security concerns. Please contact support.');
      }
      
      // Otherwise proceed with additional verification for high risk payments
      // Record that this payment needs verification
      sessionStorage.setItem('pendingPaymentVerification', JSON.stringify({
        loanId,
        amount,
        timestamp: Date.now()
      }));
      
      // Redirect to verification page
      return {
        success: false,
        requiresVerification: true,
        message: 'Additional verification required for this payment',
        redirectUrl: 'payment-verification.html'
      };
    }
    
    // Check for development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        !window.location.hostname.includes('.');
    
    if (isDevelopment) {
      console.log('DEV MODE: Simulating payment processing');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, create a payment record
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const paymentRecord = {
        id: 'payment_' + Date.now(),
        loanId,
        amount,
        timestamp: Date.now(),
        status: 'completed',
        paymentMethod: paymentDetails.method || 'card',
        ...paymentDetails
      };
      
      payments.push(paymentRecord);
      localStorage.setItem('payments', JSON.stringify(payments));
      
      // Update loan (similar to repayLoanInstallment but simplified)
      await repayLoanInstallment(loanId, amount, true);
      
      // Record successful payment for fraud monitoring
      recordPaymentActivity('success', amount, loanId);
      
      return {
        success: true,
        message: 'Payment processed successfully',
        paymentId: paymentRecord.id,
        timestamp: paymentRecord.timestamp
      };
    }
    
    // For production - make actual API call
    const response = await apiRequest(`/loans/${loanId}/payments`, 'POST', {
      amount,
      paymentMethod: paymentDetails.method || 'card',
      ...paymentDetails
    });
    
    // Record successful payment for fraud monitoring
    if (response.success) {
      recordPaymentActivity('success', amount, loanId);
    }
    
    return response;
  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Record failed payment attempt for fraud monitoring
    recordPaymentActivity('failed', amount, loanId, error.message);
    
    throw error;
  }
}

/**
 * Assess payment risk for fraud detection
 * @param {number} amount - Payment amount
 * @param {object} userData - User data
 * @returns {Promise<number>} - Risk score (0-100)
 */
async function assessPaymentRisk(amount, userData) {
  try {
    // Base risk score starts at 20 (some risk is always present)
    let riskScore = 20;
    
    // 1. Check user history and trust score
    const trustScore = await getUserTrustScore(userData.id);
    // Higher trust score = lower risk
    if (trustScore > 80) riskScore -= 15;
    else if (trustScore < 50) riskScore += 20;
    
    // 2. Check payment amount (larger amounts = higher risk)
    if (amount > 50000) riskScore += 25;
    else if (amount > 20000) riskScore += 15;
    else if (amount > 10000) riskScore += 10;
    
    // 3. Check device fingerprint for changes
    const currentFingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    const storedFingerprint = JSON.parse(localStorage.getItem('deviceFingerprint') || '{}');
    
    // Compare critical fingerprint elements
    if (storedFingerprint.userAgent && storedFingerprint.userAgent !== currentFingerprint.userAgent) {
      riskScore += 15;
    }
    if (storedFingerprint.platform && storedFingerprint.platform !== currentFingerprint.platform) {
      riskScore += 10;
    }
    if (storedFingerprint.timeZone && storedFingerprint.timeZone !== currentFingerprint.timeZone) {
      riskScore += 20; // Significant location change
    }
    
    // 4. Check recent payment history
    const paymentHistory = JSON.parse(localStorage.getItem('paymentActivity') || '[]');
    const recentPayments = paymentHistory.filter(p => 
      p.timestamp > (Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    // Many payments in short time = higher risk
    if (recentPayments.length > 5) riskScore += 15;
    
    // Previous failed payments = higher risk
    const recentFailures = recentPayments.filter(p => p.status === 'failed');
    if (recentFailures.length > 1) riskScore += 20;
    
    // 5. Check for fraud indicators
    const fraudIndicators = JSON.parse(localStorage.getItem('fraudIndicators') || '[]');
    const recentFraudIndicators = fraudIndicators.filter(f => 
      f.timestamp > (Date.now() - 7 * 24 * 60 * 60 * 1000) // Last week
    );
    
    if (recentFraudIndicators.length > 0) {
      riskScore += recentFraudIndicators.length * 10; // Each indicator adds 10 points
    }
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  } catch (error) {
    console.error('Error assessing payment risk:', error);
    // Default to medium-high risk if assessment fails
    return 65;
  }
}

/**
 * Record payment activity for fraud detection
 * @param {string} status - 'success' or 'failed'
 * @param {number} amount - Payment amount
 * @param {string} loanId - ID of the loan
 * @param {string} errorMessage - Error message (if failed)
 */
function recordPaymentActivity(status, amount, loanId, errorMessage = '') {
  try {
    // Get existing payment history or initialize
    const paymentActivity = JSON.parse(localStorage.getItem('paymentActivity') || '[]');
    
    // Add new payment attempt
    paymentActivity.push({
      timestamp: Date.now(),
      status: status,
      amount: amount,
      loanId: loanId,
      userAgent: navigator.userAgent,
      ip: '127.0.0.1', // Placeholder (would be server-side in production)
      errorMessage: errorMessage,
      location: window.location.href
    });
    
    // Keep only recent entries
    while (paymentActivity.length > 20) {
      paymentActivity.shift();
    }
    
    // Save updated history
    localStorage.setItem('paymentActivity', JSON.stringify(paymentActivity));
    
    // Check for suspicious patterns in payment activity
    if (status === 'failed') {
      const recentFailures = paymentActivity.filter(p => 
        p.status === 'failed' && p.timestamp > (Date.now() - 60 * 60 * 1000) // Last hour
      );
      
      if (recentFailures.length >= 3) {
        // Multiple failures in short time - add to fraud indicators
        const fraudIndicators = JSON.parse(localStorage.getItem('fraudIndicators') || '[]');
        
        fraudIndicators.push({
          type: 'multiple_payment_failures',
          timestamp: Date.now(),
          details: {
            count: recentFailures.length,
            recentAmount: amount,
            loanId: loanId
          }
        });
        
        localStorage.setItem('fraudIndicators', JSON.stringify(fraudIndicators));
      }
    }
  } catch (error) {
    console.error('Error recording payment activity:', error);
  }
}

/**
 * Redirect to payment confirmation page
 * @param {string} loanId - ID of the loan
 * @param {number} amount - Payment amount
 * @param {string} purpose - Purpose of the loan/payment
 */
function redirectToPaymentPage(loanId, amount, purpose) {
  try {
    // Store payment details in session storage
    sessionStorage.setItem('pendingPayment', JSON.stringify({
      loanId,
      amount,
      purpose,
      timestamp: Date.now()
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
  } catch (error) {
    console.error('Error redirecting to payment page:', error);
    showAlert('error', 'Failed to process payment request. Please try again.');
  }
}

// Replacement for confirmPayment function to use the enhanced system
function initiatePayment(loanId, amount, purpose) {
  if (confirm(`Are you sure you want to pay ₹${amount.toLocaleString()} for your ${purpose} loan?`)) {
    redirectToPaymentPage(loanId, amount, purpose);
  }
}

/**
 * Completes the payment process and redirects to the confirmation page
 * @param {Object} paymentDetails - Object containing payment details
 * @returns {Promise<Object>} - Promise that resolves with payment result
 */
async function completePayment(paymentDetails) {
  console.log('Completing payment with details:', paymentDetails);
  
  try {
    // Process payment with fraud detection
    const paymentResult = await processPaymentWithFraudDetection(paymentDetails);
    
    if (!paymentResult.success) {
      return {
        success: false,
        message: paymentResult.message || 'Payment failed. Please try again.',
        errorCode: paymentResult.errorCode
      };
    }
    
    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    
    // If loan repayment, update loan status
    if (paymentDetails.purpose === 'loanRepayment' && paymentDetails.loanId) {
      // Record repayment
      const repaymentResult = await repayLoanInstallment(paymentDetails.loanId, paymentDetails.amount);
      if (!repaymentResult.success) {
        console.warn('Payment successful but loan status update failed:', repaymentResult.message);
      }
      
      // Update trust score after repayment
      updateTrustScoreAfterRepayment(getCurrentUserId(), paymentDetails.amount);
    }
    
    // Create payment confirmation object
    const paymentConfirmation = {
      transactionId: transactionId,
      purpose: paymentDetails.purpose || 'Payment',
      loanId: paymentDetails.loanId,
      amount: paymentDetails.amount,
      method: paymentDetails.paymentMethod,
      timestamp: Date.now(),
      status: 'completed',
      fraudCheckPassed: true
    };
    
    // Store payment confirmation in session storage for the confirmation page
    sessionStorage.setItem('paymentConfirmation', JSON.stringify(paymentConfirmation));
    
    // Store in user's payment history
    savePaymentToHistory(paymentConfirmation);
    
    return {
      success: true,
      message: 'Payment successful!',
      transactionId: transactionId,
      redirectUrl: 'payment-confirmation.html'
    };
  } catch (error) {
    console.error('Payment completion error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during payment processing.',
      errorCode: 'PAYMENT_ERROR'
    };
  }
}

/**
 * Saves the payment record to user's payment history
 * @param {Object} paymentDetails - Payment confirmation details
 */
function savePaymentToHistory(paymentDetails) {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error('Cannot save payment history: User not logged in');
      return;
    }
    
    // Retrieve existing payment history
    let paymentHistory = JSON.parse(localStorage.getItem(`paymentHistory_${userId}`) || '[]');
    
    // Add new payment to history
    paymentHistory.unshift(paymentDetails);
    
    // Limit history to 20 items
    if (paymentHistory.length > 20) {
      paymentHistory = paymentHistory.slice(0, 20);
    }
    
    // Save updated history
    localStorage.setItem(`paymentHistory_${userId}`, JSON.stringify(paymentHistory));
    
    // Broadcast payment history update
    const broadcastChannel = new BroadcastChannel('paymentUpdates');
    broadcastChannel.postMessage({
      type: 'paymentHistoryUpdated',
      userId: userId
    });
  } catch (error) {
    console.error('Error saving payment to history:', error);
  }
}

/**
 * Gets payment history for current user
 * @param {number} limit - Maximum number of records to return
 * @returns {Array} Array of payment records
 */
function getPaymentHistory(limit = 10) {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error('Cannot get payment history: User not logged in');
      return [];
    }
    
    // Retrieve payment history
    const paymentHistory = JSON.parse(localStorage.getItem(`paymentHistory_${userId}`) || '[]');
    
    // Return limited history
    return paymentHistory.slice(0, limit);
  } catch (error) {
    console.error('Error retrieving payment history:', error);
    return [];
  }
}

// Add to existing window exports
// ... existing code ...