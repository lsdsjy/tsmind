import { ViewRoot } from './model'
const node: ViewRoot = {
  label: 'Root',
  id: 'root',
  expanded: true,
  direction: 'right',
  size: [150, 40],
  coord: [0, 0],
  children: [
    {
      label: 'sup2',
      id: 'sub2',
      direction: 'right',
      expanded: false,
      coord: [300, 20],
      size: [100, 30],
      children: [
        {
          label: 'sub4',
          id: 'sub4',
          direction: 'right',
          expanded: false,
          coord: [300, 20],
          size: [100, 30],
          children: [
          ]
        },
        {
          label: 'sub3',
          id: 'sub3',
          direction: 'right',
          expanded: false,
          coord: [300, 20],
          size: [100, 30],
          children: [
          ]
        },
      ]
    },
    {
      label: 'sub5',
      id: 'sub5',
      direction: 'right',
      expanded: false,
      coord: [300, 20],
      size: [100, 30],
      children: []
    },
    {
      label: 'sub1',
      id: 'sub1',
      direction: 'left',
      expanded: false,
      coord: [200, 50],
      size: [100, 30],
      children: []
    }
  ]
}
export default node
