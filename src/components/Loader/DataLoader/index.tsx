import PulseLoader from 'react-spinners/PulseLoader';

type Props = {
  visible?: boolean;
};

function DataLoader({ visible = true }: Props) {
  if (visible) {
    return <PulseLoader color="#0071ff" />;
  }

  return null;
}

export default DataLoader;
