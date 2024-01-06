import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

const maze1 = [
    'XXXXXXE.',
    'XX.XXXX.',
    'X.X.XXXX',
    '.?XSXXX.',
    '?.XXXXX.',
    'XX..XXX.',
    'XX..XX?X',
    'XXX...XX'
  ];

const maze0 = [
    'XXXXXXE.',
    'XX.XXXX.',
    'X.X.XXX.',
    '.?XSXXX.',
    '?.XXXXX.',
    'XX..XXX.',
    'XX..XX?X',
    'XXX...XX'
  ];
const maze2 = [
    'SX.?X',
    '.XX.X',
    'X.?..',
    '.??..',
    'X?...',
    '..X.X',
    '..?..',
    'X...E'
  ]

  const maze4 = [
    'SX.?XXXX',
    '.XX.XXXX',
    'X.?..XXX',
    '.??..XXX',
    'X?...XXX',
    '..X.XXXX',
    '..?..XXX',
    'X...EXXX'
  ]

  const maze5 = [
    'SX.?XXXX',
    '.XX.XXXX',
    'X.?..XXX',
    '.??..XXX',
    'X?...XXX',
    '..X.XXXX',
    '..X?XXXX',
    'XX..EXXX'
  ]

  const maze8 = [
    'XXXXXXX.XXXXXXX',
    'XX.XSXX.XXX.XXX',
    'X.X.XXXXXX.X.XX',
    '.?XXXXX.X.?XXXX',
    '?.XXXXX.X?.XXXX',
    'XX..XXX.XXX..XX',
    'XX..XX?XXXX..XX',
    'XXX...XXXXXX...',
    'XXXXXXXXXXXXXXX',
    'XXXXXXX.XXXXXXX',
    'XX.XXXX.XXX.XXX',
    'X.X.XXXXXX.X.XX',
    '.?XXXXX.X.?XXXX',
    '?.XXXXX.X?.XXXX',
    'XX..XXX.XXX..XX',
    'XX..XX?XXXX..XE'
  ];

  const maze9 = [
    'XXXXXXX.XX',
    'XX.XSXX.XX',
    'X.X.XXXXXX',
    'X?XXXXX.X.',
    '?.XXXXX.X?',
    'XX..XXX.XX',
    'XX..XX?XXX',
    'XXX...XXXX',
    'XXXXXXXXXX',
    'XXXXXXXXXX',
    'XX..XX?XEX'
  ];

  const maze7 = [
    'XXXXXXX.XXXXXXX..X',
    'XX.XSXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XX',
    'XXX...XXXXXX...XXX',
    'XXXXXXXXXXXXXXXXXX',
    'XXXXXXX.XXXXXXX..X',
    'XX.XXXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XX',
    'XXX...XXXXXX...XEX',
    'XXXXXXX.XXXXXXX..X',
  ];

  const maze6 = [
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXXXX..X',
    'XX.XSXX.XXX.XXXX.XXX.XXXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX..XX?XX',
    'XXX...XXXXXX...XXXXXX...XXXXXX...XXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXXXX..X',
    'XX.XXXX.XXX.XXXX.XXX.XXXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX..XX?XX',
    'XXX...XXXXXX...XXXXXX...XXXXXX...XXX',
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXXXX..X',
    'XX.XXXX.XXX.XXXX.XXX.XXXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX..XX?XX',
    'XXX...XXXXXX...XXXXXX...XXXXXX...XXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXXXX..X',
    'XX.XXXX.XXX.XXXX.XXX.XXXX.XXX.XXXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.X.XXXXX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XXXXX.X',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XXXXX.X',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX..XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX..XX?XE',
  ];

  const maze3 = [
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXX',
    'XX.XSXX.XXX.XXXX.XXX.XXXX.XXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.XX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XX',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XX',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX.X',
    'XXX...XXXXXX...XXXXXX...XXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.XX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XX',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XX',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX.X',
    'XXX...XXXXXX...XXXXXX...XXXXXXX',
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXX',
    'XX.XXXX.XXX.XXXX.XXX.XXXX.XXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.XX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XX',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XX',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX.X',
    'XXX...XXXXXX...XXXXXX...XXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXX.XXXXXXX..XXXXXXXX.XXXXX',
    'XX.XXXX.XXX.XXXX.XXX.XXXX.XXX.X',
    'X.X.XXXXXX.X.XXXXXX.X.XXXXXX.XX',
    '.?XXXXX.X.?XXXXX.X.?XXXXX.X.?XX',
    '?.XXXXX.X?.XXXXX.X?.XXXXX.X?.XX',
    'XX..XXX.XXX..XXX.XXX..XXX.XXX.X',
    'XX..XX?XXXX..XX?XXXX..XX?XXXX.E',
  ];

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    it('should solve', async () => {
        const res = await task4.sendSolve(8n, 8n, maze1);
        console.log('res task4', res.result);
        // const res2 = await task4Basic.sendSolve(5n, 8n, maze2)
    });
});
