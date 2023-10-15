import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

export function runDriver(): () => ThenableWebDriver {
  let webdriver: ThenableWebDriver | null = null;

  // same webdriver instance serves all the tests in the suite
  before(async function () {
    const options = process.env.CI
      ? new chrome.Options().headless()
      : new chrome.Options();

    webdriver = new Builder()
      .forBrowser('chrome')
      .withCapabilities(options)
      .build();
  });

  after(async function () {
    if (!webdriver) {
      throw new Error(
        'cannot clean up webdriver because it was not initialized'
      );
    }

    await webdriver.quit();

    // complete cleanup
    webdriver = null;
  });

  // expose singleton getter
  return () => {
    if (!webdriver) {
      throw new Error('webdriver not initialized');
    }

    return webdriver;
  };
}
