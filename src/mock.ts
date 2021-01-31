import { Canvas } from './model'

const data: Canvas = {
  children: [
    {
      label: 'Root',
      id: 'root',
      expanded: true,
      direction: 'right',
      root: true,
      coord: [0, 0],
      summaries: [],
      children: [
        {
          label: 'sup2',
          id: 'sub2',
          direction: 'right',
          expanded: false,
          summaries: [{ count: 1, label: 'summ' }],
          children: [
            {
              label: 'sub4',
              id: 'sub4',
              direction: 'right',
              expanded: false,
              children: [],
              summaries: [],
            },
            {
              label: 'sub3',
              id: 'sub3',
              direction: 'right',
              expanded: false,
              children: [],
              summaries: [],
            },
          ],
        },
        {
          label: 'sub5',
          id: 'sub5',
          direction: 'right',
          expanded: false,
          children: [],
          summaries: [],
        },
        {
          label: 'sub1',
          id: 'sub1',
          direction: 'left',
          expanded: false,
          children: [],
          summaries: [],
        },
      ],
    },
  ],
}

export default data
