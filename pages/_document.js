// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import cookie from 'js-cookie';

class MyDocument extends Document {
  render() {
      const token = cookie.get('token');
      let isLoggedIn = true;

  
      if (token) {
        const parsedToken = JSON.parse(token);
        isLoggedIn = parsedToken.isLoggedIn;
      }
  
      const bodyClass = isLoggedIn === true ? 'body' : 'body-not-logged';
  

    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta title="Tatt2 Application" />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
            crossOrigin="anonymous"
          />
          <script src="https://js.radar.com/v3/radar.min.js"></script>
        </Head>

        <body className={bodyClass}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

