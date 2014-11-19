collection.js
=============

Collection.js is small but yet powerfull local database build on top of the localstorage.

Why I should bother?
===================
If you are looking for simple solution to store you data locally and localStorage is not enough try collection.js.
Collection.js gives you powerfull API, which allows you to save/update/remove/sort/filter data.

Pros:
----
 - No configuration
 - No dependencies
 - Simple API
 - MIT license


Examples
========

Creating a collection
---------------------

```js
var myCollection = new Collection('myCollection');
```

Adding data to collection
-------------------------
```js
myCollection.save({test: 'test'});
```

Removing data from collection
-------------------------
```js
myCollection.remove(1);
```

Quering data
-------------------------
```js
myCollection.find(function(item) {
    if (item.description.substring('test') >= 0) {
        return true;
    }
});

```

Sorting data
-------------------------
```js
myCollection.sort(function(a,b){
    return a.order - b.order;
});
```

Getting by id
-------------------------
```js
myCollection.id(1);
```

Destroying a collection
----------------

```js
myCollection.destroy();
```

Looping trough the collection
---------------------------

```js
for (var i = 0; i < myCollection.length; i++) {
    console.log(myCollection[i]);
}
```

API
========

`new Collection(name, unserializer, serializer)`
------------------------------------------------

Creates new collection object

###Properties
 - `name` collection's name points to localStorage's key name
 - `unserializer` (optional) called when collection is loaded from localStorage, allows you to cast data, or extend entities
 - `serializer` (optional) called right before the entity is saved

`Collection.save(entity)`
------------------------------------------------

Saves or updates entity in the collection, returns the entitie's id

###Properties
 - `entity` object stored in the collection (after storing each object automatically gets immutable `_id` key)

`Collection.remove(entity)`
------------------------------------------------

Removes existing entity

###Properties
- `entity` can be either entity or entities's id

`Collection.id(id)`
------------------------------------------------
Returns entity with given id

###Properties
- `id` entitie's id

`Collection.find(query, sort)`
------------------------------------------------
Filters entities matching the `query` function. If none passed all entities will be available in collection

###Properties
- `query` (optional) filter function
- `sort` (optional) sorting function

`Collection.sort(sort)`
------------------------------------------------
Sorts the collection

###Properties
- `sort` sorting function

`Collection.drop()`
------------------------------------------------
Clears collection object and destroys collection's data stored in local storage



