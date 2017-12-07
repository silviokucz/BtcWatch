import { BtcWatchPage } from './app.po';

describe('btc-watch App', () => {
  let page: BtcWatchPage;

  beforeEach(() => {
    page = new BtcWatchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
