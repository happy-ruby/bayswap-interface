import DotLoader from 'react-spinners/DotLoader';

type Props = {
  visible?: boolean;
};

function ProcessLoader({ visible = true }: Props) {
  if (visible) {
    return <DotLoader color="#0071ff" />;
  }

  return null;
}

export default ProcessLoader;
