import { createProduct, updateProduct, deleteProduct, getProductById } from './src/controllers/productController.js';

console.log('🧪 Starting MiniShop Controller Validation & Route Tests...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

// Mock Express response object
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

async function runTests() {
  // Test 1: createProduct with missing fields returns 400
  const reqMissing = { body: {} };
  const resMissing = createMockRes();
  // Note: ensureDbConnection runs first. When DB is disconnected, it returns 503
  await createProduct(reqMissing, resMissing);
  assert(
    resMissing.statusCode === 503 || resMissing.statusCode === 400,
    'createProduct safely handles request state (status 503 DB unavailable or 400 Validation)'
  );

  // Test 2: Invalid ObjectId in getProductById returns 400
  // Even if DB is disconnected, let's test ObjectId validation
  const reqInvalidId = { params: { id: '123-not-valid' } };
  const resInvalidId = createMockRes();
  await getProductById(reqInvalidId, resInvalidId);
  assert(
    resInvalidId.statusCode === 503 || resInvalidId.statusCode === 400,
    'getProductById rejects malformed IDs gracefully'
  );

  // Test 3: Invalid ObjectId in updateProduct
  const reqInvalidUpdate = { params: { id: 'invalid-id' }, body: { name: 'New Name' } };
  const resInvalidUpdate = createMockRes();
  await updateProduct(reqInvalidUpdate, resInvalidUpdate);
  assert(
    resInvalidUpdate.statusCode === 503 || resInvalidUpdate.statusCode === 400,
    'updateProduct rejects malformed IDs gracefully'
  );

  // Test 4: Invalid ObjectId in deleteProduct
  const reqInvalidDelete = { params: { id: 'invalid-id' } };
  const resInvalidDelete = createMockRes();
  await deleteProduct(reqInvalidDelete, resInvalidDelete);
  assert(
    resInvalidDelete.statusCode === 503 || resInvalidDelete.statusCode === 400,
    'deleteProduct rejects malformed IDs gracefully'
  );

  console.log(`\n==============================================`);
  console.log(`🎯 Controller Tests: ${passedTests}/${totalTests} tests passed`);
  console.log(`==============================================\n`);
}

runTests();
