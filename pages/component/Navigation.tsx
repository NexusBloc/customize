import React from 'react';
import { useRouter } from "next/router";
import styles from '../../styles/navigation.module.css'
import { ConnectWallet } from "@thirdweb-dev/react";

const Navigation = () => {
    const router = useRouter();
  return (
    <div className={styles.nav_container}>
        <a onClick={() => router.push("/")} className={styles.backButton} >   
        </a>
        
        <div className={styles.right}>
        <ConnectWallet/>
        </div>
     </div>
  );
}

export default Navigation;
