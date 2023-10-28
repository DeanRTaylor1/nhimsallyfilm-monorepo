import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "../Components/Layout/Layout";
import AdminDashboardLayout from "../Components/Layout/Admin/AdminLayout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  ...appProps
}: AppProps) {
  const getContent = () => {
    if (appProps.router.pathname.includes("/admin/dashboard"))
      return (
        <SessionProvider session={session}>
          <AdminDashboardLayout>
            <Component {...pageProps} />
          </AdminDashboardLayout>
        </SessionProvider>
      );
    if (appProps.router.pathname.includes("/admin"))
      return (
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      );

    return (
      <Layout>
        <Head>
          <title>NhimSallyFilm</title>
          <meta name="description" content="Film By @NhimSally.Film" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content="NhimSally.Film" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.nhimsallyfilm.com" />
          <meta property="og:image" content="/socialshare.jpg" />
          <meta
            property="og:description"
            content="Nhim Sally: Vietnamese Photographer, gallery and portfolio"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    );
  };
  return getContent();
}
