function range(a, b, step){
    if (a == b) {
        if (!step || step === 1) {
            return [a];
        } else {
            return [];
        }
    }

    if (a > b) {
        return [];
    }

    var A = [];
    if(typeof a === 'number'){
        A[0]= a;
        step= step || 1;
        while(a+step<= b){
            A[A.length]= a+= step;
        }
    }
    else{
        var s = 'abcdefghijklmnopqrstuvwxyz';
        if( a === a.toUpperCase()){
            b = b.toUpperCase();
            s = s.toUpperCase();
        }
        s = s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A = s.split('');
    }
    return A;
}

describe('Collection.js', function() {

    it ('should be able to create new collection', function() {
        localStorage.clear();
        var collection = new Collection('Test');
        collection.save({test: 1});

        expect(localStorage.getItem('Test_1') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_meta') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_meta')).toEqual('{"name":"Test","length":1,"lastId":1,"map":[1]}');
        expect(localStorage.getItem('Test_1')).toEqual('{"test":1}');
    });

    it ('should be able to get the entity by its id', function() {
        var collection = new Collection('Test');
        expect(collection.id(1)).toEqual({test: 1});
    });

    it ('should be able to save the entity', function() {
        localStorage.clear();
        var id;
        var collection = new Collection('Test');

        expect(collection.length).toEqual(0);

        id = collection.save({test: 1});
        expect(collection.length).toEqual(1);
        expect(collection[0]).toEqual({test: 1});
        expect(localStorage.getItem('Test_1') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_1')).toEqual('{"test":1}');
        expect(id).toBe(1);

        id = collection.save({test2: 2});
        expect(collection.length).toEqual(2);
        expect(collection[1]).toEqual({test2: 2});
        expect(localStorage.getItem('Test_2') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_2')).toEqual('{"test2":2}');
        expect(localStorage.getItem('Test_meta')).toEqual('{"name":"Test","length":2,"lastId":2,"map":[1,2]}');
        expect(id).toBe(2);

        id = collection.save({test3: 3});
        expect(collection.length).toEqual(3);
        expect(collection[2]).toEqual({test3: 3});
        expect(localStorage.getItem('Test_3') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_3')).toEqual('{"test3":3}');
        expect(localStorage.getItem('Test_meta')).toEqual('{"name":"Test","length":3,"lastId":3,"map":[1,2,3]}');
        expect(id).toBe(3);

    });

    it ('should be able to remove the entity', function() {
        localStorage.clear();
        var collection = new Collection('Test');

        for (var i = 0; i < 100; i++) {
            var obj = {};
            obj['item_' + i] = i;
            collection.save(obj);
        }

        for (var i = 0; i < 100; i++) {
            var meta = {name: 'Test', length: 99 - i, lastId: 100, map: range(i + 2, 100)};
            collection.remove(i + 1);
            expect(collection.length).toEqual(99 - i);
            expect(collection._meta).toEqual(meta);
            expect(localStorage.getItem('Test_meta')).toEqual(JSON.stringify(meta));
        }

    });

    it ('should be able to update the entity', function() {
        localStorage.clear();
        var id;
        var collection = new Collection('Test');

        expect(collection.length).toEqual(0);

        id = collection.save({test: 1});
        expect(collection.length).toEqual(1);
        expect(collection[0]).toEqual({test: 1});
        expect(localStorage.getItem('Test_1') !== null).toBeTruthy();
        expect(localStorage.getItem('Test_1')).toEqual('{"test":1}');
        expect(id).toBe(1);

        collection.save({othertest: 2, _id: id});
        expect(localStorage.getItem('Test_1')).toEqual('{"othertest":2}');

    });

    it ('should be able to find group of elements', function() {
        localStorage.clear();
        var fruits = ["Dragonfruit", "Nectarine", "Star fruit", "Honeydew", "Grape", "Rock melon", "Tangerine", "Melon", "Cherry", "Goji berry", "Blood Orange", "Breadfruit", "Pear", "Cantaloupe", "Blackcurrant", "Orange", "Tomato", "Kumquat", "Strawberry", "Fig", "Physalis", "Mango", "Feijoa", "Boysenberry", "Cherimoya", "Damson", "Peach", "Pomelo", "Miracle fruit", "Plum", "Mandarine", "Gooseberry", "Lychee", "Pepper", "Jujube", "Cucumber", "Ugli fruit", "Papaya", "Eggplant", "Honeydew", "Watermelon", "Olive", "Lime", "Jambul", "Banana", "Cloudberry", "Passionfruit", "Salmon berry", "Blueberry", "Pineapple", "Durian", "Persimmon", "Apple", "Lemon", "Loquat", "Pomegranate", "Rambutan", "Satsuma", "Guava", "Avocado", "Coconut", "Mulberry", "Raisin", "Huckleberry", "Kiwi fruit", "Purple Mangosteen", "Blackberry", "Marion berry", "Bilberry", "Nut", "Raspberry", "Redcurrant", "Tamarillo", "Date", "Currant", "Apricot", "Cantaloupe", "Jackfruit", "Quince", "Cranberry", "Elderberry", "Grapefruit", "Salal berry"];
        var collection = new Collection('Fruits');
        for (var i = 0; i < fruits.length; i++) {
            var data = {
                name: fruits[i],
                length: fruits[i].length
            };
            collection.save(data);
        }

        expect(collection.length).toEqual(fruits.length);

        collection.find(function findAllFruitsStartingWithALetter(item) {
            return item.name.toLowerCase().indexOf('a') === 0;
        });

        expect(collection.length).toEqual(fruits.filter(function(val) {
            return val.toLowerCase().indexOf('a') === 0;
        }).length);

        expect(collection.length).toEqual(3);
        expect(collection.hasOwnProperty(collection.length)).toBeFalsy();//check if collection was cleared

        collection.find();
        expect(collection.length).toEqual(fruits.length);


    });

    it ('should be able to sort group of elements', function() {
        localStorage.clear();
        var fruits = ["Dragonfruit", "Nectarine", "Star fruit", "Honeydew", "Grape", "Rock melon", "Tangerine", "Melon", "Cherry", "Goji berry", "Blood Orange", "Breadfruit", "Pear", "Cantaloupe", "Blackcurrant", "Orange", "Tomato", "Kumquat", "Strawberry", "Fig", "Physalis", "Mango", "Feijoa", "Boysenberry", "Cherimoya", "Damson", "Peach", "Pomelo", "Miracle fruit", "Plum", "Mandarine", "Gooseberry", "Lychee", "Pepper", "Jujube", "Cucumber", "Ugli fruit", "Papaya", "Eggplant", "Honeydew", "Watermelon", "Olive", "Lime", "Jambul", "Banana", "Cloudberry", "Passionfruit", "Salmon berry", "Blueberry", "Pineapple", "Durian", "Persimmon", "Apple", "Lemon", "Loquat", "Pomegranate", "Rambutan", "Satsuma", "Guava", "Avocado", "Coconut", "Mulberry", "Raisin", "Huckleberry", "Kiwi fruit", "Purple Mangosteen", "Blackberry", "Marion berry", "Bilberry", "Nut", "Raspberry", "Redcurrant", "Tamarillo", "Date", "Currant", "Apricot", "Cantaloupe", "Jackfruit", "Quince", "Cranberry", "Elderberry", "Grapefruit", "Salal berry"];
        var collection = new Collection('Fruits');
        for (var i = 0; i < fruits.length; i++) {
            var data = {
                name: fruits[i],
                length: fruits[i].length
            };
            collection.save(data);
        }

        expect(collection.length).toEqual(fruits.length);


        collection.sort(function sortByName(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        fruits.sort();
        expect(collection.length).toEqual(fruits.length);

        for (var i = 0; i < collection.length; i++) {
            expect(collection[i].name).toEqual(fruits[i]);
        }

    });

    it ('should be able to find and sort', function() {
        localStorage.clear();
        var fruits = ["Dragonfruit", "Nectarine", "Star fruit", "Honeydew", "Grape", "Rock melon", "Tangerine", "Melon", "Cherry", "Goji berry", "Blood Orange", "Breadfruit", "Pear", "Cantaloupe", "Blackcurrant", "Orange", "Tomato", "Kumquat", "Strawberry", "Fig", "Physalis", "Mango", "Feijoa", "Boysenberry", "Cherimoya", "Damson", "Peach", "Pomelo", "Miracle fruit", "Plum", "Mandarine", "Gooseberry", "Lychee", "Pepper", "Jujube", "Cucumber", "Ugli fruit", "Papaya", "Eggplant", "Honeydew", "Watermelon", "Olive", "Lime", "Jambul", "Banana", "Cloudberry", "Passionfruit", "Salmon berry", "Blueberry", "Pineapple", "Durian", "Persimmon", "Apple", "Lemon", "Loquat", "Pomegranate", "Rambutan", "Satsuma", "Guava", "Avocado", "Coconut", "Mulberry", "Raisin", "Huckleberry", "Kiwi fruit", "Purple Mangosteen", "Blackberry", "Marion berry", "Bilberry", "Nut", "Raspberry", "Redcurrant", "Tamarillo", "Date", "Currant", "Apricot", "Cantaloupe", "Jackfruit", "Quince", "Cranberry", "Elderberry", "Grapefruit", "Salal berry"];
        var collection = new Collection('Fruits');
        for (var i = 0; i < fruits.length; i++) {
            var data = {
                name: fruits[i],
                length: fruits[i].length
            };
            collection.save(data);
        }

        expect(collection.length).toEqual(fruits.length);

        collection.find(function findAllFruitsStartingWithALetter(item) {
            return item.name.toLowerCase().indexOf('a') === 0;
        }, function sortByName(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        var filtered = fruits.filter(function(val) {
            return val.toLowerCase().indexOf('a') === 0;
        });

        filtered.sort();
        expect(collection.length).toEqual(filtered.length);


        for (var i = 0; i < collection.length; i++) {
            expect(collection[i].name).toEqual(filtered[i]);
        }

    });

    it ('should be able to drop a collection', function() {
        localStorage.clear();
        var fruits = ["Dragonfruit", "Nectarine", "Star fruit", "Honeydew", "Grape", "Rock melon", "Tangerine", "Melon", "Cherry", "Goji berry", "Blood Orange", "Breadfruit", "Pear", "Cantaloupe", "Blackcurrant", "Orange", "Tomato", "Kumquat", "Strawberry", "Fig", "Physalis", "Mango", "Feijoa", "Boysenberry", "Cherimoya", "Damson", "Peach", "Pomelo", "Miracle fruit", "Plum", "Mandarine", "Gooseberry", "Lychee", "Pepper", "Jujube", "Cucumber", "Ugli fruit", "Papaya", "Eggplant", "Honeydew", "Watermelon", "Olive", "Lime", "Jambul", "Banana", "Cloudberry", "Passionfruit", "Salmon berry", "Blueberry", "Pineapple", "Durian", "Persimmon", "Apple", "Lemon", "Loquat", "Pomegranate", "Rambutan", "Satsuma", "Guava", "Avocado", "Coconut", "Mulberry", "Raisin", "Huckleberry", "Kiwi fruit", "Purple Mangosteen", "Blackberry", "Marion berry", "Bilberry", "Nut", "Raspberry", "Redcurrant", "Tamarillo", "Date", "Currant", "Apricot", "Cantaloupe", "Jackfruit", "Quince", "Cranberry", "Elderberry", "Grapefruit", "Salal berry"];
        var collection = new Collection('Fruits');
        for (var i = 0; i < fruits.length; i++) {
            var data = {
                name: fruits[i],
                length: fruits[i].length
            };
            collection.save(data);
        }
        expect(localStorage.length).toEqual(fruits.length + 1);
        collection.drop();
        expect(localStorage.length).toEqual(0);

    });


});
