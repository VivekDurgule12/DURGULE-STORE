import React from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({
  children,
  title = "Durgule Store",
  description = "Durgule Store is a place where you can find all your favorite products.",
  keywords = "Durgule Store, products, shopping",
  author = "VIVEK DURGULE",
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        <title>{title}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Toaster position="top-right" />
      <Footer />
    </div>
  );
};

export default Layout;
