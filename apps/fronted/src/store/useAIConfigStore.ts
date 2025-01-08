import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIConfigState {
  doubaoApiKey: string;
  doubaoModelId: string;
  deepseekApiKey: string;
  deepseekModelId: string;
  currentAIModel: {
    provider: 'doubao' | 'deepseek';
    modelId: string;
  };
  setDoubaoApiKey: (apiKey: string) => void;
  setDoubaoModelId: (modelId: string) => void;
  setDeepseekApiKey: (apiKey: string) => void;
  setDeepseekModelId: (modelId: string) => void;
  setCurrentAIModel: (model: { provider: 'doubao' | 'deepseek', modelId: string }) => void;
}

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set) => ({
      doubaoApiKey: "",
      doubaoModelId: "",
      deepseekApiKey: "",
      deepseekModelId: "",
      currentAIModel: {
        provider: 'doubao',
        modelId: ''
      },
      setDoubaoApiKey: (apiKey: string) => set({ doubaoApiKey: apiKey }),
      setDoubaoModelId: (modelId: string) => set({ doubaoModelId: modelId }),
      setDeepseekApiKey: (apiKey: string) => set({ deepseekApiKey: apiKey }),
      setDeepseekModelId: (modelId: string) => set({ deepseekModelId: modelId }),
      setCurrentAIModel: (model) => set({ currentAIModel: model }),
    }),
    {
      name: "ai-config-storage",
    }
  )
);
