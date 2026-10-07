import React, { createContext, useContext, useState, useEffect } from "react";

export interface ImageSlotInfo {
  key: string;
  name: string;
  category: "hero" | "gallery" | "details";
  defaultUrl: string;
  description: string;
  recommendedAspect: string;
}

export const IMAGE_SLOTS: ImageSlotInfo[] = [
  {
    key: "hero-main",
    name: "Main Product Image (Overhead Studio)",
    category: "hero",
    defaultUrl: "/exact-cooktop-top.png",
    description: "Primary product photo displayed at the top of the page and gallery overhead view.",
    recommendedAspect: "16:9 or 4:3 (Landscape)",
  },
  {
    key: "active-ceramic",
    name: "Active Radiant Ceramic Hotplate",
    category: "gallery",
    defaultUrl: "/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
    description: "Close-up showing the glowing red electric zone and control knobs in operation.",
    recommendedAspect: "4:3 or 1:1",
  },
  {
    key: "flip-burner",
    name: "Flip-Up Hinged Burner (Easy Clean)",
    category: "gallery",
    defaultUrl: "/cooktop-clean.webp",
    description: "Demonstrates the patented 90-degree tilting articulated gas burner for easy cleaning.",
    recommendedAspect: "4:3 or 1:1",
  },
  {
    key: "blueprint-specs",
    name: "Technical Blueprint & Cutout Dimensions",
    category: "gallery",
    defaultUrl: "/cooktop-diagram.png",
    description: "Architectural blueprint showing 900x510mm top glass and 870x480mm countertop cutout.",
    recommendedAspect: "4:3 or 16:9",
  },
  {
    key: "hero-card-1",
    name: "Hero Detail 1: Black Tempered Glass",
    category: "details",
    defaultUrl: "/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    description: "Small showcase card in the Hero section highlighting luxury black mirror glass.",
    recommendedAspect: "1:1 or 4:3",
  },
  {
    key: "hero-card-2",
    name: "Hero Detail 2: 2000W Radiant Zone",
    category: "details",
    defaultUrl: "/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
    description: "Small showcase card in the Hero section highlighting electric radiant zone.",
    recommendedAspect: "1:1 or 4:3",
  },
  {
    key: "hero-card-3",
    name: "Hero Detail 3: Flip-Up Burner Head",
    category: "details",
    defaultUrl: "/H4183961f34a64d47a5f116fa6bfddf7eE.png",
    description: "Small showcase card in the Hero section highlighting flip-up hinges.",
    recommendedAspect: "1:1 or 4:3",
  },
  {
    key: "final-sales-box",
    name: "Final Sales Section Cooktop Preview",
    category: "details",
    defaultUrl: "/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    description: "Photo shown directly inside the critical order policy warning box.",
    recommendedAspect: "1:1 or 4:3",
  },
];

const STORAGE_KEY = "max_luxury_custom_images_v3";

interface ImageContextType {
  getImageUrl: (slotKey: string) => string;
  isCustomized: (slotKey: string) => boolean;
  updateImage: (slotKey: string, newUrl: string) => void;
  resetSlot: (slotKey: string) => void;
  resetAll: () => void;
  uploadImageFile: (slotKey: string, file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  isModalOpen: boolean;
  activeSlotKey: string;
  openModal: (slotKey?: string) => void;
  closeModal: () => void;
  allSlots: ImageSlotInfo[];
  customImages: Record<string, string>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeSlotKey, setActiveSlotKey] = useState<string>("hero-main");

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customImages));
    } catch (e) {
      console.warn("Unable to save custom images to localStorage:", e);
    }
  }, [customImages]);

  const getImageUrl = (slotKey: string): string => {
    if (customImages[slotKey]) {
      return customImages[slotKey];
    }
    const slot = IMAGE_SLOTS.find((s) => s.key === slotKey);
    return slot ? slot.defaultUrl : "/exact-cooktop-top.png";
  };

  const isCustomized = (slotKey: string): boolean => {
    return Boolean(customImages[slotKey]);
  };

  const updateImage = (slotKey: string, newUrl: string) => {
    if (!newUrl || !newUrl.trim()) return;
    setCustomImages((prev) => ({
      ...prev,
      [slotKey]: newUrl.trim(),
    }));
  };

  const resetSlot = (slotKey: string) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });
  };

  const resetAll = () => {
    setCustomImages({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const uploadImageFile = async (
    slotKey: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    return new Promise((resolve) => {
      // Validate file
      if (!file.type.startsWith("image/")) {
        resolve({ success: false, error: "Please select a valid image file (PNG, JPG, WebP, etc.)" });
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        resolve({ success: false, error: "Image file size exceeds 20MB limit." });
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;

        // 1. Immediately apply the dataUrl locally for instantaneous preview & persistence
        updateImage(slotKey, dataUrl);

        // 2. Try to persist to backend /api/upload-image for server-side persistence
        try {
          const response = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              dataUrl,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.url) {
              // Update with server URL to keep storage lightweight
              updateImage(slotKey, data.url);
              resolve({ success: true, url: data.url });
              return;
            }
          }
        } catch (err) {
          console.warn("Server image upload failed, falling back to local dataUrl:", err);
        }

        // Successfully applied locally via DataURL
        resolve({ success: true, url: dataUrl });
      };

      reader.onerror = () => {
        resolve({ success: false, error: "Failed to read image file." });
      };

      reader.readAsDataURL(file);
    });
  };

  const openModal = (slotKey?: string) => {
    if (slotKey) {
      setActiveSlotKey(slotKey);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ImageContext.Provider
      value={{
        getImageUrl,
        isCustomized,
        updateImage,
        resetSlot,
        resetAll,
        uploadImageFile,
        isModalOpen,
        activeSlotKey,
        openModal,
        closeModal,
        allSlots: IMAGE_SLOTS,
        customImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

const defaultContextValue: ImageContextType = {
  getImageUrl: (slotKey: string) => {
    const slot = IMAGE_SLOTS.find((s) => s.key === slotKey);
    return slot ? slot.defaultUrl : "/exact-cooktop-top.png";
  },
  isCustomized: () => false,
  updateImage: () => {},
  resetSlot: () => {},
  resetAll: () => {},
  uploadImageFile: async () => ({ success: false, error: "Image provider not mounted" }),
  isModalOpen: false,
  activeSlotKey: "hero-main",
  openModal: () => {},
  closeModal: () => {},
  allSlots: IMAGE_SLOTS,
  customImages: {},
};

export const useImageStore = () => {
  const context = useContext(ImageContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
};
