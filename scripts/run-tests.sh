#!/bin/bash

# Comprehensive Test Runner Script
# This script runs all tests and generates reports

set -e  # Exit on error

echo "🚀 Starting Comprehensive Test Suite"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# 1. Generate Test Manifest
echo -e "\n${YELLOW}📊 Generating Test Manifest...${NC}"
npm run test:manifest
MANIFEST_STATUS=$?
print_status $MANIFEST_STATUS "Test manifest generated"

# Display coverage summary
if [ $MANIFEST_STATUS -eq 0 ]; then
    echo -e "\n${YELLOW}Coverage Summary:${NC}"
    node -e "
        const manifest = require('./test-manifest.json');
        console.log('  Total Coverage: ' + manifest.coverage.percentage + '%');
        console.log('  Tested Files: ' + manifest.coverage.tested.length);
        console.log('  Untested Files: ' + manifest.coverage.untested.length);
        console.log('  Priority Targets: ' + manifest.coverage.priority.length);
    "
fi

# 2. Run Unit Tests
echo -e "\n${YELLOW}🧪 Running Unit Tests...${NC}"
npm test -- --run
UNIT_STATUS=$?
print_status $UNIT_STATUS "Unit tests completed"

# 3. Run Unit Tests with Coverage
echo -e "\n${YELLOW}📈 Running Unit Tests with Coverage...${NC}"
npm run test:coverage
COVERAGE_STATUS=$?
print_status $COVERAGE_STATUS "Coverage report generated"

# 4. Build the application
echo -e "\n${YELLOW}🏗️  Building Application...${NC}"
npm run build
BUILD_STATUS=$?
print_status $BUILD_STATUS "Build completed"

# 5. Run E2E Tests
if [ $BUILD_STATUS -eq 0 ]; then
    echo -e "\n${YELLOW}🎭 Running E2E Tests...${NC}"
    
    # Start the dev server in background
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to be ready
    echo "Waiting for server to start..."
    npx wait-on http://localhost:3002 -t 30000
    
    # Run E2E tests
    npx playwright test
    E2E_STATUS=$?
    print_status $E2E_STATUS "E2E tests completed"
    
    # Kill the dev server
    kill $DEV_PID 2>/dev/null || true
else
    echo -e "${RED}Skipping E2E tests due to build failure${NC}"
    E2E_STATUS=1
fi

# 6. Generate Final Report
echo -e "\n${YELLOW}📄 Generating Final Report...${NC}"

# Calculate overall status
TOTAL_TESTS=4
PASSED_TESTS=0
[ $MANIFEST_STATUS -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))
[ $UNIT_STATUS -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))
[ $COVERAGE_STATUS -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))
[ $E2E_STATUS -eq 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

# Create summary report
cat > test-summary.md << EOF
# Test Summary Report
Generated: $(date)

## Test Results
- ✅ Passed: $PASSED_TESTS/$TOTAL_TESTS
- ❌ Failed: $((TOTAL_TESTS - PASSED_TESTS))/$TOTAL_TESTS

### Individual Results:
$([ $MANIFEST_STATUS -eq 0 ] && echo "- ✅ Test Manifest Generation" || echo "- ❌ Test Manifest Generation")
$([ $UNIT_STATUS -eq 0 ] && echo "- ✅ Unit Tests" || echo "- ❌ Unit Tests")
$([ $COVERAGE_STATUS -eq 0 ] && echo "- ✅ Coverage Tests" || echo "- ❌ Coverage Tests")
$([ $E2E_STATUS -eq 0 ] && echo "- ✅ E2E Tests" || echo "- ❌ E2E Tests")

## Coverage Report
$(cat TEST_COVERAGE.md | head -20)

## Next Steps
$(if [ $PASSED_TESTS -lt $TOTAL_TESTS ]; then
    echo "1. Fix failing tests"
    echo "2. Review test output above for details"
    echo "3. Run individual test suites for debugging:"
    echo "   - \`npm test\` for unit tests"
    echo "   - \`npm run test:e2e\` for E2E tests"
else
    echo "All tests passing! 🎉"
    echo "Consider:"
    echo "1. Adding more test coverage for untested files"
    echo "2. Review priority targets in TEST_COVERAGE.md"
fi)
EOF

echo -e "\n${GREEN}✅ Test Summary saved to test-summary.md${NC}"

# Print final status
echo -e "\n======================================"
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi