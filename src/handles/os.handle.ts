import os from "os"
import {Server, Socket} from "socket.io";

const performanceLoadData = () => {
    const cpus = os.cpus();
    return new Promise(async (resolve, reject) => {
        const osType = os.type() === "Darwin" ? 'Mac' : os.type();
        const upTime = os.uptime();
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const usedMem = totalMem - freeMem;
        const memUsage = Math.floor(usedMem / totalMem * 100) / 100;
        const cpuType = cpus[0].model;
        const numCores = cpus.length;
        const cpuSpeed = cpus[0].speed;

        const cpuLoad = await getCpuLoad();
        // console.log(cpus)

        resolve({
            osType, upTime, freeMem, totalMem, usedMem,
            memUsage, cpuType, numCores, cpuSpeed, cpuLoad
        })
    });
}


const cpuAverage = () => {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;
    cpus.forEach((core) => {
        for (const mode in core.times) {
            if (Object.prototype.hasOwnProperty.call(core.times, mode)) {
                totalMs += core.times[mode as keyof typeof core.times];
            }
        }
        idleMs += core.times.idle;
    })

    return {
        idleMs: idleMs / cpus.length,
        total: totalMs / cpus.length,
    }
}

const getCpuLoad = () => {
    return new Promise(async (resolve, reject) => {
        const start = cpuAverage();
        setTimeout(async () => {
            const end = cpuAverage();
            const idleDiff = end.idleMs - start.idleMs;
            const totalDiff = end.total - start.total;
            const percentOfCpu = 100 - Math.floor(100 * idleDiff / totalDiff);
            // console.log({idleDiff, totalDiff, percentOfCpu})
            resolve(percentOfCpu);
        }, 100)
    })
}

// const run = async () => {
//     const data = await performanceLoadData();
//     console.log(data);
// }
//
// run();

export const osHandle = (io: Server, socket: Socket) => {
    const nI = os.networkInterfaces();
    let macA: any;

    for(let key in nI) {
        if (nI[key] && nI[key].length > 0) {
            const mac = nI[key][0].internal;
            const isInternetFacing = !mac;
            if (isInternetFacing) {
                macA = mac;
                break;
            }
        }
    }

    const perfDataInterval = setInterval(async () => {
        const perfData: any = await performanceLoadData();
        if (perfData) {
            perfData.macA = macA;
        }

        socket.emit("perfData", perfData);
    }, 5000)

    socket.on('disconnect', () => {
        clearInterval(perfDataInterval);
    })
}