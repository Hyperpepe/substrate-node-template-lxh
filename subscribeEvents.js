// 引入所需库
const { ApiPromise, WsProvider } = require('@polkadot/api');

// 初始化WebSocket提供程序
const wsProvider = new WsProvider('wss://rpc.polkadot.io');

// 主函数
async function main() {
    // 创建API实例
    const api = await ApiPromise.create({ provider: wsProvider });

    // 订阅新头部事件
    api.rpc.chain.subscribeNewHeads(async (header) => {
        console.log(`新区块已生成，区块号：${header.number}`);

        // 获取事件
        const events = await api.query.system.events.at(header.hash);

        // 遍历并打印事件
        events.forEach((record) => {
            const { event } = record;
            console.log(`事件：${event.section}:${event.method}:: (phase=${record.phase})`);
            console.log(`\t\t${event.meta.documentation.toString()}`);
        });
    });
}

main().catch(console.error);
