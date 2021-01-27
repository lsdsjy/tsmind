import { TreeNode } from './model'
const node: TreeNode = {
  label: 'Root',
  id: 'root',
  expanded: true,
  direction: 'right',
  children: [
    {
      label: 'sup2',
      id: 'sub2',
      direction: 'right',
      expanded: false,
      children: [
        {
          label: 'sub4',
          id: 'sub4',
          direction: 'right',
          expanded: false,
          children: [],
        },
        {
          label: 'sub3',
          id: 'sub3',
          direction: 'right',
          expanded: false,
          children: [],
        },
      ],
    },
    {
      label: 'sub5',
      id: 'sub5',
      direction: 'right',
      expanded: false,
      children: [],
    },
    {
      label: 'sub1',
      id: 'sub1',
      direction: 'left',
      expanded: false,
      children: [],
    },
  ],
}
export default node
