// require('dotenv').config();

const Typesense = require("typesense");
const products = require("./data/ecommerce.json");


module.exports = (async () => {
  // Create a client
  const typesense = new Typesense.Client({
    apiKey: "VfjYbDVVhpcsSoeYl2WxLL8CGqOiMPe8" , // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: "n874w3bqsy2tcfjep-1.a1.typesense.net",
        port:"443",
        protocol: "https"
      }
    ]
  });

  const schema ={
        "name": "test",  // The name of your Typesense collection
    num_documents:0,
    enable_nested_fields:true,
        "fields": [
          { "name": "Item", "type": "string" },
          { "name": "ID", "type": "int32"},
          { "name": "Name", "type": "string" },
          { "name": "Type", "type": "string" },
          { "name": "SKU", "type": "string" },
          { "name": "Options", "type": "string" },
          { "name": "Inventory Tracking", "type": "string" },
          { "name": "Current Stock", "type": "int32" },
          { "name": "Low Stock", "type": "int32" },
          { "name": "Price", "type": "float" },
          { "name": "Cost Price", "type": "int32" },
          { "name": "Retail Price", "type": "int32" },
          { "name": "Sale Price", "type": "int32",optional:true },
          { "name": "Brand ID", "type": "int32" },
          { "name": "Channels", "type": "int32" },
          { "name": "Categories", "type": "string" },
          { "name": "Description", "type": "string" },
          { "name": "Custom Fields", "type": "string" },
          { "name": "Page Title", "type": "string" },
          { "name": "Product URL", "type": "string" },
          { "name": "Meta Description", "type": "string" },
          { "name": "Search Keywords", "type": "string" },
          { "name": "Meta Keywords", "type": "string" },
          { "name": "Bin Picking Number", "type": "int32" },
          { "name": "UPC", "type": "object","properties": {
              "EAN": {"type": "string", "optional": true}
              // Add other properties of the UPC object if needed
            } },
          { "name": "Global Trade Number", "type": "string" },
          { "name": "Manufacturer Part Number", "type": "string" },
          { "name": "Free Shipping", "type": "bool" },
          { "name": "Fixed Shipping Cost", "type": "int32" },
          { "name": "Weight", "type": "int32" },
          { "name": "Width", "type": "int32" },
          { "name": "Height", "type": "int32" },
          { "name": "Depth", "type": "int32" },
          { "name": "Is Visible", "type": "bool" },
          { "name": "Is Featured", "type": "bool" },
          { "name": "Warranty", "type": "string" },
          { "name": "Tax Class", "type": "int32" },
          { "name": "Product Condition", "type": "string" },
          { "name": "Show Product Condition", "type": "bool" },
          { "name": "Sort Order", "type": "int32" },
          { "name": "Variant Image URL", "type": "string" },
          { "name": "Internal Image URL (Export)", "type": "string" },
          { "name": "Image URL (Import)", "type": "string" },
          { "name": "Image Description", "type": "string" },
          { "name": "Image is Thumbnail", "type": "bool" },
          { "name": "Image Sort Order", "type": "int32" },
          { "name": "YouTube ID", "type": "string" },
          { "name": "Video Title", "type": "string" },
          { "name": "Video Description", "type": "string" },
          { "name": "Video Sort Order", "type": "string" }
        ]
      }
  ;

  console.log("Populating index in Typesense");

  const products = require("./data/ecommerce.json");

  let reindexNeeded = false;

  try {
    const collection = await typesense.collections("test").retrieve();
    console.log('Collection retrieved:', collection);
    console.log("Deleting existing schema");
    await typesense.collections("test").delete();
    console.log('deleted');

    await typesense.collections().create(schema);
  } catch (error) {
    debugger
    if (error.name && error.httpStatus === 404) {
      // debugger
      console.error('Collection not found. You can create it here.');
      // Perform actions to create the collection if it doesn't exist.

      console.log("Creating schema: ");
      await typesense.collections().create(schema);
      const collectionRetrieved = await typesense
          .collections("test")
          .retrieve();
      console.log("Retrieving created schema: ");
    } else {
      console.error('Error retrieving collection:', error);
    }
  }




  console.log("Adding records: ");

  // Bulk Import
  products.forEach(product => {
    product.free_shipping = product.Name.length % 2 === 1; // We need this to be deterministic for tests
    product.rating = (product.Description.length % 5) + 1; // We need this to be deterministic for tests
    // product.categories.forEach((category, index) => {
    //   product[`categories.lvl${index}`] = [
    //     product.categories.slice(0, index + 1).join(" > ")
    //   ];
    // });
  });


  try {
    const returnData = await typesense
      .collections("test")
      .documents()
      .import(products);
    console.log({returnData});
    console.log("Done indexing.");

    const failedItems = returnData.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`
      );
    }
    return returnData;
  } catch (error) {
    console.log(error.importResults)
    console.log(error);
  }
})();
