
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { VehicleCard } from './components/VehicleCard';
import { BlueprintDisplay } from './components/BlueprintDisplay';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { TuningTerminal } from './components/TuningTerminal';
import { SocialDispatch } from './components/SocialDispatch';
import { AssetVisualizer } from './components/AssetVisualizer';
import { AssetSynthesis } from './components/AssetSynthesis';
import { GlobalPatternNexus } from './components/GlobalPatternNexus';
import { Vehicle, BlueprintScript, ImpactStat, ProjectProposal, FinancialSynergy, PerformancePatch, SocialCampaign } from './types';
import { generateVehicleBlueprint, generateProjectProposal, generateFinancialSynergy, generatePerformancePatch } from './services/geminiService';
import { sounds } from './services/soundService';

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Butch Zenith GTR: Sovereign Edition',
    year: 2055,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "Ang rurok ng street dominance. Forged from single-crystal carbon fiber with a liquid-iridium finish. Features the 'Zenith-Core' AI for zero-latency neural driving.",
    image: 'https://images.unsplash.com/photo-1544636331-e268592033c2?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '120M BUX',
    specs: { speed: '620 km/h', engine: 'V12 Plasma-Induction', tech: ['Zenith AI', 'Iridium Aero-Shell', 'Quantum-Grip'] }
  },
  {
    id: '2',
    name: 'Sovereign-X Sky-Lounge',
    year: 2054,
    luxuryLevel: 'Sovereign',
    crewQuarters: 12,
    type: 'Chain Jet',
    origin: 'Butch Aero-Nexus',
    description: "A flying penthouse for the elite. Triple-linked fusion thrusters allow for intercontinental travel in under 30 minutes with full zero-G spa facilities.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Auctioning',
    price: '450M BUX',
    specs: { speed: 'Mach 6.5', engine: 'Triple-Fusion Chain', tech: ['Zero-G Spa', 'Neural-Link HUD', 'Cloak-Field'] }
  },
  {
    id: '3',
    name: 'Butch Titan: Heavy Extraction',
    year: 2050,
    luxuryLevel: 'Elite',
    crewQuarters: 4,
    type: 'Heavy Duty',
    origin: 'Butch Defense Labs',
    description: "Tactical armored fortress. Features 12-inch thick graphene-ceramic plating and EMP shielding for high-stakes executive extractions.",
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '85M BUX',
    specs: { speed: '280 km/h', engine: 'Quad-Ion Kinetic', tech: ['Graphene Armor', 'EMP Shield', 'Drone-Swarm'] }
  },
  {
    id: '4',
    name: 'Billboard PH: Sonic Sovereign',
    year: 2052,
    luxuryLevel: 'Sovereign',
    crewQuarters: 2,
    type: 'Supercar',
    origin: 'Billboard PH HQ',
    description: "A cultural collaboration. The engine is tuned to synchronize with PH chart-toppers, emitting a sonic-boom resonance that clears traffic via acoustic repulsors.",
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Auctioning',
    price: '210M BUX',
    specs: { speed: '550 km/h', engine: 'Acoustic-Resonance Pulse', tech: ['Chart-Sync', 'Sonic-Boom Repulsor', 'Neon-Canvas'] }
  },
  {
    id: '5',
    name: 'Butch Rotor-7 Stealth',
    year: 2049,
    luxuryLevel: 'Elite',
    crewQuarters: 2,
    type: 'Helicopter',
    origin: 'Butch Aero-Defense',
    description: "Silent take-off capability using quad-tilt plasma vortex rotors. The rurok of aerial stealth for the modern executive.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '22M BUX',
    specs: { speed: '920 km/h', engine: 'Plasma-Vortex', tech: ['Silent-Takeoff', 'Neural-Glass', 'Thermal-Cloak'] }
  },
  {
    id: '6',
    name: 'Abyssal-X Submersible',
    year: 2058,
    luxuryLevel: 'Sovereign',
    crewQuarters: 4,
    type: 'Submersible',
    origin: 'Butch Marine Hub',
    description: "Ultra-deep sea luxury. Capable of reaching the Mariana Trench while providing a 5-star dining experience behind 12-inch clear titanium-glass.",
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Vaulted',
    price: '300M BUX',
    specs: { speed: '80 knots', engine: 'Hydro-Static Fusion', tech: ['Titanium-Glass', 'Pressure-Sync', 'Deep-Scan'] }
  },
  {
    id: '7',
    name: 'Butch Lunar Freighter',
    year: 2060,
    luxuryLevel: 'Sovereign',
    crewQuarters: 20,
    type: 'Space Freighter',
    origin: 'Butch Lunar Base',
    description: "The lifeline of the Butch Moon Colony. Capable of transporting 500 tons of helium-3 and luxury supplies across the Earth-Moon orbit.",
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '1.5B BUX',
    specs: { speed: 'Warp 1.2', engine: 'Antimatter-Pulse', tech: ['Gravity-Anchor', 'Radiation-Shield', 'Warp-Core'] }
  },
  {
    id: '8',
    name: 'Ghost-Bike Cyber-Sprint',
    year: 2053,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Cyber-Bike',
    origin: 'Butch Tech Labs',
    description: "Lean, fast, and virtually invisible. Uses holographic refraction to blend into the city lights of Neo-Manila.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '4.5M BUX',
    specs: { speed: '380 km/h', engine: 'Solid-State Crystal', tech: ['Holographic-Refraction', 'Neural-Tilt', 'E-Pulse'] }
  },
  {
    id: '9',
    name: 'Butch Mag-Lev Sovereign',
    year: 2051,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Mag-Lev',
    origin: 'Butch Transit Hub',
    description: "Frictionless transit. Glides 2 inches above the ground using high-temp superconductors for the ultimate smooth ride.",
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '12M BUX',
    specs: { speed: '750 km/h', engine: 'Superconductor-Lev', tech: ['Frictionless-Drive', 'Auto-Glide', 'Silent-Flux'] }
  },
  {
    id: '10',
    name: 'Executive-Hover Courier',
    year: 2048,
    luxuryLevel: 'Executive',
    crewQuarters: 0,
    type: 'Hovercar',
    origin: 'Butch Logistics',
    description: "The workhorse of the executive class. Reliable, automated, and styled for the modern boardroom on wheels.",
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '2.8M BUX',
    specs: { speed: '320 km/h', engine: 'Dual-Fan Plasma', tech: ['Auto-Pilot-Lvl-9', 'Glass-Cockpit', 'Air-Bag-Shield'] }
  },
  {
    id: '11',
    name: 'Butch Orion Space Yacht',
    year: 2062,
    luxuryLevel: 'Sovereign',
    crewQuarters: 8,
    type: 'Space Freighter',
    origin: 'Butch Orbitals',
    description: "Luxury space travel redefined. Featuring a 'Star-View' observation deck and artificial gravity generators for long-range cruising.",
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '2.8B BUX',
    specs: { speed: 'Warp 2.5', engine: 'Singularity-Drive', tech: ['Artificial-Gravity', 'Photon-Sails', 'Quantum-Uplink'] }
  },
  {
    id: '12',
    name: 'Venom-GT Cyber-Edition',
    year: 2056,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Energy Labs',
    description: "Aggressive aero-design with a retractable 'Venom' rear wing that adjusts based on real-time wind speed data.",
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '65M BUX',
    specs: { speed: '510 km/h', engine: 'Bi-Turbo Plasma', tech: ['Venom-Aero', 'Active-Chassis', 'Brembo-Mag'] }
  },
  {
    id: '13',
    name: 'Butch Sky-Crane Heavy',
    year: 2047,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 6,
    type: 'Helicopter',
    origin: 'Butch Relief Hub',
    description: "Designed for rapid deployment of modular housing units in disaster zones. A true humanitarian giant.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '15M BUX',
    specs: { speed: '450 km/h', engine: 'Heavy-Lift Vortex', tech: ['Modular-Hook', 'Stability-Control', 'Night-Vision'] }
  },
  {
    id: '14',
    name: 'Maranello-Quantum F1-S',
    year: 2059,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "The legal version of an F1 car. Uses a 'Quantum-Downforce' generator to drive on ceilings at speeds over 400km/h.",
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Vaulted',
    price: '500M BUX',
    specs: { speed: '680 km/h', engine: 'Dark-Matter Hybrid', tech: ['Quantum-Downforce', 'Mag-Grip', 'Aero-Logic'] }
  },
  {
    id: '15',
    name: 'Butch-Aqua Cruiser',
    year: 2052,
    luxuryLevel: 'Elite',
    crewQuarters: 6,
    type: 'Hovercraft',
    origin: 'Butch Marine Hub',
    description: "Seamlessly transitions from sea to swamp. The luxury choice for exploring the archipelago's untouched islands.",
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '8.5M BUX',
    specs: { speed: '120 knots', engine: 'Dual-Fan Plasma', tech: ['Amphibious-Logic', 'Stabilizer-Fin', 'Sonar-HUD'] }
  },
  {
    id: '16',
    name: 'Butcher Grand-Prix Clockwork',
    year: 2050,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Timepiece',
    origin: 'Butch Geneva Vaults',
    description: "A wearable masterpiece. The tourbillon movement is visible through a sapphire-diamond crystal casing.",
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Auctioning',
    price: '1.5M BUX',
    specs: { speed: 'Real-time Sync', engine: 'Chrono-Nuclear', tech: ['Diamond-Crystal', 'Tourbillon-X', 'Neural-Sync'] }
  },
  {
    id: '17',
    name: 'Butch Sky-Bus Omni',
    year: 2046,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 40,
    type: 'Corporate',
    origin: 'Butch Transit Hub',
    description: "High-capacity corporate transport. Moving executives and teams across Neo-Manila with zero carbon footprint.",
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '45M BUX',
    specs: { speed: '400 km/h', engine: 'Electric-Turbine', tech: ['Omni-Seating', 'Holo-Office', 'Eco-Clean'] }
  },
  {
    id: '18',
    name: 'Shadow-X Stealth Bike',
    year: 2054,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Cyber-Bike',
    origin: 'Butch Defense Labs',
    description: "A tactical bike that absorbs radar waves. Perfect for covert ops and nighttime high-speed chases.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '5.2M BUX',
    specs: { speed: '410 km/h', engine: 'Silent-Ion', tech: ['Radar-Absorb', 'Night-Vis', 'Pulse-Brake'] }
  },
  {
    id: '19',
    name: 'Butch-Air Voyager',
    year: 2049,
    luxuryLevel: 'Elite',
    crewQuarters: 12,
    type: 'Chain Jet',
    origin: 'Butch Aero-Nexus',
    description: "The ultimate family jet. Features a modular interior that can convert from a bedroom to a cinema in seconds.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '120M BUX',
    specs: { speed: 'Mach 3.2', engine: 'Dual-Fusion', tech: ['Modular-Int', 'Cinema-Zone', 'Safe-Land'] }
  },
  {
    id: '20',
    name: 'Butch-Harvester Eco-Rig',
    year: 2045,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 4,
    type: 'Heavy Duty',
    origin: 'Butch Agri-Tech',
    description: "Massive autonomous harvester that cleans the soil while gathering crops. For the future of food security.",
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '18M BUX',
    specs: { speed: '60 km/h', engine: 'Solar-Bio', tech: ['Soil-Cleaner', 'Auto-Harvest', 'Crop-Scan'] }
  },
  {
    id: '21',
    name: 'Butch Pulse-Racer 3000',
    year: 2051,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Energy Labs',
    description: "Uses electromagnetic pulses for extreme acceleration. Not for the faint of heart.",
    image: 'https://images.unsplash.com/photo-1544636331-e268592033c2?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '42M BUX',
    specs: { speed: '580 km/h', engine: 'EMP-Acceleration', tech: ['Pulse-Cap', 'Carbon-Mono', 'Grip-Max'] }
  },
  {
    id: '22',
    name: 'Butch Hydro-Foil X',
    year: 2053,
    luxuryLevel: 'Elite',
    crewQuarters: 4,
    type: 'Hovercraft',
    origin: 'Butch Marine Hub',
    description: "The fastest yacht on the water. Lifts itself 10 feet above waves for zero-drag cruising.",
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '35M BUX',
    specs: { speed: '150 knots', engine: 'Hydro-Jet Plasma', tech: ['Foil-Lift', 'Wave-Cancel', 'Aero-Fin'] }
  },
  {
    id: '23',
    name: 'Butch Cyber-Tug Heavy',
    year: 2055,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 2,
    type: 'Heavy Duty',
    origin: 'Butch Logistics',
    description: "Designed to pull stalled massive tankers and space freighters back to safety.",
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '55M BUX',
    specs: { speed: '120 km/h', engine: 'Mega-Torque Ion', tech: ['Towing-Cable-X', 'Heavy-Shield', 'Anchor-Lock'] }
  },
  {
    id: '24',
    name: 'Butch-Drone Hive Alpha',
    year: 2047,
    luxuryLevel: 'Executive',
    crewQuarters: 0,
    type: 'Corporate',
    origin: 'Butch Tech Labs',
    description: "A mobile carrier for executive delivery drones. Ensuring your documents reach you in seconds.",
    image: 'https://images.unsplash.com/photo-1527977966376-1c841de9d21a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '9M BUX',
    specs: { speed: '180 km/h', engine: 'Hive-Mind Core', tech: ['Drone-Launch', 'Packet-Sync', 'City-Grid-Link'] }
  },
  {
    id: '25',
    name: 'Butch-Air Guardian',
    year: 2050,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 10,
    type: 'Helicopter',
    origin: 'Butch Relief Hub',
    description: "Flying hospital unit. Equipped with holographic surgical suites for emergency operations mid-flight.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '30M BUX',
    specs: { speed: '500 km/h', engine: 'Med-Vortex', tech: ['Surgery-Holo', 'Bio-Scan', 'Life-Support-X'] }
  },
  {
    id: '26',
    name: 'Butch-Street Phantom',
    year: 2058,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "A phantom on the road. Uses meta-materials to be invisible to speed cameras and human eyes alike.",
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Vaulted',
    price: '420M BUX',
    specs: { speed: '600 km/h', engine: 'Ghost-Pulse', tech: ['Meta-Cloak', 'Silent-Exhaust', 'Optical-Sync'] }
  },
  {
    id: '27',
    name: 'Butch-Mag Carrier',
    year: 2051,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 20,
    type: 'Mag-Lev',
    origin: 'Butch Transit Hub',
    description: "Long-haul Mag-Lev for the general public, providing elite-level comfort for all citizens.",
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '120M BUX',
    specs: { speed: '900 km/h', engine: 'Mega-Lev Core', tech: ['Mass-Transit-Sync', 'Safety-Brake-X', 'Silent-Zone'] }
  },
  {
    id: '28',
    name: 'Butch Cyber-Blade X',
    year: 2053,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Cyber-Bike',
    origin: 'Butch Tech Labs',
    description: "A bike forged from a single piece of liquid metal. Self-healing bodywork.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '7.8M BUX',
    specs: { speed: '420 km/h', engine: 'Liquid-Metal-Core', tech: ['Self-Heal', 'Form-Shift', 'Neural-Grip'] }
  },
  {
    id: '29',
    name: 'Butch-Air Executive 500',
    year: 2048,
    luxuryLevel: 'Executive',
    crewQuarters: 6,
    type: 'Chain Jet',
    origin: 'Butch Aero-Nexus',
    description: "The classic executive jet. Refined, reliable, and always on time.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '85M BUX',
    specs: { speed: 'Mach 2.5', engine: 'Reliant-Fusion', tech: ['Safe-Uplink', 'Boardroom-Pod', 'Global-GPS-X'] }
  },
  {
    id: '30',
    name: 'Butch-Ocean Sovereign',
    year: 2060,
    luxuryLevel: 'Sovereign',
    crewQuarters: 200,
    type: 'Corporate',
    origin: 'Butch Marine Hub',
    description: "A floating city. The rurok of ocean luxury. Featuring its own stock exchange and helicopter pad.",
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '12B BUX',
    specs: { speed: '40 knots', engine: 'Nuclear-Fusion Marine', tech: ['Stock-Sync', 'Heli-Pad', 'Desalination-X'] }
  },
  {
    id: '31',
    name: 'Butch-Star Scout',
    year: 2061,
    luxuryLevel: 'Elite',
    crewQuarters: 2,
    type: 'Space Freighter',
    origin: 'Butch Orbitals',
    description: "Designed to explore the asteroid belt for rare minerals. Fast and maneuverable.",
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '250M BUX',
    specs: { speed: 'Warp 0.8', engine: 'Asteroid-Pulse', tech: ['Mineral-Scan', 'Mining-Laser', 'Eva-Suite'] }
  },
  {
    id: '32',
    name: 'Butch-Hover Limo',
    year: 2047,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Hovercar',
    origin: 'Butch Transit Hub',
    description: "The ultimate red-carpet transport. 30 feet of pure floating luxury.",
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '15M BUX',
    specs: { speed: '250 km/h', engine: 'Quad-Plasma Limo', tech: ['Champagne-Chill', 'Privacy-Cloak', 'Neon-Interior'] }
  },
  {
    id: '33',
    name: 'Butch-Crawler Heavy',
    year: 2049,
    luxuryLevel: 'Elite',
    crewQuarters: 4,
    type: 'Heavy Duty',
    origin: 'Butch Agri-Tech',
    description: "A multi-legged heavy duty crawler for extreme mountain terrain.",
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '22M BUX',
    specs: { speed: '40 km/h', engine: 'Hex-Leg Kinetic', tech: ['Terrain-Adapting', 'Climb-Max', 'Cargo-Pod'] }
  },
  {
    id: '34',
    name: 'Butch-Drone Hive Alpha 2',
    year: 2054,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Corporate',
    origin: 'Butch Tech Labs',
    description: "Next-gen drone swarm control for security and asset protection.",
    image: 'https://images.unsplash.com/photo-1527977966376-1c841de9d21a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '35M BUX',
    specs: { speed: '220 km/h', engine: 'Swarm-Core-2', tech: ['Intrusion-Block', 'Shield-Pulse', 'Holo-Guard'] }
  },
  {
    id: '35',
    name: 'Butch-Air Guardian 2',
    year: 2056,
    luxuryLevel: 'Sovereign',
    crewQuarters: 20,
    type: 'Helicopter',
    origin: 'Butch Relief Hub',
    description: "A larger, more capable aerial hospital with a full ICU suite.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '55M BUX',
    specs: { speed: '550 km/h', engine: 'ICU-Vortex', tech: ['Bio-Gen', 'Quarantine-Zone', 'Neural-Heal'] }
  },
  {
    id: '36',
    name: 'Butch-Street Ghost',
    year: 2059,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "A ghost in the machine. Features a neural-link that predicts traffic patterns 3 seconds in advance.",
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '480M BUX',
    specs: { speed: '650 km/h', engine: 'Prediction-Core', tech: ['Time-Sync', 'Traffic-Hacking', 'Aero-Vanish'] }
  },
  {
    id: '37',
    name: 'Butch-Mag Transit-X',
    year: 2052,
    luxuryLevel: 'Executive',
    crewQuarters: 0,
    type: 'Mag-Lev',
    origin: 'Butch Transit Hub',
    description: "Corporate-only Mag-Lev lines for ultra-fast inter-city meetings.",
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '45M BUX',
    specs: { speed: '1200 km/h', engine: 'Hyper-Lev', tech: ['Office-Pod', 'Meeting-Holo', 'Zero-G-Smooth'] }
  },
  {
    id: '38',
    name: 'Butch-Blade Runner',
    year: 2055,
    luxuryLevel: 'Elite',
    crewQuarters: 0,
    type: 'Cyber-Bike',
    origin: 'Butch Tech Labs',
    description: "A bike designed for racing on vertical surfaces. Uses mag-tread tires.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '12.5M BUX',
    specs: { speed: '480 km/h', engine: 'Mag-Tread-Fusion', tech: ['Vertical-Grip', 'Gravity-Comp', 'Nitro-Boost'] }
  },
  {
    id: '39',
    name: 'Butch-Air Voyager 2',
    year: 2057,
    luxuryLevel: 'Sovereign',
    crewQuarters: 24,
    type: 'Chain Jet',
    origin: 'Butch Aero-Nexus',
    description: "Twice the size, twice the luxury. Features a full-size pool and basketball court.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '850M BUX',
    specs: { speed: 'Mach 4.2', engine: 'Mega-Fusion Chain', tech: ['Pool-Zone', 'Sport-Deck', 'Sky-View-Lounge'] }
  },
  {
    id: '40',
    name: 'Butch-Harvester Eco-Rig 2',
    year: 2050,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 8,
    type: 'Heavy Duty',
    origin: 'Butch Agri-Tech',
    description: "Autonomous vertical farming unit. Feeds a city of 100,000 on its own.",
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '120M BUX',
    specs: { speed: '20 km/h', engine: 'Bio-Reactor', tech: ['Vertical-Growth', 'Water-Recycle', 'Nutrient-Scan'] }
  },
  {
    id: '41',
    name: 'Butch-Street Demon',
    year: 2060,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "A beast on the track. Forged in the fires of Maranello's most secret lab.",
    image: 'https://images.unsplash.com/photo-1544636331-e268592033c2?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Auctioning',
    price: '950M BUX',
    specs: { speed: '720 km/h', engine: 'Demon-V12-Fusion', tech: ['Unleashed-Mode', 'Carbon-Spike', 'Track-Hacking'] }
  },
  {
    id: '42',
    name: 'Butch-Sub Arctic-Ex',
    year: 2054,
    luxuryLevel: 'Elite',
    crewQuarters: 8,
    type: 'Submersible',
    origin: 'Butch Marine Hub',
    description: "Specialized for exploring under the Arctic ice. Features thermal heating for passenger comfort.",
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '45M BUX',
    specs: { speed: '60 knots', engine: 'Arctic-Fusion', tech: ['Ice-Breaker-Sonar', 'Thermal-Shell', 'Deep-Cold-Seal'] }
  },
  {
    id: '43',
    name: 'Butch-Freighter Mars-Link',
    year: 2063,
    luxuryLevel: 'Sovereign',
    crewQuarters: 50,
    type: 'Space Freighter',
    origin: 'Butch Orbitals',
    description: "The primary transport between Earth and Mars. Features a 2-year lifecycle sustainability system.",
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Pre-Order',
    price: '15B BUX',
    specs: { speed: 'Warp 5.0', engine: 'Hyper-singularity', tech: ['Mars-Atmo-Sync', 'Cryo-Sleep', 'Shield-Max'] }
  },
  {
    id: '44',
    name: 'Butch-Hover Pulse-1',
    year: 2046,
    luxuryLevel: 'Executive',
    crewQuarters: 0,
    type: 'Hovercar',
    origin: 'Butch Transit Hub',
    description: "Entry-level luxury hovercar. The modern choice for successful executives.",
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '4.2M BUX',
    specs: { speed: '350 km/h', engine: 'Pulse-Plasma', tech: ['Standard-Auto', 'Sky-Nav', 'Air-Safe'] }
  },
  {
    id: '45',
    name: 'Butch-Crawler Heavy 2',
    year: 2051,
    luxuryLevel: 'Humanitarian',
    crewQuarters: 12,
    type: 'Heavy Duty',
    origin: 'Butch Agri-Tech',
    description: "Amphibious crawler for heavy duty rescue in flooding and earthquake zones.",
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '35M BUX',
    specs: { speed: '80 km/h', engine: 'Amphi-Kinetic', tech: ['Water-Float', 'Mud-Grip', 'Rescue-Arm'] }
  },
  {
    id: '46',
    name: 'Butch-Drone Sentinel-Prime',
    year: 2058,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Corporate',
    origin: 'Butch Tech Labs',
    description: "A single, massive drone for protecting corporate headquarters from aerial threats.",
    image: 'https://images.unsplash.com/photo-1527977966376-1c841de9d21a?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '75M BUX',
    specs: { speed: '450 km/h', engine: 'Sentinel-Reactor', tech: ['Target-Lock-X', 'EMP-Proof', 'Holo-Fake'] }
  },
  {
    id: '47',
    name: 'Butch-Air Phoenix',
    year: 2055,
    luxuryLevel: 'Sovereign',
    crewQuarters: 15,
    type: 'Helicopter',
    origin: 'Butch Relief Hub',
    description: "Rebuilds cities from the air using 3D graphene printers. A true miracle of engineering.",
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '180M BUX',
    specs: { speed: '520 km/h', engine: 'Printer-Vortex', tech: ['3D-Graphene-Print', 'City-Scan', 'Structural-AI'] }
  },
  {
    id: '48',
    name: 'Butch-Street Wraith',
    year: 2061,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Supercar',
    origin: 'Butch Maranello Hub',
    description: "Features 'Wraith-Mode', allowing the car to phase through solid objects at high speed.",
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Vaulted',
    price: '1.2B BUX',
    specs: { speed: '800 km/h', engine: 'Phase-Drive-Singularity', tech: ['Object-Phase', 'Reality-Sync', 'Aero-Warp'] }
  },
  {
    id: '49',
    name: 'Butch-Mag Hyper-Link',
    year: 2053,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Mag-Lev',
    origin: 'Butch Transit Hub',
    description: "Inter-continental Mag-Lev tubes. Crossing the Pacific in 4 hours.",
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '850M BUX',
    specs: { speed: '2500 km/h', engine: 'Vacuum-Tube-Lev', tech: ['Ocean-Tube-Sync', 'Gravity-Seat', 'Sonic-Buffering'] }
  },
  {
    id: '50',
    name: 'Butch-Blade Runner 2',
    year: 2057,
    luxuryLevel: 'Sovereign',
    crewQuarters: 0,
    type: 'Cyber-Bike',
    origin: 'Butch Tech Labs',
    description: "A bike that can fly for short distances. The ultimate urban escape tool.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800&h=450',
    marketStatus: 'Available',
    price: '45M BUX',
    specs: { speed: '520 km/h (Air)', engine: 'Hybrid-Tilt-Jet', tech: ['Air-Glide', 'Brake-Flip', 'Holo-Dash'] }
  }
];

const COMMUNITY_STATS: ImpactStat[] = [
  { label: 'Global Billboard Hits', value: '55', numericValue: 55, sublabel: 'PH Chart Toppers' },
  { label: 'International Hubs', value: '12', numericValue: 12, sublabel: 'Major Cities' },
  { label: 'Market Capital', value: '1.2B BUX', numericValue: 1200, sublabel: 'International Growth' },
  { label: 'Philanthropy Fund', value: '250M BUX', numericValue: 250, sublabel: 'Global Aid' }
];

const generateTrendData = (seed: string) => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return days.map((day, i) => {
    const val = Math.abs((hash + i * 1337) % 1000) + 1500;
    return {
      name: day,
      value: val + Math.sin(i) * 300,
      volume: Math.abs((hash + i * 42) % 50) + 10
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-emerald-500/50 p-3 rounded-lg backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{label} METRICS</p>
        <p className="font-orbitron text-white text-sm font-bold tracking-tighter">VALUE: {Math.round(payload[0].value)} BUX</p>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">VOL: {payload[0].payload.volume} TRADES</p>
      </div>
    );
  }
  return null;
};

const GENERATION_STAGES = [
  { id: 'auth', label: 'Security Clearance', logs: ['Bypassing Firewall 12-B...', 'Auth Level 7 Verified'] },
  { id: 'data', label: 'Vault Access', logs: ['Accessing Butch Garage Archives...', 'Pulling Compressed Schematics'] },
  { id: 'schematics', label: 'Compiling Schematics', logs: ['Decrypting Vector Data...', 'Rerendering CAD Layers'] },
  { id: 'roi', label: 'Analyzing ROI', logs: ['Simulating Economic Impact...', 'Calculating Community Uplift'] },
  { id: 'verification', label: 'Verifying Asset Integrity', logs: ['Structural Stress Tests...', 'Final Quality Checks'] },
  { id: 'final', label: 'Encrypting Packet', logs: ['Applying Quantum Key...', 'Finalizing Executive Docket'] }
];

type SortKey = 'year' | 'luxuryLevel' | 'price';

const luxuryRank: Record<string, number> = {
  'Sovereign': 4,
  'Elite': 3,
  'Executive': 2,
  'Humanitarian': 1
};

const parsePrice = (priceStr?: string) => {
  if (!priceStr) return 0;
  const numeric = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return isNaN(numeric) ? 0 : numeric;
};

const App: React.FC = () => {
  const [vehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState<'All' | 'Available' | 'Vaulted' | 'Auctioning' | 'Pre-Order'>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [originFilter, setOriginFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortKey>('year');
  
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintScript | null>(null);
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [tuningVehicle, setTuningVehicle] = useState<Vehicle | null>(null);
  const [visualizingVehicle, setVisualizingVehicle] = useState<Vehicle | null>(null);
  const [isSynthesizingAsset, setIsSynthesizingAsset] = useState(false);
  const [isDispatchingSocial, setIsDispatchingSocial] = useState(false);
  const [isGlobalNexusOpen, setIsGlobalNexusOpen] = useState(false);
  const [selectedChartVehicleId, setSelectedChartVehicleId] = useState<string>(INITIAL_VEHICLES[0].id);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  
  const [isProposing, setIsProposing] = useState(false);
  const [isFinancing, setIsFinancing] = useState(false);
  const [proposalData, setProposalData] = useState<{location: string, challenge: string}>({location: '', challenge: ''});
  const [financeData, setFinanceData] = useState<{sector: string, goal: string}>({sector: '', goal: ''});
  
  const [activeProposal, setActiveProposal] = useState<ProjectProposal | null>(null);
  const [activeSynergy, setActiveSynergy] = useState<FinancialSynergy | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);
  const chartData = useMemo(() => generateTrendData(selectedChartVehicleId), [selectedChartVehicleId]);
  const currentChartVehicle = useMemo(() => vehicles.find(v => v.id === selectedChartVehicleId), [selectedChartVehicleId, vehicles]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [statusLog]);

  const uniqueYears = useMemo(() => {
    const years = vehicles.map(v => v.year);
    return ['All', ...Array.from(new Set(years)).sort((a, b) => b - a).map(String)];
  }, [vehicles]);

  const uniqueTypes = useMemo(() => {
    const types = vehicles.map(v => v.type);
    return ['All', ...Array.from(new Set(types)).sort()];
  }, [vehicles]);

  const uniqueOrigins = useMemo(() => {
    const origins = vehicles.map(v => v.origin);
    return ['All', ...Array.from(new Set(origins)).sort()];
  }, [vehicles]);

  const filteredAndSortedVehicles = useMemo(() => {
    const lowSearch = searchTerm.toLowerCase();
    
    let result = vehicles.filter(v => {
      const matchSearch = searchTerm === '' || 
        v.name.toLowerCase().includes(lowSearch) || 
        v.type.toLowerCase().includes(lowSearch) ||
        v.year.toString().includes(lowSearch);
      const matchMarket = marketFilter === 'All' || v.marketStatus === marketFilter;
      const matchYear = yearFilter === 'All' || v.year.toString() === yearFilter;
      const matchType = typeFilter === 'All' || v.type === typeFilter;
      const matchOrigin = originFilter === 'All' || v.origin === originFilter;
      
      return matchSearch && matchMarket && matchYear && matchType && matchOrigin;
    });

    result.sort((a, b) => {
      if (sortBy === 'year') {
        return b.year - a.year;
      } else if (sortBy === 'luxuryLevel') {
        const rankA = luxuryRank[a.luxuryLevel] || 0;
        const rankB = luxuryRank[b.luxuryLevel] || 0;
        return rankB - rankA;
      } else if (sortBy === 'price') {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      return 0;
    });

    return result;
  }, [searchTerm, marketFilter, yearFilter, typeFilter, originFilter, sortBy, vehicles]);

  const handleVehicleCardClick = (v: Vehicle) => {
    sounds.play('modalOpen');
    setSelectedVehicleForDetail(v);
    setSelectedChartVehicleId(v.id);
  };

  const handleBlueprintRequest = async (v: Vehicle) => {
    setSelectedVehicleForDetail(null);
    sounds.play('action');
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStageIdx(0);
    setStatusLog([`UPLINK_INITIALIZED: ${v.name.toUpperCase()}`]);

    const simulateStages = async () => {
      for (let i = 0; i < GENERATION_STAGES.length; i++) {
        setCurrentStageIdx(i);
        const stage = GENERATION_STAGES[i];
        for (const log of stage.logs) {
          await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
          setStatusLog(prev => [...prev, log]);
          setGenerationProgress(prev => Math.min(prev + (100 / (GENERATION_STAGES.length * 2)), 95));
        }
      }
    };

    const stagePromise = simulateStages();
    
    try {
      const blueprint = await generateVehicleBlueprint(v.name, v.type, v.origin);
      await stagePromise;
      
      setGenerationProgress(100);
      setStatusLog(prev => [...prev, "DATA_PACKET_VERIFIED", "UPLINK_SUCCESS"]);
      sounds.play('success');
      
      setTimeout(() => {
        setSelectedBlueprint(blueprint);
        setIsGenerating(false);
        setGenerationProgress(0);
        setStatusLog([]);
      }, 1500);
    } catch (error) {
      sounds.play('error');
      alert("Executive Clearance Failure.");
      setIsGenerating(false);
    }
  };

  const handleFinanceSubmit = async () => {
    if (!financeData.sector || !financeData.goal) return;
    sounds.play('action');
    setIsGenerating(true);
    setStatusLog([`SYNERGY_INIT: ${financeData.sector}`]);
    
    try {
      const roadmap = await generateFinancialSynergy(financeData.sector, financeData.goal);
      setGenerationProgress(100);
      setActiveSynergy(roadmap);
      sounds.play('success');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setStatusLog([]);
      }, 800);
    } catch (error) {
      sounds.play('error');
      alert("Financial Cluster Error.");
      setIsGenerating(false);
    }
  };

  const handleProposalSubmit = async () => {
    if (!proposalData.location || !proposalData.challenge) return;
    sounds.play('action');
    setIsGenerating(true);
    setStatusLog([`IMPACT_INIT: ${proposalData.location}`]);
    
    try {
      const proposal = await generateProjectProposal(proposalData.location, proposalData.challenge);
      setGenerationProgress(100);
      setActiveProposal(proposal);
      sounds.play('success');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setStatusLog([]);
        setIsProposing(true);
      }, 800);
    } catch (error) {
      sounds.play('error');
      alert("Synthesis Error.");
      setIsGenerating(false);
    }
  };

  const handleTuneAsset = (v: Vehicle) => {
    sounds.play('action');
    setTuningVehicle(v);
    setSelectedVehicleForDetail(null);
  };

  const handleVisualizeAsset = (v: Vehicle) => {
    sounds.play('action');
    setVisualizingVehicle(v);
    setSelectedVehicleForDetail(null);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 flex flex-col font-inter relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.15] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]"></div>

      <div className="bg-magenta-900/10 border-b border-magenta-500/30 py-2 overflow-hidden sticky top-0 z-[100] backdrop-blur-xl">
        <div className="flex gap-12 animate-marquee whitespace-nowrap text-[10px] font-black uppercase tracking-[0.4em] text-magenta-400 neon-text-magenta">
          <span>{'>'} SYSTEM STATUS: ONLINE</span>
          <span>{'>'} UPLINK SECURE: BI-LATERAL PH GIG-ECONOMY BOOM</span>
          <span>{'>'} ASSET DISCOVERY: 50+ NEW SOVEREIGN MODELS ADDED</span>
          <span>{'>'} MARKET UPDATE: BUX TOKEN VALUATION SURGE +14.2%</span>
        </div>
      </div>

      <nav className="p-8 border-b border-cyan-500/20 bg-black/80 sticky top-[30px] z-[90] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-14 h-14 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-3xl font-orbitron text-black shadow-[0_0_30px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform">B</div>
            <div>
              <h1 className="font-orbitron text-3xl font-black tracking-tighter text-white uppercase italic">
                BUTCH GARAGE <span className="text-cyan-400 neon-text-cyan">X-CEED</span>
              </h1>
              <p className="text-[10px] text-magenta-400 font-black uppercase tracking-[0.5em] neon-text-magenta">Billboard Philippines Nexus</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => { sounds.play('modalOpen'); setIsGlobalNexusOpen(true); }}
              className="px-8 py-3 bg-white/5 border-2 border-cyan-500/50 text-cyan-400 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              GLOBAL NEXUS
            </button>
            <button 
              onClick={() => { sounds.play('modalOpen'); setIsSynthesizingAsset(true); }}
              className="px-8 py-3 bg-cyan-500 text-black rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
            >
              SYNTH-SALE
            </button>
            <button 
              onClick={() => { sounds.play('modalOpen'); setIsDispatchingSocial(true); }}
              className="px-8 py-3 bg-white/5 border-2 border-magenta-500/50 text-magenta-400 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-magenta-500 hover:text-white hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all neon-text-magenta"
            >
              OMNI-ANNOUNCE
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-24 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em] flex items-center gap-3">
              <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></span>
              LIVE NETWORK TELEMETRY
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {COMMUNITY_STATS.map((stat, i) => (
                <div key={i} className="bg-white/[0.03] border border-cyan-500/10 p-6 rounded-2xl hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                  <span className="text-2xl font-orbitron font-black text-white group-hover:text-cyan-400 transition-colors">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-magenta-900/10 border border-magenta-500/20 rounded-2xl">
              <p className="text-[10px] font-bold text-magenta-400 uppercase tracking-widest mb-2">Priority Uplink Alert</p>
              <p className="text-xs text-gray-400 leading-relaxed italic">"Executive hubs in Neo-Cebu reporting optimal adoption rates. Deploying 50+ new models to the manifest."</p>
            </div>
          </div>
          
          <div className="lg:col-span-8 bg-black/40 border border-cyan-500/20 p-8 rounded-[2.5rem] h-[400px] relative overflow-hidden group/chart backdrop-blur-xl shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
             
             <div className="relative h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[9px] font-black text-cyan-500/60 uppercase tracking-[0.5em]">Global Resonance Flow</span>
                    <h3 className="font-orbitron text-2xl font-black text-white uppercase tracking-tighter italic">{currentChartVehicle?.name || 'NETWORK STATS'}</h3>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 900}} dy={10} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorCyan)" animationDuration={2000} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#06b6d4' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                   {['All', 'Available', 'Vaulted', 'Auctioning', 'Pre-Order'].map((filter) => (
                     <button key={filter} onClick={() => { sounds.play('hover'); setMarketFilter(filter as any); }} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${marketFilter === filter ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-transparent text-gray-500 border-white/5 hover:border-cyan-500/50 hover:text-cyan-400'}`}>
                       {filter}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </section>

        <section className="space-y-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-2">
              <h3 className="font-orbitron text-4xl font-black uppercase italic tracking-tighter text-white">ASSET <span className="text-cyan-400">MANIFEST</span></h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">Global Sovereignty Archive [50+ Records]</p>
            </div>
            <div className="w-full md:w-[450px] relative">
              <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl blur-xl"></div>
              <div className="relative flex items-center bg-black/60 border-2 border-cyan-500/20 rounded-2xl px-6 py-4 focus-within:border-cyan-500/80 transition-all shadow-2xl">
                <svg className="w-5 h-5 text-cyan-500/50 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="SEARCH CRYPTO-ASSETS..." className="bg-transparent border-none outline-none text-[12px] font-black uppercase tracking-widest text-white placeholder:text-gray-700 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredAndSortedVehicles.length > 0 ? (
              filteredAndSortedVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} onSelect={handleVehicleCardClick} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center space-y-6">
                 <div className="text-4xl font-orbitron font-black text-gray-800 uppercase italic tracking-tighter hover:text-cyan-500 transition-colors">NO ASSETS DETECTED</div>
                 <p className="text-[12px] text-gray-600 uppercase font-black tracking-[0.8em] animate-pulse">RECALIBRATE FILTER MATRIX</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Overlays */}
      {isGenerating && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black overflow-hidden p-8">
          <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-flow"></div>
          <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row gap-16 items-center lg:items-stretch">
             <div className="w-full lg:w-1/3 space-y-10">
                <h2 className="font-orbitron text-3xl font-black text-white uppercase tracking-tighter italic">X-CEED <span className="text-cyan-400">CLUSTER</span></h2>
                <div className="space-y-8 relative border-l border-white/10 pl-8">
                  {GENERATION_STAGES.map((stage, idx) => (
                    <div key={stage.id} className={`flex items-center gap-6 transition-all duration-700 ${idx === currentStageIdx ? 'translate-x-4 opacity-100 scale-110' : idx < currentStageIdx ? 'opacity-40 grayscale' : 'opacity-10'}`}>
                      <div className="w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black">{idx < currentStageIdx ? '✓' : idx + 1}</div>
                      <div><h4 className="text-xs font-black uppercase tracking-widest text-white">{stage.label}</h4></div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="flex-1 bg-black/80 border border-cyan-500/20 p-10 rounded-[2.5rem] font-mono text-[11px] text-cyan-400/80 overflow-y-auto max-h-[450px]">
                {statusLog.map((log, i) => <div key={i} className="mb-2">{'>'} {log}</div>)}
                <div ref={logEndRef} />
             </div>
          </div>
        </div>
      )}

      {selectedVehicleForDetail && (
        <VehicleDetailModal vehicle={selectedVehicleForDetail} onClose={() => setSelectedVehicleForDetail(null)} onGenerate={handleBlueprintRequest} onTune={handleTuneAsset} onVisualize={handleVisualizeAsset} />
      )}

      {tuningVehicle && <TuningTerminal vehicle={tuningVehicle} onClose={() => setTuningVehicle(null)} />}
      {isDispatchingSocial && <SocialDispatch vehicles={vehicles} onClose={() => setIsDispatchingSocial(false)} />}
      {visualizingVehicle && <AssetVisualizer vehicle={visualizingVehicle} onClose={() => setVisualizingVehicle(null)} />}
      {isSynthesizingAsset && <AssetSynthesis onClose={() => setIsSynthesizingAsset(false)} />}
      {isGlobalNexusOpen && <GlobalPatternNexus onClose={() => setIsGlobalNexusOpen(false)} />}
      {selectedBlueprint && <BlueprintDisplay blueprint={selectedBlueprint} onClose={() => setSelectedBlueprint(null)} />}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        @keyframes grid-flow { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }
        .animate-grid-flow { animation: grid-flow 3s linear infinite; }
        .neon-text-magenta { text-shadow: 0 0 10px rgba(217, 70, 239, 0.5); }
      `}</style>

      <footer className="bg-black py-24 px-8 border-t border-cyan-500/10 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-2xl font-orbitron text-black shadow-2xl">B</div>
            <div>
              <h4 className="text-2xl font-orbitron font-black uppercase tracking-tighter">Butch Garage <span className="text-cyan-400">Nexus</span></h4>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Established 2045 // Decentralized Fleet Control</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
