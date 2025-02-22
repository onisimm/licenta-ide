import { memo } from 'react';

const MainComponent = memo((props: any) => {
  console.log('MainComponent called');
  return <div className="wrapper-component">Hello</div>;
});

export default MainComponent;
