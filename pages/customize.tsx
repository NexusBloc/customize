import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient"; // Import Supabase client
import Payment from "./payment";
import styles from "../styles/customize.module.css";
import Navigation from "./component/Navigation";

const clothing = ["/Brett 2.0 Jersey.png", "/$AYB Base Shirt.png", "/Base Chad Tank.png", "/Goldfish On Base Shirt.png", "/Plebs Merch shirt.png", "/Copeville merch shirt.png"];
const eyes = ["/Base Laser Eyes.png", "/Meta eyes.png", "/$WEEP eyes.png", "/Plebs 3D Glasses.png"];
const hat = ["/Western Plebs Hat.png", "/Blue Base Beanie.png"];

const Customize: React.FC = () => {
  const router = useRouter();
  const { id, name, image } = router.query;

  const [nftName, setNftName] = useState<string | null>(name as string || null);
  const [nftImage, setNftImage] = useState<string | null>(image as string || null);

  const [clothingItem, setClothingItem] = useState<string>("");
  const [eyesItem, setEyesItem] = useState<string>("");
  const [hatItem, setHatItem] = useState<string>("");

  const [activeCategory, setActiveCategory] = useState<string | null>(null); // Track active category

  const [showPaymentModal, setShowPaymentModal] = useState(false); // Track modal visibility

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isUpdateDisabled = !clothingItem && !eyesItem && !hatItem; // Disable if no traits selected

  const applyCustomization = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Enable cross-origin
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
          img.src = src;
        });

      const drawLayers = async () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (nftImage) {
          const nftImg = await loadImage(nftImage);
          ctx.drawImage(nftImg, 0, 0, canvas.width, canvas.height);
        }

        if (clothingItem) {
          const clothingImage = await loadImage(clothingItem);
          ctx.drawImage(clothingImage, 0, 0, canvas.width, canvas.height);
        }

        if (eyesItem) {
          const eyesImage = await loadImage(eyesItem);
          ctx.drawImage(eyesImage, 0, 0, canvas.width, canvas.height);
        }

        if (hatItem) {
          const hatImage = await loadImage(hatItem);
          ctx.drawImage(hatImage, 0, 0, canvas.width, canvas.height);
        }
      };

      drawLayers();
    }
  };

  useEffect(() => {
    applyCustomization();
  }, [clothingItem, eyesItem, hatItem, nftImage]);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null); // Deselect if clicked again
    } else {
      setActiveCategory(category); // Set the active category
    }
  };

  const handleTraitClick = (
    trait: string,
    currentTrait: string,
    setTrait: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (trait === currentTrait) {
      setTrait(""); // Unselect the trait
    } else {
      setTrait(trait); // Select the new trait
    }
  };

  const renderTraits = () => {
    switch (activeCategory) {
      case "clothing":
        return clothing.map((cl, index) => (
          <img
            key={index}
            src={cl}
            onClick={() => handleTraitClick(cl, clothingItem, setClothingItem)}
            className={`${styles.traitItem} ${clothingItem === cl ? styles.activeTrait : ""}`}
          />
        ));
      case "eyes":
        return eyes.map((eye, index) => (
          <img
            key={index}
            src={eye}
            onClick={() => handleTraitClick(eye, eyesItem, setEyesItem)}
            className={`${styles.traitItem} ${eyesItem === eye ? styles.activeTrait : ""}`}
          />
        ));
      case "hat":
        return hat.map((ht, index) => (
          <img
            key={index}
            src={ht}
            onClick={() => handleTraitClick(ht, hatItem, setHatItem)}
            className={`${styles.traitItem} ${hatItem === ht ? styles.activeTrait : ""}`}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Navigation/>
      <h1 className={styles.nftname}>{nftName}</h1>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <Payment
              onPaymentSuccess={() => setShowPaymentModal(false)}
              onClose={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Canvas Panel */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} width="500" height="500" className={styles.canvas}></canvas>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={isUpdateDisabled}
            className={`${styles.updateButton} ${isUpdateDisabled ? styles.disabledButton : ""}`}
          >
            Update
          </button>
        </div>

        {/* Traits and Categories */}
        <div className={styles.traitsContainer}>
          <div className={styles.categories}>
            <img
              src="/shirt.png"
              alt="Clothing"
              onClick={() => handleCategoryClick("clothing")}
              className={`${styles.categoryIcon} ${activeCategory === "clothing" ? styles.activeCategory : ""}`}
            />
            <img
              src="/eyes.jpg"
              alt="Eyes"
              onClick={() => handleCategoryClick("eyes")}
              className={`${styles.categoryIcon} ${activeCategory === "eyes" ? styles.activeCategory : ""}`}
            />
            <img
              src="/hat.png"
              alt="Hat"
              onClick={() => handleCategoryClick("hat")}
              className={`${styles.categoryIcon} ${activeCategory === "hat" ? styles.activeCategory : ""}`}
            />
          </div>

          <div className={styles.traitsBox}>{renderTraits()}</div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
