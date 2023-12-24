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
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();

        task2 = blockchain.openContract(Task2.createFromConfig({admin:sender.address }, code));


        const deployResult = await task2.sendDeploy(sender, toNano('0.05'));

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
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();

        const taskUpdate = await task2.sendDict(sender, toNano('0.01'));
        const m:any = await task2.getState();
        // console.log('m', m, taskUpdate.transactions);
        expect(taskUpdate.transactions).toHaveTransaction({
            op: 0x66666666,
        });
        // expect(task1)
    });
    
    it('should sendAddUser', async () => {
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const addr = randomAddress();
        const taskUpdate = await task2.sendAddUser(sender, toNano('0.01'), addr, 100);
        await task2.sendAddUser(sender, toNano('0.01'), addr, 101);
        // await task2.sendAddUser(sender, toNano('0.01'), randomAddress(), 102);
        const m:any = await task2.getUsers();
        const share:number|null = await task2.getUserShare(addr);
        // console.log('sendAddUser', taskUpdate.transactions, m, 'share',share);
        expect(taskUpdate.transactions).toHaveTransaction({
            op: 0x368ddef3,
        });
        // expect(task1)
    });

    it('should sendDelUser', async () => {
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const addr = randomAddress();
        const addr2 = randomAddress();
        // const taskUpdate = await task2.sendAddUser(sender, toNano('0.01'), addr, 100);
        // await task2.sendAddUser(sender, toNano('0.01'), addr, 101);
        await task2.sendAddUser(sender, toNano('0.01'), addr2, 102);
        // console.log('first sendDelUser', await task2.getUsers());
        const dd = await task2.sendDelUser(sender, toNano('0.01'), addr2);
        const m:any = await task2.getUsers();
        const share:number|null = await task2.getUserShare(addr2);
        // console.log('sendDelUser', dd.transactions, m, 'share',share);
        // expect(taskUpdate.transactions).toHaveTransaction({
        //     op: 0x368ddef3,
        // });
        expect(dd.transactions).toHaveTransaction({
            op: 0x278205c8,
        });
        // expect(task1)
    });
    it('should sendSplit', async () => {
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const taskUpdate = await task2.sendSplit(sender, toNano('0.01'));
        const m:any = await task2.getState();
        // console.log('m', taskUpdate.transactions, m.address, sender.address, m.address.equals(sender.address));
        expect(taskUpdate.transactions).toHaveTransaction({
            op: 0x068530b3,
        });
        // expect(task1)
    });

    
});
