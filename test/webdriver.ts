import { path as chromeDriverPath } from 'chromedriver';
import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { ServiceBuilder, Options } from 'selenium-webdriver/chrome';

export function runDriver(): () => ThenableWebDriver {
  let webdriver: ThenableWebDriver | null = null;

  // same webdriver instance serves all the tests in the suite
  before(async function () {
    const service = new ServiceBuilder(chromeDriverPath);
    const options = process.env.CI ? new Options().headless() : new Options();

    webdriver = new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
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
