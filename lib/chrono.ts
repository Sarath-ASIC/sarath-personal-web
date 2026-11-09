/** ChronoSynch64 block data — shared by the diagram (client) and the project page (server). */

export type Status = "implemented" | "development" | "planned";

export type Block = {
  id: string;
  inst: string;
  name: string;
  status: Status;
  x: number;
  y: number;
  desc: string;
};


export const chronoBlocks: Block[] = [
  { id: "tsc", inst: "u_tsc64", name: "64-bit timestamp counter", status: "implemented", x: 120, y: 30,
    desc: "Free-running counter clocked by the 100 MHz reference, giving 10 ns per count. It is the raw time reference and is never adjusted by discipline logic." },
  { id: "pps", inst: "u_pps_cap", name: "PPS capture", status: "implemented", x: 120, y: 190,
    desc: "Detects rising edges of the GPS PPS input and latches the counter value at each edge, producing one reference timestamp per second." },
  { id: "meas", inst: "u_pps_meas", name: "Interval / phase measurement", status: "development", x: 340, y: 190,
    desc: "Computes the PPS-to-PPS interval from consecutive captured timestamps and its deviation from the nominal 100,000,000 cycles." },
  { id: "pfd", inst: "u_pfd", name: "Phase/frequency detector", status: "planned", x: 560, y: 190,
    desc: "Planned. Intended to derive phase and frequency error terms from the measured PPS behaviour." },
  { id: "ctrl", inst: "u_disc_ctrl", name: "Discipline controller", status: "planned", x: 780, y: 190,
    desc: "Planned. Intended to turn detector output into corrections for the disciplined timebase, with GPS-loss holdover in mind." },
  { id: "tb", inst: "u_disc_tb", name: "Disciplined timebase", status: "planned", x: 780, y: 350,
    desc: "Planned. A separate timebase that receives corrections, so the raw 64-bit counter stays untouched." },
  { id: "trig", inst: "u_trig_gen", name: "Trigger generator", status: "planned", x: 560, y: 350,
    desc: "Planned. Intended to issue deterministic triggers at programmed times on the disciplined timebase." },
  { id: "evt", inst: "u_evt_cap", name: "Sensor event capture", status: "planned", x: 120, y: 350,
    desc: "Planned. Intended to timestamp external sensor events against the common time reference." },
  { id: "fifo", inst: "u_evt_fifo", name: "Event FIFO + host interface", status: "planned", x: 340, y: 350,
    desc: "Planned. Intended to buffer event timestamps and expose them, with diagnostics, to a host." },
];

