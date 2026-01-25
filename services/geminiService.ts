
import { GoogleGenAI, Type } from "@google/genai";
import { BlueprintScript, WarpLogistics, ProjectProposal, FinancialSynergy, PerformancePatch, SocialCampaign, GlobalPattern } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?|```$/g, '');
  }
  return cleaned.trim();
};

export const generateGlobalPattern = async (origin: string, destination: string): Promise<GlobalPattern> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Design a high-quality "HQ Connectivity Pattern" for the Butch Garage International Network.
    Origin Hub: ${origin}
    Destination Hub: ${destination}
    
    TONE: 
    Executive, Zero-Latency, Elite Taglish. 
    Focus on "Sovereign Logistics" and "Cultural Synchronization" for the international market.
    
    OUTPUT:
    Provide a detailed logistics route, energy requirements (Quantum/Fusion), and a Cultural Sync Protocol in elite Taglish.
    Include 3 intermediate nodes with coordinates (placeholder text format like "LAT:45.0, LON:120.2") and signal strength (0-100).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patternId: { type: Type.STRING },
          originHub: { type: Type.STRING },
          destinationHub: { type: Type.STRING },
          connectionType: { type: Type.STRING },
          logisticsRoute: { type: Type.STRING },
          energyRequirement: { type: Type.STRING },
          culturalSyncProtocol: { type: Type.STRING },
          status: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                coordinate: { type: Type.STRING },
                strength: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["patternId", "originHub", "destinationHub", "connectionType", "logisticsRoute", "energyRequirement", "culturalSyncProtocol", "status", "nodes"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "{}");
  return JSON.parse(jsonStr);
};

export const generateAssetPackage = async (request: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Synthesize a "Butch Garage Sovereign Sales Package" for the request: "${request}".
    
    TONE: 
    Executive, Luxury, High-Tech, Elite Taglish. Use "Sovereign Acquisition" terminology.
    
    REQUIREMENTS:
    - A futuristic name for the asset.
    - A detailed technical description.
    - High-end specs (Speed, Engine, 4 Tech Features).
    - A "Sales Script": A persuasive 3-paragraph marketing pitch for a trillionaire client, explaining why this asset is the ultimate status symbol.
    
    OUTPUT: JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          specs: {
            type: Type.OBJECT,
            properties: {
              speed: { type: Type.STRING },
              engine: { type: Type.STRING },
              tech: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["speed", "engine", "tech"]
          },
          salesScript: { type: Type.STRING },
          suggestedPrice: { type: Type.STRING }
        },
        required: ["name", "description", "specs", "salesScript", "suggestedPrice"]
      }
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generateVehicleVisual = async (description: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A hyper-realistic, professional cinematic wide shot of a futuristic ultra-luxury vehicle. 
          DESCRIPTION: ${description}. 
          STYLE: Butch Garage aesthetics, obsidian black plating, polished chrome, cyan neon underglow, 8k resolution, volumetric lighting, sleek aerodynamic design, depth of field, studio lighting, hyper-detailed.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  
  throw new Error("No image data returned from model");
};

export const generateSocialCampaign = async (assetName: string, hypeGoal: string): Promise<SocialCampaign> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Synthesize a high-tech "Omni-Channel Social Dispatch" for the Butch Garage asset: "${assetName}".
    Mission: "${hypeGoal}".
    
    TONE:
    Cyber-Executive, Elite Taglish, Bold, Futuristic. 
    Use words like "Nexus", "Uplink", "Protocol", "Sovereign".
    
    OUTPUT:
    Generate content for X (thread), Instagram (neon aesthetic caption), LinkedIn (professional executive update), and TikTok (futuristic visual script).
    Include 5 holographic hashtags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          campaignName: { type: Type.STRING },
          xThread: { type: Type.ARRAY, items: { type: Type.STRING } },
          instaCaption: { type: Type.STRING },
          linkedInPost: { type: Type.STRING },
          tiktokScript: { type: Type.STRING },
          holographicHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          reachProjection: { type: Type.STRING }
        },
        required: ["campaignName", "xThread", "instaCaption", "linkedInPost", "tiktokScript", "holographicHashtags", "reachProjection"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "");
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse social campaign JSON", e);
    throw e;
  }
};

export const generatePerformancePatch = async (vehicleName: string, objective: string): Promise<PerformancePatch> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Synthesize a high-tech "Neural Performance Patch" for the asset "${vehicleName}" targeting the mission objective: "${objective}".
    
    TONE: 
    Executive Cyber-Engineering. Use elite Taglish jargon (e.g., "Optimal flux synchronization for the masa", "Zero-latency neural uplink").
    
    OUTPUT:
    A JSON object containing optimization summary, specific engine tuning, AI logic upgrades, and resonance (Social ROI) bonuses.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patchId: { type: Type.STRING },
          objectiveName: { type: Type.STRING },
          optimizationSummary: { type: Type.STRING },
          engineTuning: { type: Type.STRING },
          aiLogicUpgrade: { type: Type.STRING },
          resonanceBonus: { type: Type.STRING },
          stabilityRating: { type: Type.STRING }
        },
        required: ["patchId", "objectiveName", "optimizationSummary", "engineTuning", "aiLogicUpgrade", "resonanceBonus", "stabilityRating"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "");
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse patch JSON", e);
    throw e;
  }
};

export const generateVehicleBlueprint = async (vehicleName: string, vehicleType: string, origin: string = "Global HQ"): Promise<BlueprintScript> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a detailed technical dossier and Social ROI (Return on Impact) analysis for an asset named "${vehicleName}" of type "${vehicleType}" from the "${origin}" hub.
    
    COMMUNITY & ROI CONTEXT:
    - If the asset is a luxury item like a timepiece, focus on precision engineering and economic stability features.
    - If the asset is a vehicle like "Humanitarian" or "Mag-Lev", focus on community-saving features.
    - Maintain the "Butch Garage" professional tone with elite Taglish engineering jargon.

    OUTPUT STRUCTURE:
    Provide title, technical details, materials, stages, and an AI recommendation for maximizing its value/utility.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          technicalDetails: { type: Type.STRING },
          materials: { type: Type.ARRAY, items: { type: Type.STRING } },
          stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          aiRecommendation: { type: Type.STRING }
        },
        required: ["title", "technicalDetails", "materials", "stages", "aiRecommendation"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "");
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse blueprint JSON", e);
    throw e;
  }
};

export const generateFinancialSynergy = async (sector: string, goal: string): Promise<FinancialSynergy> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Design a "Butch Sovereign Philanthropy" financial roadmap to help more poor people in the "${sector}" sector with the goal: "${goal}".
    
    CONTEXT:
    - Focus on combining high-tech infrastructure (like chain-jets and drones) with micro-financing and direct aid.
    - Use executive Taglish tone (e.g., "Synergy points for the masa", "Financial liquidity deployment").
    - Provide budget allocation, asset synergy, and poverty reduction index.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sectorName: { type: Type.STRING },
          financialGoal: { type: Type.STRING },
          allocatedBudget: { type: Type.STRING },
          fundingStrategy: { type: Type.STRING },
          assetSynergy: { type: Type.STRING },
          povertyReductionIndex: { type: Type.STRING },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["sectorName", "financialGoal", "allocatedBudget", "fundingStrategy", "assetSynergy", "povertyReductionIndex", "nextSteps"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "");
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse financial synergy JSON", e);
    throw e;
  }
};

export const generateProjectProposal = async (location: string, challenge: string): Promise<ProjectProposal> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Propose a high-tech "Butch Global" impact project for "${location}" to solve the challenge of "${challenge}".
    Tone: Executive luxury meets high-stakes humanitarian engineering. Use some elite Taglish.
    Focus on scalable, futuristic solutions that help people.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          concept: { type: Type.STRING },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          socialROI: { type: Type.STRING },
          implementationStages: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "concept", "techStack", "socialROI", "implementationStages"]
      }
    }
  });

  const jsonStr = cleanJsonString(response.text || "");
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse proposal JSON", e);
    throw e;
  }
};
