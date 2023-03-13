import styles from './style.module.css';

type Props = {
  link: string;
};

function SuccessContent({ link }: Props) {
  return (
    <div className={styles.content}>
      <span>
        Your transaction is submitted to SUI blockchain. To learn more details,
        see
      </span>
      <a href={link} target="_blank" rel="noreferrer" className={styles.link}>
        here
      </a>
    </div>
  );
}

export default SuccessContent;
