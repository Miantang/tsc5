import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;
    let deployer: any;

    beforeAll(async () => {
        code = await compile('Task3');

    });

   

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    // it('should deploy', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and task3 are ready to use
    // });

    it('should v1', async () => {
        const deployer = await blockchain.treasury('deployer');
        const sender = deployer.getSender();
        const m0 = await task3.sendFirst(sender);
        const m = await task3.sendV1(sender);
        const version = await task3.getVersion();
        const ss = await task3.getStorage(32);
        console.log('m', m.transactions, version, ss);
        expect(m.transactions).toHaveTransaction({
            success: true,
        });
    });

    // it('should v2', async () => {
    //     const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const version2 = await task3.getVersion();
    //     console.log('version0', version2);
    //     const m = await task3.sendV2(sender);
    //     const version = await task3.getVersion();
    //     const ss = await task3.getStorage(32);
    //     // const am = await task3.getAmount();
    //     // const usdam = await task3.getUSDAmount();
    //     console.log('m',m.transactions, version, ss);
    //     expect(m.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    // it('should v3', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and task3 are ready to use
    //     const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const version0 = await task3.getVersion();
    //     console.log('version0', version0);
    //     const m = await task3.sendV3(sender);
    //     const version = await task3.getVersion();
    //     const ss = await task3.getStorage();
    //     const am = await task3.getAmount();
    //     const usdam = await task3.getUSDAmount();
    //     console.log('m', m.transactions, version, ss, am, usdam);
    //     expect(m.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    // it('should v4', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and task3 are ready to use
    //     const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const version0 = await task3.getVersion();
    //     console.log('version0', version0);
    //     const m = await task3.sendV4(sender);
    //     const version = await task3.getVersion();
    //     const ss = await task3.getStorage();
    //     // const am = await task3.getAmount();
    //     // const usdam = await task3.getUSDAmount();
    //     console.log('m', m.transactions, version, ss);
    //     expect(m.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    // it('should v4 add', async () => {
    //     // const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const version0 = await task3.getVersion();
    //     console.log('version0', version0);
    //     const m = await task3.sendV4(sender);
    //     console.log('version1', version0);
    //     const m2 = await task3.sendNoCode(sender, 200);
    //     const version = await task3.getVersion();
    //     const ss = await task3.getStorage(32);
    //     // const am = await task3.getAmount();
    //     // const usdam = await task3.getUSDAmount();
    //     console.log('m',m.transactions, version, ss);
    //     expect(m.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    // it('should v more', async () => {
    //     const deployer = await blockchain.treasury('deployer');
    //     const sender = deployer.getSender();
    //     const m0 = await task3.sendFirst(sender);
    //     const version0 = await task3.getVersion();
    //     console.log('version0', version0);
    //     const m2 = await task3.sendNoCode(sender, 200);
    //     const version = await task3.getVersion();
    //     const ss = await task3.getStorage(32);
    //     // const am = await task3.getAmount();
    //     // const usdam = await task3.getUSDAmount();
    //     console.log('m', m2.transactions, version, ss);
    //     expect(m2.transactions).toHaveTransaction({
    //         success: true,
    //     });
    // });

    
});
