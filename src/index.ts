import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ICpu } from './Interfaces/ICpu';
import si from 'systeminformation';
import { IConnectionsNetwork, INetwork } from './Interfaces/INetwork';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer);

const CpuNameSpace = io.of('/cpu');
CpuNameSpace.on('connection', async (socket) => {
  let idSession: string | boolean = socket.id;
  const CpuDataSctructure = {} as ICpu;

  socket.on('disconnect', () => {
    idSession = false;
  });

  const cpuDataget = await si.cpu();

  CpuDataSctructure.brand = cpuDataget.brand;
  CpuDataSctructure.speed = cpuDataget.speed;
  CpuDataSctructure.speedMax = cpuDataget.speedMax;
  CpuDataSctructure.manufacturer = cpuDataget.manufacturer;
  CpuDataSctructure.cores = cpuDataget.cores;
  CpuDataSctructure.physicalCores = cpuDataget.physicalCores;
  CpuDataSctructure.virtualization = cpuDataget.virtualization;
  CpuDataSctructure.processors = cpuDataget.processors;
  CpuDataSctructure.speedMin = cpuDataget.speedMin;

  socket.emit('cpuData', CpuDataSctructure);

  const AutoExecutable = async (): Promise<void> => {

    const cpuUsagegetData = await si.currentLoad();

    socket.emit('cpuUsageRealTime', cpuUsagegetData.currentLoad);

    if(idSession){
      setTimeout(AutoExecutable, 1000);
    }
  }
  
  AutoExecutable();
});

const netWorkNameSpace = io.of('/network');
netWorkNameSpace.on('connection', async (socket) => {
  let idSession: string | boolean = socket.id;
  const NetworkStructure = {} as INetwork;
  const ProcessNetworkConnections = {} as IConnectionsNetwork;

  socket.on('disconnect', () => {
    idSession = false;
  });

  NetworkStructure.netweorkInterfaces = await si.networkInterfaces();

  socket.emit('networkInterface', NetworkStructure);

  const UpdateDataRealTime = async (): Promise<void> => {

    ProcessNetworkConnections.ConnectionProcess = await si.networkConnections();

    socket.emit('ProcessNetworkConnected', ProcessNetworkConnections);

    if(idSession){
      setTimeout(UpdateDataRealTime, 1000);
    }
  }

  UpdateDataRealTime();
})

httpServer.listen(3999);

// import si from 'systeminformation';

// si.versions('*', (data) => {
//   console.log(data);
// });

// si.observe({
// --   cpu: 'manufacturer, brand, speed, speedMin, speedMax, cores, physicalCores, processors, virtualization',
//   mem: 'total, free, used, active, cached, available',
//   memLayout: 'size, type, clockSpeed',
//   osInfo: 'platform, distro, kernel, hostname, codepage, serial',
// -- currentLoad: 'currentLoad',
//   processes: 'all, running, blocked, sleeping, unknown, list',
//   diskLayout: 'size, interfaceType, name',
//   fsSize: 'fs, type, size, used, available, use',
// -- networkInterfaces: 'ip4, ip4subnet, ip6subnet, mac, operstate, speed',
// -- networkConnections: 'protocol, localAddress, localPort, peerAddress, pid, process',
//   dockerInfo: 'id, containers, containersRunning, containersPaused, containersStopped, images'
// }, 4000, async (data: any) => {
//   const structure = data;

//   const getSerivices = await si.services('*');
//   const httpLatency = await si.inetLatency('google.com.br');

//   structure.services = getSerivices;
//   structure.latency = httpLatency;
//   console.log(structure);
// });