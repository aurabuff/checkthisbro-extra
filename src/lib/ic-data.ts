export interface ICDbEntry {
  name: string;
  pins: number;
  note: string;
  description: string;
  pinout: string[];
}

export const icDatabase: Record<string, ICDbEntry> = {
  // Logic Gates
  "7400": {
    name: "7400",
    pins: 14,
    note: "Quad 2-Input NAND Gate",
    description: "Contains four independent 2-input NAND gates.",
    pinout: ["1A", "1B", "1Y", "2A", "2B", "2Y", "GND", "3Y", "3A", "3B", "4Y", "4A", "4B", "VCC"],
  },
  "7402": {
    name: "7402",
    pins: 14,
    note: "Quad 2-Input NOR Gate",
    description: "Contains four independent 2-input NOR gates.",
    pinout: ["1Y", "1A", "1B", "2Y", "2A", "2B", "GND", "3A", "3B", "3Y", "4A", "4B", "4Y", "VCC"],
  },
  "7404": {
    name: "7404",
    pins: 14,
    note: "Hex Inverter",
    description: "Contains six independent inverters (NOT gates).",
    pinout: ["1A", "1Y", "2A", "2Y", "3A", "3Y", "GND", "4Y", "4A", "5Y", "5A", "6Y", "6A", "VCC"],
  },
  "7408": {
    name: "7408",
    pins: 14,
    note: "Quad 2-Input AND Gate",
    description: "Contains four independent 2-input AND gates.",
    pinout: ["1A", "1B", "1Y", "2A", "2B", "2Y", "GND", "3Y", "3A", "3B", "4Y", "4A", "4B", "VCC"],
  },
  "7432": {
    name: "7432",
    pins: 14,
    note: "Quad 2-Input OR Gate",
    description: "Contains four independent 2-input OR gates.",
    pinout: ["1A", "1B", "1Y", "2A", "2B", "2Y", "GND", "3Y", "3A", "3B", "4Y", "4A", "4B", "VCC"],
  },
  "7486": {
    name: "7486",
    pins: 14,
    note: "Quad 2-Input XOR Gate",
    description: "Contains four independent 2-input XOR gates.",
    pinout: ["1A", "1B", "1Y", "2A", "2B", "2Y", "GND", "3Y", "3A", "3B", "4Y", "4A", "4B", "VCC"],
  },
  
  // Encoders/Decoders/Multiplexers
  "7447": {
    name: "7447",
    pins: 16,
    note: "BCD to 7-Segment Decoder/Driver",
    description: "Decodes BCD inputs to drive a common-anode 7-segment display.",
    pinout: ["B", "C", "LT'", "BI'/RBO'", "RBI'", "D", "A", "GND", "e", "d", "c", "b", "a", "g", "f", "VCC"],
  },
  "74138": {
    name: "74138",
    pins: 16,
    note: "3-to-8 Line Decoder/Demultiplexer",
    description: "Decodes 3 binary address inputs to 8 mutually exclusive outputs.",
    pinout: ["A", "B", "C", "G2A'", "G2B'", "G1", "Y7'", "GND", "Y6'", "Y5'", "Y4'", "Y3'", "Y2'", "Y1'", "Y0'", "VCC"],
  },
  "74147": {
    name: "74147",
    pins: 16,
    note: "10-line to 4-line Priority Encoder",
    description: "Encodes the highest priority active input to BCD.",
    pinout: ["4'", "5'", "NC", "7'", "8'", "NC", "NC", "GND", "D'", "C'", "6'", "3'", "2'", "1'", "9'", "VCC"],
  },
  "74151": {
    name: "74151",
    pins: 16,
    note: "8-to-1 Line Data Selector/Multiplexer",
    description: "Selects one of eight data sources.",
    pinout: ["D3", "D2", "D1", "D0", "Y", "W", "EN'", "GND", "C", "B", "A", "D7", "D6", "D5", "D4", "VCC"],
  },
  "74153": {
    name: "74153",
    pins: 16,
    note: "Dual 4-to-1 Line Data Selector/Multiplexer",
    description: "Contains two independent 4-to-1 multiplexers.",
    pinout: ["1G'", "B", "1C3", "1C2", "1C1", "1C0", "1Y", "GND", "2Y", "2C0", "2C1", "2C2", "2C3", "A", "2G'", "VCC"],
  },

  // Flip-Flops & Counters
  "7473": {
    name: "7473",
    pins: 14,
    note: "Dual J-K Flip-Flop with Clear",
    description: "Contains two independent J-K flip-flops.",
    pinout: ["1CLK", "1CLR'", "1K", "VCC", "2CLK", "2CLR'", "2J", "2Q'", "2Q", "2K", "GND", "1Q", "1Q'", "1J"],
  },
  "7474": {
    name: "7474",
    pins: 14,
    note: "Dual D Positive-Edge-Triggered Flip-Flop",
    description: "Contains two independent D-type flip-flops.",
    pinout: ["1CLR'", "1D", "1CLK", "1PR'", "1Q", "1Q'", "GND", "2Q'", "2Q", "2PR'", "2CLK", "2D", "2CLR'", "VCC"],
  },
  "7476": {
    name: "7476",
    pins: 16,
    note: "Dual J-K Flip-Flop with Preset and Clear",
    description: "Contains two independent J-K flip-flops with preset and clear.",
    pinout: ["1CLK", "1PR'", "1CLR'", "1J", "VCC", "2CLK", "2PR'", "2CLR'", "2J", "2Q'", "2Q", "2K", "GND", "1Q", "1Q'", "1K"],
  },
  "7490": {
    name: "7490",
    pins: 14,
    note: "Decade Counter",
    description: "A 4-bit decade (mod-10) ripple counter.",
    pinout: ["CKB", "R0(1)", "R0(2)", "NC", "VCC", "R9(1)", "R9(2)", "QC", "QB", "GND", "QD", "QA", "NC", "CKA"],
  },

  // Registers & Drivers
  "74244": {
    name: "74244",
    pins: 20,
    note: "Octal Buffer/Line Driver (3-State)",
    description: "Octal buffers and line drivers designed to be employed as memory address drivers, clock drivers, and bus-oriented transmitters/receivers.",
    pinout: ["1OE'", "1A1", "2Y4", "1A2", "2Y3", "1A3", "2Y2", "1A4", "2Y1", "GND", "2A1", "1Y4", "2A2", "1Y3", "2A3", "1Y2", "2A4", "1Y1", "2OE'", "VCC"],
  },
  "74245": {
    name: "74245",
    pins: 20,
    note: "Octal Bus Transceiver (3-State)",
    description: "Designed for asynchronous two-way communication between data buses.",
    pinout: ["DIR", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "GND", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1", "OE'", "VCC"],
  },
  "74595": {
    name: "74595",
    pins: 16,
    note: "8-bit Shift Register with Output Latches",
    description: "Serial-in, parallel-out shift register.",
    pinout: ["QB", "QC", "QD", "QE", "QF", "QG", "QH", "GND", "QH'", "SRCLR'", "SRCLK", "RCLK", "OE'", "SER", "QA", "VCC"],
  },

  // Timers, Op-Amps, Comparators
  "555": {
    name: "NE555",
    pins: 8,
    note: "Precision Timer",
    description: "Highly stable device for generating accurate time delays or oscillation.",
    pinout: ["GND", "TRIG", "OUT", "RESET", "CTRL", "THR", "DIS", "VCC"],
  },
  "556": {
    name: "NE556",
    pins: 14,
    note: "Dual Timer",
    description: "Two independent 555 timers in one package.",
    pinout: ["1DIS", "1THR", "1CTRL", "1RST", "1OUT", "1TRIG", "GND", "2TRIG", "2OUT", "2RST", "2CTRL", "2THR", "2DIS", "VCC"],
  },
  "741": {
    name: "LM741",
    pins: 8,
    note: "Operational Amplifier",
    description: "General-purpose operational amplifier.",
    pinout: ["OFFSET_NULL", "IN-", "IN+", "V-", "OFFSET_NULL", "OUT", "V+", "NC"],
  },
  "324": {
    name: "LM324",
    pins: 14,
    note: "Quad Operational Amplifier",
    description: "Four independent operational amplifiers.",
    pinout: ["OUT1", "IN1-", "IN1+", "VCC", "IN2+", "IN2-", "OUT2", "OUT3", "IN3-", "IN3+", "GND", "IN4+", "IN4-", "OUT4"],
  },
  "358": {
    name: "LM358",
    pins: 8,
    note: "Dual Operational Amplifier",
    description: "Two independent operational amplifiers.",
    pinout: ["OUTA", "INA-", "INA+", "GND", "INB+", "INB-", "OUTB", "VCC"],
  },
  "393": {
    name: "LM393",
    pins: 8,
    note: "Dual Voltage Comparator",
    description: "Two independent voltage comparators.",
    pinout: ["OUTA", "INA-", "INA+", "GND", "INB+", "INB-", "OUTB", "VCC"],
  },

  // Regulators & Misc
  "7805": {
    name: "LM7805",
    pins: 3,
    note: "+5V Voltage Regulator",
    description: "Positive voltage regulator (TO-220 pkg).",
    pinout: ["IN", "GND", "OUT"],
  },
  "7812": {
    name: "LM7812",
    pins: 3,
    note: "+12V Voltage Regulator",
    description: "Positive voltage regulator (TO-220 pkg).",
    pinout: ["IN", "GND", "OUT"],
  },
  "317": {
    name: "LM317",
    pins: 3,
    note: "Adjustable Voltage Regulator",
    description: "Adjustable positive voltage regulator.",
    pinout: ["ADJ", "OUT", "IN"],
  },
  "L293D": {
    name: "L293D",
    pins: 16,
    note: "Quad Half-H Driver (Motor Driver)",
    description: "Designed to provide bidirectional drive currents for motors.",
    pinout: ["1,2EN", "1A", "1Y", "GND", "GND", "2Y", "2A", "VCC2", "3,4EN", "3A", "3Y", "GND", "GND", "4Y", "4A", "VCC1"],
  },

  // Microcontrollers (Common DIPs)
  "ATmega328P": {
    name: "ATmega328P",
    pins: 28,
    note: "8-bit AVR Microcontroller (Arduino Uno)",
    description: "Popular 28-pin microcontroller used in Arduino Uno.",
    pinout: [
      "PC6(RES)", "PD0(RX)", "PD1(TX)", "PD2(INT0)", "PD3(INT1)", "PD4", "VCC", "GND", "PB6(XTAL1)", "PB7(XTAL2)", "PD5", "PD6", "PD7", "PB0",
      "PB1", "PB2(SS)", "PB3(MOSI)", "PB4(MISO)", "PB5(SCK)", "AVCC", "AREF", "GND", "PC0(A0)", "PC1(A1)", "PC2(A2)", "PC3(A3)", "PC4(A4)", "PC5(A5)"
    ],
  },
  "ATTiny85": {
    name: "ATTiny85",
    pins: 8,
    note: "8-bit AVR Microcontroller",
    description: "Compact 8-pin microcontroller.",
    pinout: ["PB5(RES)", "PB3(A3)", "PB4(A2)", "GND", "PB0(MOSI)", "PB1(MISO)", "PB2(SCK)", "VCC"],
  },
  "PIC16F877A": {
    name: "PIC16F877A",
    pins: 40,
    note: "8-bit PIC Microcontroller",
    description: "Popular 40-pin PIC microcontroller.",
    pinout: [
      "MCLR", "RA0", "RA1", "RA2", "RA3", "RA4", "RA5", "RE0", "RE1", "RE2", "VDD", "VSS", "OSC1", "OSC2", "RC0", "RC1", "RC2", "RC3", "RD0", "RD1",
      "RD2", "RD3", "RC4", "RC5", "RC6", "RC7", "RD4", "RD5", "RD6", "RD7", "VSS", "VDD", "RB0", "RB1", "RB2", "RB3", "RB4", "RB5", "RB6", "RB7"
    ],
  },
};

export function getICData(query: string): ICDbEntry | null {
  const normalized = query.toUpperCase().trim();
  
  if (icDatabase[normalized]) return icDatabase[normalized];
  
  // Try partial matches (e.g. "04" might match "7404", "mega328" matches "ATmega328P")
  for (const key of Object.keys(icDatabase)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return icDatabase[key];
    }
  }

  // Remove letters to find numeric match (e.g. SN74HC04N -> 7404)
  const numbersOnly = normalized.replace(/[^0-9]/g, "");
  if (numbersOnly && icDatabase[numbersOnly]) return icDatabase[numbersOnly];
  for (const key of Object.keys(icDatabase)) {
     const keyNums = key.replace(/[^0-9]/g, "");
     if (keyNums && (keyNums === numbersOnly || numbersOnly.includes(keyNums))) {
         return icDatabase[key];
     }
  }

  return null;
}
