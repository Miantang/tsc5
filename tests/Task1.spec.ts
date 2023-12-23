import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { randomAddress } from '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;
    // let deployer: SandboxContract<TreasuryContract>;
    // const csAddr = randomAddress();

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            // from: deployer.address,
            // to: task1.address,
            // deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
        //
    });

    it('should sendUpdate', async () => {
        const address = randomAddress();
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const taskUpdate = await task1.sendUpdate(sender, toNano('0.05'));
        // console.log('taskUpdate', sender.getState());
        const m:any = await task1.getState();
        console.log('m', m, taskUpdate.transactions);
        expect(taskUpdate.transactions).toHaveTransaction({
            op: 0x9DF10277,
        });
        // expect(task1)
    });
});
