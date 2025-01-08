"use client";
import { useState, useEffect } from "react";
import {
  Folder,
  Bot,
  Key,
  Hash,
  ExternalLink,
  Settings,
  User,
  Palette,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  getFileHandle,
  getConfig,
  storeFileHandle,
  storeConfig,
  verifyPermission,
} from "@/utils/fileSystem";
import { useTranslations } from "next-intl";

const SettingsPage = () => {
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [folderPath, setFolderPath] = useState<string>("");

  const {
    doubaoApiKey,
    doubaoModelId,
    setDoubaoApiKey,
    setDoubaoModelId,
    deepseekApiKey,
    deepseekModelId,
    setDeepseekApiKey,
    setDeepseekModelId,
    currentAIModel,
    setCurrentAIModel,
  } = useAIConfigStore();

  const t = useTranslations();

  useEffect(() => {
    const loadSavedConfig = async () => {
      try {
        const handle = await getFileHandle("syncDirectory");
        const path = await getConfig("syncDirectoryPath");

        if (handle && path) {
          const hasPermission = await verifyPermission(handle);
          if (hasPermission) {
            setDirectoryHandle(handle as FileSystemDirectoryHandle);
            setFolderPath(path);
          }
        }
      } catch (error) {
        console.error("Error loading saved config:", error);
      }
    };

    loadSavedConfig();
  }, []);

  const handleSelectDirectory = async () => {
    try {
      if (!("showDirectoryPicker" in window)) {
        alert(
          "Your browser does not support directory selection. Please use a modern browser."
        );
        return;
      }

      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      const hasPermission = await verifyPermission(handle);
      if (hasPermission) {
        setDirectoryHandle(handle);
        const path = handle.name;
        setFolderPath(path);
        await storeFileHandle("syncDirectory", handle);
        await storeConfig("syncDirectoryPath", path);
      }
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  const handleApiKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setDoubaoApiKey(newApiKey);
  };

  const handleModelIdChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newModelId = e.target.value;
    setDoubaoModelId(newModelId);
  };

  const handleDeepseekApiKeyChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newApiKey = e.target.value;
    setDeepseekApiKey(newApiKey);
  };

  const handleDeepseekModelIdChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newModelId = e.target.value;
    setDeepseekModelId(newModelId);
  };

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-3 space-y-2 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 h-fit sticky top-8">
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
              <Folder className="w-5 h-5 text-indigo-500" />
              {t("dashboard.settings.syncDirectory.title")}
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
              <Bot className="w-5 h-5 text-purple-500" />
              {t("dashboard.settings.aiConfig.title")}
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-span-9 space-y-6">
          {/* Sync Directory Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {t("dashboard.settings.syncDirectory.title")}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {folderPath ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {folderPath}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={handleSelectDirectory}
                  >
                    {t("dashboard.settings.syncDirectory.changeFolder")}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleSelectDirectory}
                >
                  {t("dashboard.settings.syncDirectory.selectFolder")}
                </Button>
              )}
            </div>
          </div>

          {/* AI Configuration Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {t("dashboard.settings.aiConfig.title")}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* Doubao AI Configuration */}
              <div
                onClick={() =>
                  setCurrentAIModel({
                    provider: "doubao",
                    modelId: doubaoModelId,
                  })
                }
                className={`
                  rounded-lg p-4 border space-y-3 transition-all duration-300 cursor-pointer 
                  hover:shadow-md
                  ${
                    currentAIModel.provider === "doubao"
                      ? "bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 shadow-sm"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`
                    text-sm font-medium transition-colors 
                    ${
                      currentAIModel.provider === "doubao"
                        ? "text-indigo-800 dark:text-indigo-200"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                  >
                    Doubao AI
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all 
                        ${
                          currentAIModel.provider === "doubao"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-300 bg-white dark:bg-gray-800"
                        }
                      `}
                    >
                      {currentAIModel.provider === "doubao" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs transition-colors 
                        ${
                          currentAIModel.provider === "doubao"
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      `}
                    >
                      使用此模型
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("dashboard.settings.aiConfig.apiKey.label")}
                    </Label>
                    <Input
                      type="password"
                      value={doubaoApiKey}
                      onChange={handleApiKeyChange}
                      placeholder={t(
                        "dashboard.settings.aiConfig.apiKey.placeholder"
                      )}
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("dashboard.settings.aiConfig.modelId.label")}
                    </Label>
                    <Input
                      type="text"
                      value={doubaoModelId}
                      onChange={handleModelIdChange}
                      placeholder={t(
                        "dashboard.settings.aiConfig.modelId.placeholder"
                      )}
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-indigo-300"
                    />
                  </div>
                </div>
              </div>

              {/* DeepSeek AI Configuration */}
              <div
                onClick={() =>
                  setCurrentAIModel({
                    provider: "deepseek",
                    modelId: deepseekModelId,
                  })
                }
                className={`
                  rounded-lg p-4 border space-y-3 transition-all duration-300 cursor-pointer 
                  hover:shadow-md
                  ${
                    currentAIModel.provider === "deepseek"
                      ? "bg-purple-50/50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 shadow-sm"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`
                    text-sm font-medium transition-colors 
                    ${
                      currentAIModel.provider === "deepseek"
                        ? "text-purple-800 dark:text-purple-200"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                  >
                    DeepSeek AI
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all 
                        ${
                          currentAIModel.provider === "deepseek"
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300 bg-white dark:bg-gray-800"
                        }
                      `}
                    >
                      {currentAIModel.provider === "deepseek" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs transition-colors 
                        ${
                          currentAIModel.provider === "deepseek"
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      `}
                    >
                      使用此模型
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("dashboard.settings.aiConfig.deepseekApiKey.label")}
                    </Label>
                    <Input
                      type="password"
                      value={deepseekApiKey}
                      onChange={handleDeepseekApiKeyChange}
                      placeholder={t(
                        "dashboard.settings.aiConfig.deepseekApiKey.placeholder"
                      )}
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-purple-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("dashboard.settings.aiConfig.deepseekModelId.label")}
                    </Label>
                    <Input
                      type="text"
                      value={deepseekModelId}
                      onChange={handleDeepseekModelIdChange}
                      placeholder={t(
                        "dashboard.settings.aiConfig.deepseekModelId.placeholder"
                      )}
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-purple-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
