# Mongoose JSON API Filter

## Basic Usage

given we have url like this `api/user?filter[email][is]=foo@mail.com`
you can use this module in your body like this

```javascript
import parseFilter from 'mongoose-jsonapi-filter';
import UserModel from './modelPath/user';

// express router / controller
app.get('/api/users', async (req, res) => {
  const { filter } = req.query;

  // then you can do this
  const parsedFilter = parseFilter(filter);

  /* it will actually transform like the above url this
    {
      email : {
        '$eq': 'foo@mail.com'
      }
    }
  */
  // so you can pass it directly to mongoose
  const users = await User.find(filter);
  res.json({ data: users });
});
```

## Sanitize field

you might want to sanitize filter. for example you might want to disable
filter on password field. you can do it by passing array of field to the second parameter

```javascript
import parseFilter from 'mongoose-jsonapi-filter';
import UserModel from './modelPath/user';

// express router / controller
app.get('/api/users', async (req, res) => {
  const { filter } = req.query;
  const sanitizedField = ['password'];
  // then you can do this
  const parsedFilter = parseFilter(filter, sanitizedField);

  /* it will still actually transform like the above url this
    {
      email : {
        '$eq': 'foo@mail.com'
      }
    }
  */

  // so you can pass it directly to mongoose
  const users = await User.find(filter);
  res.json({ data: users });
});
```

## Default mapping

By default this module will map keyword 'is' to 'equal' and 'like' to 'regex' and will also transform
the string to regex

## Extending Default Mapping

You can extends default mapping by passing it as the third argument

for example you want url to be formated like `api/user?filter[email][damnnotequal]=foo@mail.com`
you can see available format in mongodb here (https://docs.mongodb.com/manual/reference/operator/query/#comparison)[https://docs.mongodb.com/manual/reference/operator/query/#comparison]

you can have

```javascript
import parseFilter from 'mongoose-jsonapi-filter';
import UserModel from './modelPath/user';

// express router / controller
app.get('/api/users', async (req, res) => {
  const { filter } = req.query;
  const sanitizedField = ['password'];
  const customMapping = {
    // without the $ sign, this module will automatically add it for you
    damnnotequal: 'ne',
  };
  // then you can do this
  const parsedFilter = parseFilter(filter, sanitizedField, customMapping);

  /* it will still actually transform like the above url this
    {
      email : {
        '$ne': 'foo@mail.com'
      }
    }
  */

  // so you can pass it directly to mongoose
  const users = await User.find(filter);
  res.json({ data: users });
});
```

## Filter Mapping Value to Regex

by default this module will map the value of filter with key 'like' into 'regex'

given we have url like this `api/user?filter[email][like]=foo@mail.com`
you can use this module in your body like this

```javascript
import parseFilter from 'mongoose-jsonapi-filter';
import UserModel from './modelPath/user';

// express router / controller
app.get('/api/users', async (req, res) => {
  const { filter } = req.query;
  const sanitizedField = ['password'];
  // then you can do this
  const parsedFilter = parseFilter(filter, sanitizedField);

  /* it will still actually transform like the above url this
    {
      email : {
        '$regex': /foo@mail.com/gmi
      }
    }
  */

  // so you can pass it directly to mongoose
  const users = await User.find(filter);
  res.json({ data: users });
});
```

## extend filter mapping value that transformed to regex

given we have url like this `api/user?filter[email][helllike]=foo@mail.com`
you can use this module in your body like this and you want to transform `hellike` into
regex you will need to use a regex for value in mapping like this

```javascript
import parseFilter from 'mongoose-jsonapi-filter';
import UserModel from './modelPath/user';

// express router / controller
app.get('/api/users', async (req, res) => {
  const { filter } = req.query;
  const sanitizedField = ['password'];
  const customMapping = {
    // without the $ sign, this module will automatically add it for you
    hellike: 'regex',
  };
  // then you can do this
  const parsedFilter = parseFilter(filter, sanitizedField, customMapping);

  /* it will still actually transform like the above url this
    {
      email : {
        '$regex': /foo@mail.com/gmi
      }
    }
  */

  // so you can pass it directly to mongoose
  const users = await User.find(filter);
  res.json({ data: users });
});
```
