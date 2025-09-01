// pages/_document.tsx
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document<{ nonce: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = (ctx.req?.headers["x-nonce"] as string) || "";
    return { ...initialProps, nonce };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript nonce={(this.props as any).nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
