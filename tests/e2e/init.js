/* eslint-disable no-console */
/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// DO NOT USE EXCEPT FOR THIS REACT NATIVE FIREBASE TESTING PROJECT - YOU HAVE
// BEEN WARNED 🙃
require('@react-native-firebase/private-tests-helpers');

global.TestAdminApi = new TestingApi();

const detox = require('detox');
const jet = require('jet/platform/node');

const { requirePackageTests } = require('./helpers');
const { detox: config } = require('../package.json');

config.configurations['android.emu.debug'].name =
  process.env.ANDROID_AVD_NAME || config.configurations['android.emu.debug'].name;

console.log(`Android AVD: ${config.configurations['android.emu.debug'].name}`);

const PACKAGES = [
  'app',
  'admob',
  'dynamic-links',
  'iid',
  'perf',
  'functions',
  'analytics',
  'remote-config',
  'crashlytics',
  'ml-natural-language',
  // 'ml-vision', TODO - ci is flaky like pastry
  'in-app-messaging',
  'auth',
  'database',
  'storage',
  'messaging',
  'firestore',
];

for (let i = 0; i < PACKAGES.length; i++) {
  requirePackageTests(PACKAGES[i]);
}

before(async () => {
  console.log('--->>> BEFORE DETOX INIT');
  await detox.init(config);
  console.log('--->>> AFTER DETOX INIT');
  await jet.init();
  console.log('--->>> AFTER JET INIT');
});

beforeEach(async function beforeEach() {
  if (jet.context && jet.root && jet.root.setState) {
    jet.root.setState({
      currentTest: this.currentTest,
    });
  }

  const retry = this.currentTest.currentRetry();

  if (retry > 0) {
    if (retry === 1) {
      console.log('');
      console.warn('⚠️ A test failed:');
      console.warn(`️   ->  ${this.currentTest.title}`);
    }

    if (retry > 1) {
      console.warn(`   🔴  Retry #${retry - 1} failed...`);
    }

    console.warn(`️   ->  Retrying in ${1 * retry} seconds ... (${retry})`);
    await Utils.sleep(5000 * retry);
  }
});

after(async () => {
  console.log(' ✨ Tests Complete ✨ ');
  await device.terminateApp();
});
