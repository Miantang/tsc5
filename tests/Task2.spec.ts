import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            // from: deployer.address,
            // to: task2.address,
            // deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    it('should sendDict', async () => {
        const address = randomAddress();
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const taskUpdate = await task2.sendDict(sender, toNano('0.01'));
        const m:any = await task2.getState();
        console.log('m', m, taskUpdate.transactions);
        expect(taskUpdate.transactions).toHaveTransaction({
            op: 0x66666666,
        });
        // expect(task1)
    });

    
});
