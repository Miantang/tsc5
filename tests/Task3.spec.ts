import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });
    // it('should v1', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and task3 are ready to use
    //     const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const m = await task3.sendV1(sender);
    //     const version = await task3.getVersion();
    //     // console.log('m', m.transactions, version);
    //     expect(m.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    it('should v2', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const m0 = await task3.sendFirst(sender);
        const m = await task3.sendV2(sender);
        const version = await task3.getVersion();
        console.log('m', m.transactions, version);
        expect(m.transactions).toHaveTransaction({
            success: true,
        });
    });

    
});
