import { path as chromeDriverPath } from 'chromedriver';
import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export function runDriver(): () => ThenableWebDriver {
  let webdriver: ThenableWebDriver | null = null;

  // same webdriver instance serves all the tests in the suite
  before(async function () {
    const options = new Options();
    options.setChromeBinaryPath(chromeDriverPath);
    if (process.env.CI) {
      options.headless();
    }
    options.addArguments('--remote-debugging-pipe');

    webdriver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
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
