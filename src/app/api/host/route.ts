import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';

    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (!iface) continue;
      
      for (const info of iface) {
        if (info.family === 'IPv4' && !info.internal) {
          localIp = info.address;
          break;
        }
      }
      if (localIp !== 'localhost') break;
    }

    return NextResponse.json({
      ip: localIp,
      port: process.env.PORT || 3000,
      url: `http://${localIp}:${process.env.PORT || 3000}`,
    });
  } catch (error) {
    return NextResponse.json({
      ip: 'localhost',
      port: 3000,
      url: 'http://localhost:3000',
    });
  }
}
