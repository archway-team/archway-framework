# archway-framework

Small but powerful UI centered framework

- USH, or JSX-like syntax but with functions
- Easy to write and declarative interface
- Minimalistic Virtual DOM just under 3 kB

Here's an example counter app.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import Archway, {
        useState,
      } from "https://unpkg.com/archway-framework@latest?module";
      import jsh, {
        div,
        button,
        h1,
      } from "https://unpkg.com/@archway/jsh@latest?module";

      const Counter = () => {
        const component = (props) => {
          let [count, setCount] = useState(1);

          return div(
            {},
            h1({}, `Count: ${count}`),
            button({ onClick: () => setCount((c) => c + 1) }, "Click Me")
          );
        };

        return jsh(component)();
      };

      Archway.render(Counter({}), document.getElementById("root"));
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Installation

```
npm i archway-framework
```

You can use Archway with a module bundler like Webpack to import it into your application. Alternatively, include Archway with a `script` tag with a module type.

```html
<script type="module">
  import Archway, {
    useState,
  } from "https://unpkg.com/archway-framework@latest?module";
</script>
```
