import { Block } from '@/atoms/types';

export const DEFAULT_LABELS = [
  '밤토리에 오신걸 환영 합니다 :)',
  '밤토리에서 이벤트를 만들고 행복을 나눌 수 있어요',
  '이벤트 만들고 선물을 준비를 해보시는건 어떨까요',
  '일단, 이벤트에 참여해주셔서 감사해요',
  '참여하시고, 후기 작성도 꼭 부탁 드려요:)',
];

export const DEFAULT_BLOCKS: Block[] = [
  {
    id: '1234-5678-9abc-def0',
    type: 'auto-checkbox',
    content: {
      texts: [
        '밤토리에 오신걸 환영 합니다 :)',
        '밤토리에서 이벤트를 만들고 행복을 나눌 수 있어요',
        '이벤트 만들고 선물을 준비를 해보시는건 어떨까요',
        '일단, 이벤트에 참여해주셔서 감사해요',
        '참여하시고, 후기 작성도 꼭 부탁 드려요:)',
      ],
    },
    createdAt: '2024-11-29T19:00:00.000Z',
    updatedAt: '2024-11-29T19:00:00.000Z',
  },
] as const;
