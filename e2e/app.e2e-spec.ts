import { AppNodePage } from './app.po';

describe('app-node App', function() {
  let page: AppNodePage;

  beforeEach(() => {
    page = new AppNodePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
