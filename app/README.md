# Browser-Service 

This is a API Extension for Webdriver + Puppeteer.  

# Basic Conecept

Forward all requests to browser instance, except these we add to start and stop browser instance.

| PATH  | PARAMETER  | INFORMATION   |
|---|---|---|
| /start  | BROWSER QUOTA AS JSON  | Startup parameter for chrome   |
| /stop  | NOTHING  |  force stop of current browser |
| /ext/${session} | generic   | This is used to access browser directly   |
