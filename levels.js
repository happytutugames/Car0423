const LEVELS = {
  1: {
    map: '0001',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Right', size: 2, x: 2, y: 8, speed: 300, logic: 'straight' }
    ],
    intersections: [
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 8, y: 9 },
      { id: '4002', x: 7, y: 8 }
    ],
    target: 1
  },

  2: {
    map: '0002',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Right', size: 2, x: 2, y: 8, speed: 300, logic: 'straight' },
      { id: '0002', type: 'youzhuan', dir: 'Up', size: 2, x: 4, y: 10, speed: 300, logic: 'right_turn' }
    ],
    intersections: [
      { id: '1001', type: 't', opening: 'Down', x: 4, y: 8 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 8, y: 9 },
      { id: '4002', x: 7, y: 8 }
    ],
    target: 2
  },

  3: {
    map: '0003',
    cars: [
      { id: '0001', type: 'youdiaotou', dir: 'Right', size: 2, x: 2, y: 6, speed: 300, logic: 'right_uturn' },
      { id: '0002', type: 'zuozhuan', dir: 'Down', size: 2, x: 4, y: 4, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'youzhuan', dir: 'Up', size: 2, x: 4, y: 8, speed: 300, logic: 'right_turn' },
      { id: '0004', type: 'zhixing', dir: 'Up', size: 2, x: 4, y: 10, speed: 300, logic: 'straight' },
      { id: '0005', type: 'youzhuan', dir: 'Right', size: 2, x: 2, y: 11, speed: 300, logic: 'right_turn' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 4, y: 6 },
      { id: '1002', type: 'cross', x: 4, y: 11 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 8, y: 7 },
      { id: '4002', x: 4, y: 0 },
      { id: '4003', x: 5, y: 20 },
      { id: '4004', x: 5, y: 20 },
      { id: '4005', x: 0, y: 11 },
      { id: '4006', x: 7, y: 6 },
      { id: '4007', x: 4, y: 19 }
    ],
    target: 5
  },

  4: {
    map: '0004',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Up', size: 2, x: 2, y: 6, speed: 300, logic: 'straight' },
      { id: '0002', type: 'youzhuan', dir: 'Down', size: 2, x: 2, y: 7, speed: 300, logic: 'right_turn' },
      { id: '0003', type: 'zhixing', dir: 'Up', size: 2, x: 2, y: 11, speed: 300, logic: 'straight' },
      { id: '0004', type: 'zuozhuan', dir: 'Right', size: 2, x: 3, y: 9, speed: 300, logic: 'left_turn' },
      { id: '0005', type: 'zuozhuan', dir: 'Down', size: 2, x: 5, y: 7, speed: 300, logic: 'left_turn' },
      { id: '0006', type: 'zuozhuan', dir: 'Up', size: 2, x: 5, y: 11, speed: 300, logic: 'left_turn' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 2, y: 9 },
      { id: '1002', type: 'cross', x: 5, y: 9 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 2, y: 0 },
      { id: '4002', x: 0, y: 9 },
      { id: '4003', x: 5, y: 0 },
      { id: '4004', x: 8, y: 10 },
      { id: '4005', x: 7, y: 9 }
    ],
    target: 6
  },

  5: {
    map: '0005',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Down', size: 2, x: 2, y: 3, speed: 300, logic: 'straight' },
      { id: '0002', type: 'zuozhuan', dir: 'Right', size: 2, x: 3, y: 5, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'youzhuan', dir: 'Up', size: 2, x: 2, y: 7, speed: 300, logic: 'right_turn' },
      { id: '0004', type: 'zhixing', dir: 'Up', size: 2, x: 5, y: 7, speed: 300, logic: 'straight' },
      { id: '0005', type: 'zuozhuan', dir: 'Up', size: 2, x: 5, y: 9, speed: 300, logic: 'left_turn' },
      { id: '0006', type: 'zuodiaotou', dir: 'Right', size: 2, x: 0, y: 10, speed: 300, logic: 'left_uturn' },
      { id: '0007', type: 'zhixing', dir: 'Right', size: 2, x: 3, y: 10, speed: 300, logic: 'straight' },
      { id: '0008', type: 'youzhuan', dir: 'Up', size: 2, x: 2, y: 12, speed: 300, logic: 'right_turn' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 2, y: 5 },
      { id: '1002', type: 'cross', x: 5, y: 5 },
      { id: '1003', type: 'cross', x: 2, y: 10 },
      { id: '1004', type: 'cross', x: 5, y: 10 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 5, y: 0 },
      { id: '4002', x: 0, y: 5 },
      { id: '4003', x: 8, y: 6 },
      { id: '4004', x: 8, y: 11 },
      { id: '4005', x: 3, y: 20 },
      { id: '4006', x: 7, y: 10 },
      { id: '4007', x: 7, y: 5 }
    ],
    target: 8
  },

  6: {
    map: '0006',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Down', size: 2, x: 4, y: 3, speed: 300, logic: 'straight' },
      { id: '0002', type: 'youzhuan', dir: 'Down', size: 2, x: 4, y: 5, speed: 300, logic: 'right_turn' },
      { id: '0003', type: 'zuodiaotou', dir: 'Left', size: 2, x: 6, y: 7, speed: 300, logic: 'left_uturn' },
      { id: '0004', type: 'zuozhuan', dir: 'Up', size: 2, x: 4, y: 9, speed: 300, logic: 'left_turn' },
      { id: '0005', type: 'zuozhuan', dir: 'Left', size: 2, x: 6, y: 10, speed: 300, logic: 'left_turn' },
      { id: '0006', type: 'zuozhuan', dir: 'Up', size: 2, x: 4, y: 12, speed: 300, logic: 'left_turn' },
      { id: '0007', type: 'zhixing', dir: 'Left', size: 2, x: 2, y: 7, speed: 300, logic: 'straight' },
      { id: '0008', type: 'zuozhuan', dir: 'Up', size: 2, x: 1, y: 9, speed: 300, logic: 'left_turn' },
      { id: '0009', type: 'zhixing', dir: 'Left', size: 2, x: 3, y: 10, speed: 300, logic: 'straight' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 4, y: 7 },
      { id: '1002', type: 'cross', x: 4, y: 10 },
      { id: '1003', type: 'cross', x: 1, y: 10 },
      { id: '1004', type: 'cross', x: 1, y: 7 }
    ],
    obstacles: [
      { id: '2001', x: 3, y: 5, dir: 'Down', speed: 500, waypoints: [{ x: 4, y: 10, dir: 'Up', wait: 300 }, { x: 4, y: 6, dir: 'Down', wait: 300 }] }
    ],
    exits: [
      { id: '4001', x: 4, y: 0 },
      { id: '4002', x: 0, y: 7 },
      { id: '4003', x: 0, y: 10 },
      { id: '4004', x: 8, y: 11 },
      { id: '4005', x: 5, y: 20 },
      { id: '4006', x: 7, y: 10 }
    ],
    target: 9
  },

  7: {
    map: '0007',
    cars: [
      { id: '0001', type: 'zuozhuan', dir: 'Right', size: 2, x: 3, y: 3, speed: 300, logic: 'left_turn' },
      { id: '0002', type: 'zuozhuan', dir: 'Up', size: 2, x: 5, y: 5, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'zuozhuan', dir: 'Down', size: 2, x: 2, y: 4, speed: 300, logic: 'left_turn' },
      { id: '0004', type: 'youdiaotou', dir: 'Right', size: 2, x: 3, y: 6, speed: 300, logic: 'right_uturn' },
      { id: '0005', type: 'youzhuan', dir: 'Up', size: 2, x: 5, y: 8, speed: 300, logic: 'right_turn' },
      { id: '0006', type: 'zhixing', dir: 'Down', size: 2, x: 2, y: 7, speed: 300, logic: 'straight' },
      { id: '0007', type: 'zuodiaotou', dir: 'Down', size: 2, x: 2, y: 9, speed: 300, logic: 'left_uturn' },
      { id: '0008', type: 'zhixing', dir: 'Right', size: 2, x: 0, y: 11, speed: 300, logic: 'straight' },
      { id: '0009', type: 'zuozhuan', dir: 'Right', size: 2, x: 3, y: 11, speed: 300, logic: 'left_turn' },
      { id: '0010', type: 'zhixing', dir: 'Right', size: 2, x: 6, y: 11, speed: 300, logic: 'straight' },
      { id: '0012', type: 'zuozhuan', dir: 'Up', size: 2, x: 5, y: 13, speed: 300, logic: 'left_turn' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 5, y: 3 },
      { id: '1002', type: 'cross', x: 3, y: 4 },
      { id: '1004', type: 'cross', x: 2, y: 6 },
      { id: '1005', type: 'cross', x: 5, y: 11 },
      { id: '1006', type: 'cross', x: 2, y: 11 },
      { id: '1007', type: 'cross', x: 5, y: 6 },
      { id: '1008', type: 'cross', x: 2, y: 3 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 5, y: 0 },
      { id: '4002', x: 0, y: 3 },
      { id: '4003', x: 8, y: 7 },
      { id: '4004', x: 8, y: 12 },
      { id: '4005', x: 0, y: 11 },
      { id: '4006', x: 3, y: 20 },
      { id: '4007', x: 7, y: 3 },
      { id: '4008', x: 7, y: 6 },
      { id: '4009', x: 7, y: 11 },
      { id: '4010', x: 2, y: 19 }
    ],
    target: 11
  },

  8: {
    map: '0008',
    cars: [
      { id: '0001', type: 'youzhuan', dir: 'Down', size: 2, x: 2, y: 4, speed: 300, logic: 'right_turn' },
      { id: '0002', type: 'zuozhuan', dir: 'Down', size: 2, x: 5, y: 4, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'zhixing', dir: 'Right', size: 2, x: 5, y: 6, speed: 300, logic: 'straight' },
      { id: '0004', type: 'zhixing', dir: 'Left', size: 2, x: 2, y: 6, speed: 300, logic: 'straight' },
      { id: '0005', type: 'zhixing', dir: 'Left', size: 2, x: 4, y: 7, speed: 300, logic: 'straight' },
      { id: '0006', type: 'youzhuan', dir: 'Up', size: 2, x: 2, y: 9, speed: 300, logic: 'right_turn' },
      { id: '0007', type: 'zuozhuan', dir: 'Up', size: 2, x: 5, y: 9, speed: 300, logic: 'left_turn' },
      { id: '0008', type: 'zuozhuan', dir: 'Up', size: 2, x: 2, y: 11, speed: 300, logic: 'left_turn' },
      { id: '0009', type: 'zuodiaotou', dir: 'Up', size: 2, x: 5, y: 11, speed: 300, logic: 'left_uturn' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 2, y: 7 },
      { id: '1002', type: 'cross', x: 2, y: 6 },
      { id: '1003', type: 'cross', x: 5, y: 6 },
      { id: '1004', type: 'cross', x: 5, y: 7 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 0, y: 7 },
      { id: '4002', x: 0, y: 6 },
      { id: '4003', x: 8, y: 7 },
      { id: '4004', x: 8, y: 8 },
      { id: '4005', x: 3, y: 20 },
      { id: '4006', x: 7, y: 6 },
      { id: '4007', x: 7, y: 7 }
    ],
    target: 9
  },

  9: {
    map: '0009',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Up', size: 2, x: 1, y: 3, speed: 300, logic: 'straight' },
      { id: '0002', type: 'zuozhuan', dir: 'Right', size: 2, x: 4, y: 4, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'zhixing', dir: 'Up', size: 2, x: 1, y: 6, speed: 300, logic: 'straight' },
      { id: '0004', type: 'zuodiaotou', dir: 'Up', size: 2, x: 6, y: 6, speed: 300, logic: 'left_uturn' },
      { id: '0005', type: 'zhixing', dir: 'Up', size: 2, x: 1, y: 8, speed: 300, logic: 'straight' },
      { id: '0006', type: 'zuodiaotou', dir: 'Right', size: 2, x: 4, y: 7, speed: 300, logic: 'left_uturn' },
      { id: '0007', type: 'zhixing', dir: 'Down', size: 2, x: 6, y: 8, speed: 300, logic: 'straight' },
      { id: '0008', type: 'zhixing', dir: 'Up', size: 2, x: 1, y: 10, speed: 300, logic: 'straight' },
      { id: '0009', type: 'youdiaotou', dir: 'Right', size: 2, x: 2, y: 10, speed: 300, logic: 'right_uturn' },
      { id: '0010', type: 'youzhuan', dir: 'Right', size: 2, x: 4, y: 10, speed: 300, logic: 'right_turn' },
      { id: '0011', type: 'youzhuan', dir: 'Up', size: 2, x: 1, y: 12, speed: 300, logic: 'right_turn' },
      { id: '0012', type: 'zhixing', dir: 'Down', size: 2, x: 6, y: 14, speed: 300, logic: 'straight' },
      { id: '0013', type: 'zhixing', dir: 'Right', size: 2, x: 2, y: 13, speed: 300, logic: 'straight' },
      { id: '0014', type: 'youzhuan', dir: 'Right', size: 2, x: 4, y: 13, speed: 300, logic: 'right_turn' },
      { id: '0015', type: 'zuozhuan', dir: 'Up', size: 2, x: 1, y: 15, speed: 300, logic: 'left_turn' },
      { id: '0016', type: 'zhixing', dir: 'Down', size: 2, x: 6, y: 16, speed: 300, logic: 'straight' },
      { id: '0017', type: 'zhixing', dir: 'Down', size: 2, x: 6, y: 11, speed: 300, logic: 'straight' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 1, y: 4 },
      { id: '1002', type: 'cross', x: 6, y: 4 },
      { id: '1003', type: 'cross', x: 1, y: 7 },
      { id: '1004', type: 'cross', x: 6, y: 7 },
      { id: '1005', type: 'cross', x: 1, y: 10 },
      { id: '1006', type: 'cross', x: 6, y: 10 },
      { id: '1007', type: 'cross', x: 2, y: 14 },
      { id: '1008', type: 'cross', x: 6, y: 13 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 1, y: 0 },
      { id: '4002', x: 6, y: 0 },
      { id: '4003', x: 0, y: 4 },
      { id: '4004', x: 8, y: 11 },
      { id: '4005', x: 0, y: 13 },
      { id: '4006', x: 8, y: 14 },
      { id: '4007', x: 2, y: 20 },
      { id: '4008', x: 7, y: 20 },
      { id: '4009', x: 6, y: 19 },
      { id: '4010', x: 7, y: 13 },
      { id: '4011', x: 7, y: 10 }
    ],
    target: 17
  },

  10: {
    map: '0010',
    cars: [
      { id: '0001', type: 'zhixing', dir: 'Down', size: 2, x: 2, y: 4, speed: 300, logic: 'straight' },
      { id: '0002', type: 'zuozhuan', dir: 'Down', size: 2, x: 5, y: 4, speed: 300, logic: 'left_turn' },
      { id: '0003', type: 'youzhuan', dir: 'Down', size: 2, x: 2, y: 6, speed: 300, logic: 'right_turn' },
      { id: '0004', type: 'youzhuan', dir: 'Right', size: 2, x: 0, y: 9, speed: 300, logic: 'right_turn' },
      { id: '0005', type: 'zhixing', dir: 'Right', size: 2, x: 2, y: 9, speed: 300, logic: 'straight' },
      { id: '0006', type: 'zhixing', dir: 'Right', size: 2, x: 4, y: 9, speed: 300, logic: 'straight' },
      { id: '0007', type: 'zuodiaotou', dir: 'Left', size: 2, x: 8, y: 10, speed: 300, logic: 'left_uturn' },
      { id: '0008', type: 'youzhuan', dir: 'Up', size: 2, x: 2, y: 11, speed: 300, logic: 'right_turn' },
      { id: '0009', type: 'zuozhuan', dir: 'Down', size: 2, x: 5, y: 10, speed: 300, logic: 'left_turn' },
      { id: '0010', type: 'youzhuan', dir: 'Right', size: 2, x: 3, y: 12, speed: 300, logic: 'right_turn' },
      { id: '0011', type: 'zhixing', dir: 'Right', size: 2, x: 8, y: 13, speed: 300, logic: 'straight' },
      { id: '0012', type: 'zhixing', dir: 'Down', size: 2, x: 2, y: 13, speed: 300, logic: 'straight' },
      { id: '0013', type: 'zhixing', dir: 'Down', size: 2, x: 5, y: 13, speed: 300, logic: 'straight' }
    ],
    intersections: [
      { id: '1001', type: 'cross', x: 2, y: 9 },
      { id: '1002', type: 'cross', x: 2, y: 8 },
      { id: '1003', type: 't', opening: 'Left', x: 5, y: 8 },
      { id: '1004', type: 'cross', x: 5, y: 9 },
      { id: '1005', type: 'cross', x: 2, y: 12 },
      { id: '1006', type: 'cross', x: 5, y: 12 }
    ],
    obstacles: [
    ],
    exits: [
      { id: '4001', x: 0, y: 9 },
      { id: '4002', x: 8, y: 10 },
      { id: '4003', x: 8, y: 13 },
      { id: '4004', x: 3, y: 20 },
      { id: '4005', x: 6, y: 20 },
      { id: '4006', x: 2, y: 19 },
      { id: '4007', x: 5, y: 19 },
      { id: '4008', x: 7, y: 12 },
      { id: '4009', x: 0, y: 8 },
      { id: '4010', x: 7, y: 9 }
    ],
    target: 13
  }
};
