# AliexpressOrdersBrowser
Scrape aliexpress orders to excel and publish them at the web for your use

### How-to-use

#### 1. Install TamperMonkey to scrape orders
Tampermonkey is a userscript manager. Download and install: https://www.tampermonkey.net/  
Install the userscript [Aliexpress.js](./src/Tampermonkey/Aliexpress_items.js) to scrape your order info. Just select the RAW option in github to install.  
Open https://trade.aliexpress.com/orderList.htm to check the script.  
Do you see a button 'LOAD'? YEAH, you just finished step 1!  

#### 2. Install webpage to show orders
Put [aliorders.html](./src/html/aliorders.html) in the directory of your webserver.  
Or somewhere else and upload the file after each update.  
I also supplied my [favicon.ico](./src/html/favicon.ico)  
Files ready at your webserver. Try! YEAH, you just finished step 2!  

#### 3. An Excel file
Download the excel template [AliExpress.xlsm](./src/Excel/AliExpress.xlsm)  
Open it. Yes, it contains macros to manipulate the webpage. And to cache images locally if you want to use them within excel (optional)  

Select worksheet MACRO  
- Enter the location of the aliorders.html file in cell B3.  
- Optional - you your own convenience - enter your URL. It has no other use.  
- If you want to cache images, enter an existing directory in cell B5.  
  Please create 3 subdirectories: __50x50__, __220x220q90__ and __original__

Select worksheet Orders  
Open the Aliexpress order page, press the LOAD button, go back to cell A2 and paste the info.  
You have to copy the formulas from column U and further yourself.  
Go back to sheet MACRO and push "Save to HTML file"  
Upload the html file to your webserver if needed, and take a look.  
Success? Go back to aliexpress and scrape all order pages and add them to worksheet Orders.  
YEAH, you just finished step 3!  

### More functionalities

More bla bla explaining locally cached images.....