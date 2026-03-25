export const SEQUENCES = [
  {
    id: 1,
    name: "Signal Training",
    description: "Establish a baseline connection. Reach the target score.",
    mode: "conviction",
    moves: 25,
    objective: { type: "score", target: 1500 },
    difficulty: 1,
    reward: "Basic Connectivity"
  },
  {
    id: 2,
    name: "Frequency Alignment",
    description: "Align the nodes precisely. Focus on Match-4 combinations.",
    mode: "conviction",
    moves: 20,
    objective: { type: "score", target: 2500 },
    difficulty: 1,
    reward: "Bandwidth Expansion"
  },
  {
    id: 3,
    name: "Resonance Boost",
    description: "A faint signal detected. Recover more data.",
    mode: "signal",
    time: 60,
    objective: { type: "score", target: 3000 },
    difficulty: 2,
    reward: "Signal Stability"
  },
  {
    id: 4,
    name: "Observer Protocol",
    description: "The Mr. Observer node has been detected. Use its power.",
    mode: "conviction",
    moves: 30,
    objective: { type: "score", target: 5000 },
    difficulty: 2,
    reward: "Advanced Optics"
  },
  {
    id: 5,
    name: "First Decryption",
    description: "The first layer of encryption is thick. Breakthrough required.",
    mode: "conviction",
    moves: 15,
    objective: { type: "score", target: 4000 },
    difficulty: 3,
    reward: "Encrypted Access"
  },
  {
    id: 6,
    name: "Noise Filtering",
    description: "Heavy interference detected. Keep the signal alive.",
    mode: "signal",
    time: 45,
    objective: { type: "score", target: 4500 },
    difficulty: 3,
    reward: "Clear Channel"
  },
  {
    id: 7,
    name: "System Handshake",
    description: "Synchronizing with the secure server.",
    mode: "conviction",
    moves: 25,
    objective: { type: "score", target: 6000 },
    difficulty: 3,
    reward: "Server Authentication"
  },
  {
    id: 8,
    name: "Deep Trace",
    description: "Following the packet trail deeper into the network.",
    mode: "conviction",
    moves: 22,
    objective: { type: "score", target: 7500 },
    difficulty: 4,
    reward: "Network Mapping"
  },
  {
    id: 9,
    name: "Network Congestion",
    description: "Clear the throughput bottleneck.",
    mode: "signal",
    time: 50,
    objective: { type: "score", target: 8000 },
    difficulty: 4,
    reward: "Packet Prioritization"
  },
  {
    id: 10,
    name: "The Core Node",
    description: "Reached the central hub. Almost there.",
    mode: "conviction",
    moves: 18,
    objective: { type: "score", target: 9000 },
    difficulty: 4,
    reward: "Hub Visualization"
  },
  {
    id: 11,
    name: "Quantum Burst",
    description: "Unstable energy detected. Decrypt before collapse.",
    mode: "signal",
    time: 30,
    objective: { type: "score", target: 10000 },
    difficulty: 5,
    reward: "Quantum Handshake"
  },
  {
    id: 12,
    name: "Final Decryption",
    description: "The core signal is yours. Complete the final handshake.",
    mode: "conviction",
    moves: 20,
    objective: { type: "score", target: 15000 },
    difficulty: 5,
    reward: "Complete Signal Access"
  }
];
