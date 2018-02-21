# html-import-partials

Easily build a static html file by including html partials.

## Usage
Install via npm

```
npm install html-import-partials
```

or yarn 

```
yarn add html-import-partials
```

#### Command line:

```
$ html-import-partials src/*html -o dist
``` 

#### In Your File:
In the html file include a `<include>`.
This tag will be replaced with the `src` you provide.

```
<include src='location/of/some/file.html'/>
```

## Examples

### Basic
Simply include the files where you want them

File: `./example/src/foo.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Foo</title>
</head>
<body>
    <h1>Welcome to my website</h1>

    <include src='partials/header.html'/>
</body>
</html>
```

File: `./example/src/partials/footer.html`

```html
<p>Footer here!!!</p>
```

Command: `$ html-import-partials example/src/*html -o example/dist`

Compiled file: `./example/dist/foo.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Foo</title>
</head>
<body>
    <h1>Welcome to my website</h1>
    
    <p>Footer here!!!</p>
</body>
</html>
```