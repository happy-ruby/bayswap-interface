const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// eslint-disable-next-line
export const waitingTxExecuted = async (txDigest: string) => {
  // FIXME: find a properly method to waiting tx executed
  // eslint-disable-next-line
  await sleep(5 * 1000);
};
