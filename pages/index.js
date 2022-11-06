import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { loginUrl } from './api/spotify';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Playlist Merge</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1>Welcome to Spotify Playlist Merge</h1>
      <a href={loginUrl} id='signInButton'>
        Sign in with spotify!
      </a>
    </div>
  );
}
