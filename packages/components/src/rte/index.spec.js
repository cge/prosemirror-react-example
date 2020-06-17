import Rte from '.';
import renderer from 'react-test-renderer';

describe('Rte', () => {
  it('renders without crashing', () => {
    shallow(<Rte id="hello" onChange={() => {}} />);
  });

  it('renders correctly', () => {
    let tree = renderer.create(<Rte id="hello" onChange={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
