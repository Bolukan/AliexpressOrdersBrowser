// ==UserScript==
// @name         Aliexpress_items
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Retrieve Aliexpress order information
// @author       You
// @match        https://trade.aliexpress.com/orderList.htm*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

function parseDate(txt)
{
    // 012345678901234567
    // 10:31 May. 21 2019
    // var d = new Date(year, month (0-11), day, hours, minutes, seconds, milliseconds);
    return new Date(txt.slice(14,18),("Jan.Feb.Mar.Apr.May.Jun.Jul.Aug.Sep.Oct.Nov.Dec.".indexOf(txt.slice(6,10)))/4, txt.slice(11,13), txt.slice(0,2), txt.slice(3,5),0,0);
}

(function() {
    'use strict';

})();

var orders = [];
var items = [];
var reqs = [];
var options = { weekday: undefined, year: 'numeric',
                month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'};
$(".order-item-wraper").each((ind, eo)=>{
  var hasTracking = $(eo).find(".button-logisticsTracking ").length > 0;
  let order = {
    order_id:     $(eo).find(".order-info .first-row .info-body ").text().trim(),
    order_time:   parseDate($(eo).find(".order-info .second-row .info-body").text().trim()).toLocaleDateString('nl-NL', options),
    order_amount: $(eo).find(".order-amount .amount-num").text().trim(),
    order_status: $(eo).find(".order-status .f-left").text().trim(),
    store_name:   $(eo).find(".store-info .first-row .info-body").text().trim(),
    store_url:    $(eo).find(".store-info .second-row a:first()").attr('href'),
    product_action: $(eo).find(".product-action span:first()").text().trim(),
    hasTracking:  hasTracking,
  }
  orders.push(order);
//    console.log(order.product_action);

  var products = [];
  var inum = 0;
  $(eo).find(".order-body").each((i,eb)=>{
    $(eb).find(".product-sets").each((i,ep)=>{
      let product = {
        order_product_num: ++inum,
        product_id:        $(ep).find(".product-title .baobei-name").attr('productId'),
        product_title:     $(ep).find(".product-title .baobei-name").attr('title'),
        product_url:       $(ep).find(".product-title .baobei-name").attr('href'),
        product_pic_url:   $(ep).find(".product-left img").attr('src'),
        product_snapshot:  $(ep).find(".product-snapshot .baobei-name").attr('href'),
        product_count:     $(ep).find(".product-amount span:nth-child(2)").text().trim().slice(1), // remove parcer for different currency
        product_price:     $(ep).find(".product-amount span:first()").text().trim(),
        product_skuid:     $(ep).find(".product-property span:first() span:first()").attr('id'),
        product_property:  $(ep).find(".product-property span:first() span:first()").text().trim(),
        //product_action:    $(ep).find(".product-action span:first()").text().trim(),
        order:             order,
      };
//      console.log($(ep).find(".product-action span:first()").text().trim());
      products.push(product); // local all products
      items.push(product); // global all products
     //   console.log(item);
    });
 //  console.log(products);
  });
/*
  let order = {
    id: $(el).find(".order-info .first-row .info-body ").text().trim(),
    status: $(el).find(".order-status .f-left").text().trim(),
        orderPrice: $(el).find(".amount-num").text().trim(),
        productPriceAndAmount: $(el).find(".product-right .product-amount").text().trim().replace(/(?:\s\s)/g, ""),
        productsNames: products.map((it)=> it.title).join(", "),
	    orderDate: $(el).find(".order-info .second-row .info-body").text().trim(),
	    sellerName: $(el).find(".store-info .first-row .info-body").text().trim(),
        hasTracking: hasTracking,
        products: products,
    };
*/
/*
  if (hasTracking){
    var req = new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://ilogisticsaddress.aliexpress.com/ajax_logistics_track.htm?orderId=" + order.id + "&callback=test",
        onload:(data)=>{
          order.tracking = eval(data.responseText).tracking;
          order.trackingNumber = order.tracking.map(it=>it.mailNo).join(", ");
          resolve(order);
          orders.push(order);
        },
        onerror: () => reject(400)
      });
    });
    reqs.push(req);
  } else{
    orders.push(order);
  }
*/
});
//console.log(JSON.stringify(orders));

$.when.apply(null, reqs).done(function(){
  //   console.log(orders);
  // console.log(orders.length);
});
//<button id="search-btn" class="ui-button ui-button-primary search-btn" type="button">Search</button>

$('#mybutton').one('click', function(){
  var r=$('<input/>').attr({
    type:  "button",
    id:    "field",
    value: 'LOAD CSV'
  });
  $("body").append(r);
});

$('<button/>', {
  text: "LOAD", //set text 1 to 10
  id: 'csvBtn',
  click: function () {
    $("#csvBtn").text("Loading...");
    Promise.all(reqs).then(o =>{
      var s = "";
      items.forEach(e=> {
        s += e.order.order_id + "\t";
        s += e.order.order_time + "\t";
        s += ((e.order_product_num==1) ? e.order.order_amount : "") + "\t";
        s += e.order.order_status + "\t";
        s += e.order.store_name + "\t";
        s += "https:" + e.order.store_url + "\t";
        s += e.order.hasTracking + "\t";
        s += e.order_product_num + "\t";
        s += e.product_id + "\t";
        s += "\"" + e.product_title + "\"\t";
        s += ((typeof(e.product_skuid)=='undefined') ? "" : "\"" + e.product_skuid + "\"") + "\t";
        s += "\"" + e.product_property + "\"\t";
        s += e.product_count + "\t";
        s += e.product_price + "\t";
        s += e.order.product_action + "\t";
        s += "https:" + e.product_url + "\t";
        s += "\"" + e.product_pic_url + "\"\t";
        s += "https:" + e.product_snapshot + "\t";
        s += "https://trade.aliexpress.com/order_detail.htm?orderId=" + e.order.order_id + "\t";
        s += "\n";

      });
      //console.log(s);
      GM_setClipboard (s);
      $("#csvBtn").text("Loaded to clipboard");
    });
  }
}).appendTo("#appeal-alert");

function test(data){ return data;}