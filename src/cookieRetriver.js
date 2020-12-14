const cookies = async(page,loginUrl,email,password,filter="") => {
    const allCookies = await getCookies(page,loginUrl,email,password)
    if (!filter){
      return allCookies['cookies'];
    }
    return allCookies['cookies'].filter(item => item.name === filter);
}

const getCookies = async(page,loginUrl,email,password) => {
    const url = new URL(loginUrl);
    switch(url.hostname){
      case 'notion.so':
      case 'www.notion.so': return await getNotionCookies(page,loginUrl,email,password); break;
      case 'linkedin.com':
      case 'www.linkedin.com': return await getLinkedinCookies(page,loginUrl,email,password); break;
      default: throw new Error("Invalid login url or the domain is not recognized.") 
    }
  }
  
  const getLinkedinCookies = async(page,loginUrl,email,password) => {
      await page.setDefaultNavigationTimeout(0);
      await page.goto(loginUrl);
      await page.waitForSelector('input[id="username"]')
      await page.type('input[id="username"]', email);
      await page.keyboard.press("Enter");
      await page.waitForSelector('input[id="password"]')
      await page.type('input[id="password"]', password);
      await page.keyboard.press("Enter");
      await page.waitForSelector('div[data-control-name="identity_profile_photo"]')
      let cookies = await page._client.send('Network.getAllCookies');
      return cookies;
  }
  
  const getNotionCookies = async(page,loginUrl,email,password) => {
    await page.setDefaultNavigationTimeout(0);
    await page.goto(loginUrl);
    await page.waitForSelector('input[placeholder="Enter your email address..."]')
    await page.type('input[placeholder="Enter your email address..."]', email);
    await page.keyboard.press("Enter");
    await page.waitForSelector('input[placeholder="Enter your password..."]')
    await page.type('input[placeholder="Enter your password..."]', password);
    await page.keyboard.press("Enter");
    await page.waitForSelector('div[class="notion-sidebar-container"]')
    let cookies = await page._client.send('Network.getAllCookies');
    return cookies;
  }

export default cookies;