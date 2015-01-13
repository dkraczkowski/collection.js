
Collection.js 1.1.0, 13.01.2015
-------------------------------
 - Collection constructor parameters changed from unserializer, serializer to reader, writer
 - now reader and writer can both return false to ommit entity from getting or saving into collection
 - Collecion.find and Collection.sort now returns Collection object (supports fluent interfaces)
 - Added Collection.read, now collections can reread data from local storage
 - Added aggregation method: group

Collection.js 1.0.1, 20.11.2014
-------------------------------
 - Collection.name is no longer writable property

Collection.js 1.0.0, 18.11.2014
-------------------------------
 - Added jasmine test runner
 - Improved performance of Collection.prototype.delete method

