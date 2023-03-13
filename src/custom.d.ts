declare module '*.css';

declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string }
  >;
}
