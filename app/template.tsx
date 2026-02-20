'use client';

import { ReactNode } from 'react';
import { motion } from "framer-motion";

interface TemplateProps {
    children: ReactNode;
}

const regularVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
};

const pageTransition = {
    duration: 0.6,
    ease: "easeInOut",
}

// console.log('env:' + process.env.NEXT_PUBLIC_ENV_NAME);

export default function Template({ children }: TemplateProps) {
    return (
        <>
            <motion.div 
                key={"landing"}  // Key based on pathname to trigger animation on route change
                initial="initial"
                animate="enter"
                exit="exit"
                variants={regularVariants}
                transition={pageTransition}
                className="inner-motion-div"
            >
                {children}
            </motion.div>
        </>
    );
}
