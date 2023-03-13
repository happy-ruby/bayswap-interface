import { ReactComponent as DiscordIcon } from 'assets/images/discord.svg';
import { ReactComponent as GithubIcon } from 'assets/images/github.svg';
import { ReactComponent as MediumIcon } from 'assets/images/medium.svg';
import { ReactComponent as TwitterIcon } from 'assets/images/twitter.svg';

import styles from './style.module.css';

const socialNetworks = [
  { href: 'https://discord.gg/Tw7dNCBzVG', Icon: DiscordIcon },
  { href: 'https://twitter.com/bayswap', Icon: TwitterIcon },
  { href: 'https://github.com/BaySwap', Icon: GithubIcon },
  { href: 'https://medium.com/@bayswapio', Icon: MediumIcon },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {socialNetworks.map(({ href, Icon }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={styles.iconLink}
          >
            <Icon className={styles.icon} />
          </a>
        ))}
      </div>
      <div className={styles.copyright}>
        @Copyright {new Date().getFullYear()} by Bay Swap
      </div>
    </footer>
  );
}

export default Footer;
