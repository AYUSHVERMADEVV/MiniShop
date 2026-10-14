import Product from './src/models/Product.js';

console.log('🧪 Starting MiniShop Product Model Validation & Logic Tests...\n');

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

async function runTests() {
  // Test 1: Valid product creation in memory & virtual fields
  const p1 = new Product({
    name: 'Logitech MX Master 3S',
    category: 'Electronics',
    purchasePrice: 6500,
    sellingPrice: 8999,
    quantity: 12,
  });

  const err1 = p1.validateSync();
  assert(!err1, 'Valid product passes schema validation');
  assert(p1.profitPerUnit === 2499, 'profitPerUnit calculates correctly (8999 - 6500 = 2499)');
  assert(p1.isLowStock === false, 'isLowStock is false for quantity = 12');
  assert(p1.totalPurchaseValue === 78000, 'totalPurchaseValue calculates correctly (6500 * 12 = 78000)');
  assert(p1.totalSellingValue === 107988, 'totalSellingValue calculates correctly (8999 * 12 = 107988)');

  // Test 2: Low stock condition (quantity <= 5)
  const p2 = new Product({
    name: 'USB-C Fast Charging Cable',
    category: 'Electronics',
    purchasePrice: 150,
    sellingPrice: 399,
    quantity: 5,
  });
  assert(p2.isLowStock === true, 'isLowStock is true for quantity = 5 (threshold is <= 5)');

  const p3 = new Product({
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    purchasePrice: 1200,
    sellingPrice: 1999,
    quantity: 2,
  });
  assert(p3.isLowStock === true, 'isLowStock is true for quantity = 2');

  // Test 3: Serialization to JSON includes virtuals
  const p1Json = p1.toJSON();
  assert(p1Json.profitPerUnit === 2499, 'toJSON() includes virtual profitPerUnit');
  assert(p1Json.isLowStock === false, 'toJSON() includes virtual isLowStock');
  assert(p1Json.totalPurchaseValue === 78000, 'toJSON() includes virtual totalPurchaseValue');

  // Test 4: Validation error on missing required fields
  const pInvalidMissing = new Product({});
  const errMissing = pInvalidMissing.validateSync();
  assert(Boolean(errMissing?.errors?.name), 'Requires name field');
  assert(Boolean(errMissing?.errors?.category), 'Requires category field');
  assert(Boolean(errMissing?.errors?.purchasePrice), 'Requires purchasePrice field');
  assert(Boolean(errMissing?.errors?.sellingPrice), 'Requires sellingPrice field');
  assert(Boolean(errMissing?.errors?.quantity), 'Requires quantity field');

  // Test 5: Validation error on negative prices
  const pInvalidNegative = new Product({
    name: 'Defective Mouse',
    category: 'Electronics',
    purchasePrice: -100,
    sellingPrice: -50,
    quantity: -5,
  });
  const errNegative = pInvalidNegative.validateSync();
  assert(Boolean(errNegative?.errors?.purchasePrice), 'Rejects negative purchasePrice');
  assert(Boolean(errNegative?.errors?.sellingPrice), 'Rejects negative sellingPrice');
  assert(Boolean(errNegative?.errors?.quantity), 'Rejects negative quantity');

  // Test 6: Validation error on non-integer quantity
  const pInvalidFloatQty = new Product({
    name: 'Apples',
    category: 'Groceries',
    purchasePrice: 100,
    sellingPrice: 150,
    quantity: 3.75,
  });
  const errFloatQty = pInvalidFloatQty.validateSync();
  assert(Boolean(errFloatQty?.errors?.quantity), 'Rejects floating-point quantity (must be integer)');

  console.log(`\n==============================================`);
  console.log(`🎯 Test Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`==============================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests();
